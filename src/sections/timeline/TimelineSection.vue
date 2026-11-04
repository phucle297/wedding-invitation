<script setup lang="ts">
import { timeline } from "./content";
</script>

<template>
  <figure class="photo-interlude together-cover">
    <img
      src="/assets/album/04.jpg"
      alt="Duy Phúc và Linh Đan trong khu vườn"
      width="1067"
      height="1600"
      loading="lazy"
    />
    <figcaption lang="en">Together, always.</figcaption>
  </figure>
  <section class="block day-section" aria-labelledby="timeline-title">
    <h2 id="timeline-title">{{ timeline.title }}</h2>
    <p class="eyebrow">Chương trình ngày chung đôi</p>
    <div class="day-path">
      <svg
        class="timeline-line"
        viewBox="0 0 500 510"
        preserveAspectRatio="none"
        fill="none"
        aria-hidden="true"
      >
        <path
          class="timeline-base"
          d="M55 10H355C475 10 475 170 355 170H145C25 170 25 330 145 330H355C475 330 475 490 355 490H145"
        />
        <path
          class="timeline-progress"
          d="M55 10H355C475 10 475 170 355 170H145C25 170 25 330 145 330H355C475 330 475 490 355 490H145"
          pathLength="1"
        />
        <circle cx="55" cy="10" r="5" fill="currentColor" />
        <circle cx="145" cy="490" r="5" fill="currentColor" />
        <circle class="timeline-cursor" cx="55" cy="10" r="6" />
      </svg>
      <svg
        class="timeline-desktop"
        viewBox="0 -36 1100 126"
        preserveAspectRatio="none"
        fill="none"
        aria-hidden="true"
      >
        <path
          class="timeline-base"
          d="M50 65C240-65 310 155 550 45S860-35 1050 65"
        />
        <path
          class="timeline-progress"
          d="M50 65C240-65 310 155 550 45S860-35 1050 65"
          pathLength="1"
        />
        <circle cx="50" cy="65" r="4" fill="currentColor" />
        <circle cx="1050" cy="65" r="4" fill="currentColor" />
        <circle class="timeline-cursor" cx="50" cy="65" r="6" />
      </svg>
      <ol class="day">
        <li v-for="(item, index) in timeline.items" :key="item.datetime">
          <svg
            class="day-icon"
            viewBox="0 0 60 60"
            fill="none"
            stroke="currentColor"
            stroke-width="1.2"
            aria-hidden="true"
          >
            <g v-if="index === 0">
              <circle cx="23" cy="34" r="13" />
              <circle cx="38" cy="34" r="13" />
              <path d="M17 20l6-9 6 9m2 0 7-9 7 9M18 15h10m5 0h10" />
            </g>
            <g v-else-if="index === 1">
              <path
                d="M10 49h40M15 48V23a15 15 0 0 1 30 0v25M22 48V26a8 8 0 0 1 16 0v22M10 22h10m20 0h10M30 3v8"
              />
              <path d="M6 49V36m-4 5 4-5 4 5M54 49V36m-4 5 4-5 4 5" />
            </g>
            <g v-else>
              <path
                d="M12 9v16a6 6 0 0 0 12 0V9M18 9v43M39 10v42M39 10c-12 12-11 25 0 25"
              />
              <path d="M47 14v10m-5-5h10M7 39v8m-4-4h8" />
            </g>
          </svg>
          <div>
            <time :datetime="item.datetime">{{ item.time }}</time
            ><strong>{{ item.title }}</strong
            ><span>{{ item.detail }}</span>
          </div>
        </li>
      </ol>
    </div>
  </section>
</template>

<style scoped>
.day-section {
  text-align: center;
}
.day-section .eyebrow {
  margin-top: 14px;
}
.day-path {
  position: relative;
  margin: 50px auto 0;
  max-width: 500px;
}
.timeline-desktop {
  display: none;
}
.timeline-line {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  color: var(--bronze);
  pointer-events: none;
}
.timeline-base {
  stroke: var(--line);
  stroke-width: 1.2;
  vector-effect: non-scaling-stroke;
}
.timeline-progress {
  stroke: var(--espresso);
  stroke-width: 2.5;
  stroke-linecap: round;
  stroke-dasharray: 1;
}
.timeline-cursor {
  visibility: hidden;
  fill: var(--espresso);
  stroke: var(--cream);
  stroke-width: 2;
  vector-effect: non-scaling-stroke;
}
.day {
  position: relative;
  list-style: none;
  padding: 10px 68px;
  margin: 0;
  display: grid;
  grid-template-rows: repeat(3, 160px);
}
.day li {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 24px;
  text-align: right;
  padding: 12px 4px;
}
.day li:nth-child(even) {
  flex-direction: row-reverse;
  text-align: left;
}
.day-icon {
  width: 60px;
  height: 60px;
  flex: none;
  color: var(--bronze);
}
.day li > div {
  max-width: 210px;
}
.day time {
  display: block;
  font: 2rem/1.2 var(--display);
}
.day strong {
  display: block;
  font: 1.3rem/1.6 var(--display);
}
.day li span {
  display: block;
  font-size: 0.7rem;
  color: var(--ink-soft);
}
@media (max-width: 600px) {
  .day {
    padding-inline: 48px;
  }
  .day li {
    gap: 10px;
  }
  .day-icon {
    width: 42px;
    height: 42px;
  }
  .day li > div {
    max-width: 175px;
  }
  .day strong {
    font-size: 1.15rem;
  }
}
</style>
