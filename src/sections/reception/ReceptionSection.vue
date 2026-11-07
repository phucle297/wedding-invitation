<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, useId } from "vue";
import { reception } from "./content";
import { couple } from "../../content/couple";
import { date } from "../../content/date";

const venue = ref<HTMLElement | null>(null);
const happiness = ref<HTMLImageElement | null>(null);
const framePath = ref("");
const frameClipId = useId();
let frameObserver: ResizeObserver | undefined;

function updateFrame() {
  if (!venue.value || !happiness.value) return;

  // Layout coordinates stay aligned while the card's entrance animates its transform.
  const card = venue.value;
  const ornament = happiness.value;
  const scale = ornament.clientWidth / 617;
  const right = card.clientWidth - 14;
  const bottom = card.clientHeight - 14;
  const radius = 8;
  const point = (x: number, y: number) =>
    `${ornament.offsetLeft + x * scale},${ornament.offsetTop + y * scale}`;

  // Trace the 617 × 820 ornament's outer corner, then join the paper edges.
  framePath.value = [
    `M ${right - radius},14`,
    `H ${ornament.offsetLeft + 510 * scale}`,
    `Q ${point(480, 45)} ${point(460, 105)}`,
    `C ${point(455, 60)} ${point(435, 35)} ${point(395, 35)}`,
    `C ${point(350, 35)} ${point(305, 65)} ${point(285, 120)}`,
    `Q ${point(270, 145)} ${point(260, 110)}`,
    `C ${point(245, 65)} ${point(205, 35)} ${point(170, 42)}`,
    `C ${point(130, 48)} ${point(125, 78)} ${point(140, 100)}`,
    `Q ${point(155, 115)} ${point(150, 135)}`,
    `Q ${point(110, 140)} ${point(72, 122)}`,
    `C ${point(55, 165)} ${point(72, 215)} ${point(110, 240)}`,
    `C ${point(80, 245)} ${point(80, 285)} ${point(112, 310)}`,
    `Q ${point(105, 345)} ${point(122, 375)}`,
    `Q ${point(60, 380)} ${point(8, 380)}`,
    `C ${point(0, 420)} ${point(25, 470)} ${point(78, 492)}`,
    `Q 8,${ornament.offsetTop + 505 * scale} 8,${ornament.offsetTop + 540 * scale}`,
    `V ${bottom - radius} Q 8,${bottom} ${8 + radius},${bottom}`,
    `H ${right - radius} Q ${right},${bottom} ${right},${bottom - radius}`,
    `V ${14 + radius} Q ${right},14 ${right - radius},14 Z`,
  ].join(" ");
}

onMounted(() => {
  frameObserver = new ResizeObserver(updateFrame);
  if (venue.value) frameObserver.observe(venue.value);
});

onBeforeUnmount(() => frameObserver?.disconnect());
</script>

<template>
  <section class="hotel" aria-labelledby="hotel-title">
    <article ref="venue" class="venue">
      <svg class="invitation-frame" aria-hidden="true" focusable="false">
        <defs>
          <clipPath :id="frameClipId" clipPathUnits="userSpaceOnUse">
            <path :d="framePath" />
          </clipPath>
        </defs>
        <path class="invitation-frame-line" :d="framePath" :clip-path="`url(#${frameClipId})`" />
      </svg>
      <img
        ref="happiness"
        class="invitation-double-happiness"
        src="/assets/ornaments/double-happiness.webp"
        width="617"
        height="820"
        alt=""
        loading="lazy"
      />

      <header class="invitation-heading">
        <p class="invitation-salutation">Trân trọng kính mời</p>
        <p class="invitation-addressee">Bạn và người thương</p>
        <p class="invitation-intro">
          Đến dự bữa tiệc chung vui cùng gia đình chúng tôi tại
        </p>
        <h2 id="hotel-title">{{ reception.name }}</h2>
        <p class="invitation-hall">{{ reception.hall }}</p>
        <address>
          <template v-for="(line, index) in reception.addressLines" :key="line">
            {{ line }}<br v-if="index < reception.addressLines.length - 1" />
          </template>
        </address>
      </header>

      <div class="invitation-date-block">
        <p class="invitation-day">{{ reception.eyebrow }}</p>
        <time class="invitation-date" :datetime="date.isoReception" :aria-label="date.aria">
          <span v-for="part in date.parts" :key="part.label">{{ part.value }}</span>
        </time>
        <p class="invitation-lunar">{{ date.lunar }}</p>
      </div>

      <div class="invitation-gratitude">
        <p>
          Sự hiện diện của quý khách<br />là niềm vinh hạnh cho gia đình chúng tôi.
        </p>
        <p class="invitation-couple">
          {{ couple.groom.short.toLocaleLowerCase("vi") }} <span>&amp;</span>
          {{ couple.bride.short.toLocaleLowerCase("vi") }}
        </p>
      </div>

      <div class="invitation-monogram" aria-hidden="true">
        <span>{{ couple.groom.mark }}</span>
        <svg viewBox="0 0 32 20" fill="currentColor">
          <path d="M12 17 3 9C-3 2 7-3 12 4c5-7 15-2 9 5Zm11-1-5-5c-4-4 2-8 5-3 3-5 9-1 5 3Z" />
        </svg>
        <span>{{ couple.bride.mark }}</span>
      </div>

      <footer class="invitation-footer">
        <dl class="invitation-hours">
          <div v-for="hour in reception.hours" :key="hour.label">
            <dt>{{ hour.label }}:</dt>
            <dd>{{ hour.time }}</dd>
          </div>
        </dl>
        <p class="invitation-signoff">Kính mời!</p>
      </footer>
    </article>
  </section>
