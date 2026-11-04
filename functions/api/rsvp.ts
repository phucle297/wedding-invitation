interface Context {
  request: Request;
  env: { RSVP_SCRIPT_URL?: string; RSVP_API_TOKEN?: string };
}

interface Rsvp {
  requestId: string;
  name: string;
  attendance: "attending" | "absent";
  count: number;
  note: string;
}

const MAX_BODY_BYTES = 8192;
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function json(status: number, body: Record<string, unknown>, headers = {}) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "no-store",
      ...headers,
    },
  });
}

function error(status: number, code: string) {
  return json(status, { ok: false, error: code });
}

// Bound the actual stream, not just Content-Length (which may be absent/untrusted).
async function readBody(request: Request): Promise<string | null> {
  if (Number(request.headers.get("Content-Length")) > MAX_BODY_BYTES) return null;
  const reader = request.body?.getReader();
  if (!reader) return "";
  const chunks: Uint8Array[] = [];
  let size = 0;
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > MAX_BODY_BYTES) {
        await reader.cancel();
        return null;
      }
      chunks.push(value);
    }
  } finally {
    reader.releaseLock();
  }
  const bytes = new Uint8Array(size);
  let offset = 0;
  for (const chunk of chunks) {
    bytes.set(chunk, offset);
    offset += chunk.byteLength;
  }
  return new TextDecoder("utf-8", { fatal: true }).decode(bytes);
}

function validate(value: unknown): Rsvp | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;
  const { requestId, name, attendance, count, note = "", website } = value as Record<string, unknown>;
  if (
    typeof requestId !== "string" || !UUID.test(requestId) ||
    typeof name !== "string" || !name.trim() || name.length > 80 ||
    (attendance !== "attending" && attendance !== "absent") ||
    typeof count !== "number" || !Number.isInteger(count) || count < 1 || count > 10 ||
    typeof note !== "string" || note.length > 400 ||
    (website !== undefined && (typeof website !== "string" || website.trim() !== ""))
  ) return null;
  return { requestId: requestId.toLowerCase(), name: name.trim(), attendance, count, note: note.trim() };
}

export async function onRequest({ request, env }: Context): Promise<Response> {
  if (request.method !== "POST") {
    return json(405, { ok: false, error: "method_not_allowed" }, { Allow: "POST" });
  }
  const origin = request.headers.get("Origin");
  if (origin !== null && origin !== new URL(request.url).origin) return error(403, "forbidden_origin");
  if (request.headers.get("Content-Type")?.split(";", 1)[0]?.trim().toLowerCase() !== "application/json") {
    return error(415, "unsupported_media_type");
  }
  let body: unknown;
  try {
    const text = await readBody(request);
    if (text === null) return error(413, "body_too_large");
    body = JSON.parse(text);
  } catch {
    return error(400, "invalid_json");
  }
  const rsvp = validate(body);
  if (!rsvp) return error(400, "invalid_request");
  // Only send the server-side token to an actual Apps Script deployment.
  if (!env.RSVP_API_TOKEN || env.RSVP_API_TOKEN.length < 32 ||
      !env.RSVP_SCRIPT_URL ||
      !/^https:\/\/script\.google\.com\/macros\/s\/[A-Za-z0-9_-]+\/exec$/.test(env.RSVP_SCRIPT_URL)) {
    return error(503, "service_unavailable");
  }

  try {
    const response = await fetch(env.RSVP_SCRIPT_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token: env.RSVP_API_TOKEN, submission: rsvp }),
      // ContentService redirects JSON output to script.googleusercontent.com.
      redirect: "follow",
      signal: AbortSignal.timeout(12000),
    });
    if (!response.ok) return error(503, "service_unavailable");
    const result: unknown = await response.json();
    if (!result || typeof result !== "object" || !("ok" in result)) {
      return error(503, "service_unavailable");
    }
    if (result.ok === false && "error" in result && result.error === "idempotency_conflict") {
      return error(409, "idempotency_conflict");
    }
    if (result.ok !== true || !("requestId" in result) || result.requestId !== rsvp.requestId) {
      return error(503, "service_unavailable");
    }
    return json(200, { ok: true, requestId: rsvp.requestId });
  } catch {
    // Never expose tokens, upstream errors, or guest data in responses/logs.
    return error(503, "service_unavailable");
  }
}
