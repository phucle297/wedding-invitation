<script setup lang="ts">
import { couple } from "../../content/couple";
import { date } from "../../content/date";
import Envelope from "./Envelope.vue";

defineProps({
  open: { type: Boolean, default: false },
});

defineEmits(["open"]);

const label = `Mở thiệp mời lễ cưới của ${couple.bride.full} và ${couple.groom.full}, ngày ${date.aria}`;
</script>

<template>
  <div class="gate">
    <button class="gate-btn" type="button" :aria-label="label" :disabled="open" @click="$emit('open')">
      <Envelope :open="open" />
    </button>
  </div>
</template>

<style scoped>
.gate {
  overflow: hidden;
  background: #f5f0e5;
}

.gate-btn {
  appearance: none;
  border: 0;
  padding: 0;
  width: 100%;
  height: 100%;
  display: grid;
  place-items: center;
  cursor: pointer;
  color: inherit;
  background:
    radial-gradient(ellipse at 50% 42%, #ffffff 0%, #faf7ef 48%, #f5f0e5 100%);
}

.gate-btn:disabled {
  cursor: default;
}
</style>
