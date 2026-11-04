<script setup lang="ts">
import { nextTick, onBeforeUnmount, onMounted, ref, watch } from "vue";
import { OverlayScrollbars } from "overlayscrollbars";
import EnvelopeGate from "./sections/gate/EnvelopeGate.vue";
import InvitationPage from "./InvitationPage.vue";

const envelopeOpen = ref(false);
const entered = ref(false);
const desktopScrollbars = window.matchMedia(
  "(hover: hover) and (pointer: fine) and (forced-colors: none)",
);
let scrollbars: ReturnType<typeof OverlayScrollbars> | undefined;

function syncScrollbars() {
  if (!entered.value || !desktopScrollbars.matches) {
    scrollbars?.destroy();
    scrollbars = undefined;
    return;
  }
  if (scrollbars) return;
  // Target the body to preserve window scrolling and GSAP's document triggers.
  scrollbars = OverlayScrollbars(document.body, {
    scrollbars: {
      theme: "os-theme-invitation",
      autoHide: "move",
      autoHideDelay: 900,
      autoHideSuspend: true,
      clickScroll: "instant",
    },
  });
}

watch(entered, syncScrollbars, { flush: "post" });
onMounted(() => desktopScrollbars.addEventListener("change", syncScrollbars));
onBeforeUnmount(() => {
  desktopScrollbars.removeEventListener("change", syncScrollbars);
  scrollbars?.destroy();
});

function paintTheme(color: string) {
  document
    .querySelector('meta[name="theme-color"]')
    ?.setAttribute("content", color);
}

function onOpen() {
  if (envelopeOpen.value) return;
  envelopeOpen.value = true;
  window.setTimeout(
    () => {
      document.documentElement.classList.add("gate-out");
    },
    1650,
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
    2100,
  );
}
</script>

<template>
  <EnvelopeGate :open="envelopeOpen" @open="onOpen" />
  <InvitationPage :entered="entered" />
</template>
