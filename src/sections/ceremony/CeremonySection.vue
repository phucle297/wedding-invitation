<script setup lang="ts">
import { ceremony } from "./content";
import { couple } from "../../content/couple";
import { date } from "../../content/date";
</script>

<template>
  <section class="block place" id="dia-diem" aria-labelledby="place-title">
    <p class="announcement-intro">Trân trọng báo tin<br /><strong>Lễ vu quy</strong> của con chúng tôi</p>
    <div class="couple-names">
      <p>
        {{ couple.bride.full }}<small>{{ couple.bride.role }}</small>
      </p>
      <img src="/assets/ornaments/wedding-rings.svg" width="120" height="100" alt="" />
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
.announcement-intro {
  margin: 0;
  font: 3cqw/1.6 var(--invitation-serif);
  text-transform: uppercase;
}
.couple-names {
  margin: 4% 0 6%;
}
.couple-names p {
  margin: 0;
  font: 8.4cqw/1.4 var(--script-vi);
  white-space: nowrap;
}
.couple-names small {
  display: block;
  margin-top: 2%;
  font: 2.8cqw/1.5 var(--invitation-serif);
}
.couple-names img {
  display: block;
  width: 20%;
  height: auto;
  margin: 3% auto;
}
.ceremony-date {
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;
  gap: 5%;
  margin-top: 5%;
  font: 3.5cqw/1.4 var(--invitation-serif);
  text-transform: uppercase;
}
.ceremony-date small {
  display: block;
  font-size: 0.9em;
}
.ceremony-date strong {
  font-size: 15cqw;
  line-height: 1;
  font-variant-numeric: lining-nums;
}
.ceremony-lunar {
  margin: 4% auto 0;
  font: 2.8cqw/1.5 var(--invitation-serif);
  text-wrap: balance;
}
@media (max-width: 600px) {
  .announcement-intro { font-size: 3.6cqw; }
  .couple-names small { font-size: 3.6cqw; }
  .ceremony-date { font-size: 4cqw; }
  .ceremony-lunar { font-size: 3.4cqw; }
}
</style>
