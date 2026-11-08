<script setup lang="ts">
import { computed, nextTick, onUnmounted, ref, watch } from "vue";
import { rsvp } from "./content";
import { shuttle, shuttleStations, shuttleTrips, shuttleVehicles } from "./shuttle";
import type { OutboundChoice, TransportChoice, TripId } from "./shuttle";
import { submitRsvp } from "./submitRsvp";
import type { RsvpSubmission } from "./submitRsvp";

const name = ref("");
const attend = ref("");
const count = ref<number | string>(1);
const note = ref("");
const transport = ref<"" | TransportChoice>("");
const outbound = ref<"" | OutboundChoice>("");
const station = ref("");
const returnChoice = ref("");
const returnStation = ref("");
const status = ref("");
const website = ref("");
const pending = ref(false);
const sent = ref(false);
const routeOpen = ref(false);
const nameInput = ref<HTMLInputElement | null>(null);
const routeDialog = ref<HTMLElement | null>(null);
const absent = computed(() => attend.value === rsvp.absentValue);
const usingShuttle = computed(() => !absent.value && transport.value === "shuttle");
const pickedTrip = computed(() => shuttleTrips.find((trip) => trip.id === outbound.value) ?? null);
const returningByCar = computed(() => returnChoice.value !== "" && returnChoice.value !== "self");
let submission: { fingerprint: string; requestId: string } | null = null;
let restoreFocus: HTMLElement | null = null;

watch([name, attend, count, note, transport, outbound, station, returnChoice, returnStation], () => {
  sent.value = false;
  status.value = "";
});

watch(attend, (value) => {
  if (value === rsvp.absentValue) {
    transport.value = "";
    outbound.value = "";
    station.value = "";
    returnChoice.value = "";
    returnStation.value = "";
  }
});

watch(transport, (value) => {
  if (value !== "shuttle") {
    outbound.value = "";
    station.value = "";
    returnChoice.value = "";
    returnStation.value = "";
  }
});

watch(outbound, (value) => {
  station.value = "";
  if ((value === "trip-1" || value === "trip-2") && !returnChoice.value) {
    const car = shuttleVehicles.find((item) => item.tripId === value);
    if (car) returnChoice.value = car.name;
  }
});

watch(returnChoice, (value) => {
  if (value === "self" || value === "") {
    returnStation.value = "";
    return;
  }
  if (!returnStation.value) returnStation.value = station.value;
});

watch(station, (value) => {
  if (returningByCar.value && !returnStation.value) returnStation.value = value;
});

watch(routeOpen, async (open) => {
  document.body.style.overflow = open ? "hidden" : "";
  if (!open) return;
  await nextTick();
  routeDialog.value?.focus();
});

onUnmounted(() => {
  document.body.style.overflow = "";
});

function openRoute() {
  restoreFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null;
  routeOpen.value = true;
}

function closeRoute() {
  routeOpen.value = false;
  restoreFocus?.focus();
  restoreFocus = null;
}

function onRouteKeydown(event: KeyboardEvent) {
  if (event.key === "Escape") {
    event.preventDefault();
    closeRoute();
    return;
  }
  if (event.key !== "Tab" || !routeDialog.value) return;
  const items = [...routeDialog.value.querySelectorAll<HTMLElement>(
    "button, [href], input, select, textarea, [tabindex]:not([tabindex='-1'])",
  )].filter((item) => !item.hasAttribute("disabled"));
  if (items.length === 0) return;
  const first = items[0];
  const last = items[items.length - 1];
  if (event.shiftKey && document.activeElement === first) {
    event.preventDefault();
    last?.focus();
  } else if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault();
    first?.focus();
  }
}

function transportPayload(): Pick<RsvpSubmission, "transport" | "outbound" | "vehicle" | "station" | "returnRide" | "returnVehicle" | "returnStation"> | undefined {
  if (absent.value || transport.value === "") return undefined;
  if (transport.value === "own") return { transport: "own" };
  if (!outbound.value || returnChoice.value === "") return undefined;
  const ride: Pick<RsvpSubmission, "transport" | "outbound" | "vehicle" | "station" | "returnRide" | "returnVehicle" | "returnStation"> = {
    transport: "shuttle",
    outbound: outbound.value,
  };
  if (pickedTrip.value) {
    ride.vehicle = carsFor(pickedTrip.value.id);
    ride.station = station.value.trim();
  }
  if (returnChoice.value === "self") {
    ride.returnRide = "self";
    return ride;
  }
  ride.returnRide = "shuttle";
  ride.returnVehicle = returnChoice.value.trim();
  ride.returnStation = returnStation.value.trim();
  return ride;
}

