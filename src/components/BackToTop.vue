<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from "vue";

const visible = ref(false);

function updateVisibility() {
  visible.value = window.scrollY > 600;
}

function backToTop() {
  document.getElementById("invite")?.focus({ preventScroll: true });
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
}

onMounted(() => {
  updateVisibility();
  window.addEventListener("scroll", updateVisibility, { passive: true });
});
onBeforeUnmount(() => window.removeEventListener("scroll", updateVisibility));
</script>

<template>
  <button
    v-show="visible"
    class="back-to-top"
    type="button"
    aria-label="Về đầu trang"
    title="Về đầu trang"
    @click="backToTop"
  >
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="m6 11 6-6 6 6M12 5v14" />
    </svg>
  </button>
</template>

<style scoped>
.back-to-top {
  position: fixed;
  right: max(24px, env(safe-area-inset-right));
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
.back-to-top svg {
  width: 22px;
  height: 22px;
  stroke: currentColor;
  stroke-width: 1.5;
  stroke-linecap: round;
  stroke-linejoin: round;
}
@media (hover: hover) {
  .back-to-top:hover {
    background: var(--espresso);
    color: var(--cream);
  }
}
@media print {
  .back-to-top { display: none !important; }
}
</style>
