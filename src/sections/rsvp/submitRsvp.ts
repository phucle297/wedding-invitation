import { rsvp } from "./content";
import type { OutboundChoice, ReturnChoice, TransportChoice } from "./shuttle";

export interface RsvpSubmission {
  requestId: string;
  name: string;
  phone?: string;
  birthYear?: number;
  attendance: "attending" | "absent";
  count: number;
  note: string;
  website: string;
  transport?: TransportChoice;
  outbound?: OutboundChoice;
  vehicle?: string;
  station?: string;
  returnRide?: ReturnChoice;
  returnVehicle?: string;
  returnStation?: string;
}

export function submitRsvp(submission: RsvpSubmission): Promise<void> {
  return new Promise((resolve, reject) => {
    const nonce = crypto.randomUUID();
    const frame = document.createElement("iframe");
    frame.name = `rsvp-${nonce}`;
    frame.title = "Xác nhận gửi RSVP";
    frame.hidden = true;

    const form = document.createElement("form");
    form.action = rsvp.scriptUrl;
    form.method = "POST";
    form.target = frame.name;
    form.hidden = true;
    for (const [name, value] of Object.entries({
      payload: JSON.stringify(submission), nonce, origin: window.location.origin,
    })) {
      const input = document.createElement("input");
      input.type = "hidden";
      input.name = name;
      input.value = value;
      form.append(input);
    }

    function finish(error?: Error) {
      window.clearTimeout(timeout);
      window.removeEventListener("message", onReceipt);
      form.remove();
      frame.remove();
      if (error) reject(error);
      else resolve();
    }

    function onReceipt(event: MessageEvent<unknown>) {
      // HtmlService runs in a nested Google sandbox, not the target frame itself.
      if (!/^https:\/\/(?:script|[a-z0-9-]+-script)\.googleusercontent\.com$/.test(event.origin)) return;
      const value = event.data;
      if (!value || typeof value !== "object" ||
        !("type" in value) || value.type !== "wedding-rsvp" ||
        !("nonce" in value) || value.nonce !== nonce) return;
      if ("ok" in value && value.ok === true &&
        "requestId" in value && value.requestId === submission.requestId) {
        // Do not confirm data that an older Apps Script deployment silently ignores.
        const minimumVersion = submission.phone || submission.birthYear !== undefined ? 3 : submission.transport ? 2 : 0;
        const saved = minimumVersion === 0 ||
          ("version" in value && typeof value.version === "number" && value.version >= minimumVersion);
        finish(saved ? undefined : new Error("outdated_deployment"));
      } else {
        finish(new Error("error" in value && value.error === "service_unavailable"
          ? "service_unavailable" : "unconfirmed_submission"));
      }
    }

    const timeout = window.setTimeout(() => finish(new Error("unconfirmed_submission")), 15000);
    window.addEventListener("message", onReceipt);
    document.body.append(frame, form);
    try {
      // Native form POST avoids CORS preflight; the script confirms the actual write.
      form.submit();
    } catch {
      finish(new Error("unconfirmed_submission"));
    }
  });
}