async function onSubmit() {
  if (pending.value || sent.value) return;
  const guest = name.value.trim();
  if (!guest) {
    status.value = rsvp.messages.needName;
    nameInput.value?.focus();
    return;
  }
  if (attend.value !== "attending" && attend.value !== "absent") {
    status.value = rsvp.messages.needAttend;
    return;
  }
  if (!absent.value && transport.value !== "shuttle" && transport.value !== "own") {
    status.value = rsvp.messages.needTransport;
    return;
  }
  if (usingShuttle.value && !outbound.value) {
    status.value = rsvp.messages.needOutbound;
    return;
  }
  if (pickedTrip.value && !station.value) {
    status.value = rsvp.messages.needStation;
    return;
  }
  if (usingShuttle.value && !returnChoice.value) {
    status.value = rsvp.messages.needReturn;
    return;
  }
  if (returningByCar.value && !returnStation.value.trim()) {
    status.value = rsvp.messages.needReturnStation;
    return;
  }
  const ride = transportPayload();
  const payload: Omit<RsvpSubmission, "requestId"> = {
    name: guest,
    attendance: attend.value,
    count: absent.value ? 1 : Number(count.value),
    note: note.value.trim(),
    website: website.value,
    ...ride,
  };
  const fingerprint = JSON.stringify(payload);
  if (submission?.fingerprint !== fingerprint) {
    submission = { fingerprint, requestId: crypto.randomUUID() };
  }
  pending.value = true;
  status.value = "";
  try {
    await submitRsvp({ ...payload, requestId: submission.requestId });
    sent.value = true;
    status.value = rsvp.messages.saved;
  } catch (error) {
    status.value = error instanceof Error && error.message === "service_unavailable"
      ? rsvp.messages.unavailable : rsvp.messages.failed;
  } finally {
    pending.value = false;
  }
}

function carsFor(tripId: TripId) {
  return shuttleVehicles.filter((car) => car.tripId === tripId).map((car) => car.name).join(", ");
}
</script>

