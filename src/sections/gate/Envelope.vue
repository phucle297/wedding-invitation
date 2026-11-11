<script setup lang="ts">
import { couple } from "../../content/couple";
import { date } from "../../content/date";
import { phrases } from "../../content/phrases";

defineProps({ open: { type: Boolean, default: false } });
</script>

<template>
  <div class="frame" aria-hidden="true">
    <div class="envelope" :class="{ 'is-open': open }">
      <div class="slot">
        <article class="card">
          <img
            src="/assets/ornaments/floral-bouquet.webp"
            width="490"
            height="390"
            alt=""
          />
          <p class="card-title">Thiệp Mời</p>
          <p class="card-names">
            {{ couple.bride.full }}<span>&amp;</span>{{ couple.groom.full }}
          </p>
          <p class="when">{{ date.weekday }}, {{ date.display }}</p>
        </article>
      </div>
      <div class="pocket"></div>
      <div class="front-copy">
        <div class="name-band">
          <div>
            <p class="names">
              {{ couple.bride.short.toLocaleLowerCase("vi") }}
              <span>&amp;</span>
              {{ couple.groom.short.toLocaleLowerCase("vi") }}
            </p>
            <p class="when">{{ date.weekday }}, {{ date.display }}</p>
          </div>
        </div>
        <div class="addressee">
          <p class="salute">{{ phrases.invite }}</p>
          <p class="guest">{{ phrases.addressee }}</p>
        </div>
      </div>
      <div class="flap">
        <div class="flap-front">
          <div class="flap-material"></div>
          <svg viewBox="0 0 800 300" preserveAspectRatio="none">
            <path
              d="M2 1H798L425 277Q400 297 375 277Z"
              fill="none"
              stroke="#fffdf5"
              stroke-opacity=".8"
              stroke-width="1.5"
              vector-effect="non-scaling-stroke"
            />
            <path
              d="M14 5 380 264Q400 282 420 264L786 5"
              fill="none"
              stroke="#a18b6a"
              stroke-width="1"
              vector-effect="non-scaling-stroke"
            />
          </svg>
          <span class="happiness"
            ><img
              src="/assets/ornaments/double-happiness.svg"
              width="100"
              height="100"
              alt=""
          /></span>
          <span class="seal"
            ><img
              src="/assets/ornaments/gold-seal.webp"
              width="384"
              height="384"
              alt=""
          /></span>
        </div>
        <div class="flap-back">
          <div class="flap-lining"></div>
          <span class="seal"
            ><img
              src="/assets/ornaments/gold-seal.webp"
              width="384"
              height="384"
              alt=""
          /></span>
        </div>
      </div>
    </div>
    <p class="hint">{{ phrases.openEnvelope }} <span>↓</span></p>
  </div>
</template>

