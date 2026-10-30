import { createHash } from "node:crypto";
import { after } from "next/server";
import { OPENAI_ADS_PIXEL_ID, site } from "@/lib/site";

/**
 * Server-only OpenAI Ads Conversions API. Do not import this from a client component.
 * https://developers.openai.com/ads/conversions-api
 */
const OPENAI_CONVERSIONS_URL = "https://bzr.openai.com/v1/events";
const CAPI_TIMEOUT_MS = 3_000;
const MAX_MATCH_TOKEN_LENGTH = 512;
const MAX_USER_AGENT_LENGTH = 1024;

const OBREF_COOKIE = "__obref";
const OPPREF_COOKIE = "__oppref";

let missingKeyWarned = false;

export type OpenAiLeadEventInput = {
  ref: string;
  email?: string;
  phone?: string;
  page?: string;
  cookieHeader?: string | null;
  userAgent?: string | null;
  ip?: string | null;
  timestampMs?: number;
};

export type OpenAiLeadUser = {
  obref?: string;
  emails_sha256?: string[];
  phone_numbers_sha256?: string[];
  ip_address?: string;
  user_agent?: string;
};

export type OpenAiLeadEvent = {
  id: string;
  type: "lead_created";
  timestamp_ms: number;
  oppref?: string;
  source_url: string;
  action_source: "web";
  user?: OpenAiLeadUser;
  data: { type: "customer_action" };
};

export type OpenAiConversionsPayload = {
  validate_only: false;
  events: OpenAiLeadEvent[];
};

export type OpenAiLeadRequest = {
  url: string;
  body: OpenAiConversionsPayload;
};

/** Clears the one-time missing-key warning so tests can assert it. */
export function resetOpenAiAdsCapiForTests(): void {
  missingKeyWarned = false;
}

export function sha256Hex(value: string): string {
  return createHash("sha256").update(value, "utf8").digest("hex");
}

/** Trim and lowercase. Empty values are omitted rather than hashed. */
export function normalizeOpenAiEmail(raw: string): string | null {
  const email = raw.trim().toLowerCase();
  return email ? email : null;
}

/**
 * Conversions API phone normalisation, in the documented order:
 * drop whitespace, parentheses, periods and hyphens; drop one leading "+";
 * drop leading zeroes. Hash only when 8–15 digits remain.
 */
export function normalizeOpenAiPhone(raw: string): string | null {
  const stripped = raw.replace(/[\s().\-]/g, "");
  if (!stripped) return null;
  const withoutPlus = stripped.startsWith("+") ? stripped.slice(1) : stripped;
  const digits = withoutPlus.replace(/^0+/, "");
  if (!/^\d{8,15}$/.test(digits)) return null;
  return digits;
}

export function readCookie(cookieHeader: string | null | undefined, name: string): string | null {
  if (!cookieHeader) return null;
  for (const part of cookieHeader.split(";")) {
    const segment = part.trim();
    const eq = segment.indexOf("=");
    if (eq <= 0) continue;
    if (segment.slice(0, eq).trim() !== name) continue;
    const value = segment.slice(eq + 1);
    if (!value || value.length > MAX_MATCH_TOKEN_LENGTH) return null;
    return value;
  }
  return null;
}

