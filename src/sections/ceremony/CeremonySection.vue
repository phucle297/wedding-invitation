<script setup lang="ts">
import { ceremony } from "./content";
import { couple } from "../../content/couple";
import { date } from "../../content/date";
</script>

<template>
  <section class="block place" id="dia-diem" aria-labelledby="place-title">
    <div class="couple-names">
      <p>
        {{ couple.bride.full }}<small>{{ couple.bride.role }}</small>
      </p>
      <img src="/assets/ornaments/rings.svg" width="80" height="45" alt="" />
      <p>
        {{ couple.groom.full }}<small>{{ couple.groom.role }}</small>
      </p>
    </div>
    <h2 id="place-title">Hôn lễ được cử hành tại tư gia</h2>
    <time
      class="ceremony-date"
      :datetime="date.isoCeremony"
      :aria-label="date.aria"
    >
      <span
        >{{ date.weekday }}<small>{{ date.ceremonyTime }}</small></span
      >
      <strong>{{ String(date.markedDay).padStart(2, "0") }}</strong>
      <span
        >Tháng {{ date.month }}<small>{{ date.year }}</small></span
      >
    </time>
    <p class="ceremony-lunar">({{ ceremony.lunar }})</p>
  </section>
</template>

<style scoped>
.place {
  text-align: center;
}
.couple-names {
  margin: 28px 0 30px;
}
.couple-names p {
  margin: 0;
  font: clamp(2rem, 7cqw, 3.1rem)/1.4 var(--script-vi);
}
.couple-names small {
  display: block;
  margin-top: 10px;
  font: 1rem/1.5 var(--heading);
  text-transform: uppercase;
}
.couple-names img {
  display: block;
  margin: 22px auto;
  opacity: 0.8;
}
.ceremony-date {
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;
  gap: 5%;
  margin-top: 22px;
  font: clamp(1rem, 3.8cqw, 1.5rem)/1.4 var(--heading);
  text-transform: uppercase;
}
.ceremony-date small {
  display: block;
  font-size: 0.9em;
}
.ceremony-date strong {
  font-size: clamp(4rem, 19cqw, 7rem);
  line-height: 1;
  font-variant-numeric: lining-nums;
}
.ceremony-lunar {
  max-width: 84%;
  margin: 18px auto 0;
  font: 1rem/1.5 var(--heading);
  text-transform: uppercase;
  text-wrap: balance;
}
@media (max-width: 400px) {
  .ceremony-lunar {
    font-size: 0.875rem;
  }
}
</style>
