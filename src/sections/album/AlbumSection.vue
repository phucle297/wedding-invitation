<script setup>
import { ref } from "vue";
import { couple } from "../../content/couple.js";
import { album } from "./content.js";
import PhotoLightbox from "./PhotoLightbox.vue";

const opened = ref(false);
const lightbox = ref(null);

const spots = [
  { x: "22%", y: "16%", r: "-8deg" },
  { x: "50%", y: "11%", r: "3deg" },
  { x: "78%", y: "18%", r: "7deg" },
  { x: "20%", y: "68%", r: "6deg" },
  { x: "50%", y: "76%", r: "-4deg" },
  { x: "80%", y: "66%", r: "5deg" },
];

const names = `${couple.groom.short} & ${couple.bride.short}`;
const bookPhotos = album.photos.slice(0, 6);
const morePhotos = album.photos.slice(6);

function openBook() {
  opened.value = true;
}

function openPhoto(photo) {
  lightbox.value?.open(photo);
}
</script>

<template>
  <section class="block album-block" id="anh" aria-labelledby="photo-title">
    <h2 id="photo-title">{{ album.title }}</h2>
    <p class="lead">{{ album.lead }}</p>
    <div class="stage" :class="{ 'is-open': opened }">
      <button
        class="book"
        type="button"
        :aria-expanded="opened"
        :aria-label="album.openLabel"
        :tabindex="opened ? -1 : 0"
        @click="openBook"
      >
        <span class="pages" aria-hidden="true"></span>
        <span class="cover">
          <span class="cover-face cover-front">
            <span class="cover-xi">囍</span>
            <span class="cover-title">{{ album.cover }}</span>
            <span class="cover-names">{{ names }}</span>
            <span class="cover-hint">{{ album.hint }}</span>
          </span>
          <span class="cover-face cover-inside"></span>
        </span>
      </button>
      <button
        v-for="(photo, index) in bookPhotos"
        :key="photo.src"
        class="print"
        type="button"
        :style="{
          '--x': spots[index % spots.length].x,
          '--y': spots[index % spots.length].y,
          '--r': spots[index % spots.length].r,
          '--i': index,
        }"
        :tabindex="opened ? 0 : -1"
        :aria-hidden="opened ? 'false' : 'true'"
        @click="opened && openPhoto(photo)"
      >
        <img :src="photo.src" :alt="photo.alt" :width="photo.width" :height="photo.height">
      </button>
    </div>
    <div class="gallery" :class="{ 'is-open': opened }" :aria-hidden="opened ? 'false' : 'true'">
      <button
        v-for="(photo, index) in morePhotos"
        :key="photo.src"
        class="shot"
        type="button"
        :style="{ '--i': index, '--tilt': index % 2 ? '1.5deg' : '-1.5deg' }"
        :tabindex="opened ? 0 : -1"
        @click="openPhoto(photo)"
      >
        <img :src="photo.src" :alt="photo.alt" :width="photo.width" :height="photo.height" loading="lazy" decoding="async">
      </button>
    </div>
    <PhotoLightbox ref="lightbox" />
  </section>
</template>

<style scoped>
.album-block {
  width: auto;
  max-width: none;
  margin-inline: 0;
  padding-left: var(--pad);
  padding-right: var(--pad);
  text-align: center;
}

.album-block .lead {
  max-width: 28rem;
  margin-left: auto;
  margin-right: auto;
}

.stage {
  position: relative;
  height: clamp(680px, 86vh, 900px);
  margin: 28px calc(var(--pad) * -1) 0;
}

.book {
  position: absolute;
  z-index: 2;
  left: 50%;
  top: 48%;
  width: clamp(190px, 28vw, 270px);
  aspect-ratio: 3 / 4.1;
  transform: translate(-50%, -50%);
  perspective: 1400px;
  border: 0;
  padding: 0;
  background: transparent;
  cursor: pointer;
  transition: opacity 0.45s ease;
}

.is-open .book {
  opacity: 0;
  pointer-events: none;
  transition-delay: 0.85s;
}

