/**
 * Fill the production CSP's inline-script hashes after `next build`.
 *
 * `next start` serves headers from `.next/routes-manifest.json`, not from a
 * fresh call to `next.config.ts`. On Vercel, the CDN header is copied from
 * that manifest into `.vercel/output/config.json` during the build. A hash
 * written only to a file the dev server re-reads never reaches production:
 * the header ships with the placeholder and blocks every inline script.
 *
 * This step replaces the placeholder in every build artifact, then fails if
 * any placeholder remains or any prerendered inline script is missing a hash.
 */
import { readdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import {
  CSP_HASH_PLACEHOLDER,
  assertProductionScriptSrc,
  buildContentSecurityPolicy,
  missingScriptHashes,
} from "../src/lib/csp-policy";
import { requiredScriptHashes } from "../src/lib/csp-inline";

const root = process.cwd();
const nextDir = path.join(root, ".next");
const vercelOutput = path.join(root, ".vercel", "output");
const placeholder = Buffer.from(CSP_HASH_PLACEHOLDER);

const SKIP_DIRS = new Set(["cache", "dev", "node_modules"]);

async function walk(dir: string, visit: (file: string) => Promise<void>): Promise<void> {
  let entries;
  try {
    entries = await readdir(dir, { withFileTypes: true });
  } catch (err) {
    if ((err as NodeJS.ErrnoException).code === "ENOENT") return;
    throw err;
  }
  for (const entry of entries) {
    if (SKIP_DIRS.has(entry.name)) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) await walk(full, visit);
    else if (entry.isFile()) await visit(full);
  }
}

async function htmlFiles(dir: string): Promise<string[]> {
  const files: string[] = [];
  await walk(dir, async (file) => {
    if (file.endsWith(".html")) files.push(file);
  });
  return files.sort();
}

function policiesIn(value: unknown, found: string[] = []): string[] {
  if (typeof value === "string") {
    if (value.includes("script-src ") && value.includes("default-src ")) found.push(value);
    return found;
  }
  if (Array.isArray(value)) {
    for (const item of value) policiesIn(item, found);
    return found;
  }
  if (value && typeof value === "object") {
    for (const [key, item] of Object.entries(value)) {
      if (key.toLowerCase() === "content-security-policy" && typeof item === "string") found.push(item);
      else policiesIn(item, found);
    }
  }
  return found;
}

async function readJson(file: string): Promise<unknown> {
  return JSON.parse(await readFile(file, "utf8"));
}

function fail(message: string): never {
  console.error(`\nCSP build failed: ${message}\n`);
  process.exit(1);
}

async function main() {
  const serverDir = path.join(nextDir, "server");
  const html = await htmlFiles(serverDir);
  if (html.length === 0) fail(`no prerendered HTML under ${serverDir}`);

  const required = new Set<string>();
  const perFile: { file: string; hashes: string[] }[] = [];
  for (const file of html) {
    const body = await readFile(file, "utf8");
    let hashes: string[];
    try {
      hashes = requiredScriptHashes(body);
    } catch (err) {
      fail(`${path.relative(root, file)}: ${err instanceof Error ? err.message : String(err)}`);
    }
    if (hashes.length === 0) fail(`${path.relative(root, file)} has no executable inline script to hash`);
    perFile.push({ file, hashes });
    for (const hash of hashes) required.add(hash);
  }

  const hashList = [...required].sort();
  const policy = buildContentSecurityPolicy(hashList);
  assertProductionScriptSrc(policy);
  const hashSources = policy.includes(CSP_HASH_PLACEHOLDER)
    ? fail("built policy still contains the placeholder before it was written")
    : hashList.join(" ");

  const routesManifestPath = path.join(nextDir, "routes-manifest.json");
  let routesManifest: string;
  try {
    routesManifest = await readFile(routesManifestPath, "utf8");
  } catch {
    fail(`missing ${routesManifestPath}`);
  }
  if (!routesManifest.includes(CSP_HASH_PLACEHOLDER)) {
    fail("routes-manifest.json has no CSP hash placeholder. The production header was not wired through next.config.ts.");
  }

  const patched: string[] = [];
  async function patchTree(dir: string) {
    await walk(dir, async (file) => {
      const body = await readFile(file);
      if (!body.includes(placeholder)) return;
      const next = Buffer.from(body.toString("utf8").split(CSP_HASH_PLACEHOLDER).join(hashSources));
      if (next.includes(placeholder)) fail(`placeholder survived replacement in ${path.relative(root, file)}`);
      await writeFile(file, next);
      patched.push(path.relative(root, file));
    });
  }

  await patchTree(nextDir);
  await patchTree(vercelOutput);

  if (patched.length === 0) fail("placeholder was in routes-manifest.json but no file was patched");

  const leftovers: string[] = [];
  async function findLeftovers(dir: string) {
    await walk(dir, async (file) => {
      const body = await readFile(file);
      if (body.includes(placeholder)) leftovers.push(path.relative(root, file));
    });
  }
  await findLeftovers(nextDir);
  await findLeftovers(vercelOutput);
  if (leftovers.length) fail(`placeholder still present:\n${leftovers.join("\n")}`);

  const served: { name: string; policies: string[] }[] = [];
  const manifest = await readJson(routesManifestPath);
  served.push({ name: "routes-manifest.json", policies: policiesIn(manifest) });

  const configPath = path.join(vercelOutput, "config.json");
  let config: unknown = null;
  try {
    config = await readJson(configPath);
  } catch (err) {
    if ((err as NodeJS.ErrnoException).code !== "ENOENT") throw err;
  }
  if (config) served.push({ name: ".vercel/output/config.json", policies: policiesIn(config) });
  if (process.env.VERCEL === "1" && !config) {
    console.log("CSP: .vercel/output/config.json is not written yet. Vercel must copy headers from routes-manifest.json after this step.");
  }

  for (const source of served) {
    if (source.policies.length === 0) {
      fail(`${source.name} does not contain a Content-Security-Policy. Vercel would ship no hashed policy.`);
    }
    for (const value of source.policies) {
      try {
        assertProductionScriptSrc(value);
      } catch (err) {
        fail(`${source.name}: ${err instanceof Error ? err.message : String(err)}`);
      }
      const missing = missingScriptHashes(value, hashList);
      if (missing.length) {
        fail(`${source.name} is missing ${missing.length} inline-script hash(es), first ${missing[0]}`);
      }
    }
  }

  for (const { file, hashes } of perFile) {
    for (const source of served) {
      for (const value of source.policies) {
        const missing = missingScriptHashes(value, hashes);
        if (missing.length) {
          fail(`${path.relative(root, file)} hash ${missing[0]} is not in ${source.name}`);
        }
      }
    }
  }

  const headerBytes = Buffer.byteLength(policy);
  console.log(
    `CSP: ${hashList.length} inline-script hashes across ${html.length} HTML files, header ${headerBytes} bytes, patched ${patched.length} file(s):`,
  );
  for (const file of patched) console.log(`  ${file}`);
  if (headerBytes > 7500) {
    fail(`Content-Security-Policy is ${headerBytes} bytes. Split hashes per route before it exceeds proxy header limits.`);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
