<script setup lang="ts">
import { useCountdown } from "../../composables/useCountdown";
import { countdown } from "./content";

const { days, hours, minutes, seconds, note } = useCountdown({
  target: countdown.isoReception,
  dayEnd: countdown.isoDayEnd,
  notes: countdown.notes,
});
</script>

<template>
  <section
    class="block countdown-section"
    id="thoi-gian"
    aria-labelledby="time-title"
  >
    <div class="countdown-copy">
      <h2 id="time-title">{{ countdown.title }}</h2>
      <p class="lead">{{ countdown.lead }}</p>
    </div>
    <div class="count" role="timer" aria-label="Thời gian còn lại đến giờ tiệc">
      <div>
        <b>{{ days }}</b
        ><span>ngày</span>
      </div>
      <div>
        <b>{{ hours }}</b
        ><span>giờ</span>
      </div>
      <div>
        <b>{{ minutes }}</b
        ><span>phút</span>
      </div>
      <div>
        <b>{{ seconds }}</b
        ><span>giây</span>
      </div>
    </div>
    <p class="count-note">{{ note }}</p>
  </section>
</template>

<style scoped>
.block {
  text-align: center;
}

.block h2 {
  font-family: var(--sans);
  font-style: normal;
  font-size: 0.84rem;
  font-weight: 500;
  color: var(--ink-soft);
}

.lead {
  max-width: 28em;
  margin-left: auto;
  margin-right: auto;
}

.count {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  margin-top: 26px;
  padding-top: 22px;
  border-top: 1px solid var(--line);
}

.count div {
  text-align: center;
  padding: 0 4px;
}

.count b {
  display: block;
  font-family: var(--display);
  font-size: clamp(2.2rem, 7vw, 3.2rem);
  font-weight: 500;
  font-variant-numeric: lining-nums tabular-nums;
  line-height: 1;
}

.count span {
  display: block;
  margin-top: 6px;
  font-size: 0.84rem;
  color: var(--ink-soft);
}

.count-note {
  min-height: 1.4em;
  margin: 12px 0 0;
  text-align: center;
  color: var(--ink-soft);
}
</style>