<style scoped>
.frame {
  width: min(800px, calc(100vw - 64px), calc(125svh - 100px));
  container-type: inline-size;
}
.envelope {
  --flap-fraction: 0.6;
  --envelope-paper: #fffbf2;
  --paper-fibers: url("/assets/ornaments/cotton-paper.svg");
  position: relative;
  isolation: isolate;
  aspect-ratio: 8 / 5;
  perspective: 1700px;
  border-radius: 8px;
  outline: 1px solid #b8a586;
  outline-offset: -1px;
  background: var(--envelope-paper);
  color: #665033;
  box-shadow:
    0 1px 1px #ffffffcc inset,
    0 -2px 3px #715c3e24 inset,
    0 2px 0 #d0c3ad,
    0 3px 0 #f5eddf,
    0 4px 1px #a8987b,
    1px 6px 5px -2px #534a3866,
    5px 22px 24px -12px #534a3859,
    12px 46px 60px -24px #534a3847;
}
.pocket,
.flap-material {
  background:
    var(--paper-fibers) 0 0 / 340px,
    linear-gradient(120deg, #ffffff30, transparent 40%, #8c76551c),
    url("/assets/ornaments/pale-gold-paper.webp") center / cover,
    var(--envelope-paper);
}
.pocket {
  position: absolute;
  z-index: 2;
  inset: 0;
  border: 1px solid #b8a586;
  border-radius: inherit;
  box-shadow:
    1px 1px 0 #fffdf6 inset,
    -1px -2px 3px #715c3e33 inset;
  clip-path: polygon(0 0, 50% 33%, 100% 0, 100% 100%, 0 100%);
}
.pocket::after {
  content: "";
  position: absolute;
  inset: 9px;
  border: 1px solid #a18b6a;
  border-radius: 5px;
}
.front-copy {
  position: absolute;
  z-index: 5;
  inset: 65% 10% 3%;
  transition: opacity 0.25s ease;
}
.name-band {
  display: flex;
  align-items: center;
  justify-content: center;
}
.happiness {
  position: absolute;
  top: 28%;
  left: 50%;
  transform: translateX(-50%);
  display: grid;
  place-items: center;
  width: 10cqw;
  height: 11cqw;
}
.happiness img {
  width: 100%;
  height: 100%;
  filter: drop-shadow(-0.5px -0.5px 0.25px #fff8df)
    drop-shadow(0.6px 1px 0.5px #71552d66);
}
.seal {
  position: absolute;
  left: 50%;
  bottom: 3%;
  width: 10cqw;
  height: 10cqw;
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
    #66543c40,
    #8f795126 40%,
    #b69a660a 68%,
    transparent
  );
  pointer-events: none;
}
.seal img {
  display: block;
  width: 100%;
  height: 100%;
  filter: drop-shadow(1px 2px 1px #51432d4d) drop-shadow(2px 5px 4px #51432d33);
}
.names {
  margin: 0;
  font: 4.8cqw/1.25 var(--script-vi);
  white-space: nowrap;
  text-transform: capitalize;
}
.names span {
  font-size: 0.75em;
}
.when {
  margin: 1cqw 0 0;
  font: 2cqw/1.5 var(--heading);
  text-transform: uppercase;
}
.addressee {
  width: 35%;
  margin: 0.6cqw 0 0 auto;
  text-align: center;
  transform: translateX(4cqw);
}
.salute {
  margin: 0;
  font: 500 2cqw/1.5 var(--heading);
  text-transform: uppercase;
}
.guest {
  margin: 0.9cqw 0 0;
  padding-bottom: 0.7cqw;
  border-bottom: 1px dotted #9e896b;
  color: #913b3e;
  font: 3.5cqw/1.2 var(--script-vi);
}
.flap {
  position: absolute;
  z-index: 4;
  inset: 0 0 auto;
  height: calc(100% * var(--flap-fraction));
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
  filter: drop-shadow(0 1px 0.4px #fff8e8) drop-shadow(1px 3px 1px #715c3e66)
    drop-shadow(2px 8px 5px #715c3e3b) drop-shadow(4px 16px 12px #715c3e1a);
}
/* Use a full-size paper sheet before clipping, so motifs never stretch with the flap. */
.flap-material {
  position: absolute;
  inset: 0 0 auto;
  height: calc(100% / var(--flap-fraction));
  clip-path: polygon(
    0 0,
    100% 0,
    53.25% calc(92.67% * var(--flap-fraction)),
    51.5% calc(95.4% * var(--flap-fraction)),
    50% calc(96.17% * var(--flap-fraction)),
    48.5% calc(95.4% * var(--flap-fraction)),
    46.75% calc(92.67% * var(--flap-fraction))
  );
}
.flap-front > svg {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
}
.flap-back {
  transform: rotateY(180deg);
}
.flap-lining {
  position: absolute;
  z-index: 1;
  inset: 0;
  background:
    var(--paper-fibers) 0 0 / 340px,
    linear-gradient(170deg, #e8dfcd, var(--envelope-paper) 18%, #f3ebda);
  clip-path: polygon(0 0, 100% 0, 50% 97%);
}
.flap-back .seal {
  z-index: 0;
}
.slot {
  position: absolute;
  z-index: 1;
  inset: 4% 10% 8%;
  overflow: hidden;
}
.card {
  position: absolute;
  inset: 12px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border: 5px double #dfd4c2;
  border-radius: 16px 16px 10px 10px;
  background:
    var(--paper-fibers) 0 0 / 340px,
    linear-gradient(135deg, #fffefa, #f6efe2);
  color: #913b3e;
  box-shadow:
    0 1px 0 #cdbfa7,
    0 3px 0 #e5d9c5,
    1px 5px 5px #715c3e33,
    3px 18px 24px -8px #715c3e59;
  transform: translateY(110%);
  transition: transform 0.85s cubic-bezier(0.16, 0.84, 0.24, 1) 0.5s;
}
.card img {
  width: 17%;
  height: auto;
}
.card-title {
  margin: 0;
  font: 6cqw/1.3 var(--script-vi);
}
.card-names {
  margin: 1cqw 0;
  font: 3.7cqw/1.3 var(--script-vi);
}
.card-names span {
  display: block;
  font-size: 0.65em;
}
.card .when {
  font-size: 2cqw;
}
.hint {
  margin: 30px 0 0;
  color: #715c3e;
  font-size: 0.75rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  transition: opacity 0.2s ease;
}
.hint span {
  display: inline-block;
  margin-left: 10px;
}
.is-open .flap {
  transform: rotateX(-135deg);
}
.is-open .flap-front {
  visibility: hidden;
  transition: visibility 0s 0.44s;
}
.is-open .card {
  transform: translateY(0);
}
.is-open .front-copy,
.envelope.is-open + .hint {
  opacity: 0;
}
.is-open .pocket {
  z-index: 0;
}
.is-open .slot {
  z-index: 3;
}
@media (max-width: 600px) {
  .frame {
    width: calc(100vw - 40px);
  }
  .envelope {
    height: calc(100svh - 96px);
    aspect-ratio: auto;
    --flap-fraction: 0.47;
  }
  .front-copy {
    inset: 56% 7% 5%;
  }
  .happiness {
    width: 17cqw;
    height: 20cqw;
  }
  .seal {
    width: 17cqw;
    height: 17cqw;
  }
  .names {
    font-size: clamp(23px, 7.4cqw, 40px);
    line-height: 1.35;
  }
  .front-copy .when {
    margin-top: clamp(10px, 3cqw, 16px);
    font-size: clamp(12px, 4cqw, 18px);
    letter-spacing: 0.03em;
  }
  .addressee {
    width: min(100%, 72cqw);
    margin: clamp(28px, 10cqw, 48px) auto 0;
    transform: none;
  }
  .salute {
    font-size: clamp(13px, 4.3cqw, 20px);
    letter-spacing: 0.04em;
    white-space: nowrap;
  }
  .guest {
    margin-top: clamp(12px, 4cqw, 20px);
    padding-bottom: clamp(8px, 2cqw, 12px);
    font-size: clamp(30px, 10cqw, 48px);
  }
  .hint {
    font-size: 0.8125rem;
  }
  .slot {
    inset: 22% 6% 14%;
    visibility: hidden;
  }
  .card {
    inset: 10px 12px 26px;
    padding: 14px 18px;
    transform: translateY(calc(100% + 32px));
  }
  .card-title {
    font-size: min(12cqw, 7svh);
  }
  .card-names {
    margin-block: min(5cqw, 3svh);
    font-size: min(7cqw, 4svh);
    text-align: center;
  }
  .card img {
    width: 32%;
  }
  .card .when {
    font-size: min(3.6cqw, 2svh);
  }
  .is-open .slot {
    visibility: visible;
    transition: visibility 0s 0.5s;
  }
  .is-open .flap {
    transform: rotateX(-180deg);
  }
  .is-open .card {
    transform: translateY(0);
  }
}
@media (max-height: 600px) and (min-width: 601px) {
  .is-open .flap {
    transform: rotateX(-105deg);
  }
  .hint {
    margin-top: 16px;
  }
}
</style>
