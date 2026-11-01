<script setup>
import { couple } from "../../content/couple.js";
import { nav } from "./content.js";

const brand = `${couple.groom.short} & ${couple.bride.short}`;
</script>

<template>
  <nav class="topnav" aria-label="Trong thiệp">
    <a class="brand" href="#mo-dau">{{ brand }}</a>
    <ul>
      <li v-for="item in nav" :key="item.href">
        <a :href="item.href">{{ item.label }}</a>
      </li>
    </ul>
  </nav>
</template>

<style scoped>
.topnav {
  position: sticky;
  top: 0;
  z-index: 5;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 14px var(--pad);
  background: color-mix(in srgb, var(--paper) 88%, transparent);
  border-bottom: 1px solid var(--line);
  backdrop-filter: blur(10px);
}

.brand {
  font-family: var(--display);
  font-style: italic;
  font-size: 1.15rem;
  color: inherit;
  text-decoration: none;
  white-space: nowrap;
}

ul {
  display: flex;
  gap: 16px;
  list-style: none;
  margin: 0;
  padding: 0;
  overflow-x: auto;
}

ul a {
  color: var(--ink-soft);
  text-decoration: none;
  font-size: 0.84rem;
  letter-spacing: 0.01em;
  white-space: nowrap;
  transition: color 0.2s cubic-bezier(0.23, 1, 0.32, 1);
}

ul a:hover { color: var(--ink); }

@media (max-width: 560px) {
  .topnav {
    align-items: flex-start;
    flex-direction: column;
    gap: 4px;
  }

  ul {
    width: 100%;
    justify-content: space-between;
  }

  ul a { letter-spacing: 0.06em; }
}
</style>
