<script setup>
import { timeline } from "./content.js";
</script>

<template>
  <section class="block" aria-labelledby="timeline-title">
    <h2 id="timeline-title">{{ timeline.title }}</h2>
    <ol class="day">
      <li v-for="(item, index) in timeline.items" :key="item.datetime" :style="{ '--i': index }">
        <time :datetime="item.datetime">{{ item.time }}</time>
        <span class="dot" aria-hidden="true"></span>
        <div>
          <strong>{{ item.title }}</strong>
          <span>{{ item.detail }}</span>
        </div>
      </li>
    </ol>
  </section>
</template>

<style scoped>
.day {
  position: relative;
  list-style: none;
  margin: 22px 0 0;
  padding: 0;
}

.day::before {
  content: "";
  position: absolute;
  left: calc(4.6rem + 11px);
  top: 18px;
  bottom: 18px;
  width: 1px;
  background: var(--line);
  transform-origin: top;
}

.reveal .day::before { transform: scaleY(0); }
.reveal.is-in .day::before { transform: scaleY(1); transition: transform 0.9s ease; }

.day li {
  display: grid;
  grid-template-columns: 4.6rem 22px 1fr;
  gap: 8px;
  align-items: center;
  padding: 16px 0;
}

.reveal .day li { opacity: 0; transform: translateY(14px); }
.reveal.is-in .day li {
  animation: rise 0.7s cubic-bezier(0.16, 0.84, 0.24, 1) forwards;
  animation-delay: calc(var(--i) * 140ms);
}

.day time {
  font-family: var(--display);
  font-size: 1.55rem;
  font-variant-numeric: lining-nums tabular-nums;
}

.dot {
  width: 9px;
  height: 9px;
  justify-self: center;
  border: 1px solid var(--bronze);
  border-radius: 50%;
  background: var(--paper);
  position: relative;
  z-index: 1;
}

.day strong {
  display: block;
  font-family: var(--display);
  font-size: 1.35rem;
  font-weight: 500;
}

.day li span:not(.dot) { color: var(--ink-soft); font-size: 0.92rem; }
</style>
