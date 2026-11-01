<script setup>
import { onBeforeUnmount, watch } from "vue";
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

defineEmits(["replay"]);

const selector = "#invite .hero, #invite .block, #invite .hotel, #invite .colophon";
let observer;

function clearReveal() {
  observer?.disconnect();
  observer = null;
  document.querySelectorAll(`${selector}, #invite .is-in`).forEach((node) => {
    node.classList.remove("reveal", "is-in");
  });
}

function armReveal() {
  clearReveal();
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const nodes = document.querySelectorAll(selector);
  nodes.forEach((node) => node.classList.add("reveal"));
  observer = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      entry.target.classList.add("is-in");
      observer.unobserve(entry.target);
    }
  }, { threshold: 0.16, rootMargin: "0px 0px -8% 0px" });
  nodes.forEach((node) => observer.observe(node));
}

watch(() => props.entered, (value) => {
  if (value) armReveal();
  else clearReveal();
});

onBeforeUnmount(() => observer?.disconnect());
</script>

<template>
  <main id="invite" class="invite" tabindex="-1">
    <div class="sheet">
      <SiteNav />
      <HeroSection />
      <LetterSection />
      <FamiliesSection />
      <CeremonySection />
      <ReceptionSection />
      <TimelineSection />
      <CountdownSection />
      <AlbumSection />
      <RsvpSection />
      <Colophon @replay="$emit('replay')" />
    </div>
  </main>
</template>

<style scoped>
.invite {
  min-height: 100vh;
}

.invite:focus { outline: none; }

.sheet {
  width: 100%;
  min-height: 100vh;
  background-color: var(--paper);
  background-image: var(--silk);
}
</style>
