<script setup lang="ts">
defineProps<{ beaded?: boolean }>();

const outline = "M140 24H360Q410 24 416 74Q463 80 470 124Q490 130 490 174V576Q490 620 470 626Q463 670 416 676Q410 726 360 726H140Q90 726 84 676Q37 670 30 626Q10 620 10 576V174Q10 130 30 124Q37 80 84 74Q90 24 140 24Z";
</script>

<template>
  <svg class="stationery-frame" viewBox="0 0 500 750" preserveAspectRatio="none" aria-hidden="true">
    <path :d="outline" fill="white" stroke="#eee9e2" stroke-width="20" />
    <path :d="outline" fill="none" stroke="#ded5c8" stroke-width="1" />
    <path
      :d="outline"
      transform="translate(10 10) scale(.96 .9733)"
      fill="none"
      stroke="#e8e0d5"
      :stroke-width="beaded ? 6 : 1"
      :stroke-dasharray="beaded ? '0 15' : undefined"
      stroke-linecap="round"
    />
  </svg>
</template>

<style scoped>
.stationery-frame {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
}
</style>
