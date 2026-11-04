// Deploy as a web app: execute as yourself, access Anyone. Keep the Sheet restricted.
// Set RSVP_API_TOKEN in Script Properties, never in this file or client code.
const SPREADSHEET_ID = "1c7TpzxU7pS5JtdgGbt_1cFwR336KVPWPQqdzLD1ARc0";
const RSVP_TAB = "RSVP";
const HEADERS = ["Request ID", "Thời gian", "Họ tên", "Tham dự", "Số người", "Lời nhắn", "Payload"];

function output_(value) {
  return ContentService.createTextOutput(JSON.stringify(value))
    .setMimeType(ContentService.MimeType.JSON);
}

function validate_(value) {
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;
  const { requestId, name, attendance, count, note = "" } = value;
  if (typeof requestId !== "string" ||
      !/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(requestId) ||
      typeof name !== "string" || !name.trim() || name.length > 80 ||
      (attendance !== "attending" && attendance !== "absent") ||
      !Number.isInteger(count) || count < 1 || count > 10 ||
      typeof note !== "string" || note.length > 400) return null;
  return { requestId: requestId.toLowerCase(), name: name.trim(), attendance, count, note: note.trim() };
}

// Do not let Sheets interpret guest-entered text as a formula.
function cellText_(text) {
  return /^[=+\-@]/.test(text) ? "'" + text : text;
}

function doPost(e) {
  let lock;
  try {
    const token = PropertiesService.getScriptProperties().getProperty("RSVP_API_TOKEN");
    if (!token || token.length < 32) return output_({ ok: false, error: "service_unavailable" });
    const text = e && e.postData && e.postData.contents;
    if (typeof text !== "string" || text.length > 16384) {
      return output_({ ok: false, error: "invalid_request" });
    }
    const body = JSON.parse(text);
    if (!body || typeof body.token !== "string" || body.token !== token) {
      return output_({ ok: false, error: "unauthorized" });
    }
    const rsvp = validate_(body.submission);
    if (!rsvp) return output_({ ok: false, error: "invalid_request" });

    // Serialize lookup + append so concurrent retries cannot create two rows.
    lock = LockService.getScriptLock();
    if (!lock.tryLock(5000)) return output_({ ok: false, error: "service_unavailable" });
    const book = SpreadsheetApp.openById(SPREADSHEET_ID);
    const sheet = book.getSheetByName(RSVP_TAB) || book.insertSheet(RSVP_TAB);
    if (sheet.getLastRow() === 0) sheet.getRange(1, 1, 1, HEADERS.length).setValues([HEADERS]);
    const headers = sheet.getRange(1, 1, 1, HEADERS.length).getValues()[0];
    if (JSON.stringify(headers) !== JSON.stringify(HEADERS)) {
      return output_({ ok: false, error: "service_unavailable" });
    }
    const payload = JSON.stringify(rsvp);
    const lastRow = sheet.getLastRow();
    if (lastRow > 1) {
      const match = sheet.getRange(2, 1, lastRow - 1, 1).createTextFinder(rsvp.requestId)
        .matchEntireCell(true).matchCase(true).useRegularExpression(false).findNext();
      if (match) {
        const saved = sheet.getRange(match.getRow(), 7).getValue();
        return output_(saved === payload
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
      return output_({ ok: false, error: "service_unavailable" });
    }
    return output_({ ok: true, requestId: rsvp.requestId });
  } catch {
    // Do not log submitted guest data, tokens, or Google account errors.
    return output_({ ok: false, error: "service_unavailable" });
  } finally {
    if (lock && lock.hasLock()) lock.releaseLock();
  }
}
