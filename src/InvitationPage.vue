<script setup lang="ts">
import { onMounted, ref } from "vue";
import { useInvitationMotion } from "./composables/useInvitationMotion";
import BackToTop from "./components/BackToTop.vue";
import StationeryFrame from "./components/StationeryFrame.vue";
import StorySections from "./sections/story/StorySections.vue";
import GuestInfo from "./sections/reception/GuestInfo.vue";
import AlbumSection from "./sections/album/AlbumSection.vue";
import CeremonySection from "./sections/ceremony/CeremonySection.vue";
import Colophon from "./sections/footer/Colophon.vue";
import CountdownSection from "./sections/countdown/CountdownSection.vue";
import FamiliesSection from "./sections/families/FamiliesSection.vue";
import HeroSection from "./sections/hero/HeroSection.vue";
import LetterSection from "./sections/letter/LetterSection.vue";
import SiteNav from "./sections/nav/SiteNav.vue";
import ReceptionSection from "./sections/reception/ReceptionSection.vue";
import RsvpSection from "./sections/rsvp/RsvpSection.vue";
import TimelineSection from "./sections/timeline/TimelineSection.vue";

const props = defineProps({
  entered: { type: Boolean, default: false },
});

const page = ref<HTMLElement | null>(null);
const music = ref<HTMLAudioElement | null>(null);
const musicPlaying = ref(false);
useInvitationMotion(page, () => props.entered);

async function playMusic() {
  if (!music.value) return;
  music.value.volume = 0.4;
  try {
    await music.value.play();
  } catch {
    // Playback may be blocked; leave the control available for a manual retry.
    musicPlaying.value = false;
  }
}

function toggleMusic() {
  if (music.value?.paused) void playMusic();
  else music.value?.pause();
}

onMounted(playMusic);
defineExpose({ playMusic });
</script>

<template>
  <main id="invite" ref="page" class="invite" tabindex="-1" :inert="!entered">
    <div class="sheet">
      <SiteNav />
      <HeroSection />
      <LetterSection />
      <div class="invitation-details">
        <div class="announcement-paper">
          <article class="announcement-card">
            <StationeryFrame />
            <div class="announcement-copy">
              <FamiliesSection />
              <CeremonySection />
            </div>
          </article>
        </div>
        <ReceptionSection />
      </div>
      <TimelineSection />
      <StorySections />
      <CountdownSection />
      <AlbumSection :entered="entered" />
      <GuestInfo />
      <RsvpSection />
      <Colophon />
    </div>
    <audio
      ref="music"
      src="/assets/music/piano.mp3"
      preload="auto"
      autoplay
      loop
      @play="musicPlaying = true"
      @pause="musicPlaying = false"
      @error="musicPlaying = false"
    ></audio>
    <button
      v-if="entered"
      class="music-toggle"
      type="button"
      :aria-label="musicPlaying ? 'Tạm dừng nhạc nền' : 'Phát nhạc nền'"
      :title="musicPlaying ? 'Tạm dừng nhạc nền' : 'Phát nhạc nền'"
      @click="toggleMusic"
    >
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M9 18V5l12-2v13M9 9l12-2" />
        <ellipse cx="6" cy="18" rx="3" ry="3" />
        <ellipse cx="18" cy="16" rx="3" ry="3" />
        <path v-if="!musicPlaying" d="m3 3 18 18" />
      </svg>
    </button>
    <BackToTop v-if="entered" />
  </main>
</template>

<style scoped>
.invite {
  min-height: 100vh;
}

.invite:focus {
  outline: none;
}

.sheet {
  width: 100%;
  min-height: 100vh;
}

.music-toggle {
  position: fixed;
  left: max(24px, env(safe-area-inset-left));
  bottom: max(24px, env(safe-area-inset-bottom));
  z-index: 20;
  display: grid;
  place-items: center;
  width: 48px;
  height: 48px;
  padding: 0;
  border: 1px solid var(--line);
  border-radius: 50%;
  background: var(--cream);
  color: var(--espresso);
  box-shadow: 0 4px 18px #3f342a14;
  cursor: pointer;
  transition: background 0.2s ease, color 0.2s ease;
}
.music-toggle svg {
  width: 22px;
  height: 22px;
  stroke: currentColor;
  stroke-width: 1.5;
  stroke-linecap: round;
  stroke-linejoin: round;
}
@media (hover: hover) {
  .music-toggle:hover {
    background: var(--espresso);
    color: var(--cream);
  }
}
@media print {
  .music-toggle { display: none !important; }
}

.announcement-paper {
  padding: 22px;
  background: url("/assets/ornaments/floral-paper.webp") center / 650px, #eee9e1;
}
.announcement-card {
  position: relative;
  width: min(100%, 600px);
  min-height: 100%;
  margin-inline: auto;
  container-type: inline-size;
}
.announcement-copy { position: relative; padding: 17% 9% 16%; }
.announcement-card :deep(.block) { width: 100%; padding: 0; border: 0; color: #913b3e; }
.announcement-card :deep(.block h2),
.announcement-card :deep(.families h3),
.announcement-card :deep(.where) { color: inherit; }
.announcement-card :deep(.families) { margin: 0; grid-template-columns: minmax(0, 1fr) minmax(0, 1fr); gap: 3%; }
.announcement-card :deep(.families article) { padding: 0; border: 0; }
.announcement-card :deep(.families h3) { margin: 0 0 3%; font: 2.6cqw/1.5 var(--invitation-serif); text-transform: none; }
.announcement-card :deep(.families article p:not(.where)) { font: 2.35cqw/1.6 var(--invitation-serif); letter-spacing: -0.035em; text-transform: uppercase; white-space: nowrap; }
.announcement-card :deep(.families .where) { margin-top: 3%; font: 2.25cqw/1.5 var(--invitation-serif); }
.announcement-card :deep(.family-section::after) { content: none; }
.announcement-card :deep(.place) { margin-top: 7%; }
.announcement-card :deep(.place h2) { font: 3cqw/1.6 var(--invitation-serif); text-transform: uppercase; margin: 0; }
@media (max-width: 600px) {
  .announcement-paper { padding: 16px 12px; }
  .announcement-card :deep(.families) { grid-template-columns: 1fr; gap: 22px; }
  .announcement-card :deep(.families h3) { font-size: 3.8cqw; margin-bottom: 2%; }
  .announcement-card :deep(.families article p:not(.where)) { font-size: 4cqw; }
  .announcement-card :deep(.families .where) { font-size: 3.4cqw; margin-top: 2%; }
  .announcement-copy { padding: 20% 10% 22%; }
}
</style>
