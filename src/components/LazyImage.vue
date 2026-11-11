<script setup lang="ts">
import { computed, ref, useAttrs } from "vue";

defineOptions({ inheritAttrs: false });

defineProps({
  fill: { type: Boolean, default: false },
});

const attrs = useAttrs();
const pending = ref(true);
const imgAttrs = computed(() => {
  const { class: _class, ...rest } = attrs;
  return rest;
});

function capture(el: unknown) {
  if (!(el instanceof HTMLImageElement)) return;
  if (el.complete && el.naturalWidth > 0) pending.value = false;
}

function settle() {
  pending.value = false;
}
</script>

<template>
  <span class="lazy-media" :class="[{ 'is-fill': fill }, attrs.class]">
    <span v-if="pending" class="lazy-skeleton" aria-hidden="true"></span>
    <img :ref="capture" v-bind="imgAttrs" @load="settle" @error="settle" />
  </span>
</template>

<style scoped>
.lazy-media {
  display: block;
  position: relative;
  max-width: 100%;
}
.lazy-media.is-fill {
  position: absolute;
  inset: 0;
  max-width: none;
}
.lazy-media.is-fill img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.lazy-skeleton {
  position: absolute;
  inset: 0;
  z-index: 1;
  pointer-events: none;
  background: #e8e2d6;
  overflow: hidden;
}
.lazy-skeleton::after {
  content: "";
  position: absolute;
  inset: 0;
  background: linear-gradient(100deg, transparent 20%, #fbf7f0 50%, transparent 80%);
  transform: translateX(-100%);
  animation: lazy-shimmer 1.35s ease-in-out infinite;
}
@keyframes lazy-shimmer {
  to {
    transform: translateX(100%);
  }
}
</style>
