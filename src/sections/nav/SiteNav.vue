<script setup lang="ts">
import { ref } from "vue";
import { nav } from "./content";

const expanded = ref(false);
</script>

<template>
  <nav class="topnav" aria-label="Trong thiệp" @keydown.esc="expanded = false">
    <a class="brand" href="#mo-dau" @click="expanded = false"
      >Phúc <em>&amp;</em> Đan</a
    >
    <ul id="invitation-links" :class="{ 'is-expanded': expanded }">
      <li v-for="item in nav" :key="item.href">
        <a :href="item.href" @click="expanded = false">{{ item.label }}</a>
      </li>
    </ul>
    <div class="nav-actions">
      <a class="nav-rsvp" href="#xac-nhan" @click="expanded = false"
        >Xác nhận tham dự</a
      >
      <button
        class="menu-toggle"
        type="button"
        :aria-expanded="expanded"
        aria-controls="invitation-links"
        @click="expanded = !expanded"
      >
        <span>{{ expanded ? "Đóng" : "Mục lục" }}</span
        ><span aria-hidden="true">{{ expanded ? "−" : "+" }}</span>
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
.menu-toggle > span:last-child {
  font-size: 1.2rem;
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
    padding-inline: 18px;
  }
  .brand {
    font-size: 1.35rem;
  }
  .nav-actions {
    gap: 12px;
  }
  .nav-rsvp {
    line-height: 1.4;
  }
  .menu-toggle {
    gap: 8px;
  }
}
@media (max-width: 360px) {
  .topnav {
    gap: 12px;
  }
  .brand {
    font-size: 1.15rem;
  }
  .nav-actions {
    gap: 8px;
  }
  .nav-rsvp {
    max-width: 7em;
  }
}
</style>
