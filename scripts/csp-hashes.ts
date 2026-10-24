/**
 * Fill production CSP hashes for a local `next build`, and check the files
 * Vercel actually serves.
 *
 * On Vercel, `scripts/csp-adapter.mjs` runs inside onBuildComplete, before the
 * adapter writes `.next/output/config.json`. This step still runs afterwards:
 * `next start` reads `routes-manifest.json`, and a placeholder left in either
 * file would block every inline script. It fails if that happens.
 */
import { readdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { stripPreviewToolbar } from "../src/lib/csp-inline";
import { assertDeploymentOutput, publishInlineScriptHashes } from "../src/lib/csp-publish";

const root = process.cwd();
const nextDir = path.join(root, ".next");

function fail(message: string): never {
  console.error(`\nCSP build failed: ${message}\n`);
  process.exit(1);
}

async function walk(dir: string, visit: (file: string) => Promise<void>): Promise<void> {
  const skip = new Set(["cache", "dev", "node_modules"]);
  let entries;
  try {
    entries = await readdir(dir, { withFileTypes: true });
  } catch (err) {
    if ((err as NodeJS.ErrnoException).code === "ENOENT") return;
    throw err;
  }
  for (const entry of entries) {
    if (skip.has(entry.name)) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) await walk(full, visit);
    else if (entry.isFile()) await visit(full);
  }
}

async function main() {
  let published;
  try {
    published = await publishInlineScriptHashes({ distDir: nextDir });
    const checked = await assertDeploymentOutput({
      projectRoot: root,
      distDir: nextDir,
      requireDeploymentOutput: process.env.VERCEL === "1",
    });
    if (checked.configs.length) {
      console.log(`CSP: checked hashed policy in ${checked.configs.map((file) => path.relative(root, file)).join(", ")}`);
    }
  } catch (err) {
    fail(err instanceof Error ? err.message : String(err));
  }

  const toolbarFiles: string[] = [];
  await walk(nextDir, async (file) => {
    if (!file.endsWith(".js") && !file.endsWith(".html")) return;
    const body = await readFile(file, "utf8");
    if (!body.includes("vercel.live/_next-live/feedback/feedback.js")) return;
    let stripped: string;
    try {
      stripped = stripPreviewToolbar(body);
    } catch (err) {
      fail(`${path.relative(root, file)}: ${err instanceof Error ? err.message : String(err)}`);
    }
    if (stripped !== body) {
      await writeFile(file, stripped);
      toolbarFiles.push(path.relative(root, file));
    }
  });
  if (toolbarFiles.length) {
    console.log(`CSP: removed the unconditional preview toolbar injection from ${toolbarFiles.length} file(s)`);
  }

  const headerBytes = Buffer.byteLength(published.policy);
  console.log(
    `CSP: ${published.hashList.length} inline-script hashes across ${published.files.length} HTML files, header ${headerBytes} bytes, patched ${published.patchedFiles.length} file(s).`,
  );
  if (headerBytes > 7500) {
    fail(`Content-Security-Policy is ${headerBytes} bytes. Split hashes per route before it exceeds proxy header limits.`);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
