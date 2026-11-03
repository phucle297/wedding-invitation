<script setup>
import { couple } from "../../content/couple.js";
import CallaSprig from "../../components/CallaSprig.vue";

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
    text: "Không chỉ là một khoảnh khắc. Là những ngày có nhau.",
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
    </div>
    <div class="portraits">
      <figure>
        <div class="portrait-frame groom-portrait">
          <img
            src="/assets/album/13.jpg"
            alt="Chú rể Duy Phúc"
            width="1067"
            height="1600"
            loading="lazy"
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
          <img
            src="/assets/album/13.jpg"
            alt="Cô dâu Linh Đan"
            width="1067"
            height="1600"
            loading="lazy"
          />
        </div>
        <figcaption>
          <span>{{ couple.bride.short }}</span
          ><small>{{ couple.bride.full }}</small
          ><em>{{ couple.bride.role }}</em>
        </figcaption>
      </figure>
      <CallaSprig class="couple-botanical" />
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
          <img
            :src="`/assets/album/${scene.image}.jpg`"
            :alt="scene.alt"
            width="1067"
            height="1600"
            loading="lazy"
          />
        </figure>
        <span class="journey-dot" aria-hidden="true"></span>
        <div class="journey-copy">
          <h3>{{ scene.title }}</h3>
          <p>{{ scene.text }}</p>
        </div>
      </article>
    </div>
  </section>

  <section class="block vow" aria-labelledby="vow-title">
    <p class="eyebrow" id="vow-title">Lời hẹn</p>
    <blockquote aria-label="“Cùng nhau, đi tiếp những ngày đẹp nhất.”">
      <span class="vow-line" aria-hidden="true">
        <span class="vow-word">“Cùng</span> <span class="vow-word">nhau,</span>{{ " " }}
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
  font-size: 0.8rem;
}
.couple-section {
  position: relative;
  color: var(--ink);
  background-color: var(--champagne);
  background-image:
    var(--paper-grain), linear-gradient(125deg, var(--cream), var(--champagne));
}
.couple-section .eyebrow,
.couple-section h2 {
  color: inherit;
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
.portrait-frame img {
  position: absolute;
  width: 200%;
  max-width: none;
  height: 148%;
  object-fit: cover;
  top: -12%;
}
.groom-portrait img {
  left: -38%;
}
.bride-portrait img {
  left: -87%;
}
figcaption {
  text-align: center;
  margin-top: 18px;
}
figcaption span {
  display: block;
  font: 1.8rem var(--display);
  text-transform: uppercase;
}
figcaption small {
  display: block;
  font-size: 0.7rem;
  margin-top: 4px;
}
figcaption em {
  display: block;
  font: 2rem var(--script-vi);
  margin-top: 5px;
}
.couple-botanical {
  position: absolute;
  width: 24%;
  height: 44%;
  left: 38%;
  bottom: 28%;
  filter: drop-shadow(0 2px 4px #30282033);
  transform: rotate(-20deg);
}
.journey {
  padding: 78px 42px 36px;
  scroll-margin-top: 90px;
}
.journey h2 {
  font: 3.5rem/1.15 var(--script-vi);
  margin: 16px 0;
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
  margin: 0;
  aspect-ratio: 0.8;
  overflow: hidden;
  border-radius: 100px 100px 0 0;
  background: #e7e7e2;
}
.journey-scene:nth-of-type(even) .journey-frame {
  border-radius: 0 0 100px 100px;
}
.journey-frame img {
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
.journey-copy h3 {
  font: 2rem/1.15 var(--script-vi);
  margin: 0 0 16px;
}
.journey-copy p {
  color: var(--ink-soft);
  line-height: 1.9;
  margin: 0;
  font-size: 0.8rem;
}
.vow {
  text-align: center;
  border-block: 1px solid var(--line);
}
.vow blockquote {
  font: 2.8rem/1.4 var(--script-vi);
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
  figcaption span {
    font-size: 1.25rem;
  }
  figcaption small {
    font-size: 0.65rem;
  }
  figcaption em {
    font-size: 1.5rem;
  }
  .journey {
    padding: 60px 24px 30px;
  }
  .journey h2 {
    font-size: 2.9rem;
  }
  .journey-scene {
    display: flex;
    flex-direction: column;
    gap: 24px;
    align-items: stretch;
    padding: 24px 0 32px 32px;
  }
  .journey-frame {
    aspect-ratio: 1;
  }
  .journey-dot {
    top: 50px;
  }
  .journey-copy h3 {
    font-size: 2.1rem;
    margin-bottom: 10px;
  }
  .journey-copy p {
    font-size: 0.9rem;
  }
  .vow blockquote {
    font-size: 2.1rem;
  }
}
</style>
