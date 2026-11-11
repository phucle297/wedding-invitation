<script setup lang="ts">
import StationeryFrame from "../../components/StationeryFrame.vue";
import LazyImage from "../../components/LazyImage.vue";
import { reception } from "./content";
import { date } from "../../content/date";
import { phrases } from "../../content/phrases";
</script>

<template>
  <section class="hotel" aria-labelledby="hotel-title">
    <article class="venue">
      <StationeryFrame beaded />
      <div class="invitation-copy">
        <LazyImage class="invitation-bouquet" src="/assets/ornaments/floral-bouquet.webp" width="490" height="390" alt="" loading="lazy" />
        <p class="invitation-title">Thiệp Mời</p>
        <p class="invitation-salutation">{{ phrases.invite }}</p>
        <p class="invitation-addressee">{{ phrases.addressee }}</p>
        <p class="invitation-intro">Đến dự buổi tiệc chung vui<br />cùng chúng mình tại</p>
        <h2 id="hotel-title">{{ reception.name }}</h2>
        <p class="invitation-hall">{{ reception.hall }}</p>
        <address>
          <template v-for="(line, index) in reception.addressLines" :key="line">
            {{ line }}<br v-if="index < reception.addressLines.length - 1" />
          </template>
        </address>
        <time class="invitation-date" :datetime="date.isoReception" :aria-label="date.aria">
          <span>{{ date.weekday }}<small>{{ reception.hours[0]?.time }}</small></span>
          <strong>{{ String(date.markedDay).padStart(2, "0") }}</strong>
          <span>Tháng {{ date.month }}<small>{{ date.year }}</small></span>
        </time>
        <p class="invitation-lunar">({{ date.lunar }})</p>
        <dl class="invitation-hours">
          <div v-for="hour in reception.hours" :key="hour.label">
            <dt>{{ hour.label }}:</dt><dd>{{ hour.time }}</dd>
          </div>
        </dl>
        <p class="invitation-gratitude">Sự hiện diện của bạn là niềm hạnh phúc trong ngày vui của chúng mình.</p>
      </div>
    </article>
  </section>
</template>

<style scoped>
.hotel {
  --ink: #913b3e;
  padding: 22px;
  color: var(--ink);
  font-family: var(--invitation-serif);
  text-align: center;
  text-transform: uppercase;
}
.venue {
  position: relative;
  width: min(100%, 600px);
  height: 100%;
  margin-inline: auto;
  container-type: inline-size;
}
.invitation-copy {
  position: relative;
  padding: 13% 9% 14%;
}
.invitation-bouquet { display: block; width: 28%; height: auto; margin: 0 auto 2%; }
.invitation-bouquet :deep(img) { display: block; width: 100%; height: auto; }
.invitation-title { margin: 0 0 5%; font: 10cqw/1.25 var(--script-vi); text-transform: none; }
.invitation-salutation { margin: 0; font-size: 2.8cqw; text-transform: uppercase; }
.invitation-addressee {
  margin: 3% auto 5%;
  font: 5cqw/1.4 var(--script-vi);
  text-transform: none;
}
.invitation-intro { margin: 0 0 3%; font-size: 2.8cqw; line-height: 1.6; text-transform: uppercase; }
h2 { margin: 0; font: 700 5.6cqw/1.3 var(--invitation-serif); letter-spacing: -0.04em; text-transform: none; white-space: nowrap; }
.invitation-hall { margin: 3% 0; font-size: 2.8cqw; text-transform: uppercase; }
address { font-size: 2.5cqw; font-style: normal; line-height: 1.6; text-transform: uppercase; }
.invitation-date {
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;
  gap: 5%;
  margin: 5% 0 0;
  font-size: 3.5cqw;
  line-height: 1.4;
  text-transform: uppercase;
}
.invitation-date small { display: block; font-size: .9em; }
.invitation-date strong { font-size: 15cqw; font-weight: 700; line-height: 1; font-variant-numeric: lining-nums; }
.invitation-lunar { margin: 3% 0 4%; font-size: 2.8cqw; line-height: 1.5; text-transform: none; }
.invitation-hours { display: flex; flex-wrap: wrap; justify-content: center; gap: 4px 12px; margin: 0; font-size: 2.6cqw; text-transform: none; }
.invitation-hours div { display: flex; gap: 4px; }
.invitation-hours dd { margin: 0; font-variant-numeric: lining-nums; }
.invitation-gratitude { margin: 3% auto 0; font-size: 2.8cqw; line-height: 1.6; text-transform: none; text-wrap: balance; }
@media (max-width: 600px) {
  .hotel { padding: 16px 12px; }
  .invitation-copy { padding-block: 15% 20%; }
  .invitation-salutation,
  .invitation-intro,
  .invitation-hall,
  .invitation-gratitude { font-size: 3.6cqw; }
  address { font-size: 3cqw; }
  .invitation-date { font-size: 4cqw; }
  .invitation-lunar { font-size: 3.4cqw; }
  .invitation-hours { font-size: 3.1cqw; gap: 4px 8px; }
}
</style>
