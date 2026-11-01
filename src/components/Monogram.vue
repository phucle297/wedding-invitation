<script setup>
import { couple } from "../content/couple.js";
</script>

<template>
  <p class="signoff" aria-hidden="true">
    <span>{{ couple.groom.mark }}</span>
    <span class="heart">♥</span>
    <span>{{ couple.bride.mark }}</span>
  </p>
</template>

<style scoped>
.signoff {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
  margin: 22px 0 8px;
  font-family: var(--display);
  font-size: 1.35rem;
  letter-spacing: 0.08em;
  color: var(--bronze);
}

.heart { font-size: 0.75rem; }
</style>
