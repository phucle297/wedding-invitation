<script setup lang="ts">
import { couple } from "../../content/couple";
import { date } from "../../content/date";
import { phrases } from "../../content/phrases";
</script>

<template>
  <div class="closing-spread">
    <figure class="photo-interlude closing-photo">
      <img
        src="/assets/album/09.jpg"
        alt="Duy Phúc và Linh Đan bên nhau dưới lớp voan"
        width="1067"
        height="1600"
        loading="lazy"
      />
    </figure>
    <section class="thanks" aria-labelledby="thanks-title">
      <p class="eyebrow">Vì có bạn, ngày vui thêm trọn vẹn</p>
      <h2 id="thanks-title" lang="en">Thank you!</h2>
      <p>
        Sự hiện diện của bạn là niềm vui<br />và vinh hạnh của hai gia đình.
      </p>
      <span class="thanks-signature">Hẹn gặp bạn trong ngày trọng đại!</span>
    </section>
  </div>
  <footer class="colophon">
    <a class="footer-names" href="#mo-dau"
      >{{ couple.groom.short }} <em>&amp;</em> {{ couple.bride.short }}</a
    >
    <p>
      {{ phrases.footerPlace }} <span aria-hidden="true">·</span>
      {{ date.display }}
    </p>
  </footer>
</template>

<style scoped>
.closing-photo {
  aspect-ratio: 0.85;
}
.thanks {
  padding: 70px 24px;
  text-align: center;
}
.thanks h2 {
  font: 5.5rem var(--script);
  margin: 22px 0;
}
.thanks > p:not(.eyebrow) {
  color: var(--ink-soft);
  font: 1.3rem/1.7 var(--display);
}
.thanks-signature {
  display: block;
  margin-top: 30px;
  color: var(--bronze);
  font-family: var(--script-vi);
  font-size: 1.8rem;
}
.colophon {
  position: relative;
  isolation: isolate;
  text-align: center;
  padding: 44px 24px;
  color: var(--ink);
  background: var(--champagne);
  border-top: 1px solid var(--line);
}
.colophon::before {
  position: absolute;
  content: "";
  inset: 0;
  opacity: 0.13;
  z-index: -1;
  background-image: var(--paper-grain);
  pointer-events: none;
}
.footer-names {
  color: inherit;
  font-family: var(--display);
  font-size: 2.2rem;
  text-decoration: none;
}
.footer-names em {
  color: var(--bronze);
}
.colophon p {
  color: var(--ink-soft);
  font-size: 0.8rem;
  letter-spacing: 0.06em;
  margin: 12px 0 24px;
}
.colophon p span {
  margin: 0 12px;
}
@media (max-width: 759px) {
  .thanks {
    padding-block: 60px;
  }
  .thanks .eyebrow {
    font-size: 0.62rem;
  }
}
</style>
