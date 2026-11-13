<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from "vue";
import { nav } from "./content";

const expanded = ref(false);
const navigation = ref<HTMLElement | null>(null);
const menuToggle = ref<HTMLButtonElement | null>(null);

function closeOnEscape() {
  if (!expanded.value) return;
  expanded.value = false;
  menuToggle.value?.focus();
}

function closeOnOutsidePress(event: PointerEvent) {
  if (event.target instanceof Node && !navigation.value?.contains(event.target)) {
    expanded.value = false;
  }
}

onMounted(() => document.addEventListener("pointerdown", closeOnOutsidePress));
onBeforeUnmount(() => document.removeEventListener("pointerdown", closeOnOutsidePress));
</script>

<template>
  <nav ref="navigation" class="topnav" aria-label="Trong thiệp" @keydown.esc="closeOnEscape">
    <a class="brand" href="#mo-dau" @click="expanded = false"
      >Đan <em>&amp;</em> Phúc</a
    >
    <ul id="invitation-links" :class="{ 'is-expanded': expanded }">
      <li class="menu-heading" aria-hidden="true">Trong thiệp mời</li>
      <li v-for="(item, index) in nav" :key="item.href">
        <a :href="item.href" @click="expanded = false">
          <span class="menu-number" aria-hidden="true">0{{ index + 1 }}</span>
          <span>{{ item.label }}</span>
          <svg class="menu-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.25" aria-hidden="true">
            <path d="M5 12h14m-6-6 6 6-6 6" />
          </svg>
        </a>
      </li>
    </ul>
    <div class="nav-actions">
      <a class="nav-rsvp" href="#xac-nhan" @click="expanded = false"
        >Đăng ký xe đưa đón</a
      >
      <button
        ref="menuToggle"
        class="menu-toggle"
        type="button"
        :aria-expanded="expanded"
        :aria-label="expanded ? 'Đóng mục lục' : 'Mở mục lục'"
        aria-controls="invitation-links"
        @click="expanded = !expanded"
      >
        <span>{{ expanded ? "Đóng" : "Mục lục" }}</span
        >
        <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.25" stroke-linecap="round" aria-hidden="true">
          <path v-if="expanded" d="m5 5 10 10M15 5 5 15" />
          <path v-else d="M3 6h14M7 10h10M3 14h14" />
        </svg>
      </button>
    </div>
  </nav>
</template>

<style scoped>
.topnav {
  position: sticky;
  top: 0;
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 28px;
  background: #fffffff2;
  backdrop-filter: blur(12px);
  border-bottom: 1px solid var(--line);
}
.brand {
  font: 1.6rem var(--script-vi);
  color: var(--ink);
  text-decoration: none;
  white-space: nowrap;
}
.brand em {
  font-family: var(--display);
  color: var(--bronze);
}
.nav-actions {
  display: flex;
  align-items: center;
  gap: 22px;
}
.nav-rsvp {
  min-height: 44px;
  display: flex;
  align-items: center;
  font-size: var(--text-small);
  color: var(--ink);
  text-underline-offset: 5px;
}
.menu-toggle {
  display: flex;
  align-items: center;
  gap: 12px;
  white-space: nowrap;
  min-height: 44px;
  padding: 0;
  border: 0;
  background: none;
  font-size: var(--text-small);
  cursor: pointer;
}
.menu-toggle svg {
  width: 18px;
  height: 18px;
}
.menu-heading,
.menu-number,
.menu-arrow {
  display: none;
}
ul {
  position: absolute;
  inset: 100% 0 auto;
  display: none;
  grid-template-columns: 1fr 1fr;
  padding: 16px 28px 24px;
  margin: 0;
  list-style: none;
  background: var(--paper);
  box-shadow: 0 10px 15px #3d362a16;
  gap: 0 24px;
  border-bottom: 1px solid var(--line);
}
ul.is-expanded {
  display: grid;
}
ul a {
  display: flex;
  align-items: center;
  min-height: 48px;
  font-size: var(--text-body);
  color: var(--ink);
  text-decoration: none;
  border-bottom: 1px solid var(--line);
}
@media (max-width: 600px) {
  .topnav {
    padding: 10px 16px;
    gap: 12px;
  }
  .brand {
    font-size: clamp(1.25rem, 6.4vw, 1.5rem);
  }
  .nav-actions {
    gap: 8px;
  }
  .nav-rsvp {
    min-height: 36px;
    padding-inline: 8px;
    border-radius: 6px;
    background: var(--espresso);
    color: var(--paper);
    white-space: nowrap;
    text-decoration: none;
  }
  .nav-rsvp:hover {
    background: var(--bronze);
  }
  .menu-toggle {
    justify-content: center;
    width: 36px;
    min-height: 36px;
    padding: 0;
    border: 1px solid var(--line);
    border-radius: 24px;
    background: var(--cream);
    color: var(--ink);
  }
  .menu-toggle span {
    display: none;
  }
  .menu-toggle[aria-expanded="true"] {
    background: var(--champagne);
  }
  ul {
    inset: calc(100% + 8px) 12px auto;
    grid-template-columns: 1fr;
    gap: 0;
    max-height: calc(100dvh - 88px);
    overflow-y: auto;
    padding: 18px 20px 20px;
    border: 1px solid var(--line);
    border-radius: 12px;
    background: var(--cream);
    box-shadow: 0 16px 40px #3f342a24;
  }
  .menu-heading {
    display: block;
    padding-bottom: 8px;
    color: var(--ink-soft);
    font-size: 0.75rem;
    letter-spacing: 0.12em;
    text-transform: uppercase;
  }
  ul a {
    gap: 16px;
    min-height: 56px;
    font-size: var(--text-detail);
  }
  .menu-number {
    display: block;
    color: var(--bronze);
    font-size: 0.75rem;
    font-variant-numeric: tabular-nums;
  }
  .menu-arrow {
    display: block;
    width: 20px;
    height: 20px;
    margin-left: auto;
    color: var(--bronze);
  }
  ul a:hover {
    color: var(--bronze);
  }
}
</style>
