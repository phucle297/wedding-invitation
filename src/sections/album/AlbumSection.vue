<script setup lang="ts">
import { computed, nextTick, ref, watch } from "vue";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { album } from "./content";
import PhotoLightbox from "./PhotoLightbox.vue";

const props = defineProps({
  entered: { type: Boolean, default: false },
});
const opened = ref(false);
const gallery = ref<HTMLElement | null>(null);
const toggle = ref<HTMLButtonElement | null>(null);
const lightbox = ref<InstanceType<typeof PhotoLightbox> | null>(null);
const photos = computed(() =>
  opened.value ? album.photos : album.photos.slice(0, 4),
);

watch(
  [() => props.entered, opened],
  async ([active], _, onCleanup) => {
    let cancelled = false;
    const context = gsap.context(() => {});
    onCleanup(() => {
      cancelled = true;
      context.revert();
    });
    if (!active) return;
    await nextTick();
    if (cancelled || !gallery.value) return;

    context.add(() => {
      gallery.value?.querySelectorAll(".shot").forEach((shot, index) => {
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
      ScrollTrigger.refresh();
    });
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
      src="/assets/album/album-cover.jpg"
      srcset="/assets/album/11.jpg 1600w, /assets/album/album-cover.jpg 3200w"
      sizes="(min-width: 1024px) 100vw, (min-width: 720px) 720px, 100vw"
      alt="Duy Phúc và Linh Đan trong khu vườn xanh"
      width="3200"
      height="2133"
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
  aspect-ratio: 1.1;
}
.album-heading {
  text-align: center;
  margin-bottom: 40px;
}
.album-heading .lead {
  font-size: 0.85rem;
}
.gallery {
  columns: 2;
  column-gap: 10px;
  scroll-margin-top: 110px;
}
.shot {
  display: block;
  width: 100%;
  margin-bottom: 10px;
  break-inside: avoid;
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
  height: auto;
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
</style>
