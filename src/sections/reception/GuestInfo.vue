<script setup lang="ts">
import { reception } from "./content";
import WeatherNote from "./WeatherNote.vue";

const mapEmbedUrl = `https://maps.google.com/maps?${new URLSearchParams({
  q: "Minh Toàn Galaxy Hotel, 306 Đường 2/9, Đà Nẵng",
  output: "embed",
  hl: "vi",
})}`;
</script>

<template>
  <section class="block guest-info" aria-labelledby="guest-info-title">
    <h2 id="guest-info-title">Thông tin dự lễ</h2>
    <div class="guest-details">
      <div>
        <span class="guest-icon" aria-hidden="true">◷</span>
        <p>
          <small>Giờ đón khách</small
          ><strong>{{ reception.hours[0].time }}</strong>
        </p>
      </div>
      <div>
        <span class="guest-icon" aria-hidden="true">⌖</span>
        <p>
          <small>Địa điểm</small><strong>{{ reception.hall }}</strong
          ><span>{{ reception.name }}</span>
        </p>
      </div>
    </div>
    <p class="guest-note">
      Rất mong được đón tiếp bạn và những người thân yêu.
    </p>
    <div class="travel-details">
      <div class="venue-map">
        <iframe
          :src="mapEmbedUrl"
          title="Bản đồ Minh Toàn Galaxy Hotel, 306 Đường 2/9, Đà Nẵng"
          loading="lazy"
          referrerpolicy="no-referrer-when-downgrade"
          allowfullscreen
        ></iframe>
        <a :href="reception.mapUrl" target="_blank" rel="noopener noreferrer">
          Xem đường đi đến Minh Toàn Galaxy Hotel ↗
        </a>
      </div>
      <WeatherNote />
    </div>
  </section>
</template>

<style scoped>
.guest-info {
  border-block: 1px solid var(--line);
}
.travel-details {
  grid-column: 1 / -1;
  display: grid;
  grid-template-columns: minmax(0, 1.4fr) minmax(0, 1fr);
  gap: 24px;
  margin-top: 40px;
}
.venue-map iframe {
  display: block;
  width: 100%;
  min-height: 320px;
  height: calc(100% - 56px);
  border: 1px solid var(--line);
}
.venue-map a {
  display: inline-flex;
  align-items: center;
  min-height: 56px;
  color: var(--ink);
  font-size: 0.95rem;
  text-underline-offset: 4px;
}
.guest-details {
  display: grid;
  grid-template-columns: 1fr 1.5fr;
  gap: 32px;
  margin-top: 36px;
}
.guest-details > div {
  display: flex;
  gap: 20px;
}
.guest-details > div + div {
  border-left: 1px solid var(--line);
  padding-left: 32px;
}
.guest-icon {
  font-size: 2rem;
  color: var(--bronze);
  line-height: 1;
}
p {
  margin: 0;
}
small,
strong {
  display: block;
}
small {
  color: var(--ink-soft);
  font-size: 0.8rem;
  margin-bottom: 8px;
}
strong {
  font-family: var(--display);
  font-size: 1.8rem;
  font-weight: 500;
  line-height: 1.2;
}
.guest-details p > span {
  color: var(--ink-soft);
  font-size: 0.9rem;
}
.guest-note {
  margin-top: 32px;
  color: var(--ink-soft);
  font-size: 0.85rem;
}
@media (max-width: 600px) {
  .travel-details {
    grid-template-columns: 1fr;
  }
  .guest-details {
    grid-template-columns: 1fr;
    gap: 28px;
  }
  .guest-details > div + div {
    border-left: 0;
    border-top: 1px solid var(--line);
    padding: 24px 0 0;
  }
}
</style>
