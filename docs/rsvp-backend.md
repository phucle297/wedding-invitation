# RSVP → Google Sheets, directly from the frontend

The static website submits directly to the Google Apps Script web app. There is
no `/api/rsvp`, Cloudflare Function, database, or shared API token to configure.
This works with static hosting, including Cloudflare Pages and S3.

## Separate destinations for main and bh

| Branch | Spreadsheet ID | Tab ID (`gid`) |
| --- | --- | --- |
| `main` | `1c7TpzxU7pS5JtdgGbt_1cFwR336KVPWPQqdzLD1ARc0` | `901966793` |
| `bh` | `1p0KG88IGdCcjXlxcEkaAJliSro5MCtxkKqA78j7M29E` | `736591688` |

This branch's `apps-script/Code.gs` is **BH only**. It selects the spreadsheet
and tab by their fixed IDs, not the tab name. If that tab is missing, submissions
fail without creating or writing another tab.

Keep separate Apps Script projects and `/exec` URLs for the two branches.
Deploying a new version of a shared Apps Script project can affect both sites;
different deployment URLs alone do not guarantee different spreadsheet targets.
Do not copy this BH script into main's Apps Script project or replace main's
destination when merging changes between branches. The frontend `scriptUrl`
must point to its own branch's deployment. Local source edits do not update
Google's deployed code, and the current receipt does not identify its destination.

## Biên Hòa deployment (`bh` branch)

This branch's `apps-script/Code.gs` writes to the dedicated
[Biên Hòa spreadsheet](https://docs.google.com/spreadsheets/d/1p0KG88IGdCcjXlxcEkaAJliSro5MCtxkKqA78j7M29E/edit).
Use a separate Apps Script project and deployment so the main invitation keeps
writing to its original spreadsheet.

1. Open that spreadsheet and choose **Extensions → Apps Script**. Replace the
   editor's `Code.gs` with `apps-script/Code.gs` from this branch and save.
2. Choose **Deploy → New deployment → Web app**. Set **Execute as: Me** and
   **Who has access: Anyone**, authorize access, then deploy.
3. Copy the new web-app `/exec` URL into `scriptUrl` in
   `src/sections/rsvp/content.ts` on `bh` only. This branch is configured with the
   [BH deployment](https://script.google.com/macros/s/AKfycbwx_ILCFzydE1crX71T-Q9IyDXGWSa_28nk5qKoTwW3M1I_tdg4OLgCWUxBlPj464HMXw/exec).
   Changing the spreadsheet ID alone does not connect the website to a new deployment.
4. Deploy the static website normally. No Cloudflare variables or secrets are
   used. The old `RSVP_API_TOKEN` and `RSVP_SCRIPT_URL` settings can be deleted.
5. Submit a test RSVP and confirm one row appears in BH's tab `gid=736591688`
   and none in main's spreadsheet.
   A retry of identical content with the same request ID must not add a second row.

For later updates to the BH script, choose **Deploy → Manage deployments → Edit
→ New version → Deploy** to keep its `/exec` URL. Saving alone does not update
deployed code. Do not edit the main invitation's Apps Script project.

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
`none`) and `returnRide` (`self` or `shuttle`). A trip sends the car and pickup as
plain text in `vehicle` and `station`. A return shuttle sends `returnVehicle` and
`returnStation`, also plain text up to 120 characters. Either direction can be
used alone. The page offers the choices; this script does not keep those lists,
so renaming a car or a stop does not require a new Apps Script deployment. Guests who are not attending
omit these fields. Older BH clients that omit shuttle fields remain
valid: the script stores the original payload shape and leaves the shuttle
columns blank. A receipt for every successful save now includes `version: 2`.
The Biên Hòa page treats a shuttle submission as unconfirmed until it receives
that version, so deploy this script before sharing the `bh` form.

The RSVP tab contains Request ID, Thời gian, Họ tên, Tham dự, Số người, Lời nhắn,
Payload, and, after this deployment, Xe đưa đón, Chiều đi, Tên xe, Trạm đón, Chiều về,
Trạm trả. An existing header row with only the first seven titles is extended
in place. Do not rename the shuttle titles or edit the Request ID/Payload
columns, and do not sort columns separately.
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
