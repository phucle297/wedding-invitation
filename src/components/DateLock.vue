<script setup>
import { date } from "../content/date.js";
</script>

<template>
  <div class="date-plate" :aria-label="date.aria">
    <p class="weekday">{{ date.weekday }}</p>
    <div class="mark">
      <p class="ring"><b>{{ date.parts[0].value }}</b><small>Ngày</small></p>
      <div class="aside">
        <b>{{ date.monthName }}</b>
        <i>{{ date.year }}</i>
        <small>{{ date.ceremonyTime }}</small>
      </div>
    </div>
    <p class="lunar">{{ date.lunar }}</p>
  </div>
</template>

<style scoped>
.date-plate {
  max-width: 460px;
  margin: 34px auto 0;
}

.weekday {
  margin: 0;
  font-size: 0.72rem;
  font-weight: 500;
  letter-spacing: 0.32em;
  text-transform: uppercase;
  color: var(--bronze);
}

.mark {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 22px;
  margin-top: 16px;
}

.ring {
  flex: 0 0 auto;
  width: 138px;
  height: 138px;
  margin: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  border: 1px solid rgba(122, 115, 108, 0.7);
  box-shadow:
    0 0 0 6px var(--paper),
    0 0 0 7px rgba(122, 115, 108, 0.38);
}

.ring b {
  font-family: var(--display);
  font-size: 4.4rem;
  font-weight: 500;
  line-height: 0.8;
  letter-spacing: 0.02em;
}

.ring small,
.aside small {
  font-family: var(--sans);
  font-size: 0.66rem;
  font-weight: 500;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--ink-soft);
}

.aside { text-align: left; }

.aside b {
  display: block;
  font-family: var(--display);
  font-style: italic;
  font-weight: 500;
  font-size: clamp(1.7rem, 4vw, 2.15rem);
  line-height: 1;
}

.aside i {
  display: block;
  margin-top: 6px;
  font-family: var(--display);
  font-style: normal;
  font-size: 1.45rem;
  letter-spacing: 0.16em;
}

.aside small { display: block; margin-top: 10px; }

.lunar {
  margin: 18px 0 0;
  font-family: var(--display);
  font-style: italic;
  font-size: 1.2rem;
  color: var(--ink-soft);
}

@media (max-width: 420px) {
  .ring { width: 118px; height: 118px; }
  .ring b { font-size: 3.6rem; }
  .mark { gap: 14px; }
}
</style>
