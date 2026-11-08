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
          <span>{{ date.weekday }}<small>Đón khách {{ reception.hours[0]?.time }}</small></span>
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
  font-family: var(--heading);
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
  padding: 13% 12% 28%;
}
.invitation-bouquet { display: block; width: 34%; height: auto; margin: 0 auto 3%; }
.invitation-bouquet :deep(img) { display: block; width: 100%; height: auto; }
.invitation-title { margin: 0 0 7%; font: clamp(2.5rem, 11cqw, 4.5rem)/1.25 var(--script-vi); text-transform: none; }
.invitation-salutation { margin: 0; font-size: clamp(.875rem, 3.3cqw, 1.25rem); text-transform: uppercase; }
.invitation-addressee {
  margin: 4% auto 8%;
  font: clamp(1.5rem, 6cqw, 2.2rem)/1.4 var(--script-vi);
  text-transform: none;
}
.invitation-intro { margin: 0 0 5%; font-size: clamp(.875rem, 3.1cqw, 1.2rem); line-height: 1.6; text-transform: uppercase; }
h2 { margin: 0; font-size: clamp(1.75rem, 6.8cqw, 2.7rem); font-weight: 700; line-height: 1.1; text-wrap: balance; }
.invitation-hall { margin: 5% 0; font-size: clamp(.875rem, 3.3cqw, 1.25rem); text-transform: uppercase; }
address { font-size: clamp(.8125rem, 3cqw, 1.125rem); font-style: normal; line-height: 1.6; text-transform: uppercase; }
.invitation-date {
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;
  gap: 5%;
  margin: 7% 0 0;
  font-size: clamp(.875rem, 3.8cqw, 1.5rem);
  line-height: 1.4;
  text-transform: uppercase;
}
.invitation-date small { display: block; font-size: .9em; }
.invitation-date strong { font-size: clamp(4rem, 19cqw, 7rem); font-weight: 700; line-height: 1; font-variant-numeric: lining-nums; }
.invitation-lunar { margin: 4% 0 7%; font-size: clamp(.8125rem, 3cqw, 1.125rem); line-height: 1.5; }
.invitation-hours { display: flex; flex-wrap: wrap; justify-content: center; gap: 4px 18px; margin: 0; font-size: clamp(.875rem, 3.1cqw, 1.125rem); }
.invitation-hours div { display: flex; gap: 4px; }
.invitation-hours dd { margin: 0; font-variant-numeric: lining-nums; }
.invitation-gratitude { max-width: 84%; margin: 7% auto 0; font-size: clamp(.875rem, 3.3cqw, 1.25rem); line-height: 1.6; text-wrap: balance; }
@media (max-width: 600px) {
  .hotel { padding: 16px 12px; }
}
</style>
