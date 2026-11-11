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
      <div class="fold fold-left"></div>
      <div class="fold fold-right"></div>
      <div class="fold fold-bottom">
        <svg class="creases" viewBox="0 0 800 500" preserveAspectRatio="none">
          <path
            d="M0 500 400 295 800 500"
            fill="none"
            stroke="#fffef9"
            stroke-opacity="0.8"
            stroke-width="0.8"
            vector-effect="non-scaling-stroke"
          />
        </svg>
      </div>
      <div class="slot">
        <article class="card">
          <img
            class="card-botanical card-botanical-top"
            src="/assets/ornaments/botanical.svg"
            width="240"
            height="360"
            alt=""
          />
          <img
            class="card-botanical card-botanical-bottom"
            src="/assets/ornaments/botanical.svg"
            width="240"
            height="360"
            alt=""
          />
          <p class="card-title">Thiệp mời lễ cưới</p>
          <p class="names">
            {{ couple.groom.full }}<span>&amp;</span>{{ couple.bride.full }}
          </p>
          <p class="when">
            <span>{{ date.weekday }}</span>{{ date.display }}
          </p>
          <img
            class="card-flourish"
            src="/assets/ornaments/flourish.svg"
            width="200"
            height="60"
            alt=""
          />
        </article>
      </div>

      <div class="lower">
        <p class="salute">{{ phrases.invite }}</p>
        <p class="guest">{{ phrases.addressee }}</p>
      </div>
      <p class="hint">{{ phrases.openEnvelope }}</p>

      <div class="flap">
        <div class="flap-back">
          <div class="flap-lining">
            <svg
              class="creases"
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
            >
              <polygon
                points="0,0 100,0 50,100"
                fill="none"
                stroke="#c1b7a2"
                stroke-width="0.6"
                vector-effect="non-scaling-stroke"
              />
            </svg>
          </div>
          <div class="seal">
            <img src="/assets/ornaments/gold-seal.webp" width="384" height="384" alt="" />
          </div>
        </div>
        <div class="flap-front">
          <div class="flap-paper">
            <div class="flap-shape">
              <svg
                class="creases"
                viewBox="0 0 100 100"
                preserveAspectRatio="none"
              >
                <polyline
                  points="0,0 50,100 100,0"
                  fill="none"
                  stroke="#fffefb"
                  stroke-opacity="0.9"
                  stroke-width="1"
                  vector-effect="non-scaling-stroke"
                />
              </svg>
            </div>
          </div>
          <div class="face">
            <p class="welcome">Welcome<br />to</p>
            <p class="script">Wedding</p>
            <svg class="swash" viewBox="0 0 280 36">
              <path
                d="M12 22c28-2 40-16 62-10 22 6 34 16 54 8 18-8 28-18 48-14 22 4 36 14 70 6"
                fill="none"
                stroke="currentColor"
                stroke-width="1.1"
                stroke-linecap="round"
              />
            </svg>
          </div>
          <div class="seal">
            <img src="/assets/ornaments/gold-seal.webp" width="384" height="384" alt="" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.frame {
  width: min(calc(100% - 64px), 520px);
  height: calc(100% - 96px);
  align-self: center;
}

