<script setup lang="ts">
import { nextTick, ref } from "vue";
import EnvelopeGate from "./sections/gate/EnvelopeGate.vue";
import InvitationPage from "./InvitationPage.vue";

const envelopeOpen = ref(false);
const entered = ref(false);
const invitation = ref<InstanceType<typeof InvitationPage> | null>(null);

function paintTheme(color: string) {
  document
    .querySelector('meta[name="theme-color"]')
    ?.setAttribute("content", color);
}

function onOpen() {
  if (envelopeOpen.value) return;
  envelopeOpen.value = true;
  void invitation.value?.playMusic();
  // Let the inner card finish rising, then leave time to read it before fading.
  const readingDelay = 2500;
  const fadeDuration = 700;
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
  <InvitationPage ref="invitation" :entered="entered" />
</template>
