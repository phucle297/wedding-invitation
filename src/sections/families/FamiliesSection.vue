<script setup lang="ts">
import { families } from "./content";
</script>

<template>
  <section class="block family-section" aria-labelledby="family-title">
    <h2 id="family-title">{{ families.title }}</h2>
    <div class="families">
      <article v-for="group in families.groups" :key="group.label">
        <h3>{{ group.label }}</h3>
        <p v-for="person in group.people" :key="person">{{ person }}</p>
        <p class="where">{{ group.place }}</p>
      </article>
    </div>
  </section>
</template>

<style scoped>
.block {
  text-align: center;
  padding-top: 28px;
}

.block h2 {
  font-size: var(--section-title);
}

.families {
  display: grid;
  grid-template-columns: 1fr 1fr;
  margin-top: 26px;
}

article { padding: 0 18px; }

article + article {
  padding: 0 18px;
  border-left: 1px solid var(--line);
}

h3 {
  margin: 0 0 12px;
  font-family: var(--heading);
  font-size: var(--text-detail);
  font-weight: 500;
  letter-spacing: -0.025em;
  text-transform: uppercase;
  color: var(--ink-soft);
}

p { margin: 0; }

article p:not(.where) {
  font-family: var(--display);
  font-size: var(--text-detail);
  line-height: 1.35;
  text-wrap: balance;
}

@media (max-width: 560px) {
  .families { grid-template-columns: 1fr; }

  article,
  article + article {
    padding: 18px 0;
    border-left: 0;
  }

  article + article { border-top: 1px solid var(--line); }
}
</style>