.velvet {
  --paper-grain: url("/assets/ornaments/cotton-paper.svg");
  --paper-vignette: radial-gradient(
    ellipse at 50% 42%,
    #fffdf933 0%,
    #eee8db11 48%,
    #ada18a14 100%
  );
  position: relative;
  width: 100%;
  height: 100%;
  perspective: 1700px;
  isolation: isolate;
  color: #806124;
  background:
    var(--paper-grain), var(--paper-vignette),
    linear-gradient(180deg, #fbf9f2, #f0eadd);
  box-shadow:
    0 1px 0 #ddd6c8,
    0 2px 2px #534a3824,
    0 8px 14px -6px #534a3833,
    0 22px 38px -18px #534a3826;
}
.velvet::after {
  content: "";
  position: absolute;
  z-index: 1;
  inset: 0;
  box-shadow:
    inset 1px 0 0 #fffefa99,
    inset -1px 0 0 #ada18a26,
    inset 0 -1px 0 #ada18a33;
  pointer-events: none;
}
.velvet::before {
  content: "";
  position: absolute;
  z-index: 1;
  inset: 0;
  background: radial-gradient(
    ellipse at 50% 59%,
    #8574591a 0%,
    #b1a0800a 20%,
    transparent 42%
  );
  pointer-events: none;
}
.velvet.is-open::before {
  background:
    linear-gradient(180deg, #72634b1a, #a18e700d 3%, transparent 14%),
    radial-gradient(ellipse at 50% 38%, #8f7b5b26, transparent 66%);
}

.fold {
  position: absolute;
  inset: 0;
  pointer-events: none;
}
.fold-left {
  clip-path: polygon(0 0, 52% 59%, 0 100%);
  background:
    var(--paper-grain), var(--paper-vignette),
    linear-gradient(110deg, #fcfaf4, #f2ece0);
}
.fold-right {
  clip-path: polygon(100% 0, 48% 59%, 100% 100%);
  background:
    var(--paper-grain), var(--paper-vignette),
    linear-gradient(250deg, #f8f5ed, #eee7da);
}
.fold-bottom {
  filter: drop-shadow(0 -1px 1px #70624c29);
}
.fold-bottom::before {
  content: "";
  position: absolute;
  inset: 0;
  clip-path: polygon(0 100%, 50% 59%, 100% 100%);
  background:
    var(--paper-grain), var(--paper-vignette),
    linear-gradient(175deg, #fdfbf5 50%, #f5f0e5);
}

.slot {
  position: absolute;
  z-index: 2;
  left: 6%;
  right: 6%;
  top: 19%;
  height: 70%;
  overflow: hidden;
  visibility: hidden;
}
.velvet.is-open .slot {
  visibility: visible;
  transition: visibility 0s linear 0.5s;
}
.card {
  position: absolute;
  /* Leave room inside the reveal mask for the paper's edge and cast shadow. */
  inset: 10px 12px 26px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 14px 18px;
  background:
    linear-gradient(135deg, #ffffff66, transparent 60%),
    var(--paper-grain), linear-gradient(160deg, #fffefa, #fbf7ed);
  border: 1px solid #fffefb;
  box-shadow:
    0 1px 0 #c9bda7,
    0 3px 3px #66543d29,
    2px 12px 18px -6px #66543d40;
  transform: translateY(calc(100% + 32px));
  transition: transform 0.85s cubic-bezier(0.16, 0.84, 0.24, 1) 0.5s;
}
.card::after {
  content: "";
  position: absolute;
  inset: 10px;
  border: 1px solid #b8a68159;
  box-shadow: 0 1px 0 #ffffffb3;
  pointer-events: none;
}
.card-botanical {
  position: absolute;
  width: clamp(48px, 14%, 88px);
  height: auto;
  opacity: 0.45;
  pointer-events: none;
}
.card-botanical-top {
  top: 22px;
  left: 20px;
}
.card-botanical-bottom {
  right: 20px;
  bottom: 22px;
  transform: rotate(180deg);
}
.card-flourish {
  width: 76px;
  height: auto;
  margin-top: 12px;
  opacity: 0.7;
  pointer-events: none;
}
.velvet.is-open .card {
  transform: translateY(0);
}
.card-title {
  margin: 0 0 8px;
  font-family: var(--heading);
  font-size: 0.85rem;
  font-weight: 500;
  line-height: 1.5;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}
.names {
  margin: 12px 0 0;
  font-family: var(--script-vi);
  font-size: clamp(1.1rem, 6.4vw, 2.3rem);
  line-height: 1.25;
  text-align: center;
  text-wrap: balance;
}
.names span {
  display: block;
  margin: 2px 0;
  color: #a47e34;
  font-size: 0.6em;
  line-height: 1.1;
}
.when {
  margin: 16px 0 0;
  font-family: var(--heading);
  letter-spacing: 0.04em;
  font-size: 1.35rem;
  line-height: 1.4;
}
.when span {
  display: block;
  margin-bottom: 4px;
  font-size: 0.75em;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.flap {
  position: absolute;
  z-index: 3;
  inset: 0 0 auto;
  height: 59%;
  transform-origin: center top;
  transform-style: preserve-3d;
  transition: transform 0.65s cubic-bezier(0.42, 0, 0.25, 1);
}
.flap-front,
.flap-back {
  position: absolute;
  inset: 0;
  backface-visibility: hidden;
}
.flap-front {
  transform: translateZ(1px);
}
.flap-front > * {
  backface-visibility: hidden;
}
/* Filtered children can leak through their parent's back face in WebKit. */
.velvet.is-open .flap-front {
  visibility: hidden;
  transition: visibility 0s linear 0.44s;
}
.flap-back {
  transform: rotateY(180deg);
}
.flap-lining {
  position: absolute;
  z-index: 1;
  inset: 0;
  clip-path: polygon(0 0, 100% 0, 50% 100%);
  background:
    linear-gradient(180deg, #7f6a4924, #a18c6914 9%, transparent 32%),
    var(--paper-grain), linear-gradient(180deg, #eee6d6, #f4eee1 40%, #faf7ef);
}
.flap-back .seal {
  z-index: 0;
}
/* The shadow belongs outside the clipped paper, so it follows the folded edge. */
.flap-paper {
  position: absolute;
  inset: 0;
  filter:
    drop-shadow(0 1px 0.5px #70624c40)
    drop-shadow(1px 4px 3px #70624c24)
    drop-shadow(2px 10px 8px #70624c12);
}
.flap-shape {
  position: absolute;
  inset: 0;
  background:
    var(--paper-grain),
    radial-gradient(ellipse at 40% 0%, #ffffff80, transparent 65%),
    linear-gradient(170deg, #fffdf8 0%, #faf7ef 60%, #eee7d7 100%);
  clip-path: polygon(0 0, 100% 0, 50% 100%);
}
.creases {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
}
.velvet.is-open .flap {
  transform: rotateX(-180deg);
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
.hint {
  transition: opacity 0.28s ease 0.12s;
}
.face {
  z-index: 1;
  top: 12%;
  transform: translateZ(0.1px);
}
.welcome {
  position: relative;
  margin: 0;
  font-size: 0.875rem;
  font-weight: 500;
  letter-spacing: 0.15em;
  text-indent: 0.15em;
  text-transform: uppercase;
  line-height: 1.5;
}
.welcome::before,
.welcome::after {
  content: "";
  position: absolute;
  top: 10px;
  width: 26px;
  height: 1px;
  background: #b2a58d80;
}
.welcome::before {
  right: calc(50% + 56px);
}
.welcome::after {
  left: calc(50% + 56px);
}
.script {
  margin: 14px 0 0;
  font-family: var(--script);
  font-size: clamp(3.8rem, 14vw, 5.6rem);
  font-weight: 400;
  line-height: 0.85;
  color: #957029;
  text-shadow: 0 1px 0 #fffefa;
}
.swash {
  display: block;
  width: min(48%, 190px);
  height: 28px;
  margin: -2px auto 0;
  color: #a47e34;
}
.lower {
  z-index: 1;
  top: 72%;
}
.salute {
  position: relative;
  margin: 0;
  font-size: 0.875rem;
  font-weight: 500;
  letter-spacing: 0.09em;
  text-indent: 0.09em;
  text-transform: uppercase;
}
.salute::before {
  content: "";
  position: absolute;
  top: -16px;
  left: calc(50% - 2px);
  width: 4px;
  height: 4px;
  border: 1px solid #b2a58d;
  transform: rotate(45deg);
}
.guest {
  margin: 9px 0 0;
  font-family: var(--script-vi);
  font-size: clamp(2.5rem, 8vw, 3.3rem);
  font-weight: 400;
  line-height: 1.15;
  color: #957029;
}
.hint {
  bottom: max(22px, 4vh);
  margin: 0;
  font-size: 0.75rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}
.hint::before {
  content: "";
  display: block;
  width: 28px;
  height: 1px;
  margin: 0 auto 12px;
  background: #b2a58d80;
}
.seal {
  position: absolute;
  z-index: 2;
  left: 50%;
  bottom: 0;
  width: 100px;
  height: 100px;
  transform: translate(-50%, 50%) rotate(-8deg);
}
.seal::before {
  content: "";
  position: absolute;
  z-index: -1;
  inset: -12%;
  border-radius: 50%;
  background: radial-gradient(
    closest-side,
    #66543c40 0%,
    #8f795126 40%,
    #b69a660a 68%,
    transparent 100%
  );
  pointer-events: none;
}
.seal img {
  position: absolute;
  inset: 0;
  display: block;
  width: 100%;
  height: 100%;
  filter: drop-shadow(1px 2px 1px #51432d4d) drop-shadow(2px 5px 4px #51432d33);
}
.velvet.is-open .lower,
.velvet.is-open .hint {
  opacity: 0;
}

@media screen and (min-width: 1024px) {
  .frame {
    width: min(800px, calc(100vw - 112px), calc(160svh - 153.6px));
    height: auto;
    align-self: center;
    margin-bottom: 0;
    aspect-ratio: 8 / 5;
    container-type: inline-size;
  }
  .velvet {
    box-shadow:
      0 1px 0 #ddd6c8,
      0 3px 3px #534a3826,
      0 12px 18px -8px #534a3833,
      0 30px 48px -22px #534a382b;
  }
  .velvet.is-open .flap {
    transform: rotateX(-135deg);
  }
  .face {
    top: 13%;
  }
  .welcome {
    font-size: max(0.75rem, 1.4cqw);
  }
  .script {
    margin-top: 1.5cqw;
    font-size: 10.5cqw;
  }
  .swash {
    width: 27cqw;
    height: 3.5cqw;
    margin-top: -0.3cqw;
  }
  .seal {
    width: 12.5cqw;
    height: 12.5cqw;
  }
  .lower {
    top: 74%;
  }
  .salute {
    font-size: max(0.875rem, 1.7cqw);
  }
  .guest {
    margin-top: 0.8cqw;
    font-size: 5.2cqw;
  }
  .hint {
    bottom: 4%;
    font-size: max(0.75rem, 1.3cqw);
  }
  .hint::before {
    display: none;
  }
  .slot {
    left: 8%;
    right: 8%;
    top: 15%;
    height: 70%;
  }
  .card-title {
    font-size: max(0.85rem, 1.8cqw);
  }
  .names {
    margin-top: 1cqw;
    font-size: 4.5cqw;
  }
  .when {
    margin-top: 1.5cqw;
    font-size: max(1.15rem, 2.4cqw);
  }
}

/* Keep the lid upright on short windows instead of moving or scaling the envelope. */
@media screen and (min-width: 1024px) and (max-height: 850px) {
  .velvet.is-open .flap {
    transform: rotateX(-112deg);
  }
}

@media screen and (min-width: 1024px) and (max-height: 700px) {
  .velvet.is-open .flap {
    transform: rotateX(-101deg);
  }
}

@media screen and (max-width: 1023px) and (max-height: 680px) {
  .face {
    top: 8%;
  }
  .welcome {
    font-size: 0.68rem;
    line-height: 1.3;
  }
  .script {
    margin-top: 6px;
    font-size: 3rem;
  }
  .swash {
    width: 44%;
    height: 22px;
  }
  .guest {
    margin-top: 6px;
    font-size: 2.2rem;
    line-height: 1.05;
  }
  .card-botanical-top {
    display: none;
  }
  .card-botanical-bottom {
    width: 32px;
  }
  .names {
    font-size: clamp(1.1rem, 6.4vw, 1.85rem);
  }
  .when {
    margin-top: 8px;
    font-size: 1.15rem;
    line-height: 1.4;
  }
  .hint {
    bottom: 18px;
    font-size: 0.65rem;
  }
  .hint::before,
  .salute::before {
    display: none;
  }
}

@media (prefers-reduced-motion: reduce) {
  .flap {
    transition-duration: 0.01s;
    transition-delay: 0s;
  }
  .velvet.is-open .flap-front {
    transition-delay: 0s;
  }
  .velvet.is-open .slot {
    transition-delay: 0s;
  }
  .card {
    transition-duration: 0.01s;
    transition-delay: 0s;
  }
  .lower,
  .hint {
    transition-duration: 0.01s;
    transition-delay: 0s;
  }
}
</style>
