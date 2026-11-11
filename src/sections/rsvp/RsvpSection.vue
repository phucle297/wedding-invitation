<script setup lang="ts">
import { computed, nextTick, onUnmounted, ref, watch } from "vue";
import { rsvp } from "./content";
import { shuttle, shuttleTrips, shuttleVehicles } from "./shuttle";
import type { OutboundChoice, TransportChoice, TripId } from "./shuttle";
import { submitRsvp } from "./submitRsvp";
import type { RsvpSubmission } from "./submitRsvp";
import StopSelect from "./StopSelect.vue";

const name = ref("");
const phone = ref("");
const birthYear = ref<number | string>("");
const currentYear = new Date().getFullYear();
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
const returnStops = computed(() => {
  const car = shuttleVehicles.find((item) => item.name === returnChoice.value);
  return shuttleTrips.find((trip) => trip.id === car?.tripId)?.stops ?? [];
});
let submission: { fingerprint: string; requestId: string } | null = null;
let restoreFocus: HTMLElement | null = null;

watch([name, phone, birthYear, attend, count, note, transport, outbound, station, returnChoice, returnStation], () => {
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

watch(returnChoice, () => {
  if (!returnStops.value.some((stop) => stop.name === returnStation.value)) {
    returnStation.value = "";
  }
  if (!returnStation.value && returnStops.value.some((stop) => stop.name === station.value)) {
    returnStation.value = station.value;
  }
});

watch(station, (value) => {
  if (!returnStation.value && returnStops.value.some((stop) => stop.name === value)) {
    returnStation.value = value;
  }
});

watch(routeOpen, async (open) => {
  if (!open) return;
  document.body.style.overflow = "hidden";
  await nextTick();
  if (routeOpen.value) routeDialog.value?.focus({ preventScroll: true });
});

onUnmounted(() => {
  document.body.style.overflow = "";
});

function openRoute() {
  restoreFocus ??= document.activeElement instanceof HTMLElement ? document.activeElement : null;
  routeOpen.value = true;
}

function closeRoute() {
  routeOpen.value = false;
}

function onRouteClosed() {
  if (routeOpen.value) return;
  document.body.style.overflow = "";
  restoreFocus?.focus({ preventScroll: true });
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
  const contactPhone = phone.value.replace(/[\s().-]/g, "");
  if (phone.value.trim() && !/^\+?[0-9]{9,15}$/.test(contactPhone)) {
    status.value = rsvp.messages.needPhone;
    await nextTick();
    document.getElementById("guest-phone")?.focus();
    return;
  }
  const year = birthYear.value === "" ? undefined : Number(birthYear.value);
  if (year !== undefined && (!Number.isInteger(year) || year < 1900 || year > currentYear)) {
    status.value = rsvp.messages.needBirthYear;
    await nextTick();
    document.getElementById("guest-birth-year")?.focus();
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
    await nextTick();
    document.getElementById("guest-station")?.focus();
    return;
  }
  if (usingShuttle.value && !returnChoice.value) {
    status.value = rsvp.messages.needReturn;
    return;
  }
  if (returningByCar.value && !returnStation.value.trim()) {
    status.value = rsvp.messages.needReturnStation;
    await nextTick();
    document.getElementById("guest-return-station")?.focus();
    return;
  }
  const ride = transportPayload();
  const payload: Omit<RsvpSubmission, "requestId"> = {
    name: guest,
    ...(contactPhone ? { phone: contactPhone } : {}),
    ...(year !== undefined ? { birthYear: year } : {}),
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
    if (error instanceof Error && error.message === "outdated_deployment") {
      status.value = rsvp.messages.outdated;
    } else {
      status.value = error instanceof Error && error.message === "service_unavailable"
        ? rsvp.messages.unavailable : rsvp.messages.failed;
    }
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
        <label for="guest-name">{{ rsvp.nameLabel }} <span class="required" aria-hidden="true">*</span></label>
        <input
          id="guest-name"
          ref="nameInput"
          v-model="name"
          type="text"
          autocomplete="name"
          aria-describedby="passenger-note"
          maxlength="80"
          :disabled="pending"
          required
        />
      </div>
      <div class="contact-fields">
        <div class="field">
          <label for="guest-phone">{{ rsvp.phoneLabel }}</label>
          <input
            id="guest-phone"
            v-model="phone"
            type="tel"
            inputmode="tel"
            autocomplete="tel"
            maxlength="24"
            :disabled="pending"
            :aria-invalid="status === rsvp.messages.needPhone || undefined"
            :aria-describedby="status === rsvp.messages.needPhone ? 'passenger-note rsvp-status' : 'passenger-note'"
          />
        </div>
        <div class="field">
          <label for="guest-birth-year">{{ rsvp.birthYearLabel }}</label>
          <input
            id="guest-birth-year"
            v-model="birthYear"
            type="number"
            inputmode="numeric"
            autocomplete="bday-year"
            min="1900"
            :max="currentYear"
            step="1"
            :disabled="pending"
            :aria-invalid="status === rsvp.messages.needBirthYear || undefined"
            :aria-describedby="status === rsvp.messages.needBirthYear ? 'passenger-note rsvp-status' : 'passenger-note'"
          />
        </div>
      </div>
      <p id="passenger-note" class="field-note passenger-note">{{ rsvp.passengerNote }}</p>
      <fieldset>
        <legend>{{ rsvp.attendLegend }} <span class="required" aria-hidden="true">*</span></legend>
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
        <label for="guest-count">{{ rsvp.countLabel }} <span class="required" aria-hidden="true">*</span></label>
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
        <legend>{{ shuttle.legend }} <span class="required" aria-hidden="true">*</span></legend>
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
        <legend>{{ shuttle.outboundLegend }} <span class="required" aria-hidden="true">*</span></legend>
        <label v-for="trip in shuttleTrips" :key="trip.id" class="choice">
          <input
            v-model="outbound"
            type="radio"
            name="outbound"
            :value="trip.id"
            :disabled="pending"
            required
          />
          <span>{{ carsFor(trip.id) }} · {{ trip.depart }} · {{ trip.seats }} chỗ</span>
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
        <label id="guest-station-label" for="guest-station">{{ shuttle.stationLabel }} <span class="required" aria-hidden="true">*</span></label>
        <StopSelect
          id="guest-station"
          v-model="station"
          :stops="pickedTrip.stops"
          :placeholder="shuttle.stationPlaceholder"
          :disabled="pending"
          :error="status === rsvp.messages.needStation ? status : undefined"
          show-time
        />
      </div>
      <fieldset v-if="usingShuttle">
        <legend>{{ shuttle.returnLegend }} <span class="required" aria-hidden="true">*</span></legend>
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
        <label id="guest-return-station-label" for="guest-return-station">{{ shuttle.returnStationLabel }} <span class="required" aria-hidden="true">*</span></label>
        <StopSelect
          id="guest-return-station"
          v-model="returnStation"
          :stops="returnStops"
          :placeholder="shuttle.returnStationPlaceholder"
          :disabled="pending"
          :error="status === rsvp.messages.needReturnStation ? status : undefined"
        />
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
      <p id="rsvp-status" class="form-status" role="status">{{ status }}</p>
      <p class="privacy-note">Thông tin chỉ dùng để sắp xếp tiệc cưới và đối chiếu danh sách xe đưa đón.</p>
    </form>
    <Teleport to="body">
      <Transition
        name="route-modal"
        @before-enter="(element) => element.removeAttribute('inert')"
        @before-leave="(element) => element.setAttribute('inert', '')"
        @after-leave="onRouteClosed"
      >
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
            <div class="route-header">
              <div class="route-bar">
                <p class="route-kicker">{{ shuttle.legend }}</p>
                <button class="text-btn route-close" type="button" @click="closeRoute">{{ shuttle.closeRoute }}</button>
              </div>
              <h3 id="route-title">{{ shuttle.routeTitle }}</h3>
            </div>
            <div class="route-content" role="region" aria-label="Chi tiết lộ trình" tabindex="0">
              <p class="route-lead">{{ shuttle.routeLead }}</p>
              <div class="route-list">
                <section v-for="trip in shuttleTrips" :key="trip.id" class="route-trip">
                  <h4>{{ carsFor(trip.id) }} · {{ trip.seats }} chỗ</h4>
                  <p>Xuất phát {{ trip.depart }}</p>
                  <ol>
                    <li v-for="stop in trip.stops" :key="stop.name">
                      <time :datetime="stop.time">{{ stop.time }}</time>
                      <span>
                        {{ stop.name }}
                        <small v-if="stop.address !== stop.name">{{ stop.address }}</small>
                      </span>
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
        </div>
      </Transition>
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

.contact-fields {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 0.65fr);
  gap: 18px;
}
.contact-fields .field { min-width: 0; }
.required { color: #913b3e; font-style: normal; }
.field-note.passenger-note {
  margin-top: 8px;
  padding: 0 4px;
  font-size: 0.8125rem;
  line-height: 1.6;
}
@media (max-width: 480px) {
  .contact-fields { grid-template-columns: minmax(0, 1fr); gap: 0; }
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
input[type="tel"],
input[type="number"],
textarea {
  width: 100%;
  padding: 12px 2px;
  border: 0;
  border-bottom: 1px solid rgba(42, 39, 36, 0.28);
  background: transparent;
  border-radius: 0;
  transition: border-color 0.2s cubic-bezier(0.23, 1, 0.32, 1);
}

input[type="text"]:focus,
input[type="tel"]:focus,
input[type="number"]:focus,
textarea:focus {
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
  place-items: center;
  padding: 16px;
  background: rgba(42, 39, 36, 0.46);
}

.route-modal-enter-active {
  transition: opacity 240ms cubic-bezier(0.23, 1, 0.32, 1);
}

.route-modal-leave-active {
  transition: opacity 180ms ease-in;
  pointer-events: none;
}

.route-modal-enter-active .route-dialog {
  transition: transform 240ms cubic-bezier(0.23, 1, 0.32, 1);
}

.route-modal-leave-active .route-dialog {
  transition: transform 180ms ease-in;
}

.route-modal-enter-from,
.route-modal-leave-to {
  opacity: 0;
}

.route-modal-enter-from .route-dialog,
.route-modal-leave-to .route-dialog {
  transform: translateY(16px) scale(0.98);
}

.route-dialog {
  --ink: #3f342a;
  --ink-soft: #756655;
  --espresso: #685033;
  --line: #94734638;
  --paper: #fffdf9;
  display: flex;
  flex-direction: column;
  width: min(720px, 100%);
  max-height: min(calc(100dvh - 32px), 820px);
  margin-inline: auto;
  overflow: hidden;
  border: 1px solid #94734655;
  border-radius: 10px;
  background: var(--paper);
  color: var(--ink);
  text-align: left;
  box-shadow: 0 24px 60px rgba(48, 48, 44, 0.18);
}

.route-dialog:focus {
  outline: none;
}

.route-header {
  flex: none;
  padding: 20px 22px 16px;
  border-bottom: 1px solid var(--line);
}

.route-content {
  min-height: 0;
  overflow-y: auto;
  overscroll-behavior: contain;
  padding: 20px 22px calc(22px + env(safe-area-inset-bottom));
}

.route-kicker,
.route-lead,
.route-trip p {
  margin: 0;
  color: var(--ink-soft);
}

.route-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
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
  margin: 0;
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

.route-trip small {
  display: block;
  margin-top: 3px;
  color: var(--ink-soft);
  font-size: 0.85em;
}

.route-trip .destination span {
  font-weight: 500;
}

.route-dialog .btn {
  width: 100%;
}

@media (min-width: 720px) {
  .route-backdrop {
    padding: 24px;
  }

  .route-dialog {
    max-height: min(calc(100dvh - 48px), 820px);
  }

  .route-header {
    padding: 24px 36px 20px;
  }

  .route-content {
    padding: 24px 36px 28px;
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
