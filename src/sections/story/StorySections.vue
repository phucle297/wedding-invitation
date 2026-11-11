<script setup lang="ts">
import { couple } from "../../content/couple";
import { albumSrcset } from "../../content/images";
import LazyImage from "../../components/LazyImage.vue";

const scenes = [
  {
    title: "Gặp gỡ",
    image: "13",
    alt: "Duy Phúc và Linh Đan bên khung cửa",
    text: "Giữa bao điều đẹp đẽ, có một người để cùng sẻ chia.",
  },
  {
    title: "Đồng hành",
    image: "10",
    alt: "Duy Phúc và Linh Đan cùng nhau trong khu vườn",
    text: "Hạnh phúc là có nhau, cùng biến những ngày bình thường thành thương nhớ.",
  },
  {
    title: "Về chung một nhà",
    image: "09",
    alt: "Khoảnh khắc gần gũi của Duy Phúc và Linh Đan",
    text: "Một chương mới, một mái nhà. Và những điều bình dị đang chờ phía trước.",
  },
];
</script>

<template>
  <section class="block couple-section" aria-labelledby="couple-title">
    <div class="section-heading">
      <p class="eyebrow">Hai người, một hành trình</p>
      <h2 id="couple-title">Chúng mình</h2>
      <p class="couple-intro">
        Chẳng cần những điều lớn lao, chỉ mong mỗi ngày đều có nhau.
        Cùng chia sẻ những niềm vui nhỏ, cùng đi qua những ngày bình thường —
        và cùng viết tiếp câu chuyện của chúng mình.
      </p>
    </div>
    <div class="portraits">
      <figure>
        <div class="portrait-frame groom-portrait">
          <LazyImage
            fill
            src="/assets/album/groom.webp"
            :srcset="albumSrcset('/assets/album/groom.webp')"
            sizes="auto, (min-width: 1024px) 360px, (min-width: 720px) 300px, 42vw"
            alt="Chú rể Duy Phúc"
            width="1067"
            height="1600"
            loading="lazy"
            decoding="async"
          />
        </div>
        <figcaption>
          <span>{{ couple.groom.short }}</span
          ><small>{{ couple.groom.full }}</small
          ><em>{{ couple.groom.role }}</em>
        </figcaption>
      </figure>
      <figure>
        <div class="portrait-frame bride-portrait">
          <LazyImage
            fill
            src="/assets/album/bride.webp"
            :srcset="albumSrcset('/assets/album/bride.webp')"
            sizes="auto, (min-width: 1024px) 360px, (min-width: 720px) 300px, 42vw"
            alt="Cô dâu Linh Đan"
            width="1067"
            height="1600"
            loading="lazy"
            decoding="async"
          />
        </div>
        <figcaption>
          <span>{{ couple.bride.short }}</span
          ><small>{{ couple.bride.full }}</small
          ><em>{{ couple.bride.role }}</em>
        </figcaption>
      </figure>
      <img
        class="couple-botanical"
        src="/assets/ornaments/botanical.svg"
        alt=""
        aria-hidden="true"
        width="240"
        height="360"
      />
    </div>
  </section>

  <section class="journey" id="hanh-trinh" aria-labelledby="journey-title">
    <div class="section-heading">
      <p class="eyebrow">Một dòng ký ức</p>
      <h2 id="journey-title">Hành trình của chúng mình</h2>
      <p class="lead">Ba chương, một hành trình — vẫn đang tiếp tục.</p>
    </div>
    <div class="journey-track">
      <div class="journey-line" aria-hidden="true">
        <span class="journey-progress"></span>
        <span class="journey-cursor"></span>
      </div>
      <article v-for="scene in scenes" :key="scene.title" class="journey-scene">
        <figure class="journey-frame">
          <LazyImage
            fill
            :src="`/assets/album/${scene.image}.webp`"
            :srcset="albumSrcset(`/assets/album/${scene.image}.webp`)"
            sizes="auto, (min-width: 1024px) 540px, (min-width: 720px) 300px, 40vw"
            :alt="scene.alt"
            width="1067"
            height="1600"
            loading="lazy"
            decoding="async"
          />
        </figure>
        <span class="journey-dot" aria-hidden="true"><span class="journey-dot-fill"></span></span>
        <div class="journey-copy">
          <h3>{{ scene.title }}</h3>
          <p>{{ scene.text }}</p>
        </div>
      </article>
    </div>
  </section>

  <section class="block vow" aria-labelledby="vow-title">
    <p class="eyebrow" id="vow-title">Lời hẹn</p>
    <blockquote aria-label="“Cùng nhau đi tiếp những ngày đẹp nhất.”">
      <span class="vow-line" aria-hidden="true">
        <span class="vow-word">“Cùng</span> <span class="vow-word">nhau</span>{{ " " }}
        <span class="vow-word">đi</span> <span class="vow-word">tiếp</span>
      </span>
      <span class="vow-line" aria-hidden="true">
        <span class="vow-word">những</span> <span class="vow-word">ngày</span>{{ " " }}
        <span class="vow-word">đẹp</span> <span class="vow-word">nhất.”</span>
      </span>
    </blockquote>
    <span class="fine-rule" aria-hidden="true"></span>
  </section>
</template>

