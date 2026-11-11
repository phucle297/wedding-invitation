<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from "vue";

const props = defineProps<{
  id: string;
  stops: readonly { name: string; address: string; time: string }[];
  placeholder: string;
  disabled?: boolean;
  showTime?: boolean;
  error?: string;
}>();
const model = defineModel<string>({ required: true });
const selected = computed(() => props.stops.find((stop) => stop.name === model.value));
const trigger = ref<HTMLButtonElement | null>(null);
const menu = ref<HTMLElement | null>(null);
const open = ref(false);
const activeIndex = ref(0);
const descriptionIds = computed(() => [
  selected.value ? `${props.id}-detail` : "",
  props.error ? `${props.id}-error` : "",
].filter(Boolean).join(" ") || undefined);
let typed = "";
let lastTyped = 0;

function positionMenu() {
  if (!open.value || !trigger.value || !menu.value) return;
  const rect = trigger.value.getBoundingClientRect();
  const popup = menu.value;
  const gutter = 8;
  const gap = 6;
  const width = Math.min(rect.width, document.documentElement.clientWidth - gutter * 2);
  popup.style.width = `${width}px`;
  popup.style.left = `${Math.max(gutter, Math.min(rect.left, document.documentElement.clientWidth - width - gutter))}px`;
  const below = window.innerHeight - rect.bottom - gutter - gap;
  const above = rect.top - gutter - gap;
  const upwards = below < Math.min(240, popup.scrollHeight) && above > below;
  const maxHeight = Math.max(0, Math.min(360, upwards ? above : below));
  popup.style.maxHeight = `${maxHeight}px`;
  popup.style.top = `${upwards ? rect.top - Math.min(popup.scrollHeight, maxHeight) - gap : rect.bottom + gap}px`;
  popup.dataset.side = upwards ? "top" : "bottom";
}

function scrollToActive() {
  nextTick(() => {
    menu.value?.querySelector<HTMLElement>(`[data-index="${activeIndex.value}"]`)
      ?.scrollIntoView({ block: "nearest", behavior: "instant" });
  });
}

function showMenu(index = Math.max(0, props.stops.findIndex((stop) => stop.name === model.value))) {
  if (props.disabled || props.stops.length === 0) return;
  activeIndex.value = index;
  open.value = true;
  nextTick(() => {
    positionMenu();
    scrollToActive();
  });
}

function closeMenu() {
  open.value = false;
  typed = "";
}

function onPointerDown(event: PointerEvent) {
  if (event.target instanceof Node && !trigger.value?.contains(event.target) && !menu.value?.contains(event.target)) closeMenu();
}

function choose(index: number) {
  const stop = props.stops[index];
  if (!stop || props.disabled) return;
  model.value = stop.name;
  closeMenu();
  trigger.value?.focus({ preventScroll: true });
}

function keepTriggerFocus(event: PointerEvent) {
  if (event.pointerType === "mouse") event.preventDefault();
}

function normalize(value: string) {
  return value.normalize("NFD").replace(/\p{M}/gu, "").toLocaleLowerCase("vi").replace(/đ/g, "d");
}

function onKeydown(event: KeyboardEvent) {
  const last = props.stops.length - 1;
  if (props.disabled || last < 0) return;
  if (event.key === "Tab") {
    closeMenu();
    return;
  }
  if (event.key === "Escape") {
    if (open.value) {
      event.preventDefault();
      event.stopPropagation();
      closeMenu();
    }
    return;
  }
  if (["ArrowDown", "ArrowUp", "Home", "End"].includes(event.key)) {
    event.preventDefault();
    if (event.key === "Home") showMenu(0);
    else if (event.key === "End") showMenu(last);
    else if (!open.value) showMenu(selected.value ? undefined : event.key === "ArrowUp" ? last : 0);
    else {
      activeIndex.value = Math.max(0, Math.min(last, activeIndex.value + (event.key === "ArrowDown" ? 1 : -1)));
      scrollToActive();
    }
    return;
  }
  if (event.key === "Enter" || event.key === " ") {
    event.preventDefault();
    if (open.value) choose(activeIndex.value);
    else showMenu();
    return;
  }
  if (event.key.length !== 1 || event.ctrlKey || event.metaKey || event.altKey) return;
  event.preventDefault();
  const now = performance.now();
  typed = now - lastTyped < 600 ? typed + event.key : event.key;
  lastTyped = now;
  const find = (query: string) => props.stops.findIndex((stop) => normalize(stop.name).startsWith(normalize(query)));
  let index = find(typed);
  if (index < 0) {
    typed = event.key;
    index = find(typed);
  }
  if (index >= 0) showMenu(index);
}

