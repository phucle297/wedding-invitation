<script setup>
import { reception } from "./content.js";
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
  </section>
</template>

<style scoped>
.guest-info {
  border-block: 1px solid var(--line);
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
