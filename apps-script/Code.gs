// Deploy as a web app: execute as yourself, access Anyone. Keep the Sheet restricted.
// The public form posts directly here; no Cloudflare Function or shared token is needed.
const SPREADSHEET_ID = "1c7TpzxU7pS5JtdgGbt_1cFwR336KVPWPQqdzLD1ARc0";
const RSVP_TAB = "RSVP";
const HEADERS = ["Request ID", "Thời gian", "Họ tên", "Tham dự", "Số người", "Lời nhắn", "Payload"];
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function output_(value, receipt) {
  // Return only a receipt, never guest data. Escape script delimiters in untrusted input.
  const message = JSON.stringify({ type: "wedding-rsvp", nonce: receipt.nonce, ...value })
    .replace(/</g, "\\u003c");
  const origin = JSON.stringify(receipt.origin).replace(/</g, "\\u003c");
  return HtmlService.createHtmlOutput(
    `<script>window.top.postMessage(${message}, ${origin});</script>`
  ).setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

function validate_(value) {
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;
  const { requestId, name, attendance, count, note = "", website } = value;
  if (typeof requestId !== "string" || !UUID.test(requestId) ||
      typeof name !== "string" || !name.trim() || name.length > 80 ||
      (attendance !== "attending" && attendance !== "absent") ||
      !Number.isInteger(count) || count < 1 || count > 10 ||
      typeof note !== "string" || note.length > 400 ||
      (website !== undefined && (typeof website !== "string" || website.trim() !== ""))) return null;
  return { requestId: requestId.toLowerCase(), name: name.trim(), attendance, count, note: note.trim() };
}

// Do not let Sheets interpret guest-entered text as a formula.
function cellText_(text) {
  return /^[=+\-@]/.test(text) ? "'" + text : text;
}

function doPost(e) {
  let lock;
  const receipt = e && e.parameter;
  if (!receipt || typeof receipt.nonce !== "string" || !UUID.test(receipt.nonce) ||
      typeof receipt.origin !== "string" ||
      !/^https?:\/\/[a-z0-9.-]+(?::[0-9]+)?$/i.test(receipt.origin)) {
    return HtmlService.createHtmlOutput("Invalid request");
  }
  const respond = (value) => output_(value, receipt);
  try {
    const text = receipt.payload;
    if (typeof text !== "string" || text.length > 16384) {
      return respond({ ok: false, error: "invalid_request" });
    }
    const rsvp = validate_(JSON.parse(text));
    if (!rsvp) return respond({ ok: false, error: "invalid_request" });

    // Serialize lookup + append so concurrent retries cannot create two rows.
    lock = LockService.getScriptLock();
    if (!lock.tryLock(5000)) return respond({ ok: false, error: "service_unavailable" });
    const book = SpreadsheetApp.openById(SPREADSHEET_ID);
    const sheet = book.getSheetByName(RSVP_TAB) || book.insertSheet(RSVP_TAB);
    if (sheet.getLastRow() === 0) sheet.getRange(1, 1, 1, HEADERS.length).setValues([HEADERS]);
    const headers = sheet.getRange(1, 1, 1, HEADERS.length).getValues()[0];
    if (JSON.stringify(headers) !== JSON.stringify(HEADERS)) {
      return respond({ ok: false, error: "service_unavailable" });
    }
    const payload = JSON.stringify(rsvp);
    const lastRow = sheet.getLastRow();
    if (lastRow > 1) {
      const match = sheet.getRange(2, 1, lastRow - 1, 1).createTextFinder(rsvp.requestId)
        .matchEntireCell(true).matchCase(true).useRegularExpression(false).findNext();
      if (match) {
        const saved = sheet.getRange(match.getRow(), 7).getValue();
        return respond(saved === payload
          ? { ok: true, requestId: rsvp.requestId }
          : { ok: false, error: "idempotency_conflict" });
      }
    }
    const row = lastRow + 1;
    sheet.appendRow([
      rsvp.requestId, new Date(), cellText_(rsvp.name), rsvp.attendance,
      rsvp.count, cellText_(rsvp.note), payload,
    ]);
    SpreadsheetApp.flush();
    if (sheet.getRange(row, 7).getValue() !== payload) {
      return respond({ ok: false, error: "service_unavailable" });
    }
    return respond({ ok: true, requestId: rsvp.requestId });
  } catch {
    // Do not log submitted guest data or Google account errors.
    return respond({ ok: false, error: "service_unavailable" });
  } finally {
    if (lock && lock.hasLock()) lock.releaseLock();
  }
}
