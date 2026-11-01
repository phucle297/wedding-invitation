<script setup>
import { couple } from "../../content/couple.js";
import DateLock from "../../components/DateLock.vue";
import Monogram from "../../components/Monogram.vue";
import { hero } from "./content.js";
</script>

<template>
  <header class="hero" id="mo-dau">
    <p class="xi" aria-hidden="true">囍</p>
    <p class="eyebrow">{{ hero.eyebrow }}</p>
    <h1>
      <span class="person">
        <span class="who">{{ couple.groom.role }}</span>
        {{ couple.groom.full }}
      </span>
      <span class="amp" aria-hidden="true">&amp;</span>
      <span class="person">
        <span class="who">{{ couple.bride.role }}</span>
        {{ couple.bride.full }}
      </span>
    </h1>
    <Monogram />
    <DateLock />
  </header>
</template>

<style scoped>
.hero {
  position: relative;
  text-align: center;
  padding: 72px var(--pad) 36px;
}

.xi {
  margin: 0;
  font-family: var(--brush);
  font-size: clamp(5.2rem, 18vw, 8rem);
  font-weight: 400;
  line-height: 1;
  color: var(--xi-mark);
}

h1 {
  margin: 10px 0 0;
  font-size: clamp(1.85rem, 7.4vw, 3.6rem);
  font-weight: 500;
  font-style: italic;
}

.person { display: block; }

.who {
  display: block;
  margin-bottom: 4px;
  font-family: var(--sans);
  font-style: normal;
  font-size: 0.68rem;
  font-weight: 500;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--bronze);
}

.amp {
  display: block;
  margin: 8px 0;
  font-style: italic;
  color: var(--bronze);
  font-size: 0.55em;
}

</style>