<template>
  <section class="block rsvp" id="xac-nhan" aria-labelledby="rsvp-title">
    <div class="rsvp-copy">
      <h2 id="rsvp-title">{{ rsvp.title }}</h2>
      <p class="lead">{{ rsvp.lead }}</p>
    </div>
    <form :aria-busy="pending" @submit.prevent="onSubmit">
      <div class="honeypot" aria-hidden="true">
        <label for="guest-website">Website</label>
        <input id="guest-website" v-model="website" type="text" tabindex="-1" autocomplete="off" />
      </div>
      <div class="field">
        <label for="guest-name">{{ rsvp.nameLabel }}</label>
        <input
          id="guest-name"
          ref="nameInput"
          v-model="name"
          type="text"
          autocomplete="name"
          maxlength="80"
          :disabled="pending"
          required
        />
      </div>
      <fieldset>
        <legend>{{ rsvp.attendLegend }}</legend>
        <label
          v-for="choice in rsvp.choices"
          :key="choice.value"
          class="choice"
        >
          <input
            v-model="attend"
            type="radio"
            name="attend"
            :value="choice.value"
            :disabled="pending"
            required
          />
          <span>{{ choice.label }}</span>
        </label>
      </fieldset>
      <div v-if="!absent" class="field">
        <label for="guest-count">{{ rsvp.countLabel }}</label>
        <input
          id="guest-count"
          v-model="count"
          type="number"
          inputmode="numeric"
          min="1"
          max="10"
          required
          :disabled="pending"
        />
      </div>
      <fieldset v-if="!absent">
        <legend>{{ shuttle.legend }}</legend>
        <p class="field-note">{{ shuttle.note }}</p>
        <label class="choice">
          <input
            v-model="transport"
            type="radio"
            name="transport"
            value="shuttle"
            :disabled="pending"
            required
          />
          <span>{{ shuttle.useLabel }}</span>
        </label>
        <label class="choice">
          <input
            v-model="transport"
            type="radio"
            name="transport"
            value="own"
            :disabled="pending"
            required
          />
          <span>{{ shuttle.ownLabel }}</span>
        </label>
        <button class="text-btn route-link" type="button" :disabled="pending" @click="openRoute">
          {{ shuttle.viewRoute }}
        </button>
      </fieldset>
      <fieldset v-if="usingShuttle">
        <legend>{{ shuttle.outboundLegend }}</legend>
        <label v-for="trip in shuttleTrips" :key="trip.id" class="choice">
          <input
            v-model="outbound"
            type="radio"
            name="outbound"
            :value="trip.id"
            :disabled="pending"
            required
          />
          <span>{{ trip.label }} · {{ trip.depart }} · {{ carsFor(trip.id) }}</span>
        </label>
        <label class="choice">
          <input v-model="outbound" type="radio" name="outbound" value="self" :disabled="pending" required />
          <span>{{ shuttle.selfOutbound }}</span>
        </label>
        <label class="choice">
          <input v-model="outbound" type="radio" name="outbound" value="none" :disabled="pending" required />
          <span>{{ shuttle.noneOutbound }}</span>
        </label>
      </fieldset>
      <div v-if="pickedTrip" class="field">
        <label for="guest-station">{{ shuttle.stationLabel }}</label>
        <select id="guest-station" v-model="station" :disabled="pending" required>
          <option disabled value="">{{ shuttle.stationPlaceholder }}</option>
          <option v-for="stop in shuttleStations" :key="stop.name" :value="stop.name">
            {{ stop.times[pickedTrip.id] }} · {{ stop.name }}
          </option>
        </select>
      </div>
      <fieldset v-if="usingShuttle">
        <legend>{{ shuttle.returnLegend }}</legend>
        <label v-for="car in shuttleVehicles" :key="car.name" class="choice">
          <input v-model="returnChoice" type="radio" name="return-ride" :value="car.name" :disabled="pending" required />
          <span>{{ car.name }}</span>
        </label>
        <label class="choice">
          <input v-model="returnChoice" type="radio" name="return-ride" value="self" :disabled="pending" required />
          <span>{{ shuttle.returnSelf }}</span>
        </label>
      </fieldset>
      <div v-if="returningByCar" class="field">
        <label for="guest-return-station">{{ shuttle.returnStationLabel }}</label>
        <select id="guest-return-station" v-model="returnStation" :disabled="pending" required>
          <option disabled value="">{{ shuttle.returnStationPlaceholder }}</option>
          <option v-for="stop in shuttleStations" :key="stop.name" :value="stop.name">
            {{ stop.name }}
          </option>
        </select>
      </div>
      <div class="field">
        <label for="guest-note">
          {{ rsvp.noteLabel }}
          <span class="optional">{{ rsvp.noteOptional }}</span>
        </label>
        <textarea
          id="guest-note"
          v-model="note"
          maxlength="400"
          rows="3"
          :disabled="pending"
        ></textarea>
      </div>
      <button class="btn btn-ink" type="submit" :disabled="pending || sent">
        {{ pending ? "Đang gửi…" : sent ? "Đã gửi xác nhận" : rsvp.submit }}
      </button>
      <p class="form-status" role="status">{{ status }}</p>
      <p class="privacy-note">Thông tin chỉ dùng để sắp xếp tiệc cưới.</p>
    </form>
    <Teleport to="body">
      <div
        v-if="routeOpen"
        class="route-backdrop"
        @click.self="closeRoute"
        @keydown="onRouteKeydown"
      >
        <div
          ref="routeDialog"
          class="route-dialog"
          role="dialog"
          aria-modal="true"
          aria-labelledby="route-title"
          tabindex="-1"
        >
          <div class="route-bar">
            <p class="route-kicker">{{ shuttle.legend }}</p>
            <button class="text-btn route-close" type="button" @click="closeRoute">{{ shuttle.closeRoute }}</button>
          </div>
          <h3 id="route-title">{{ shuttle.routeTitle }}</h3>
          <p class="route-lead">{{ shuttle.routeLead }}</p>
          <div class="route-list">
            <section v-for="trip in shuttleTrips" :key="trip.id" class="route-trip">
              <h4>{{ trip.label }} · {{ carsFor(trip.id) }}</h4>
              <p>Xuất phát {{ trip.depart }}</p>
              <ol>
                <li v-for="stop in shuttleStations" :key="stop.name">
                  <time :datetime="stop.times[trip.id]">{{ stop.times[trip.id] }}</time>
                  <span>{{ stop.name }}</span>
                </li>
                <li class="destination">
                  <time :datetime="trip.arrive">{{ trip.arrive }}</time>
                  <span>{{ shuttle.destination }}</span>
                </li>
              </ol>
            </section>
          </div>
          <button class="btn btn-ink" type="button" @click="closeRoute">{{ shuttle.closeRoute }}</button>
        </div>
      </div>
    </Teleport>
  </section>
</template>

<style scoped>
.rsvp {
  text-align: center;
}
.honeypot {
  position: absolute;
  width: 1px;
  height: 1px;
  overflow: hidden;
  clip-path: inset(50%);
}
button:disabled {
  opacity: 0.65;
  cursor: default;
}
.privacy-note {
  color: var(--ink-soft);
  font-size: 0.85rem;
}

