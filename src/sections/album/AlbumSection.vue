<script setup>
import { computed, nextTick, ref, watch } from "vue";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { album } from "./content.js";
import PhotoLightbox from "./PhotoLightbox.vue";

const props = defineProps({
  entered: { type: Boolean, default: false },
});
const opened = ref(false);
const gallery = ref(null);
const toggle = ref(null);
const lightbox = ref(null);
const photos = computed(() =>
  opened.value ? album.photos : album.photos.slice(0, 4),
);

watch(
  [() => props.entered, opened],
  async ([active], _, onCleanup) => {
    let cancelled = false;
    const media = gsap.matchMedia();
    onCleanup(() => {
      cancelled = true;
      media.revert();
    });
    if (!active) return;
    await nextTick();
    if (cancelled || !gallery.value) return;

    media.add(
      {
        reduced: "(prefers-reduced-motion: reduce)",
        normal: "(prefers-reduced-motion: no-preference)",
      },
      (context) => {
        if (!context.conditions.reduced) {
          gallery.value.querySelectorAll(".shot").forEach((shot, index) => {
            gsap.from(shot, {
              y: index % 2 ? 28 : -18,
              rotation: index % 2 ? 2 : -2,
              opacity: 0,
              delay: (index % 3) * 0.1,
              duration: 0.9,
              ease: "power2.out",
              scrollTrigger: {
                trigger: shot,
                start: "top 92%",
                end: "top 55%",
                scrub: 0.6,
              },
            });
          });
        }
        ScrollTrigger.refresh();
      },
      gallery.value,
    );
  },
  { immediate: true, flush: "post" },
);

async function toggleAlbum() {
  opened.value = !opened.value;
  await nextTick();
  ScrollTrigger.refresh();
  if (!opened.value) {
    toggle.value?.focus({ preventScroll: true });
    gallery.value?.scrollIntoView({ block: "start" });
  }
}
</script>

<template>
  <figure class="photo-interlude album-cover">
    <img
      src="/assets/album/11.jpg"
      alt="Duy Phúc và Linh Đan trong khu vườn xanh"
      width="1600"
      height="1067"
      loading="lazy"
    />
    <figcaption lang="en">Our memories</figcaption>
  </figure>
  <section class="block album-block" id="anh" aria-labelledby="photo-title">
    <div class="album-heading">
      <h2 id="photo-title">{{ album.title }}</h2>
      <p class="lead">Những khoảnh khắc đáng nhớ.</p>
      <span class="fine-rule" aria-hidden="true"></span>
    </div>
    <div
      id="wedding-gallery"
      ref="gallery"
      class="gallery"
      :class="{ 'is-open': opened }"
    >
      <button
        v-for="photo in photos"
        :key="photo.src"
        class="shot"
        type="button"
        @click="lightbox?.open(photo)"
      >
        <img
          :src="photo.src"
          :alt="photo.alt"
          :width="photo.width"
          :height="photo.height"
          loading="lazy"
          decoding="async"
        />
        <span class="photo-zoom" aria-hidden="true">↗</span>
      </button>
    </div>
    <button
      ref="toggle"
      class="btn btn-ink album-toggle"
      type="button"
      :aria-expanded="opened"
      aria-controls="wedding-gallery"
      @click="toggleAlbum"
    >
      {{ opened ? "Thu gọn album" : `Xem đủ ${album.photos.length} ảnh` }}
      <span aria-hidden="true">{{ opened ? "−" : "↗" }}</span>
    </button>
    <PhotoLightbox ref="lightbox" />
  </section>
</template>

<style scoped>
.album-cover {
  aspect-ratio: 1.6;
}
.album-heading {
  text-align: center;
  margin-bottom: 40px;
}
.album-heading .lead {
  font-size: 0.85rem;
}
.gallery {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 10px;
  scroll-margin-top: 110px;
}
.gallery:not(.is-open) {
  grid-template-rows: repeat(3, 180px);
}
.gallery:not(.is-open) .shot:nth-child(1) {
  grid-area: 1/1/2/2;
  border-radius: 75px 0 0 0;
}
.gallery:not(.is-open) .shot:nth-child(2) {
  grid-area: 1/2/3/3;
  border-radius: 0 100px 0 0;
}
.gallery:not(.is-open) .shot:nth-child(3) {
  grid-area: 2/1/4/2;
  border-radius: 0 0 100px 100px;
}
.gallery:not(.is-open) .shot:nth-child(4) {
  grid-area: 3/2/4/3;
  border-radius: 0 0 65px 0;
}
.shot {
  position: relative;
  padding: 0;
  border: 0;
  background: #e7e7e2;
  overflow: hidden;
  cursor: zoom-in;
}
.shot img {
  display: block;
  width: 100%;
  height: 100%;
  aspect-ratio: 3/4;
  object-fit: cover;
  transition: transform 0.6s ease;
}
.photo-zoom {
  position: absolute;
  bottom: 12px;
  right: 12px;
  width: 30px;
  height: 30px;
  display: grid;
  place-items: center;
  background: #ffffffed;
}
.album-toggle {
  display: flex;
  gap: 26px;
  margin: 32px auto 0;
}
@media (hover: hover) {
  .shot:hover img {
    transform: scale(1.04);
  }
}
@media (max-width: 759px) {
  .gallery:not(.is-open) {
    grid-template-rows: repeat(3, 125px);
  }
}
</style>
