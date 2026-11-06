<script setup lang="ts">
import { nextTick, onBeforeUnmount, ref, watch } from "vue";
import emblaCarouselVue from "embla-carousel-vue";
import { phrases } from "../../content/phrases";
import type { AlbumPhoto } from "./content";

const props = defineProps<{ photos: AlbumPhoto[] }>();
const dialog = ref<HTMLDialogElement | null>(null);
const closeButton = ref<HTMLButtonElement | null>(null);
const active = ref(false);
const selected = ref(0);
const [viewport, carousel] = emblaCarouselVue({ loop: true, watchFocus: false });
let opener: HTMLButtonElement | null = null;
let previousOverflow: string | null = null;
let scrollPosition = { top: 0, left: 0 };

function goTo(index: number) {
  carousel.value?.scrollTo(index, window.matchMedia("(prefers-reduced-motion: reduce)").matches);
}

watch(carousel, (api) => {
  api?.on("select", () => {
    selected.value = api.selectedScrollSnap();
  });
});

async function open(index: number, trigger: HTMLButtonElement) {
  if (active.value || !props.photos[index] || !dialog.value) return;
  opener = trigger;
  selected.value = index;
  active.value = true;
  scrollPosition = { top: window.scrollY, left: window.scrollX };
  await nextTick();
  if (!active.value || !dialog.value) return;
  dialog.value.showModal();
  previousOverflow = document.documentElement.style.overflow;
  document.documentElement.style.overflow = "hidden";
  // A closed dialog has no width. Measure Embla only after it becomes visible.
  carousel.value?.reInit({ startIndex: index });
  carousel.value?.scrollTo(index, true);
  closeButton.value?.focus({ preventScroll: true });
}

function close() {
  dialog.value?.close();
}

function restorePage() {
  if (previousOverflow === null) return;
  document.documentElement.style.overflow = previousOverflow;
  previousOverflow = null;
  opener?.focus({ preventScroll: true });
  window.scrollTo({ ...scrollPosition, behavior: "instant" });
}

function onClose() {
  active.value = false;
  restorePage();
}

function onBackdrop(event: MouseEvent) {
  if (!event.defaultPrevented && event.target instanceof Element &&
    !event.target.closest("button, img")) close();
}