.rsvp .lead {
  max-width: 34em;
  margin-left: auto;
  margin-right: auto;
}

form {
  margin-top: 8px;
  text-align: left;
}

form .btn {
  margin-top: 22px;
}

.field {
  margin-top: 22px;
}

.field label,
legend {
  display: block;
  margin-bottom: 6px;
  font-size: 0.84rem;
  font-weight: 500;
  color: var(--ink-soft);
}

.field-note {
  margin: 0;
  color: var(--ink-soft);
  font-size: 0.95rem;
}

.optional {
  letter-spacing: 0;
  text-transform: none;
  font-style: italic;
}

input[type="text"],
input[type="number"],
textarea,
select {
  width: 100%;
  padding: 12px 2px;
  border: 0;
  border-bottom: 1px solid rgba(42, 39, 36, 0.28);
  background: transparent;
  border-radius: 0;
  transition: border-color 0.2s cubic-bezier(0.23, 1, 0.32, 1);
}

select {
  min-height: 48px;
  padding: 12px;
  font: inherit;
  font-size: 16px;
}

input[type="text"]:focus,
input[type="number"]:focus,
textarea:focus,
select:focus {
  border-bottom-color: var(--ink);
}

textarea {
  resize: vertical;
}

fieldset {
  margin: 22px 0 0;
  padding: 0;
  border: 0;
}

.choice {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 0;
  border-top: 1px solid var(--line);
  cursor: pointer;
}

.choice input {
  width: 1.15rem;
  height: 1.15rem;
  accent-color: var(--espresso);
  flex: none;
}

.choice:hover span,
.choice:has(input:checked) span {
  color: var(--ink);
}

.choice:has(input:checked) span {
  font-weight: 500;
}

.route-link {
  margin: 2px 0 0;
  padding-inline: 0;
}

.form-status {
  min-height: 1.4em;
  margin: 14px 0 0;
}

.form-status:not(:empty) {
  color: var(--ink);
}

.route-backdrop {
  position: fixed;
  inset: 0;
  z-index: 80;
  display: grid;
  align-items: end;
  background: rgba(42, 39, 36, 0.46);
}

.route-dialog {
  --ink: #3f342a;
  --ink-soft: #756655;
  --espresso: #685033;
  --line: #94734638;
  --paper: #fffdf9;
  width: min(720px, 100%);
  max-height: min(92vh, 820px);
  margin-inline: auto;
  overflow: auto;
  padding: 28px 22px calc(22px + env(safe-area-inset-bottom));
  border: 1px solid #94734655;
  background: var(--paper);
  color: var(--ink);
  text-align: left;
  box-shadow: 0 24px 60px rgba(48, 48, 44, 0.18);
}

.route-dialog:focus {
  outline: none;
}

.route-kicker,
.route-lead,
.route-trip p {
  margin: 0;
  color: var(--ink-soft);
}

.route-bar {
  position: sticky;
  top: 0;
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: -8px 0 8px;
  padding-block: 4px 8px;
  background: var(--paper);
}

.route-close {
  margin: 0;
  padding: 8px 0 8px 12px;
  color: var(--espresso);
}

.route-kicker {
  font-size: 0.78rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.route-dialog h3 {
  margin: 8px 0 12px;
  font-family: var(--script-vi, "Great Vibes", cursive);
  font-size: clamp(2rem, 5vw, 2.6rem);
  font-weight: 500;
  line-height: 1.2;
}

.route-lead {
  max-width: 40em;
  font-size: 0.98rem;
}

.route-list {
  display: grid;
  gap: 22px;
  margin: 22px 0;
}

.route-trip h4 {
  margin: 0 0 4px;
  font-family: var(--heading, "Cormorant SC", serif);
  font-size: 1.35rem;
  font-weight: 500;
}

.route-trip ol {
  list-style: none;
  margin: 12px 0 0;
  padding: 0;
}

.route-trip li {
  display: grid;
  grid-template-columns: 3.5rem minmax(0, 1fr);
  gap: 10px;
  padding: 9px 0;
  border-top: 1px solid var(--line);
}

.route-trip time {
  color: var(--espresso);
  font-variant-numeric: tabular-nums;
}

.route-trip .destination span {
  font-weight: 500;
}

.route-dialog .btn {
  width: 100%;
}

@media (min-width: 720px) {
  .route-backdrop {
    align-items: center;
    padding: 24px;
  }

  .route-dialog {
    padding: 36px 36px 28px;
  }

  .route-list {
    grid-template-columns: 1fr 1fr;
    gap: 28px;
  }

  .route-dialog .btn {
    width: auto;
    min-width: 140px;
  }
}
</style>
