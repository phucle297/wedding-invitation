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
      <div class="fold fold-bottom"></div>
      <div class="slot">
        <article class="card">
          <p class="monogram">
            {{ couple.groom.mark }} <span>&amp;</span> {{ couple.bride.mark }}
          </p>
          <p class="names">
            {{ couple.groom.short }} <span>&amp;</span> {{ couple.bride.short }}
          </p>
          <p class="when">{{ date.display }}</p>
        </article>
      </div>

      <div class="lower">
        <p class="salute">{{ phrases.invite }}</p>
        <p class="guest">{{ phrases.addressee }}</p>
      </div>
      <p class="hint">{{ phrases.openEnvelope }}</p>

      <div class="flap">
        <div class="flap-back">
          <div class="flap-lining"></div>
          <div class="seal">
            <img src="/assets/ornaments/gold-seal.svg" alt="" />
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
                  stroke="#fffffc"
                  stroke-width="0.45"
                />
                <polyline
                  points="3,0 50,94 97,0"
                  fill="none"
                  stroke="#bbad92"
                  stroke-opacity="0.65"
                  stroke-width="0.14"
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
            <img src="/assets/ornaments/gold-seal.svg" alt="" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.frame {
  width: min(calc(100% - 32px), 520px);
  height: calc(100% - 180px);
  align-self: end;
  margin-bottom: 24px;
}

.velvet {
  --paper-grain: url("/assets/ornaments/cotton-paper.svg");
  --paper-vignette: radial-gradient(
    ellipse at 50% 42%,
    #fffdf955 0%,
    #efe2c522 48%,
    #ac94642b 100%
  );
  position: relative;
  width: 100%;
  height: 100%;
  perspective: 1700px;
  isolation: isolate;
  color: #806124;
  background:
    var(--paper-grain), var(--paper-vignette),
    radial-gradient(ellipse at 50% 18%, #ffffffcc, transparent 42%),
    radial-gradient(ellipse at 50% 100%, #be9b521f, transparent 52%),
    linear-gradient(180deg, #fffefa 0%, #faf5e9 46%, #f1e5ca 100%);
  box-shadow:
    inset 0 0 0 1px #a39a8729,
    inset 0 0 48px #b9a37414,
    1px 2px 0 #d8d4c8,
    0 4px 7px #4c483c1f,
    5px 20px 32px #4c483c26,
    12px 38px 60px #4c483c12;
}
.velvet::after {
  content: "";
  position: absolute;
  z-index: 1;
  inset: 14px;
  border: 1px solid #b7aa9059;
  box-shadow:
    0 1px 0 #fffffa99,
    inset 0 1px 0 #fffffa99,
    inset 0 0 28px #c9b5870f;
  pointer-events: none;
}
.velvet::before {
  content: "";
  position: absolute;
  z-index: 1;
  inset: 0;
  background: radial-gradient(
    ellipse at 50% 59%,
    #8f79522e 0%,
    #bea57114 28%,
    transparent 58%
  );
  pointer-events: none;
  transition: opacity 0.6s ease;
}
.velvet.is-open::before {
  opacity: 0;
}

.fold {
  position: absolute;
  inset: 0;
  pointer-events: none;
}
.fold-left {
  clip-path: polygon(0 0, 54% 62%, 0 100%);
  background:
    var(--paper-grain), var(--paper-vignette),
    linear-gradient(110deg, #fffefa, #f5ecd9);
}
.fold-right {
  clip-path: polygon(100% 0, 46% 62%, 100% 100%);
  background:
    var(--paper-grain), var(--paper-vignette),
    linear-gradient(240deg, #fcf8ef, #f1e5ca);
}
.fold-bottom {
  clip-path: polygon(0 100%, 0 99%, 50% 54%, 100% 99%, 100% 100%);
  background:
    var(--paper-grain), var(--paper-vignette),
    linear-gradient(165deg, #fffdfa, #f5ecd8);
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
.card {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: var(--paper-grain), linear-gradient(135deg, #fffdf7, #faf5e9);
  border: 1px solid #b8ae993d;
  box-shadow:
    inset 0 0 0 7px #fffefa,
    inset 0 0 0 8px #b8ae992b,
    0 8px 14px #4c483c12;
  transform: translateY(108%);
  transition: transform 0.42s cubic-bezier(0.16, 0.84, 0.24, 1) 0.4s;
}
.velvet.is-open .card {
  transform: translateY(0);
}
.monogram {
  margin: 0;
  font-family: var(--heading);
  font-size: 3.2rem;
  line-height: 1.1;
  color: #a47e34;
}
.monogram span {
  font-family: var(--script);
  font-size: 0.65em;
}
.names {
  margin: 8px 0 0;
  font-family: var(--heading);
  font-size: clamp(1.8rem, 5vw, 2.4rem);
  line-height: 1.1;
}
.names span {
  color: #a47e34;
  padding-inline: 0.12em;
}
.when {
  margin: 12px 0 0;
  letter-spacing: 0.04em;
  font-size: 1rem;
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
  inset: 0;
  clip-path: polygon(0 0, 100% 0, 50% 100%);
  background:
    var(--paper-grain), linear-gradient(180deg, #fffefa, #faf5e9 65%, #f1e5ca);
}
/* The shadow belongs outside the clipped paper, so it follows the folded edge. */
.flap-paper {
  position: absolute;
  inset: 0;
  filter: drop-shadow(2px 12px 8px #4c483c38) drop-shadow(0 2px 1px #a49b8866);
}
.flap-shape {
  position: absolute;
  inset: 0;
  background:
    var(--paper-grain),
    radial-gradient(ellipse at 50% 18%, #ffffffd9, transparent 58%),
    radial-gradient(ellipse at 50% 100%, #ae925b2e, transparent 68%),
    linear-gradient(180deg, #ffffff 0%, #fcf8ef 58%, #eddfbd 100%);
  clip-path: polygon(0 0, 100% 0, 50% 100%);
}
.creases {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
}
.velvet.is-open .flap {
  transform: rotateX(-110deg);
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
  transform: translate(-50%, -8%) rotate(-8deg);
}
.seal::before {
  content: "";
  position: absolute;
  z-index: -1;
  inset: -35%;
  border-radius: 50%;
  background: radial-gradient(
    closest-side,
    #80694259 0%,
    #a58b5533 40%,
    #b69a6612 68%,
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
  filter: drop-shadow(3px 8px 5px #514c403d) drop-shadow(0 2px 1px #514c4033);
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
      inset 0 0 0 1px #a39a8729,
      inset 0 0 56px #b9a37414,
      1px 3px 0 #d8d4c8,
      0 5px 9px #4c483c21,
      7px 24px 36px #4c483c29,
      18px 52px 80px #4c483c17;
  }
  .velvet::after {
    inset: 18px;
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
    top: 18%;
    height: 64%;
  }
  .monogram {
    font-size: 7cqw;
  }
  .names {
    margin-top: 1cqw;
    font-size: 5.5cqw;
  }
  .when {
    margin-top: 1.5cqw;
    font-size: max(1rem, 1.8cqw);
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
    transform: rotateX(-106deg);
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
