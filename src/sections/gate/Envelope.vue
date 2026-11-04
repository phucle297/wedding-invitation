<script setup lang="ts">
import { couple } from "../../content/couple";
import { date } from "../../content/date";
import { phrases } from "../../content/phrases";

defineProps({
  open: { type: Boolean, default: false },
});
</script>

<template>
  <div class="frame" aria-hidden="true">
  <div class="velvet" :class="{ 'is-open': open }">
    <div class="slot">
      <article class="card">
        <p class="xi">囍</p>
        <p class="names">{{ couple.groom.short }} <span>&amp;</span> {{ couple.bride.short }}</p>
        <p class="when">{{ date.display }}</p>
      </article>
    </div>

    <div class="lower">
      <p class="salute">{{ phrases.invite }}</p>
      <p class="guest">{{ phrases.addressee }}</p>
    </div>
    <p class="hint">{{ phrases.openEnvelope }}</p>

    <div class="flap">
      <div class="flap-shape">
        <svg class="creases" viewBox="0 0 100 100" preserveAspectRatio="none">
          <polyline points="0,0 50,100 100,0" fill="none" stroke="rgba(164,126,52,0.45)" stroke-width="0.35" />
        </svg>
      </div>
      <div class="face">
        <p class="welcome">Welcome<br>to</p>
        <p class="script">Wedding</p>
        <svg class="swash" viewBox="0 0 280 36" aria-hidden="true">
          <path d="M12 22c28-2 40-16 62-10 22 6 34 16 54 8 18-8 28-18 48-14 22 4 36 14 70 6" fill="none" stroke="currentColor" stroke-width="1.1" stroke-linecap="round" />
        </svg>
      </div>
      <div class="seal">
      <svg viewBox="0 0 120 120" aria-hidden="true">
        <defs>
          <radialGradient id="wax" cx="36%" cy="32%" r="70%">
            <stop offset="0%" stop-color="#f8e7bc" />
            <stop offset="40%" stop-color="#e4c48a" />
            <stop offset="72%" stop-color="#c49245" />
            <stop offset="100%" stop-color="#7a5424" />
          </radialGradient>
        </defs>
        <path
          fill="url(#wax)"
          d="M 60.0 14.0 L 61.7 12.6 L 63.4 11.6 L 65.1 11.0 L 66.9 11.1 L 68.5 11.8 L 70.0 13.1 L 71.3 14.7 L 72.5 16.5 L 73.6 18.2 L 74.7 19.5 L 76.0 20.5 L 77.4 20.9 L 79.1 20.9 L 80.9 20.6 L 83.0 20.2 L 85.1 19.8 L 87.1 19.8 L 88.9 20.2 L 90.4 21.1 L 91.5 22.5 L 92.1 24.3 L 92.4 26.4 L 92.6 28.5 L 92.7 30.6 L 93.0 32.3 L 93.6 33.8 L 94.6 34.9 L 96.0 35.7 L 97.8 36.4 L 99.8 37.0 L 101.8 37.8 L 103.6 38.7 L 105.0 40.0 L 105.8 41.5 L 106.0 43.3 L 105.6 45.2 L 104.9 47.1 L 103.9 49.0 L 103.0 50.9 L 102.4 52.5 L 102.2 54.1 L 102.5 55.5 L 103.4 57.0 L 104.6 58.4 L 106.0 60.0 L 107.4 61.7 L 108.4 63.4 L 109.0 65.1 L 108.9 66.9 L 108.2 68.5 L 106.9 70.0 L 105.3 71.3 L 103.5 72.5 L 101.8 73.6 L 100.5 74.7 L 99.5 76.0 L 99.1 77.4 L 99.1 79.1 L 99.4 80.9 L 99.8 83.0 L 100.2 85.1 L 100.2 87.1 L 99.8 88.9 L 98.9 90.4 L 97.5 91.5 L 95.7 92.1 L 93.6 92.4 L 91.5 92.6 L 89.4 92.7 L 87.7 93.0 L 86.2 93.6 L 85.1 94.6 L 84.3 96.0 L 83.6 97.8 L 83.0 99.8 L 82.2 101.8 L 81.3 103.6 L 80.0 105.0 L 78.5 105.8 L 76.7 106.0 L 74.8 105.6 L 72.9 104.9 L 71.0 103.9 L 69.1 103.0 L 67.5 102.4 L 65.9 102.2 L 64.5 102.5 L 63.0 103.4 L 61.6 104.6 L 60.0 106.0 L 58.3 107.4 L 56.6 108.4 L 54.9 109.0 L 53.1 108.9 L 51.5 108.2 L 50.0 106.9 L 48.7 105.3 L 47.5 103.5 L 46.4 101.8 L 45.3 100.5 L 44.0 99.5 L 42.6 99.1 L 40.9 99.1 L 39.1 99.4 L 37.0 99.8 L 34.9 100.2 L 32.9 100.2 L 31.1 99.8 L 29.6 98.9 L 28.5 97.5 L 27.9 95.7 L 27.6 93.6 L 27.4 91.5 L 27.3 89.4 L 27.0 87.7 L 26.4 86.2 L 25.4 85.1 L 24.0 84.3 L 22.2 83.6 L 20.2 83.0 L 18.2 82.2 L 16.4 81.3 L 15.0 80.0 L 14.2 78.5 L 14.0 76.7 L 14.4 74.8 L 15.1 72.9 L 16.1 71.0 L 17.0 69.1 L 17.6 67.5 L 17.8 65.9 L 17.5 64.5 L 16.6 63.0 L 15.4 61.6 L 14.0 60.0 L 12.6 58.3 L 11.6 56.6 L 11.0 54.9 L 11.1 53.1 L 11.8 51.5 L 13.1 50.0 L 14.7 48.7 L 16.5 47.5 L 18.2 46.4 L 19.5 45.3 L 20.5 44.0 L 20.9 42.6 L 20.9 40.9 L 20.6 39.1 L 20.2 37.0 L 19.8 34.9 L 19.8 32.9 L 20.2 31.1 L 21.1 29.6 L 22.5 28.5 L 24.3 27.9 L 26.4 27.6 L 28.5 27.4 L 30.6 27.3 L 32.3 27.0 L 33.8 26.4 L 34.9 25.4 L 35.7 24.0 L 36.4 22.2 L 37.0 20.2 L 37.8 18.2 L 38.7 16.4 L 40.0 15.0 L 41.5 14.2 L 43.3 14.0 L 45.2 14.4 L 47.1 15.1 L 49.0 16.1 L 50.9 17.0 L 52.5 17.6 L 54.1 17.8 L 55.5 17.5 L 57.0 16.6 L 58.4 15.4 Z"
        />
        <circle cx="60" cy="60" r="33" fill="none" stroke="#6d4a22" stroke-width="0.8" opacity="0.55" />
        <g transform="translate(60 60)" fill="#6b4520">
          <path d="M0-2c4-6 5-14 0-22-5 8-4 16 0 22z" />
          <path d="M0-2c4-6 5-14 0-22-5 8-4 16 0 22z" transform="rotate(72)" />
          <path d="M0-2c4-6 5-14 0-22-5 8-4 16 0 22z" transform="rotate(144)" />
          <path d="M0-2c4-6 5-14 0-22-5 8-4 16 0 22z" transform="rotate(216)" />
          <path d="M0-2c4-6 5-14 0-22-5 8-4 16 0 22z" transform="rotate(288)" />
          <circle r="3.4" fill="#f6e6c0" />
          <path d="M6 8c8 2 14 9 11 15-6-2-10-7-11-15z" />
          <path d="M-6 8c-8 2-14 9-11 15 6-2 10-7 11-15z" />
          <path d="M0 4c1 8 0 13-1 16" fill="none" stroke="#6b4520" stroke-width="1" />
        </g>
      </svg>
      </div>
    </div>
  </div>
  </div>
