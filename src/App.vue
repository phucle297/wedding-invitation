<script setup>
import { nextTick, ref } from "vue";
import EnvelopeGate from "./sections/gate/EnvelopeGate.vue";
import InvitationPage from "./InvitationPage.vue";

const envelopeOpen = ref(false);
const entered = ref(false);

function reducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function paintTheme(color) {
  document
    .querySelector('meta[name="theme-color"]')
    ?.setAttribute("content", color);
}

function onOpen() {
  if (envelopeOpen.value) return;
  envelopeOpen.value = true;
  const reduced = reducedMotion();
  window.setTimeout(
    () => {
      document.documentElement.classList.add("gate-out");
    },
    reduced ? 0 : 1650,
  );
  window.setTimeout(
    () => {
      document.documentElement.classList.remove("has-gate", "gate-out");
      entered.value = true;
      paintTheme("#ffffff");
      nextTick(() =>
        document.getElementById("invite")?.focus({ preventScroll: true }),
      );
    },
    reduced ? 0 : 2100,
  );
}
</script>

<template>
  <EnvelopeGate :open="envelopeOpen" @open="onOpen" />
  <InvitationPage :entered="entered" />
</template>