</template>

<style scoped>
.hotel {
  --ink: #5d5044;
  --ink-soft: #685c50;
  --espresso: #594936;
  --line: #75634e4d;
  padding: 24px;
  color: var(--ink);
}
.venue {
  position: relative;
  display: grid;
  grid-template-columns: minmax(0, 1fr) 32px;
  gap: 32px 20px;
  width: min(100%, 600px);
  margin: 0 auto;
  padding: 32px;
  container-type: inline-size;
}
.invitation-frame {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  overflow: visible;
  pointer-events: none;
}
.invitation-frame-line {
  fill: none;
  stroke: #998b788c;
  stroke-width: 2px;
}
.invitation-double-happiness {
  position: absolute;
  top: -8px;
  left: -14px;
  width: 53%;
  height: auto;
  pointer-events: none;
}
.invitation-heading {
  position: relative;
  grid-column: 1 / -1;
  justify-self: end;
  width: 58%;
  min-height: max(290px, 70cqw);
  padding-top: 8px;
  text-align: right;
}
.invitation-salutation {
  margin: 0;
  font: 500 0.875rem/1.5 var(--heading);
  text-transform: uppercase;
}
.invitation-addressee {
  margin: 8px 0 18px;
  padding-bottom: 16px;
  border-bottom: 1px dotted var(--line);
  font: 1.5rem/1.3 var(--script-vi);
}
.invitation-intro {
  margin: 0 0 12px;
  font: 0.875rem/1.45 var(--heading);
  text-transform: uppercase;
}
.invitation-heading h2 {
  margin: 0;
  font: 600 clamp(1.6rem, 7.8cqw, 2.6rem)/0.98 var(--heading);
  letter-spacing: -0.045em;
  text-transform: uppercase;
  text-wrap: balance;
}
.invitation-hall {
  margin: 12px 0 8px;
  font: 1.4rem/1.2 var(--script-vi);
}
address {
  font: 0.8125rem/1.45 var(--heading);
  font-style: normal;
  text-transform: uppercase;
}
.invitation-date-block,
.invitation-gratitude {
  grid-column: 1;
}
.invitation-day {
  margin: 0 0 6px;
  font: 600 0.875rem/1.4 var(--heading);
  text-transform: uppercase;
}
.invitation-date {
  display: flex;
  align-items: center;
  font: 600 clamp(1.8rem, 8.5cqw, 3rem)/1 var(--heading);
  text-transform: uppercase;
  font-variant-numeric: lining-nums;
  white-space: nowrap;
}
.invitation-date span + span {
  margin-left: 0.35em;
  padding-left: 0.35em;
  border-left: 1px solid var(--line);
}
.invitation-lunar {
  margin: 8px 0 0;
  font: 0.8125rem/1.4 var(--heading);
  text-transform: uppercase;
}
.invitation-gratitude > p:first-child {
  margin: 0;
  font: 0.9375rem/1.5 var(--heading);
  text-transform: uppercase;
}
.invitation-couple {
  margin: 14px 0 0;
  font: 400 clamp(1.4rem, 9cqw, 2.6rem)/1.4 var(--script);
  text-transform: capitalize;
}
.invitation-couple span {
  font-size: 0.75em;
}
.invitation-monogram {
  grid-column: 2;
  grid-row: 2 / 4;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  font: 600 2.7rem/1 var(--heading);
  font-style: italic;
  text-transform: uppercase;
}
.invitation-monogram::before,
.invitation-monogram::after {
  content: "";
  width: 1px;
  min-height: 32px;
  flex: 1;
  background: currentColor;
}
.invitation-monogram svg {
  width: 22px;
  height: 14px;
}
.invitation-footer {
  grid-column: 1 / -1;
  display: flex;
  align-items: end;
  justify-content: space-between;
  gap: 20px;
  margin-top: 8px;
}
.invitation-hours {
  margin: 0;
  font: 0.9375rem/1.7 var(--heading);
  text-transform: uppercase;
}
.invitation-hours div {
  display: flex;
  gap: 5px;
}
.invitation-hours div::before {
  content: "";
  align-self: center;
  width: 5px;
  height: 5px;
  margin-right: 3px;
  background: currentColor;
}
.invitation-hours dd {
  margin: 0;
  font-variant-numeric: lining-nums tabular-nums;
}
.invitation-signoff {
  margin: 0;
  font: 2rem/1.2 var(--script-vi);
  white-space: nowrap;
}

@media (max-width: 600px) {
  .hotel {
    padding: 24px 14px;
  }
  .venue {
    padding: 36px 30px;
    gap: 28px 16px;
    grid-template-columns: minmax(0, 1fr) 24px;
  }
  .invitation-double-happiness {
    width: 48%;
  }
  .invitation-heading {
    width: 64%;
    min-height: 270px;
  }
  .invitation-heading h2 {
    font-size: clamp(1.35rem, 7.8cqw, 2.1rem);
  }
  .invitation-addressee {
    font-size: 1.25rem;
  }
  .invitation-intro,
  address {
    font-size: 0.75rem;
  }
  .invitation-gratitude > p:first-child {
    font-size: 0.875rem;
  }
  .invitation-footer {
    gap: 12px;
  }
  .invitation-hours {
    font-size: 0.8125rem;
  }
  .invitation-hours dt {
    white-space: nowrap;
  }
  .invitation-signoff {
    font-size: 1.8rem;
  }
}
</style>
