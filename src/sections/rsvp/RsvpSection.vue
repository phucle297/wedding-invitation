<script setup lang="ts">
import { computed, ref } from "vue";
import { couple } from "../../content/couple";
import { date } from "../../content/date";
import { copyText } from "../../lib/clipboard";
import { buildRsvpMessage } from "../../lib/rsvpMessage";
import { rsvp } from "./content";

const name = ref("");
const attend = ref("");
const count = ref<number | string>(1);
const note = ref("");
const status = ref("");
const preview = ref("");
const nameInput = ref<HTMLInputElement | null>(null);
const absent = computed(() => attend.value === rsvp.absentValue);

function onSubmit() {
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
  const text = buildRsvpMessage({
    title: `Xác nhận tham dự lễ cưới ${couple.groom.short} & ${couple.bride.short}`,
    date: date.display,
    name: guest,
    attend: attend.value,
    count: count.value,
    note: note.value.trim(),
    absentValue: rsvp.absentValue,
  });
  preview.value = text;

  const copied = () => {
    status.value = rsvp.messages.copied;
  };
  const fallback = () => {
    copyText(text)
      .then(copied)
      .catch(() => {
        status.value = rsvp.messages.failed;
      });
  };

  if (navigator.share) {
    navigator
      .share({ title: "Xác nhận tham dự", text })
      .then(() => {
        status.value = rsvp.messages.shared;
      })
      .catch((error: unknown) => {
        if (error instanceof Error && error.name === "AbortError") {
          status.value = rsvp.messages.cancelled;
          return;
        }
        fallback();
      });
    return;
  }
  fallback();
}
</script>

<template>
  <section class="block rsvp" id="xac-nhan" aria-labelledby="rsvp-title">
    <div class="rsvp-copy">
      <h2 id="rsvp-title">{{ rsvp.title }}</h2>
      <p class="lead">{{ rsvp.lead }}</p>
    </div>
    <form @submit.prevent="onSubmit">
      <div class="field">
        <label for="guest-name">{{ rsvp.nameLabel }}</label>
        <input
          id="guest-name"
          ref="nameInput"
          v-model="name"
          type="text"
          autocomplete="name"
          maxlength="80"
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
        ></textarea>
      </div>
      <button class="btn btn-ink" type="submit">{{ rsvp.submit }}</button>
      <p class="form-status" role="status">{{ status }}</p>
      <pre v-show="preview" class="confirm-text">{{ preview }}</pre>
    </form>
  </section>
</template>

<style scoped>
.rsvp {
  text-align: center;
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

.confirm-text {
  margin: 12px 0 0;
  padding: 14px 2px;
  white-space: pre-wrap;
  background: transparent;
  border: 0;
  border-top: 1px solid var(--line);
  font-family: var(--sans);
  font-size: 0.92rem;
  line-height: 1.55;
  text-align: left;
}
</style>