function onScroll(event: Event) {
  if (open.value && event.target instanceof Node && !menu.value?.contains(event.target)) closeMenu();
}

watch(() => props.disabled, (disabled) => { if (disabled) closeMenu(); });
watch(() => props.stops, closeMenu);
onMounted(() => {
  document.addEventListener("pointerdown", onPointerDown, true);
  window.addEventListener("resize", positionMenu);
  window.addEventListener("scroll", onScroll, { capture: true, passive: true });
});
onBeforeUnmount(() => {
  document.removeEventListener("pointerdown", onPointerDown, true);
  window.removeEventListener("resize", positionMenu);
  window.removeEventListener("scroll", onScroll, true);
});
</script>

<template>
  <div class="stop-select" :class="{ 'has-value': selected, 'is-open': open, 'has-error': error }">
    <button
      :id="id"
      ref="trigger"
      class="stop-trigger"
      type="button"
      role="combobox"
      aria-haspopup="listbox"
      aria-required="true"
      :aria-expanded="open"
      :aria-controls="open ? `${id}-listbox` : undefined"
      :aria-labelledby="`${id}-label`"
      :aria-activedescendant="open ? `${id}-option-${activeIndex}` : undefined"
      :aria-invalid="error ? true : undefined"
      :aria-describedby="descriptionIds"
      :disabled="disabled"
      @click.prevent="open ? closeMenu() : showMenu()"
      @keydown="onKeydown"
    >
      <svg class="stop-pin" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true">
        <path d="M19 10c0 5-7 11-7 11S5 15 5 10a7 7 0 0 1 14 0Z" />
        <circle cx="12" cy="10" r="2.5" />
      </svg>
      <span class="stop-copy">
        <span class="stop-heading">
          <span v-if="selected && showTime" class="stop-time">{{ selected.time }}</span>
          <span class="stop-name">{{ selected?.name ?? placeholder }}</span>
        </span>
        <span v-if="selected && selected.address !== selected.name" class="stop-address">{{ selected.address }}</span>
      </span>
      <svg class="stop-chevron" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true">
        <path d="m5 8 5 5 5-5" />
      </svg>
    </button>
    <Teleport to="#invite">
      <Transition
        name="stop-menu"
        @enter="positionMenu"
        @before-enter="(element) => element.removeAttribute('inert')"
        @before-leave="(element) => element.setAttribute('inert', '')"
      >
        <div
          v-if="open"
          :id="`${id}-listbox`"
          ref="menu"
          class="stop-menu"
          role="listbox"
          :aria-labelledby="`${id}-label`"
        >
          <div
            v-for="(stop, index) in stops"
            :id="`${id}-option-${index}`"
            :key="stop.name"
            class="stop-option"
            :class="{ 'is-active': activeIndex === index }"
            :data-index="index"
            role="option"
            :aria-selected="stop.name === model"
            @pointermove="activeIndex = index"
            @pointerdown="keepTriggerFocus"
            @click="choose(index)"
          >
            <span class="stop-copy">
              <span class="stop-heading">
                <span v-if="showTime" class="stop-time">{{ stop.time }}</span>
                <span class="stop-name">{{ stop.name }}</span>
              </span>
              <span v-if="stop.address !== stop.name" class="stop-address">{{ stop.address }}</span>
            </span>
            <svg v-if="stop.name === model" class="stop-check" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.7" aria-hidden="true">
              <path d="m4 10 4 4 8-8" />
            </svg>
          </div>
        </div>
      </Transition>
    </Teleport>
    <span v-if="selected" :id="`${id}-detail`" class="stop-description">
      {{ showTime ? `${selected.time} · ` : "" }}{{ selected.name }}. {{ selected.address !== selected.name ? selected.address : "" }}
    </span>
    <p v-if="error" :id="`${id}-error`" class="stop-error">{{ error }}</p>
  </div>
