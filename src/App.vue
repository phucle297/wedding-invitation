<script setup lang="ts">
import { nextTick, ref } from "vue";
import EnvelopeGate from "./sections/gate/EnvelopeGate.vue";
import InvitationPage from "./InvitationPage.vue";

const envelopeOpen = ref(false);
const entered = ref(false);

function paintTheme(color: string) {
  document
    .querySelector('meta[name="theme-color"]')
    ?.setAttribute("content", color);
}

function onOpen() {
  if (envelopeOpen.value) return;
  envelopeOpen.value = true;
  // Let the inner card finish rising, then leave time to read it before fading.
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const readingDelay = reducedMotion ? 0 : 2500;
  const fadeDuration = reducedMotion ? 0 : 700;
  window.setTimeout(() => {
    document.documentElement.classList.add("gate-out");
  }, readingDelay);
  window.setTimeout(() => {
    document.documentElement.classList.remove("has-gate", "gate-out");
    entered.value = true;
    paintTheme("#ffffff");
    nextTick(() => {
      window.scrollTo({ top: 0, left: 0, behavior: "instant" });
      document.getElementById("invite")?.focus({ preventScroll: true });
    });
  }, readingDelay + fadeDuration);
}
</script>

<template>
  <EnvelopeGate :open="envelopeOpen" @open="onOpen" />
  <InvitationPage :entered="entered" />
</template>