<style scoped>
.section-heading {
  text-align: center;
  margin-bottom: 40px;
}
.section-heading h2 {
  margin: 14px 0;
}
.section-heading .lead {
  font-size: var(--text-body);
}
.couple-section {
  position: relative;
  color: var(--ink);
  background-color: var(--champagne);
}
.couple-section .eyebrow,
.couple-section h2 {
  color: inherit;
}
.couple-intro {
  max-width: 32em;
  margin: 20px auto 0;
  color: var(--ink-soft);
  font-size: var(--text-body);
  line-height: 1.9;
  text-wrap: pretty;
}
.portraits {
  display: grid;
  position: relative;
  grid-template-columns: 1fr 1fr;
  gap: 28px;
}
.portraits figure {
  margin: 0;
}
.portraits figure:nth-child(2) {
  padding-top: 85px;
}
.portrait-frame {
  position: relative;
  aspect-ratio: 0.68;
  overflow: hidden;
  border-radius: 95px 0 0 0;
}
.bride-portrait {
  border-radius: 0 95px 0 0;
}
.portrait-frame :deep(img) {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center 30%;
}
.groom-portrait :deep(img) {
  transform: scaleX(-1);
}
figcaption {
  text-align: center;
  margin-top: 18px;
}
figcaption span {
  display: block;
  font: 500 var(--text-feature)/1.25 var(--heading);
  text-transform: uppercase;
}
figcaption small {
  display: block;
  font-size: var(--text-small);
  line-height: 1.5;
  margin-top: 4px;
}
figcaption em {
  display: block;
  font: var(--text-small)/1.5 var(--sans);
  margin-top: 5px;
}
.couple-botanical {
  position: absolute;
  width: clamp(96px, 24%, 180px);
  height: auto;
  left: 50%;
  top: 46%;
  transform: translate(-50%, -25%) rotate(-12deg);
  pointer-events: none;
}
.journey {
  padding: 78px 42px 36px;
  scroll-margin-top: 90px;
}
.journey h2 {
  font: var(--section-title)/1.25 var(--script-vi);
  margin: 16px 0;
}
.journey .section-heading::after {
  content: "";
  display: block;
  width: 120px;
  height: 36px;
  margin: 20px auto 0;
  background: url("/assets/ornaments/flourish.svg") center / contain no-repeat;
  opacity: 0.7;
}
.journey-track {
  position: relative;
}
.journey-line {
  position: absolute;
  left: 10px;
  top: 0;
  bottom: 0;
  width: 1.2px;
  background: var(--line);
}
.journey-progress {
  display: block;
  position: absolute;
  left: calc(50% - 1.25px);
  width: 2.5px;
  height: 100%;
  border-radius: 999px;
  background: var(--espresso);
  transform-origin: top;
}
.journey-cursor {
  position: absolute;
  z-index: 1;
  visibility: hidden;
  top: 0;
  left: 50%;
  width: 14px;
  height: 14px;
  border: 2px solid var(--cream);
  border-radius: 50%;
  background: var(--espresso);
  transform: translate(-50%, -50%);
}
.journey-scene {
  position: relative;
  display: grid;
  grid-template-columns: 1.25fr 1fr;
  align-items: center;
  gap: 28px;
  padding: 30px 0 44px 40px;
}
.journey-frame {
  position: relative;
  margin: 0;
  aspect-ratio: 1;
  overflow: hidden;
  border-radius: 50%;
  background: #e7e7e2;
}
.journey-frame :deep(img) {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center 42%;
}
.journey-dot {
  position: absolute;
  width: 9px;
  height: 9px;
  border: 1px solid var(--bronze);
  border-radius: 50%;
  background: var(--paper);
  left: 6px;
  top: 50%;
}
.journey-dot-fill {
  position: absolute;
  inset: 0;
  border-radius: inherit;
  background: var(--bronze);
  opacity: 0;
}
.journey-copy h3 {
  font: var(--text-script)/1.25 var(--script-vi);
  letter-spacing: 0.015em;
  margin: 0 0 16px;
}
.journey-copy p {
  color: var(--ink-soft);
  line-height: 1.9;
  margin: 0;
  font-size: var(--text-body);
}
.journey-copy::after {
  content: "";
  display: block;
  width: 64px;
  height: 36px;
  margin-top: 18px;
  background: url("/assets/ornaments/rings.svg") left center / contain no-repeat;
  opacity: 0.65;
}
.journey-scene:nth-of-type(2) .journey-copy::after {
  background-image: url("/assets/ornaments/ribbon.svg");
}
.journey-scene:nth-of-type(3) .journey-copy::after {
  background-image: url("/assets/ornaments/sparkles.svg");
}
@media (min-width: 1024px) {
  .journey-scene:nth-of-type(even) .journey-copy::after {
    margin-left: auto;
  }
}
.vow {
  text-align: center;
  border-block: 1px solid var(--line);
  background-color: var(--cream);
}
.vow blockquote {
  font: var(--section-title)/1.4 var(--script-vi);
  margin: 28px 0;
}
.vow-line {
  display: block;
}
.vow-word {
  display: inline-block;
}
@media (max-width: 600px) {
  .portraits {
    gap: 20px;
  }
  .portraits figure:nth-child(2) {
    padding-top: 55px;
  }
  .journey {
    padding: 60px 24px 30px;
  }
  .journey-scene {
    display: flex;
    flex-direction: column;
    gap: 24px;
    align-items: stretch;
    padding: 24px 0 32px 32px;
  }
  .journey-dot {
    top: 50px;
  }
  .journey-copy h3 {
    margin-bottom: 10px;
  }
}
</style>
