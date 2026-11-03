<script setup>
import { families } from "../families/content.js";
import { date } from "../../content/date.js";
import CallaSprig from "../../components/CallaSprig.vue";
</script>

<template>
  <section class="block letter" id="loi-ngo" aria-labelledby="letter-title">
    <div class="stationery" aria-hidden="true">
      <CallaSprig class="letter-botanical" />
      <div class="paper-envelope">
        <div class="envelope-lining"></div>
        <img
          class="keepsake-photo"
          src="/assets/album/02.jpg"
          alt=""
          width="1067"
          height="1600"
          loading="lazy"
        />
        <div class="envelope-pocket"></div>
        <span class="wax-seal">P<span>&amp;</span>Đ</span>
      </div>
      <div class="photo-strip">
        <img
          v-for="image in ['09', '10', '11']"
          :key="image"
          :src="`/assets/album/${image}.jpg`"
          alt=""
          loading="lazy"
          width="1067"
          height="1600"
        />
      </div>
      <div class="date-tag">
        <span>{{ String(date.markedDay).padStart(2, "0") }}</span
        ><small>THÁNG {{ date.month }}</small
        ><span>{{ date.year }}</span
        ><i></i>
      </div>
    </div>
    <div class="letter-copy">
      <p class="eyebrow">Gửi bạn, một lời mời</p>
      <h2 id="letter-title">Save the date</h2>
      <blockquote>{{ families.letter }}</blockquote>
      <p class="letter-date">{{ date.weekday }} · {{ date.display }}</p>
    </div>
  </section>
</template>

<style scoped>
.letter {
  text-align: center;
}
.stationery {
  position: relative;
  height: 640px;
  max-width: 550px;
  margin: 0 auto 30px;
}
.letter-botanical {
  position: absolute;
  width: 34%;
  height: 75%;
  left: 0;
  top: 0;
  opacity: 0.55;
  transform: rotate(-23deg);
}
.paper-envelope {
  position: absolute;
  width: 64%;
  height: 48%;
  left: 25%;
  top: 35%;
  transform: rotate(10deg);
  filter: drop-shadow(2px 12px 12px #40372524);
}
.envelope-lining {
  position: absolute;
  inset: -30% 0 0;
  background: #c9c9c2;
  clip-path: polygon(0 30%, 50% 0, 100% 30%, 100% 100%, 0 100%);
}
.keepsake-photo {
  position: absolute;
  width: 79%;
  height: 108%;
  left: 11%;
  bottom: 22%;
  object-fit: cover;
  border: 9px solid #ffffff;
  transform: rotate(-5deg);
}
.envelope-pocket {
  position: absolute;
  inset: 0;
  background: linear-gradient(145deg, #f2f2ee, #d6d6ce);
  clip-path: polygon(0 0, 50% 48%, 100% 0, 100% 100%, 0 100%);
}
.envelope-pocket::after {
  content: "";
  position: absolute;
  inset: 0;
  background: linear-gradient(20deg, #fafaf8, #e2e2db);
  clip-path: polygon(0 100%, 50% 48%, 100% 100%);
}
.wax-seal {
  position: absolute;
  left: 43%;
  top: 44%;
  display: grid;
  place-content: center;
  width: 52px;
  height: 52px;
  border-radius: 50%;
  background: #8c8a7e;
  color: #ffffff;
  box-shadow:
    inset 0 0 0 4px #b8b6a9,
    1px 3px 5px #45453f33;
  font: 1.3rem var(--display);
}
.wax-seal span {
  display: none;
}
.photo-strip {
  position: absolute;
  left: 4%;
  top: 42%;
  width: 23%;
  padding: 7px;
  background: #ffffff;
  transform: rotate(-14deg);
  box-shadow: 2px 5px 12px #40372526;
}
.photo-strip img {
  display: block;
  width: 100%;
  aspect-ratio: 1;
  object-fit: cover;
  margin-bottom: 6px;
}
.photo-strip img:last-child {
  margin: 0;
}
.date-tag {
  position: absolute;
  width: 26%;
  right: 4%;
  bottom: 1%;
  padding: 20px 4px;
  background: #ffffff;
  border-radius: 40px 40px 30px 30px;
  border: 1px solid #b8b7ae;
  outline: 4px solid #ffffff;
  text-align: center;
  box-shadow: 4px 8px 8px #45453f1a;
  transform: rotate(7deg);
  color: var(--ink-soft);
}
.date-tag span {
  display: block;
  font: 2.5rem/1.1 var(--display);
}
.date-tag small {
  font-size: 0.6rem;
  letter-spacing: 0.1em;
}
.date-tag i {
  display: block;
  width: 36px;
  height: 70px;
  background: repeating-linear-gradient(90deg, #b0aea1 0 1px, #e8e7e0 1px 3px);
  clip-path: polygon(45% 0, 55% 0, 65% 65%, 100% 100%, 0 100%, 35% 65%);
  margin: 12px auto -85px;
}
.letter h2 {
  margin-block: 16px;
}
blockquote {
  font-family: var(--display);
  font-size: 1.5rem;
  line-height: 1.6;
  max-width: 27em;
  margin: 20px auto;
}
.letter-date {
  font-size: 0.72rem;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: var(--ink-soft);
}
@media (max-width: 600px) {
  .stationery {
    height: 112vw;
    max-height: 600px;
    margin-bottom: 46px;
  }
  .keepsake-photo {
    border-width: 5px;
  }
  .wax-seal {
    width: 34px;
    height: 34px;
    font-size: 1rem;
  }
  .date-tag {
    padding: 15px 2px;
  }
  .date-tag span {
    font-size: 1.8rem;
  }
  .date-tag small {
    font-size: 0.5rem;
  }
  blockquote {
    font-size: 1.3rem;
  }
}
</style>