export function isIpAddress(value: string): boolean {
  if (/^(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(?:\.(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}$/.test(value)) return true;
  if (!value.includes(":") || !/^[0-9a-fA-F:]+$/.test(value)) return false;
  const halves = value.split("::");
  if (halves.length > 2) return false;
  const groups = halves.flatMap((half) => (half ? half.split(":") : []));
  if (groups.some((group) => group.length < 1 || group.length > 4)) return false;
  if (halves.length === 1) return groups.length === 8;
  return groups.length <= 7;
}

/** Page path from the quote form, or the site origin when the path is missing or unsafe. */
export function leadSourceUrl(page: string | undefined): string {
  const raw = (page ?? "").trim();
  if (!raw.startsWith("/") || raw.startsWith("//") || raw.includes("\\") || raw.includes("://")) return site.url;
  if (/[\u0000-\u0020\u007f]/.test(raw)) return site.url;
  try {
    const url = new URL(raw, site.url);
    if (url.origin !== site.url) return site.url;
    return url.href;
  } catch {
    return site.url;
  }
}

function matchToken(value: string | null): string | null {
  if (!value || value.length > MAX_MATCH_TOKEN_LENGTH) return null;
  return value;
}

function capiKey(): string | null {
  const key = process.env.OPENAI_ADS_CAPI_KEY?.trim() ?? "";
  if (key) return key;
  if (!missingKeyWarned) {
    missingKeyWarned = true;
    console.warn("[openai-ads] OPENAI_ADS_CAPI_KEY is unset; server lead events are skipped");
  }
  return null;
}

/** Payload for one lead_created event. `id` is the quote reference so it dedupes with the pixel event_id. */
export function buildOpenAiLeadRequest(input: OpenAiLeadEventInput): OpenAiLeadRequest | null {
  const ref = input.ref.trim();
  if (!ref || !OPENAI_ADS_PIXEL_ID) return null;

  const user: OpenAiLeadUser = {};
  const obref = matchToken(readCookie(input.cookieHeader, OBREF_COOKIE));
  if (obref) user.obref = obref;

  const email = input.email ? normalizeOpenAiEmail(input.email) : null;
  if (email) user.emails_sha256 = [sha256Hex(email)];

  const phone = input.phone ? normalizeOpenAiPhone(input.phone) : null;
  if (phone) user.phone_numbers_sha256 = [sha256Hex(phone)];

  const ip = input.ip?.trim() ?? "";
  if (ip && isIpAddress(ip)) user.ip_address = ip;

  const userAgent = input.userAgent?.trim() ?? "";
  if (userAgent && userAgent.length <= MAX_USER_AGENT_LENGTH) user.user_agent = userAgent;

  const event: OpenAiLeadEvent = {
    id: ref,
    type: "lead_created",
    timestamp_ms: Math.round(input.timestampMs ?? Date.now()),
    source_url: leadSourceUrl(input.page),
    action_source: "web",
    data: { type: "customer_action" },
  };
  const oppref = matchToken(readCookie(input.cookieHeader, OPPREF_COOKIE));
  if (oppref) event.oppref = oppref;
  if (Object.keys(user).length > 0) event.user = user;

  return {
    url: `${OPENAI_CONVERSIONS_URL}?pid=${encodeURIComponent(OPENAI_ADS_PIXEL_ID)}`,
    body: { validate_only: false, events: [event] },
  };
}

export async function sendOpenAiServerLead(input: OpenAiLeadEventInput): Promise<"sent" | "skipped" | "failed"> {
  try {
    const request = buildOpenAiLeadRequest(input);
    if (!request) return "skipped";
    const key = capiKey();
    if (!key) return "skipped";

    const response = await fetch(request.url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(request.body),
      cache: "no-store",
      signal: AbortSignal.timeout(CAPI_TIMEOUT_MS),
    });
    await response.body?.cancel().catch(() => undefined);
    if (!response.ok) {
      console.error(`[openai-ads] conversions api responded ${response.status}`);
      return "failed";
    }
    return "sent";
  } catch (err) {
    const name = err instanceof Error && /^[A-Za-z][A-Za-z0-9]{0,40}$/.test(err.name) ? err.name : "Error";
    console.error(`[openai-ads] conversions api request failed (${name})`);
    return "failed";
  }
}

/** Runs after the quote response. Falls back to a detached send when `after` has no request scope (unit tests). */
export function scheduleOpenAiServerLead(input: OpenAiLeadEventInput): void {
  const task = () => sendOpenAiServerLead(input);
  try {
    after(task);
  } catch {
    void task().catch(() => {
      console.error("[openai-ads] conversions api request failed");
    });
  }
}
