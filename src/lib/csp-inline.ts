import { createHash } from "node:crypto";
import { missingScriptHashes } from "./csp-policy";

const NEXT_S_PUSH = "(self.__next_s=self.__next_s||[]).push(";

const JS_TYPES = new Set([
  "",
  "text/javascript",
  "application/javascript",
  "text/ecmascript",
  "application/ecmascript",
  "module",
]);

export type InlineScript = {
  /** Exact source text the browser hashes for this parser-inserted script. */
  text: string;
  /**
   * `next/script` beforeInteractive payloads. Next inserts these with
   * createElement after load, so the browser hashes the payload itself.
   */
  dynamic: string[];
};

function attr(attrs: string, name: string): string | null {
  const match = attrs.match(new RegExp(`\\b${name}\\s*=\\s*(?:"([^"]*)"|'([^']*)'|([^\\s"'=<>\`]+))`, "i"));
  if (!match) return null;
  return match[1] ?? match[2] ?? match[3] ?? "";
}

function isExecutableScript(attrs: string): boolean {
  if (attr(attrs, "src") !== null) return false;
  const type = attr(attrs, "type");
  if (type === null) return true;
  return JS_TYPES.has(type.trim().toLowerCase());
}

/** Children Next will assign to a new script element via innerHTML. */
export function nextScriptPayloads(text: string): string[] {
  const trimmed = text.trim();
  if (!trimmed.startsWith(NEXT_S_PUSH)) return [];
  if (!trimmed.endsWith(")")) {
    throw new Error("truncated __next_s inline script");
  }
  let payload: unknown;
  try {
    payload = JSON.parse(trimmed.slice(NEXT_S_PUSH.length, -1));
  } catch (err) {
    throw new Error(`unparseable __next_s inline script: ${err instanceof Error ? err.message : String(err)}`);
  }
  if (!Array.isArray(payload)) return [];
  const props = payload[1];
  if (!props || typeof props !== "object" || !("children" in props)) return [];
  const children = (props as { children?: unknown }).children;
  if (typeof children !== "string" || children.length === 0) return [];
  return [children];
}

/** Parser-inserted executable inline scripts, in document order. JSON-LD is ignored. */
export function inlineScripts(html: string): InlineScript[] {
  const scripts: InlineScript[] = [];
  const open = /<script\b([^>]*)>/gi;
  let match: RegExpExecArray | null;
  while ((match = open.exec(html))) {
    const attrs = match[1] ?? "";
    const start = open.lastIndex;
    const end = html.toLowerCase().indexOf("</script>", start);
    if (end === -1) throw new Error("unterminated <script> in prerendered HTML");
    const text = html.slice(start, end);
    open.lastIndex = end + "</script>".length;
    if (!isExecutableScript(attrs) || text.length === 0) continue;
    scripts.push({ text, dynamic: nextScriptPayloads(text) });
  }
  return scripts;
}

export function sha256Source(content: string): string {
  const digest = createHash("sha256").update(content, "utf8").digest("base64");
  return `'sha256-${digest}'`;
}

/** Every hash the CSP must list for this HTML document. */
export function requiredScriptHashes(html: string): string[] {
  const hashes = new Set<string>();
  for (const script of inlineScripts(html)) {
    hashes.add(sha256Source(script.text));
    for (const payload of script.dynamic) hashes.add(sha256Source(payload));
  }
  return [...hashes].sort();
}

export function uncoveredInlineScripts(html: string, policy: string): string[] {
  return missingScriptHashes(policy, requiredScriptHashes(html));
}

const PREVIEW_TOOLBAR_URL = "https://vercel.live/_next-live/feedback/feedback.js";

/**
 * Vercel injects this into preview client bundles. The public site never loads it,
 * and the CSP does not allow vercel.live. Remove the known injection. If the URL
 * remains, the build must fail instead of shipping a script the policy will block.
 */
const PREVIEW_TOOLBAR_INJECTION =
  /var \w+=document\.createElement\("script"\);\w+\.src="https:\/\/vercel\.live\/_next-live\/feedback\/feedback\.js",\w+\.setAttribute\("data-deployment-id",globalThis\.NEXT_DEPLOYMENT_ID\),\(document\.head\|\|document\.documentElement\)\.appendChild\(\w+\)/g;

export function stripPreviewToolbar(source: string): string {
  const code = source.replace(PREVIEW_TOOLBAR_INJECTION, "void 0");
  if (code.includes(PREVIEW_TOOLBAR_URL)) {
    throw new Error("unrecognized Vercel preview toolbar injection still references vercel.live");
  }
  return code;
}
