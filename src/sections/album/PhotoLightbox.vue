<script setup>
import { ref } from "vue";
import { phrases } from "../../content/phrases.js";

const dialog = ref(null);
const photo = ref(null);

function open(next) {
  photo.value = next;
  dialog.value?.showModal();
}

function close() {
  dialog.value?.close();
}

function onBackdrop(event) {
  if (event.target === dialog.value) close();
}

defineExpose({ open });
</script>

<template>
  <dialog ref="dialog" class="lightbox" @click="onBackdrop">
    <button class="text-btn light-close" type="button" @click="close">{{ phrases.closePhoto }}</button>
    <img v-if="photo" :src="photo.src" :alt="photo.alt">
  </dialog>
</template>

<style scoped>
.lightbox {
  border: 0;
  padding: 48px 16px 16px;
  background: transparent;
  max-width: none;
  max-height: none;
}

.lightbox::backdrop { background: rgba(24, 18, 14, 0.9); }

img {
  display: block;
  max-width: min(92vw, 880px);
  max-height: 84vh;
  margin: 0 auto;
  width: auto;
  height: auto;
  object-fit: contain;
}

.light-close {
  position: absolute;
  top: 8px;
  right: 8px;
  color: #f6f0e6;
}
</style>
