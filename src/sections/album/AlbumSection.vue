<script setup lang="ts">
import { computed, nextTick, ref, watch } from "vue";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { albumSrcset } from "../../content/images";
import { album } from "./content";
import PhotoLightbox from "./PhotoLightbox.vue";
import LazyImage from "../../components/LazyImage.vue";

const props = defineProps({
  entered: { type: Boolean, default: false },
});
const opened = ref(false);
const albumSection = ref<HTMLElement | null>(null);
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
        gsap.from(shot.querySelector(".shot-content"), {
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
  if (opened.value) {
    // Let the gallery's post-render animation setup finish before scrolling.
    await new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));
    albumSection.value?.scrollIntoView({
      block: "start",
      behavior: "smooth",
    });
  } else {
    toggle.value?.focus({ preventScroll: true });
    gallery.value?.scrollIntoView({ block: "start" });
  }
}

function openPhoto(index: number, event: MouseEvent) {
  if (event.currentTarget instanceof HTMLButtonElement) {
    lightbox.value?.open(index, event.currentTarget);
  }
}
</script>

<template>
  <figure class="photo-interlude album-cover">
    <LazyImage
      fill
      src="/assets/album/album-cover.webp"
      :srcset="albumSrcset('/assets/album/album-cover.webp', 1920)"
      sizes="auto, (min-width: 1024px) 100vw, (min-width: 720px) 720px, 100vw"
      alt="Linh Đan và Duy Phúc trong khu vườn xanh"
      width="1600"
      height="900"
      loading="lazy"
      decoding="async"
    />
    <figcaption lang="en">Our memories</figcaption>
  </figure>
  <section ref="albumSection" class="block album-block" id="anh" aria-labelledby="photo-title">
    <div class="album-heading">
      <h2 id="photo-title">{{ album.title }}</h2>
      <span class="fine-rule" aria-hidden="true"></span>
    </div>
    <div
      id="wedding-gallery"
      ref="gallery"
      class="gallery"
      :class="{ 'is-open': opened }"
    >
      <button
        v-for="(photo, index) in photos"
        :key="photo.src"
        class="shot"
        :class="{ 'shot-cover': photo.width > photo.height }"
        type="button"
        aria-haspopup="dialog"
        :aria-label="`Mở ảnh ${index + 1}: ${photo.alt}`"
        @click="openPhoto(index, $event)"
      >
        <span class="shot-content">
          <LazyImage
            :src="photo.src"
            :srcset="albumSrcset(photo.src, photo.width > photo.height ? 960 : 640)"
            sizes="auto, (min-width: 1392px) 635px, (min-width: 1024px) calc((100vw - 122px) / 2), (min-width: 720px) 313px, calc((100vw - 58px) / 2)"
            :alt="photo.alt"
            :width="photo.width"
            :height="photo.height"
            loading="lazy"
            decoding="async"
          />
          <span class="photo-zoom" aria-hidden="true">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" focusable="false">
              <path d="M7 17 17 7M7 7h10v10" />
            </svg>
          </span>
        </span>
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
      {{ opened ? "Thu gọn album" : "Xem tất cả ảnh" }}
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">
        <path :d="opened ? 'M7 12h10' : 'M7 17 17 7M7 7h10v10'" />
      </svg>
    </button>
    <PhotoLightbox ref="lightbox" :photos="album.photos" />
  </section>
</template>

<style scoped>
.album-cover {
  width: 100%;
  aspect-ratio: 16 / 9;
  max-height: 900px;
}
.album-cover :deep(img) {
  height: 100%;
  object-fit: cover;
}
.album-heading {
  text-align: center;
  margin-bottom: 40px;
}
.gallery {
  columns: 2;
  column-gap: 10px;
  scroll-margin-top: 110px;
}
.shot {
  appearance: none;
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
  touch-action: manipulation;
}
.shot-content {
  display: block;
  position: relative;
  pointer-events: none;
}
.shot :deep(img) {
  display: block;
  width: 100%;
  height: auto;
  object-fit: contain;
}
.shot-cover :deep(img) {
  aspect-ratio: 2 / 3;
  object-fit: cover;
  object-position: 60% center;
}
.photo-zoom {
  position: absolute;
  bottom: 12px;
  right: 12px;
  width: 44px;
  height: 44px;
  display: grid;
  place-items: center;
  background: #ffffffed;
  color: var(--ink);
}
.album-toggle {
  display: flex;
  gap: 26px;
  margin: 32px auto 0;
}
.album-toggle svg {
  flex-shrink: 0;
}
</style>