</template>

<style scoped>
.frame {
  width: min(100%, 520px);
  height: 100%;
}

.velvet {
  position: relative;
  width: 100%;
  height: 100%;
  perspective: 1700px;
  color: #806124;
  background:
    radial-gradient(ellipse at 50% 18%, rgba(255, 255, 255, 0.8), transparent 42%),
    radial-gradient(ellipse at 50% 100%, rgba(190, 155, 82, 0.12), transparent 52%),
    linear-gradient(180deg, #fffefa 0%, #faf5e9 46%, #f1e5ca 100%);
  box-shadow: inset 0 0 0 1px rgba(164, 126, 52, 0.3);
}

.slot {
  position: absolute;
  z-index: 2;
  left: 11%;
  right: 11%;
  top: 34%;
  height: 48%;
  overflow: hidden;
}

.slot::after {
  content: "";
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  height: 24px;
  background: linear-gradient(transparent, rgba(128, 97, 36, 0.06));
  opacity: 0;
  pointer-events: none;
}

.velvet.is-open .slot::after {
  opacity: 1;
  transition: opacity 0.45s ease 0.7s;
}

.card {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background:
    radial-gradient(ellipse at 50% 0%, #fff, transparent 58%),
    #fffdf7;
  color: #806124;
  box-shadow: 0 8px 14px rgba(128, 97, 36, 0.07);
  transform: translateY(108%);
  transition: transform 0.95s cubic-bezier(0.16, 0.84, 0.24, 1) 0.42s;
}

.velvet.is-open .card { transform: translateY(0); }

.xi {
  margin: 0;
  font-family: var(--brush);
  font-size: 4.2rem;
  line-height: 0.9;
  color: #a47e34;
}

.names {
  margin: 8px 0 0;
  font-family: var(--display);
  font-style: italic;
  font-size: clamp(1.8rem, 5vw, 2.4rem);
  line-height: 1.1;
}

.names span { color: #a47e34; padding-inline: 0.12em; }

.when {
  margin: 12px 0 0;
  letter-spacing: 0.28em;
  font-size: 0.78rem;
}

.flap {
  position: absolute;
  z-index: 3;
  left: 0;
  right: 0;
  top: 0;
  height: 62%;
  transform-origin: center top;
  backface-visibility: hidden;
  transition: transform 1.15s cubic-bezier(0.45, 0.05, 0.15, 1);
}

.flap-shape {
  position: absolute;
  inset: 0;
  background:
    linear-gradient(180deg, rgba(255, 255, 255, 0.6), transparent 30%),
    linear-gradient(180deg, #ffffff 0%, #fcf8ef 58%, #eddfbd 100%);
  clip-path: polygon(0 0, 100% 0, 50% 100%);
  filter: drop-shadow(0 16px 14px rgba(128, 97, 36, 0.16));
}

.creases {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
}

.velvet.is-open .flap {
  transform: rotateX(180deg);
}

.face,
.lower,
.hint {
  position: absolute;
  left: 0;
  right: 0;
  text-align: center;
}

.lower,
.hint { transition: opacity 0.28s ease 0.12s; }

.face {
  z-index: 1;
  top: 20%;
}

.welcome {
  margin: 0;
  font-size: 0.86rem;
  font-weight: 500;
  letter-spacing: 0.38em;
  text-indent: 0.38em;
  text-transform: uppercase;
  line-height: 1.35;
}

.script {
  margin: 10px 0 0;
  font-family: var(--script);
  font-size: clamp(4.6rem, 15vw, 6.2rem);
  font-weight: 400;
  line-height: 0.85;
  color: #957029;
}

.swash {
  display: block;
  width: min(72%, 250px);
  height: 28px;
  margin: -6px auto 0;
  color: #a47e34;
}

.lower {
  z-index: 1;
  top: 68%;
}

.salute {
  margin: 0;
  font-size: 0.92rem;
  font-weight: 500;
  letter-spacing: 0.16em;
  text-indent: 0.16em;
  text-transform: uppercase;
}

.guest {
  margin: 6px 0 0;
  font-family: var(--script-vi);
  font-size: clamp(2.5rem, 8vw, 3.3rem);
  font-weight: 500;
  line-height: 1;
  color: #957029;
}

.hint {
  bottom: max(18px, 3vh);
  margin: 0;
  font-size: 0.68rem;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  opacity: 0.78;
}

.seal {
  position: absolute;
  z-index: 2;
  left: 50%;
  bottom: 0;
  width: 112px;
  height: 112px;
  transform: translate(-50%, 50%);
  filter: drop-shadow(0 8px 8px rgba(128, 97, 36, 0.24));
  animation: seal-glow 3.2s ease-in-out infinite;
}

.seal svg { display: block; width: 100%; height: 100%; }

.velvet.is-open .lower,
.velvet.is-open .hint {
  opacity: 0;
}

.velvet.is-open .seal { animation: none; }

@keyframes seal-glow {
  50% { filter: drop-shadow(0 0 12px rgba(236, 204, 140, 0.55)); }
}

@media screen and (min-width: 1024px) {
  .frame {
    width: min(760px, calc(100vw - 112px), calc(160svh - 153.6px));
    height: auto;
    aspect-ratio: 8 / 5;
    container-type: inline-size;
  }

  .velvet {
    box-shadow:
      inset 0 0 0 1px rgba(164, 126, 52, 0.3),
      0 12px 36px rgba(128, 97, 36, 0.07);
  }

  .face {
    top: 12%;
  }

  .welcome {
    font-size: 1.5cqw;
  }

  .script {
    margin-top: 1.3cqw;
    font-size: 11cqw;
  }

  .swash {
    width: 30cqw;
    height: 3.5cqw;
    margin-top: -0.8cqw;
  }

  .seal {
    width: 12cqw;
    height: 12cqw;
  }

  .lower {
    top: 74%;
  }

  .salute {
    font-size: 1.6cqw;
  }

  .guest {
    margin-top: 0.8cqw;
    font-size: 5.5cqw;
  }

  .hint {
    bottom: 4%;
    font-size: 1.2cqw;
  }

  .slot {
    left: 8%;
    right: 8%;
    top: 18%;
    height: 64%;
  }

  .xi {
    font-size: 8.8cqw;
  }

  .names {
    margin-top: 1cqw;
    font-size: 5.5cqw;
  }

  .when {
    margin-top: 1.5cqw;
    font-size: 1.8cqw;
  }
}
</style>
