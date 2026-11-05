<script setup lang="ts">
import { ceremony } from "./content";
</script>

<template>
  <section class="block place" id="dia-diem" aria-labelledby="place-title">
    <p class="eyebrow">{{ ceremony.eyebrow }}</p>
    <h2 id="place-title">{{ ceremony.place }}</h2>
    <p class="when">{{ ceremony.when }}</p>
    <p class="where">{{ ceremony.lunar }}</p>
  </section>
</template>

<style scoped>
.place {
  text-align: center;
  padding-bottom: 18px;
}

.place h2 {
  margin-top: 8px;
  font-size: clamp(2.2rem, 6vw, 3rem);
}

.when {
  margin: 10px 0 0;
  font-family: var(--display);
  font-size: clamp(1.35rem, 3.8vw, 1.6rem);
  font-weight: 600;
  line-height: 1.6;
}

.where {
  margin-top: 4px;
  font-family: var(--display);
  font-style: italic;
  font-size: 1.15rem;
}
</style>
