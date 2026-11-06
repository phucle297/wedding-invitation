<script setup lang="ts">
import { couple } from "../../content/couple";
import { date } from "../../content/date";
import { hero } from "./content";
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
      <h1>
        <span>{{ couple.groom.short }}</span
        ><em>&amp;</em><span>{{ couple.bride.short }}</span>
      </h1>
      <p class="hero-message">{{ hero.message }}</p>
      <div class="hero-keepsake">
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
  font-size: 72px;
  line-height: 0.76;
  margin: 0 0 32px;
  color: var(--ink);
  width: 80%;
}
.hero-script span {
  display: block;
  margin: 6px 0 0 13%;
}
.hero-message {
  width: 28%;
  margin: 0 0 24px;
  text-align: center;
  color: var(--ink-soft);
  font-size: var(--text-small);
  line-height: 1.7;
  text-wrap: balance;
}
h1 {
  width: 28%;
  text-align: center;
  margin: 22px 0 26px;
  font-size: 2.3rem;
  line-height: 1.3;
  letter-spacing: -0.025em;
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
.hero-keepsake {
  width: 28%;
  padding: 5px;
  border: 1px solid var(--line);
  background: var(--paper);
  box-shadow: 0 6px 18px #45453f14;
  transform: rotate(-4deg);
}
.hero-keepsake img {
  display: block;
  width: 100%;
  height: auto;
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
  font-size: var(--text-small);
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
  letter-spacing: 0.02em;
  font-size: 1.75rem;
  font-weight: 600;
  line-height: 1.3;
  margin: 0;
}
.hero-date span {
  display: block;
  font-family: var(--sans);
  font-size: var(--text-small);
  font-weight: 400;
  letter-spacing: 0.02em;
  margin-bottom: 8px;
  text-transform: uppercase;
}
@media (max-width: 600px) {
  .hero {
    height: 150vw;
    min-height: 600px;
    max-height: 760px;
  }
  .hero-photo {
    height: calc(67% - 24px);
  }
  .hero-copy {
    padding-top: 9%;
  }
  .hero-script {
    font-size: clamp(32px, 8vw, 46px);
    margin-bottom: 32px;
  }
  .hero-message,
  h1,
  .hero-keepsake,
  .hero-scroll {
    width: 30%;
  }
  .hero-message {
    margin-bottom: 8px;
  }
  h1 {
    font-size: clamp(1.375rem, 6.2vw, 2rem);
    margin-block: 16px;
  }
  h1 span {
    white-space: nowrap;
  }
  h1 em {
    font-size: 1rem;
    margin-block: 4px;
  }
  .hero-keepsake {
    padding: 3px;
  }
  .hero-scroll {
    margin-top: 16px;
  }
  .hero-date {
    font-size: 1.5rem;
    bottom: 20px;
  }
}
</style>
