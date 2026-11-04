<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { rsvp } from "./content";

const name = ref("");
const attend = ref("");
const count = ref<number | string>(1);
const note = ref("");
const status = ref("");
const website = ref("");
const pending = ref(false);
const sent = ref(false);
const nameInput = ref<HTMLInputElement | null>(null);
const absent = computed(() => attend.value === rsvp.absentValue);
let submission: { fingerprint: string; requestId: string } | null = null;

watch([name, attend, count, note], () => {
  sent.value = false;
  status.value = "";
});

async function onSubmit() {
  if (pending.value || sent.value) return;
  const guest = name.value.trim();
  if (!guest) {
    status.value = rsvp.messages.needName;
    nameInput.value?.focus();
    return;
  }
  if (!attend.value) {
    status.value = rsvp.messages.needAttend;
    return;
  }
  const payload = {
    name: guest,
    attendance: attend.value,
    count: absent.value ? 1 : Number(count.value),
    note: note.value.trim(),
    website: website.value,
  };
  const fingerprint = JSON.stringify(payload);
  if (submission?.fingerprint !== fingerprint) {
    submission = { fingerprint, requestId: crypto.randomUUID() };
  }
  pending.value = true;
  status.value = "";
  try {
    const response = await fetch("/api/rsvp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...payload, requestId: submission.requestId }),
      signal: AbortSignal.timeout(15000),
    });
    if (!response.ok) {
      status.value = response.status === 503 ? rsvp.messages.unavailable : rsvp.messages.failed;
      return;
    }
    const result: unknown = await response.json();
    if (!result || typeof result !== "object" || !("ok" in result) || result.ok !== true) {
      throw new Error("Invalid response");
    }
    sent.value = true;
    status.value = rsvp.messages.saved;
  } catch {
    status.value = rsvp.messages.failed;
  } finally {
    pending.value = false;
  }
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
      <div v-show="!absent" class="field">
        <label for="guest-count">{{ rsvp.countLabel }}</label>
        <input
          id="guest-count"
          v-model="count"
          type="number"
          inputmode="numeric"
          min="1"
          max="10"
          :required="!absent"
          :disabled="pending || absent"
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
      <p class="form-status" role="status">{{ status }}</p>
      <p class="privacy-note">Thông tin chỉ dùng để sắp xếp tiệc cưới.</p>
    </form>
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

.optional {
  letter-spacing: 0;
  text-transform: none;
  font-style: italic;
}

input[type="text"],
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

.form-status {
  min-height: 1.4em;
  margin: 14px 0 0;
}

.form-status:not(:empty) {
  color: var(--ink);
}

</style>
