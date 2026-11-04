<script setup lang="ts">
import { reception } from "./content";
import { couple } from "../../content/couple";
import { date } from "../../content/date";
import CallaSprig from "../../components/CallaSprig.vue";
</script>

<template>
  <section class="hotel" aria-labelledby="hotel-title">
    <div class="venue">
      <p class="eyebrow">Trân trọng kính mời</p>
      <p class="invitation-guest">Bạn và người thương</p>
      <p class="invitation-note">
        Đến dự bữa tiệc chung vui cùng<br />gia đình chúng tôi
      </p>
      <p class="invitation-names">
        {{ couple.groom.short }}<span>&amp;</span>{{ couple.bride.short }}
      </p>
      <div class="invitation-date">
        <span>{{ date.weekday }}</span
        ><strong>{{ date.display }}</strong>
      </div>
      <p class="invitation-lunar">{{ date.lunar }}</p>
      <p class="eyebrow">{{ reception.eyebrow }}</p>
      <h2 id="hotel-title">{{ reception.name }}</h2>
      <p class="hall">{{ reception.hall }}</p>
      <address>
        <template v-for="(line, index) in reception.addressLines" :key="line">
          {{ line }}<br v-if="index < reception.addressLines.length - 1" />
        </template>
      </address>
      <dl class="hours">
        <div v-for="hour in reception.hours" :key="hour.label">
          <dt>{{ hour.label }}</dt>
          <dd>{{ hour.time }}</dd>
        </div>
      </dl>
      <div class="actions">
        <a
          class="btn btn-ink"
          :href="reception.mapUrl"
          target="_blank"
          rel="noopener noreferrer"
          >{{ reception.mapLabel }}</a
        >
        <a class="call" :href="reception.phoneHref">{{
          reception.phoneLabel
        }}</a>
      </div>
      <p class="fine">{{ reception.phoneNote }}</p>
    </div>
    <CallaSprig class="venue-botanical" />
  </section>
</template>

<style scoped>
.hotel {
  padding: 10px 0 clamp(56px, 8vw, 84px);
  color: var(--ink);
  background-color: var(--champagne);
  background-image: var(--paper-grain);
}

.venue {
  width: min(40rem, calc(100% - 64px));
  margin: 0 auto;
  padding: clamp(40px, 6vw, 64px) clamp(20px, 4vw, 48px) clamp(32px, 5vw, 44px);
  text-align: center;
  border: 1px solid rgba(122, 115, 108, 0.55);
  box-shadow:
    0 0 0 6px var(--paper),
    0 0 0 7px rgba(122, 115, 108, 0.32);
}

h2 {
  margin: 8px 0 0;
  font-family: var(--heading);
  font-style: normal;
  font-weight: 500;
  font-size: clamp(2rem, 5vw, 2.7rem);
  line-height: 1.15;
  text-wrap: balance;
}

.hall {
  margin: 8px 0 0;
  font-family: var(--display);
  font-style: italic;
  font-size: 1.35rem;
  color: var(--ink-soft);
}

address {
  margin-top: 14px;
  font-style: normal;
  color: var(--ink-soft);
}

.hours {
  display: grid;
  grid-template-columns: 1fr 1fr;
  max-width: 22rem;
  margin: 26px auto 0;
  border-top: 1px solid var(--line);
}

.hours div {
  padding-top: 12px;
}

.hours div + div {
  padding-left: 16px;
  border-left: 1px solid var(--line);
}

dt {
  font-size: 0.84rem;
  color: var(--ink-soft);
}

dd {
  margin: 2px 0 0;
  font-family: var(--display);
  font-size: clamp(1.8rem, 5vw, 2.2rem);
  font-variant-numeric: lining-nums tabular-nums;
}

.actions {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  gap: 8px 18px;
  margin-top: 28px;
}

.call {
  display: inline-flex;
  align-items: center;
  min-height: 48px;
  color: var(--ink);
  text-underline-offset: 4px;
}

.fine {
  margin: 14px 0 0;
  font-size: 0.84rem;
  color: var(--ink-soft);
  text-wrap: balance;
}
</style>