.pages {
  position: absolute;
  top: 8px;
  bottom: 8px;
  right: -9px;
  width: 12px;
  border-radius: 0 2px 2px 0;
  background: linear-gradient(90deg, #e6d7c2, #f7f1e6 40%, #efe3d2);
  box-shadow:
    4px 0 0 #f6f0e6,
    7px 0 0 #e4d4be,
    10px 12px 16px rgba(40, 24, 12, 0.14);
}

.cover {
  position: absolute;
  inset: 0;
  transform-origin: left center;
  transform-style: preserve-3d;
  transition: transform 0.95s cubic-bezier(0.4, 0.05, 0.2, 1);
}

.is-open .cover { transform: rotateY(-168deg); }

.cover-face {
  position: absolute;
  inset: 0;
  backface-visibility: hidden;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 6px;
}

.cover-front {
  background:
    linear-gradient(165deg, rgba(255, 244, 220, 0.14), transparent 34%),
    linear-gradient(180deg, #3d2a24, #241612 72%);
  color: #f4e7cb;
  box-shadow:
    inset 0 0 0 1px rgba(214, 180, 112, 0.35),
    0 18px 36px rgba(28, 14, 8, 0.28);
}

.cover-front::before {
  content: "";
  position: absolute;
  inset: 14px;
  border: 1px solid rgba(214, 180, 112, 0.55);
}

.cover-inside {
  transform: rotateY(180deg);
  background: #f7f6f4;
  box-shadow: inset 0 0 0 1px rgba(42, 39, 36, 0.08);
}

.cover-xi {
  font-family: var(--han);
  font-size: 2.8rem;
  line-height: 1;
  color: rgba(244, 231, 203, 0.9);
}

.cover-title {
  font-family: var(--display);
  font-size: 2rem;
  font-style: italic;
}

.cover-names,
.cover-hint {
  font-size: 0.78rem;
  letter-spacing: 0.12em;
}

.cover-hint {
  margin-top: 16px;
  text-transform: uppercase;
  color: rgba(244, 231, 203, 0.72);
}

.print {
  position: absolute;
  z-index: 1;
  left: 50%;
  top: 48%;
  width: clamp(112px, 22vw, 210px);
  margin: 0;
  padding: 8px 8px 28px;
  border: 0;
  background: #fffdf9;
  box-shadow: 0 16px 28px rgba(40, 24, 12, 0.18);
  cursor: zoom-in;
  opacity: 0;
  pointer-events: none;
  transform: translate(-50%, -50%) scale(0.28) rotate(0deg);
  transition:
    left 0.9s cubic-bezier(0.16, 1.15, 0.32, 1),
    top 0.9s cubic-bezier(0.16, 1.15, 0.32, 1),
    transform 0.9s cubic-bezier(0.16, 1.15, 0.32, 1),
    opacity 0.35s ease;
  transition-delay: calc(180ms + var(--i) * 75ms);
}

.is-open .print {
  left: var(--x);
  top: var(--y);
  z-index: 4;
  opacity: 1;
  pointer-events: auto;
  transform: translate(-50%, -50%) rotate(var(--r)) scale(1);
}

.print img {
  display: block;
  width: 100%;
  aspect-ratio: 3 / 4;
  height: auto;
  object-fit: cover;
}

.gallery {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
  max-height: 0;
  margin-top: 0;
  opacity: 0;
  overflow: hidden;
  pointer-events: none;
}

.gallery.is-open {
  max-height: 4200px;
  margin-top: 22px;
  opacity: 1;
  pointer-events: auto;
  transition:
    max-height 1.15s cubic-bezier(0.16, 0.84, 0.24, 1) 0.35s,
    opacity 0.35s ease 0.4s,
    margin-top 0.4s ease 0.35s;
}

.shot {
  display: block;
  padding: 0;
  border: 0;
  background: transparent;
  cursor: zoom-in;
  opacity: 0;
  transform: translateY(42px) rotate(var(--tilt)) scale(0.94);
}

.gallery.is-open .shot {
  opacity: 1;
  transform: none;
  animation: deal 0.72s cubic-bezier(0.16, 0.84, 0.24, 1) both;
  animation-delay: calc(0.42s + var(--i) * 50ms);
}

@keyframes deal {
  from { opacity: 0; transform: translateY(48px) rotate(var(--tilt)) scale(0.92); }
  to { opacity: 1; transform: none; }
}

.shot img {
  display: block;
  width: 100%;
  aspect-ratio: 3 / 4;
  object-fit: cover;
  height: auto;
}

@media (max-width: 640px) {
  .gallery { grid-template-columns: repeat(2, 1fr); gap: 8px; }
}
</style>
