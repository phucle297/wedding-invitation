<script setup>
import { couple } from "../../content/couple.js";
import { date } from "../../content/date.js";
import { hero } from "./content.js";
</script>

<template>
  <header class="hero satin" id="mo-dau">
    <div class="hero-photo">
      <img
        src="/assets/album/13.jpg"
        alt="Duy Phúc và Linh Đan trong sảnh ngập nắng"
        width="1067"
        height="1600"
        fetchpriority="high"
      />
    </div>
    <div class="hero-copy">
      <p class="hero-script" lang="en">The<br /><span>wedding of</span></p>
      <p class="eyebrow">{{ hero.eyebrow }}</p>
      <h1>
        <span>{{ couple.groom.short }}</span
        ><em>&amp;</em><span>{{ couple.bride.short }}</span>
      </h1>
      <div class="hero-medallion">
        <img
          src="/assets/album/11.jpg"
          alt="Một khoảnh khắc bên nhau trong khu vườn"
          width="1600"
          height="1067"
        />
      </div>
      <a class="hero-scroll" href="#loi-ngo"
        >Mở câu chuyện<span aria-hidden="true">↓</span></a
      >
    </div>
    <p class="hero-date">
      <span>{{ date.weekday }} · Đà Nẵng</span>{{ date.gate }}
    </p>
  </header>
</template>

<style scoped>
.hero {
  position: relative;
  isolation: isolate;
  overflow: clip;
  min-height: 640px;
  height: 800px;
}
.hero-photo {
  position: absolute;
  right: 4%;
  top: 20%;
  width: 59%;
  height: 67%;
  overflow: hidden;
  border-radius: 160px 160px 0 0;
}
.hero-photo img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: 50% 40%;
}
.hero-copy {
  position: relative;
  z-index: 1;
  padding: 6% 0 0 7%;
  width: 100%;
}
.hero-script {
  font-family: var(--script);
  font-size: 100px;
  line-height: 0.76;
  margin: 0 0 48px;
  color: var(--ink);
  width: 80%;
}
.hero-script span {
  display: block;
  margin: 6px 0 0 13%;
}
.hero-copy .eyebrow {
  width: 28%;
  text-align: center;
  letter-spacing: 0.18em;
  font-size: 0.65rem;
}
h1 {
  width: 28%;
  text-align: center;
  margin: 22px 0 26px;
  font-size: 1.9rem;
  line-height: 1.3;
  letter-spacing: 0.05em;
}
h1 span,
h1 em {
  display: block;
}
h1 em {
  font-size: 1.2rem;
  color: var(--bronze);
  margin: 8px 0;
}
.hero-medallion {
  width: 28%;
  aspect-ratio: 1;
  border-radius: 50%;
  border: 6px solid var(--paper);
  overflow: hidden;
}
.hero-medallion img {
  height: 100%;
  width: 100%;
  object-fit: cover;
}
.hero-scroll {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  width: 28%;
  margin-top: 22px;
  color: var(--ink);
  text-decoration: none;
  font-size: 0.7rem;
  min-height: 44px;
}
.hero-scroll span {
  font-size: 1.3rem;
}
.hero-date {
  position: absolute;
  bottom: 22px;
  left: 0;
  width: 100%;
  text-align: center;
  font-family: var(--display);
  letter-spacing: 0.25em;
  font-size: 1.4rem;
  margin: 0;
}
.hero-date span {
  display: block;
  font-family: var(--sans);
  font-size: 0.65rem;
  letter-spacing: 0.16em;
  margin-bottom: 8px;
  text-transform: uppercase;
}
@media (max-width: 600px) {
  .hero {
    height: 150vw;
    min-height: 530px;
    max-height: 760px;
  }
  .hero-copy {
    padding-top: 9%;
  }
  .hero-script {
    font-size: clamp(58px, 13.5vw, 82px);
    margin-bottom: 48px;
  }
  .hero-copy .eyebrow {
    font-size: 0.5rem;
    letter-spacing: 0.1em;
  }
  h1 {
    font-size: clamp(1.1rem, 4.2vw, 1.55rem);
    margin-block: 16px;
  }
  h1 em {
    font-size: 1rem;
    margin-block: 4px;
  }
  .hero-medallion {
    border-width: 3px;
  }
  .hero-scroll {
    font-size: 0.6rem;
    margin-top: 16px;
  }
  .hero-date {
    font-size: 1.1rem;
    bottom: 20px;
  }
  .hero-date span {
    font-size: 0.55rem;
  }
}
</style>