</template>

<style scoped>
.stop-select { position: relative; }
.stop-trigger {
  appearance: none;
  display: grid;
  grid-template-columns: 20px minmax(0, 1fr) 18px;
  align-items: center;
  gap: 12px;
  width: 100%;
  min-height: 56px;
  padding: 14px;
  position: relative;
  border: 1px solid #94734660;
  border-radius: 8px;
  background: var(--paper);
  color: var(--ink-soft);
  text-align: left;
  cursor: pointer;
  transition: border-color 160ms ease, box-shadow 160ms ease;
}
.has-value .stop-trigger { color: var(--ink); }
.stop-trigger:not(:disabled):hover { border-color: var(--bronze); }
.stop-trigger:focus,
.is-open .stop-trigger {
  border-color: var(--espresso);
  box-shadow: 0 0 0 3px #9473461a;
}
.stop-trigger:focus-visible {
  outline: 2px solid var(--espresso);
  outline-offset: 3px;
}
.has-error .stop-trigger { border-color: #913b3e; }
.stop-trigger:disabled { opacity: 0.6; cursor: default; }
.stop-menu {
  position: fixed;
  z-index: 70;
  inset: auto;
  margin: 0;
  padding: 6px;
  border: 1px solid #94734660;
  border-radius: 10px;
  background: var(--paper);
  color: var(--ink);
  text-align: left;
  box-shadow: 0 12px 32px #3f342a24, 0 2px 6px #3f342a0d;
  overflow-y: auto;
  overscroll-behavior: contain;
  scroll-padding: 6px;
  scrollbar-width: thin;
  scrollbar-color: #94734680 transparent;
  transition: opacity 180ms ease, transform 180ms ease;
}
.stop-menu-enter-from,
.stop-menu-leave-to {
  opacity: 0;
  transform: translateY(-6px);
}
.stop-menu[data-side="top"].stop-menu-enter-from,
.stop-menu[data-side="top"].stop-menu-leave-to { transform: translateY(6px); }
.stop-menu-leave-active { pointer-events: none; }
.stop-option {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 18px;
  align-items: center;
  gap: 10px;
  min-height: 48px;
  padding: 12px;
  border: 1px solid transparent;
  border-radius: 6px;
  cursor: pointer;
  transition: background 120ms ease, border-color 120ms ease;
}
.stop-option + .stop-option { margin-top: 2px; }
.stop-option.is-active { background: var(--champagne); }
.stop-option[aria-selected="true"] { border-color: #94734655; background: var(--cream); }
.stop-option[aria-selected="true"].is-active { background: var(--champagne); }
.stop-check { width: 18px; height: 18px; color: var(--espresso); }
.stop-error {
  margin: 8px 0 0;
  color: #913b3e;
  font-size: 14px;
  line-height: 1.5;
}
.stop-pin,
.stop-chevron {
  display: block;
  width: 100%;
  color: var(--bronze);
}
.stop-pin { align-self: start; margin-top: 2px; }
.stop-chevron { transition: transform 180ms ease; }
.is-open .stop-chevron { transform: rotate(180deg); }
.stop-copy { min-width: 0; }
.stop-heading {
  display: flex;
  align-items: baseline;
  flex-wrap: wrap;
  gap: 4px 8px;
}
.stop-name { font-size: 16px; font-weight: 500; line-height: 1.5; overflow-wrap: anywhere; }
.stop-time {
  padding: 1px 6px;
  border-radius: 4px;
  background: var(--champagne);
  color: var(--espresso);
  font-size: 13px;
  font-weight: 600;
  font-variant-numeric: tabular-nums;
  line-height: 1.6;
}
.stop-address {
  display: block;
  margin-top: 4px;
  color: var(--ink-soft);
  font-size: 14px;
  line-height: 1.6;
  overflow-wrap: anywhere;
}
.stop-description {
  position: absolute;
  width: 1px;
  height: 1px;
  overflow: hidden;
  clip-path: inset(50%);
}
</style>
