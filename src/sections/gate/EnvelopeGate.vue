<script setup>
import { couple } from "../../content/couple.js";
import { date } from "../../content/date.js";
import Envelope from "./Envelope.vue";

defineProps({
  open: { type: Boolean, default: false },
});

defineEmits(["open"]);

const label = `Mở thiệp mời lễ cưới của ${couple.groom.full} và ${couple.bride.full}, ngày ${date.aria}`;
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
  background: #2c070c;
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
    radial-gradient(ellipse at 50% 42%, #6e1822 0%, #4a0e16 48%, #2c070c 100%);
}

.gate-btn:disabled {
  cursor: default;
}
</style>
