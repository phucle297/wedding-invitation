<script setup lang="ts">
import { computed, nextTick, ref, watch } from "vue";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { album, memories } from "./content";
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
  <section class="block memories-block" aria-labelledby="memories-title">
    <div class="album-heading">
      <p class="eyebrow">Những điều bình dị</p>
      <h2 id="memories-title">Trước ngày chung đôi</h2>
      <p class="lead">Một vài mảnh ghép từ những ngày của chúng mình.</p>
      <span class="fine-rule" aria-hidden="true"></span>
    </div>
    <div class="memories-grid">
      <button
        v-for="memory in memories"
        :key="memory.src"
        class="memory-shot"
        type="button"
        @click="lightbox?.open(memory)"
      >
        <img
          :src="memory.src"
          :alt="memory.alt"
          :width="memory.width"
          :height="memory.height"
          loading="lazy"
          decoding="async"
        />
        <span class="photo-zoom" aria-hidden="true">↗</span>
      </button>
    </div>
  </section>
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
.memories-block {
  background: var(--cream);
}
.memories-block .eyebrow {
  margin-bottom: 18px;
}
.memories-grid {
  display: grid;
  grid-template-columns: 1fr 1.35fr;
  align-items: start;
  gap: 20px;
  max-width: 1000px;
  margin-inline: auto;
}
.memory-shot {
  position: relative;
  padding: 8px;
  border: 1px solid var(--line);
  background: var(--paper);
  cursor: zoom-in;
}
.memory-shot:first-child {
  grid-row: span 2;
  align-self: center;
}
.memory-shot img {
  display: block;
  width: 100%;
  height: auto;
}
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
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  align-items: start;
  gap: 10px;
  scroll-margin-top: 110px;
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
@media (max-width: 759px) {
  .memories-grid {
    grid-template-columns: 1fr;
    gap: 24px;
  }
  .memory-shot:first-child {
    grid-row: auto;
    width: 78%;
    justify-self: center;
  }
}
</style>
