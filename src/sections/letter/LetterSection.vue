<script setup>
import { families } from "../families/content.js";
</script>

<template>
  <section class="block letter" id="loi-ngo" aria-labelledby="letter-title">
    <h2 id="letter-title">Lời ngỏ</h2>
    <blockquote>{{ families.letter }}</blockquote>
  </section>
</template>

<style scoped>
.letter {
  text-align: center;
  padding-top: 28px;
  padding-bottom: 8px;
}

.letter h2 {
  font-family: var(--sans);
  font-style: normal;
  font-size: 0.84rem;
  font-weight: 500;
  letter-spacing: 0.01em;
  color: var(--ink-soft);
}

blockquote {
  max-width: 16em;
  margin: 18px auto 0;
  font-family: var(--display);
  font-style: italic;
  font-weight: 500;
  font-size: clamp(1.6rem, 4vw, 2.15rem);
  line-height: 1.4;
  text-wrap: pretty;
}

blockquote::after {
  content: "";
  display: block;
  width: 48px;
  height: 1px;
  margin: 26px auto 0;
  background: rgba(122, 115, 108, 0.55);
}
</style>
