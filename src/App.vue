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
  window.setTimeout(() => {
    document.documentElement.classList.add("gate-out");
  }, 1050);
  window.setTimeout(() => {
    document.documentElement.classList.remove("has-gate", "gate-out");
    entered.value = true;
    paintTheme("#ffffff");
    nextTick(() => {
      window.scrollTo({ top: 0, left: 0, behavior: "instant" });
      document.getElementById("invite")?.focus({ preventScroll: true });
    });
  }, 1450);
}
</script>

<template>
  <EnvelopeGate :open="envelopeOpen" @open="onOpen" />
  <InvitationPage :entered="entered" />
</template>
