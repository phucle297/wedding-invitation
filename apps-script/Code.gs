// Deploy as a web app: execute as yourself, access Anyone. Keep the Sheet restricted.
// The public form posts directly here; no Cloudflare Function or shared token is needed.
// Biên Hòa: deploy separately from the main invitation's Apps Script.
const SPREADSHEET_ID = "1p0KG88IGdCcjXlxcEkaAJliSro5MCtxkKqA78j7M29E";
const RSVP_TAB = "RSVP";
const HEADERS = ["Request ID", "Thời gian", "Họ tên", "Tham dự", "Số người", "Lời nhắn", "Payload"];
const EXTRA = ["Xe đưa đón", "Chiều đi", "Tên xe", "Trạm đón", "Chiều về", "Trạm trả"];
const TRANSPORT_LABEL = { own: "Tự sắp xếp", shuttle: "Dùng xe" };
const OUTBOUND_LABEL = {
  "trip-1": "Chuyến 1", "trip-2": "Chuyến 2", self: "Tự đi", none: "Không đi",
};
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

function placeText_(value) {
  if (typeof value !== "string") return null;
  const text = value.trim();
  if (!text || text.length > 120) return null;
  return text;
}

function ride_(value, attendance) {
  const keys = ["transport", "outbound", "vehicle", "station", "returnRide", "returnVehicle", "returnStation"];
  const present = keys.filter((key) => Object.prototype.hasOwnProperty.call(value, key));
  if (present.length === 0) return { legacy: true };
  if (attendance !== "attending") return null;
  const { transport, outbound, vehicle, station, returnRide, returnVehicle, returnStation } = value;
  if (transport === "own") {
    return present.length === 1 ? { legacy: false, transport: "own" } : null;
  }
  if (transport !== "shuttle") return null;
  const going = outbound === "trip-1" || outbound === "trip-2";
  if (!going && outbound !== "self" && outbound !== "none") return null;
  const ride = { legacy: false, transport: "shuttle", outbound: outbound };
  if (going) {
    const car = placeText_(vehicle);
    const pickup = placeText_(station);
    if (!car || !pickup) return null;
    ride.vehicle = car;
    ride.station = pickup;
  } else if (present.indexOf("vehicle") !== -1 || present.indexOf("station") !== -1) {
    return null;
  }
  if (returnRide === "self") {
    if (present.indexOf("returnVehicle") !== -1 || present.indexOf("returnStation") !== -1) return null;
    ride.returnRide = "self";
    return ride;
  }
  if (returnRide !== "shuttle") return null;
  const back = placeText_(returnVehicle);
  const dropoff = placeText_(returnStation);
  if (!back || !dropoff) return null;
  ride.returnRide = "shuttle";
  ride.returnVehicle = back;
  ride.returnStation = dropoff;
  return ride;
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
  const ride = ride_(value, attendance);
  if (!ride) return null;
  return {
    requestId: requestId.toLowerCase(), name: name.trim(), attendance, count, note: note.trim(),
    ...ride,
  };
}

function storedPayload_(rsvp) {
  // Legacy key order must stay stable so a retry still matches rows written before shuttle columns.
  const stored = {
    requestId: rsvp.requestId, name: rsvp.name, attendance: rsvp.attendance,
    count: rsvp.count, note: rsvp.note,
  };
  if (!rsvp.legacy) {
    stored.transport = rsvp.transport;
    if (rsvp.outbound) stored.outbound = rsvp.outbound;
    if (rsvp.vehicle) stored.vehicle = rsvp.vehicle;
    if (rsvp.station) stored.station = rsvp.station;
    if (rsvp.returnRide) stored.returnRide = rsvp.returnRide;
    if (rsvp.returnVehicle) stored.returnVehicle = rsvp.returnVehicle;
    if (rsvp.returnStation) stored.returnStation = rsvp.returnStation;
  }
  return JSON.stringify(stored);
}

function transportCells_(rsvp) {
  if (rsvp.legacy) return ["", "", "", "", "", ""];
  return [
    cellText_(TRANSPORT_LABEL[rsvp.transport]),
    rsvp.outbound ? cellText_(OUTBOUND_LABEL[rsvp.outbound]) : "",
    rsvp.vehicle ? cellText_(rsvp.vehicle) : "",
    rsvp.station ? cellText_(rsvp.station) : "",
    rsvp.returnRide === "self" ? "Tự về" : rsvp.returnVehicle ? cellText_(rsvp.returnVehicle) : "",
    rsvp.returnStation ? cellText_(rsvp.returnStation) : "",
  ];
}

function ensureHeaders_(sheet) {
  const width = HEADERS.length + EXTRA.length;
  if (sheet.getLastRow() === 0) {
    sheet.getRange(1, 1, 1, width).setValues([HEADERS.concat(EXTRA)]);
  }
  const headers = sheet.getRange(1, 1, 1, width).getValues()[0];
  const base = headers.slice(0, HEADERS.length);
  if (JSON.stringify(base) !== JSON.stringify(HEADERS)) return false;
  const extra = headers.slice(HEADERS.length);
  const blank = extra.every((cell) => cell === "");
  if (!blank && JSON.stringify(extra) !== JSON.stringify(EXTRA)) return false;
  if (blank) sheet.getRange(1, HEADERS.length + 1, 1, EXTRA.length).setValues([EXTRA]);
  return true;
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
    if (!ensureHeaders_(sheet)) return respond({ ok: false, error: "service_unavailable" });
    const payload = storedPayload_(rsvp);
    const lastRow = sheet.getLastRow();
    if (lastRow > 1) {
      const match = sheet.getRange(2, 1, lastRow - 1, 1).createTextFinder(rsvp.requestId)
        .matchEntireCell(true).matchCase(true).useRegularExpression(false).findNext();
      if (match) {
        const saved = sheet.getRange(match.getRow(), 7).getValue();
        return respond(saved === payload
          ? { ok: true, requestId: rsvp.requestId, version: 2 }
          : { ok: false, error: "idempotency_conflict" });
      }
    }
    const row = lastRow + 1;
    sheet.appendRow([
      rsvp.requestId, new Date(), cellText_(rsvp.name), rsvp.attendance,
      rsvp.count, cellText_(rsvp.note), payload,
    ].concat(transportCells_(rsvp)));
    SpreadsheetApp.flush();
    if (sheet.getRange(row, 7).getValue() !== payload) {
      return respond({ ok: false, error: "service_unavailable" });
    }
    return respond({ ok: true, requestId: rsvp.requestId, version: 2 });
  } catch {
    // Do not log submitted guest data or Google account errors.
    return respond({ ok: false, error: "service_unavailable" });
  } finally {
    if (lock && lock.hasLock()) lock.releaseLock();
  }
}
