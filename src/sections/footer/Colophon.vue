<script setup lang="ts">
import { couple } from "../../content/couple";
import { date } from "../../content/date";
import { albumSrcset } from "../../content/images";
import { phrases } from "../../content/phrases";
import LazyImage from "../../components/LazyImage.vue";
</script>

<template>
  <div class="closing-spread">
    <figure class="photo-interlude closing-photo">
      <LazyImage
        fill
        src="/assets/album/09.webp"
        :srcset="albumSrcset('/assets/album/09.webp')"
        sizes="auto, (min-width: 1024px) 50vw, (min-width: 720px) 720px, 100vw"
        alt="Linh Đan và Duy Phúc bên nhau dưới lớp voan"
        width="1067"
        height="1600"
        loading="lazy"
        decoding="async"
      />
    </figure>
    <section class="thanks" aria-labelledby="thanks-title">
      <p class="eyebrow">Vì có bạn, ngày vui thêm trọn vẹn</p>
      <h2 id="thanks-title" lang="en">Thank you!</h2>
      <p>
        Cảm ơn bạn đã cùng chúng mình<br />viết nên một kỷ niệm thật đẹp.
      </p>
      <span class="thanks-signature">Hẹn gặp bạn trong ngày trọng đại!</span>
    </section>
  </div>
  <footer class="colophon">
    <a class="footer-names" href="#mo-dau">
      <span>{{ couple.bride.short }} <em>&amp;</em></span>
      <span>{{ couple.groom.short }}</span>
    </a>
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
  display: flex;
  flex-direction: column;
  justify-content: center;
  min-height: 520px;
  padding: 70px 24px;
  text-align: center;
}
.thanks h2 {
  font: var(--text-display)/1.2 var(--script);
  margin: 22px 0;
}
.thanks > p:not(.eyebrow) {
  color: var(--ink-soft);
  font: var(--text-detail)/1.7 var(--display);
}
.thanks-signature {
  display: block;
  margin-top: 30px;
  color: var(--bronze);
  font-family: var(--script-vi);
  font-size: var(--text-script);
}
.colophon {
  position: relative;
  isolation: isolate;
  container-type: inline-size;
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
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  column-gap: 0.32em;
  row-gap: 0.04em;
  color: inherit;
  font-family: var(--heading);
  text-transform: uppercase;
  /* Fit "LINH ĐAN & DUY PHÚC" on one line. Below the floor, wrap before the next name. */
  font-size: clamp(1.5rem, calc(100cqi / 11.2), 2.2rem);
  line-height: 1.15;
  text-decoration: none;
}
.footer-names span {
  white-space: nowrap;
}
.footer-names em {
  color: var(--bronze);
}
.colophon p {
  color: var(--ink-soft);
  font-size: var(--text-small);
  letter-spacing: 0.02em;
  margin: 12px 0 24px;
  white-space: nowrap;
}
.colophon p span {
  margin: 0 12px;
}
@media (max-width: 759px) {
  .thanks {
    padding-block: 60px;
  }
}
@media (max-width: 600px) {
  .thanks {
    min-height: 420px;
    padding-block: 48px;
  }
}
</style>