function previous() {
  carousel.value?.scrollPrev(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
}

function next() {
  carousel.value?.scrollNext(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
}

onBeforeUnmount(restorePage);
defineExpose({ open });
</script>

<template>
  <Teleport to="body">
    <dialog
      ref="dialog"
      class="lightbox"
      aria-label="Album ảnh cưới"
      @click="onBackdrop"
      @close="onClose"
      @keydown.left.prevent="previous"
      @keydown.right.prevent="next"
    >
      <div class="light-toolbar">
        <span>Album ảnh cưới</span>
        <button ref="closeButton" class="light-close" type="button" @click="close">
          {{ phrases.closePhoto }}<span aria-hidden="true">×</span>
        </button>
      </div>
      <div ref="viewport" class="light-viewport" aria-roledescription="carousel" aria-label="Ảnh cưới">
        <div class="light-track">
          <div
            v-for="(photo, index) in photos"
            :key="photo.src"
            class="light-slide"
            role="group"
            aria-roledescription="ảnh"
            :aria-label="`${index + 1} / ${photos.length}`"
            :aria-hidden="index !== selected"
          >
            <img
              v-if="active"
              :src="photo.src"
              :alt="photo.alt"
              :width="photo.width"
              :height="photo.height"
              :loading="index === selected ? 'eager' : 'lazy'"
              decoding="async"
              draggable="false"
            />
          </div>
        </div>
      </div>
      <div class="light-controls">
        <button class="light-arrow" type="button" aria-label="Ảnh trước" @click="previous">
          <span aria-hidden="true">←</span>
        </button>
        <div class="light-indicators" role="group" aria-label="Chọn ảnh">
          <button
            v-for="(photo, index) in photos"
            :key="photo.src"
            class="light-dot"
            type="button"
            :class="{ 'is-selected': index === selected }"
            :aria-current="index === selected ? 'step' : undefined"
            :aria-label="`Xem ảnh ${index + 1}`"
            @click="goTo(index)"
          ></button>
        </div>
        <button class="light-arrow" type="button" aria-label="Ảnh tiếp theo" @click="next">
          <span aria-hidden="true">→</span>
        </button>
      </div>
    </dialog>
  </Teleport>
</template>

<style scoped>
.lightbox {
  position: fixed;
  inset: 0;
  width: 100%;
  height: 100dvh;
  max-width: none;
  max-height: none;
  margin: 0;
  border: 0;
  padding: max(12px, env(safe-area-inset-top)) max(16px, env(safe-area-inset-right)) max(16px, env(safe-area-inset-bottom)) max(16px, env(safe-area-inset-left));
  color: #f6f0e6;
  background: transparent;
  overscroll-behavior: contain;
}
.lightbox[open] {
  display: grid;
  grid-template-rows: auto minmax(0, 1fr) auto;
  gap: 12px;
}
.lightbox::backdrop {
  background: #18120eb3;
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
}
.light-toolbar,
.light-controls {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  width: min(100%, 1100px);
  margin-inline: auto;
}
.light-toolbar { font-size: 1rem; }
.lightbox button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex: none;
  min-width: 48px;
  min-height: 48px;
  padding: 8px 14px;
  border: 1px solid #f6f0e655;
  border-radius: 4px;
  background: #ffffff0d;
  color: inherit;
  font-size: 1rem;
  cursor: pointer;
  touch-action: manipulation;
}
.lightbox button:hover { background: #ffffff24; }
.lightbox button:focus-visible { outline: 2px solid #f6f0e6; outline-offset: 3px; }
.light-close { gap: 12px; }
.light-close span { font-size: 1.6rem; line-height: 1; }
.light-viewport {
  min-width: 0;
  min-height: 0;
  overflow: hidden;
  touch-action: pan-y pinch-zoom;
}
.light-track {
  display: flex;
  gap: clamp(16px, 2vw, 32px);
  height: 100%;
}
.light-slide {
  display: grid;
  place-items: center;
  flex: 0 0 100%;
  min-width: 0;
  min-height: 0;
  height: 100%;
}
.light-slide img {
  display: block;
  width: auto;
  height: auto;
  min-height: 0;
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
  user-select: none;
  -webkit-user-drag: none;
}
.light-arrow span { font-size: 1.5rem; }
.light-indicators {
  display: flex;
  justify-content: center;
}
.lightbox .light-dot,
.lightbox .light-dot:hover {
  min-width: 16px;
  width: 16px;
  min-height: 32px;
  padding: 4px;
  border: 0;
  background: none;
  transition: all 0.3s ease;
}
.light-dot::before {
  content: "";
  width: 8px;
  height: 8px;
  border-radius: 999px;
  background: #fff;
  opacity: 0.2;
  transition: all 0.3s ease;
}
.light-dot:hover::before { opacity: 0.6; }
.lightbox .light-dot.is-selected {
  min-width: 32px;
  width: 32px;
}
.light-dot.is-selected::before {
  width: 24px;
  background: #e4bc70;
  opacity: 1;
}
@media (max-width: 600px) {
  .light-controls { flex-wrap: wrap; gap: 4px; }
  .light-arrow:last-child { margin-left: auto; }
  .light-indicators { order: 1; width: 100%; }
  .lightbox .light-dot,
  .lightbox .light-dot:hover { min-width: 14px; width: 14px; padding-inline: 3px; }
  .lightbox .light-dot.is-selected { min-width: 30px; width: 30px; }
}
@media (prefers-reduced-motion: reduce) {
  .lightbox .light-dot,
  .lightbox .light-dot:hover,
  .light-dot::before {
    transition: none;
  }
}
</style>
