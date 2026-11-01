<script setup>
import { couple } from "../../content/couple.js";
import { date } from "../../content/date.js";
import { phrases } from "../../content/phrases.js";

defineEmits(["replay"]);

const line = `${couple.groom.short} & ${couple.bride.short} · ${phrases.footerPlace} · ${date.display}`;
</script>

<template>
  <footer class="colophon">
    <p class="invite">{{ phrases.invite }}</p>
    <p class="fine">{{ line }}</p>
    <button class="text-btn" type="button" @click="$emit('replay')">{{ phrases.replay }}</button>
  </footer>
</template>

<style scoped>
.colophon {
  text-align: center;
  padding: 8px 24px 72px;
}

.colophon::before {
  content: "";
  display: block;
  width: min(40rem, 100%);
  margin: 0 auto 36px;
  border-top: 1px solid var(--line);
}

.invite {
  margin: 0;
  font-family: var(--display);
  font-style: italic;
  font-size: clamp(1.8rem, 4vw, 2.4rem);
  text-wrap: balance;
}

.fine {
  margin: 10px 0 0;
  color: var(--ink-soft);
  font-size: 0.84rem;
}
</style>
