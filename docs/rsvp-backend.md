# RSVP → Google Sheets, directly from the frontend

The static website submits directly to the Google Apps Script web app. There is
no `/api/rsvp`, Cloudflare Function, database, or shared API token to configure.
This works with static hosting, including Cloudflare Pages and S3.

## One-time update to the existing Google deployment

1. Replace the code in your Apps Script editor with `apps-script/Code.gs` and save.
2. Choose **Deploy → Manage deployments → Edit → New version → Deploy**.
   Keep **Execute as: Me** and **Who has access: Anyone**. Editing the existing
   deployment keeps its `/exec` URL. Saving alone does not update deployed code.
3. The public web-app URL is already in `src/sections/rsvp/content.ts`. If you
   create a different deployment, update `scriptUrl` there.
4. Deploy the static website normally. No Cloudflare variables or secrets are
   used. The old `RSVP_API_TOKEN` and `RSVP_SCRIPT_URL` settings can be deleted.
5. Submit a test RSVP and confirm one row appears in the spreadsheet's RSVP tab.
   A retry of identical content with the same request ID must not add a second row.

The spreadsheet remains **Restricted**. Only the Apps Script owner's account
needs permission to edit it. Never enable public spreadsheet editing.

## How the browser receives confirmation

A native form POST sends the JSON payload to Google in a hidden iframe. This
does not require CORS preflight or a proxy. After saving, Apps Script returns an
HtmlService receipt that calls `window.top.postMessage` back to the exact
invitation-site origin. HtmlService allows the receipt to be embedded.

The browser accepts only Google sandbox origins, the current attempt's random
nonce, and the submitted request ID. It reports success only after that matching
save acknowledgement. A loaded iframe is not proof of a saved response. Blocked
Google pages, missing replies, or failures leave the form retryable after 15s.
There is no `fetch(..., { mode: "no-cors" })` or assumed success.

## Public form and data safety

This is intentionally a public submission endpoint. There is no secret in the
frontend, and no API to read guest data. The receipt contains only status,
request ID, and the attempt nonce, never guest details. Honeypot checks and input
validation reject malformed submissions, but do not provide authentication or
strong spam prevention. Apps Script quotas still apply.

Names are trimmed and limited to 80 UTF-16 characters; notes to 400. Attendance
must be `attending` or `absent`, and count an integer from 1 to 10. Payload text is
limited to 16,384 characters. Guest text beginning with formula characters is
escaped before writing to Sheets.

The Biên Hòa form (`bh`) also sends shuttle fields. `transport` is `shuttle` or
`own`. A shuttle guest then sends `outbound` (`trip-1`, `trip-2`, `self`, or
`none`), a known `station` id when they chose a trip, and `returnRide` (`same`
or `self`). Station ids live in `src/sections/rsvp/shuttle.ts` and must stay
identical in `apps-script/Code.gs`. Guests who are not attending omit these
fields. Older clients, including `main`, still omit them and remain valid: the
script stores the original payload shape and leaves the four shuttle columns
blank. A receipt for every successful save now includes `version: 2`. The Biên
Hòa page treats a shuttle submission as unconfirmed until it receives that
version, so deploy this script before sharing the `bh` form.

The RSVP tab contains Request ID, Thời gian, Họ tên, Tham dự, Số người, Lời nhắn,
Payload, and, after this deployment, Xe đưa đón, Chiều đi, Trạm, Chiều về. An
existing header row with only the first seven titles is extended in place. Do
not rename the shuttle titles or edit the Request ID/Payload columns, and do not
sort columns separately.
Existing rows remain compatible. The script locks lookup plus append, flushes,
and verifies the stored payload before acknowledging. Identical retries reuse
the saved row; a different payload with the same ID is rejected. A guest who
creates a new ID can still submit another response.

## Verification

Run `bun run check` and `bun run build`. The tests execute the actual Apps Script
against simulated Google services; they do not prove a live Sheet write.
Local development uses `bun run dev`, with no local API server or `.dev.vars`.
An end-to-end production check still requires the updated Google deployment and
one test submission confirmed in the real spreadsheet.
