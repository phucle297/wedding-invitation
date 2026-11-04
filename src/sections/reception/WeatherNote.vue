<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from "vue";
import { date } from "../../content/date";

const temperature = ref<number | null>(null);
const condition = ref("");
const updated = ref("");
const loading = ref(true);
const failed = ref(false);
const controller = new AbortController();

function describe(code: number) {
  if (code === 0) return "Trời quang";
  if (code <= 3) return "Có mây";
  if (code === 45 || code === 48) return "Có sương mù";
  if (code >= 95) return "Có dông";
  if ((code >= 71 && code <= 77) || code === 85 || code === 86) return "Có tuyết";
  if (code >= 51 && code <= 57) return "Mưa phùn";
  if ((code >= 61 && code <= 67) || (code >= 80 && code <= 82)) return "Có mưa";
  return "Thời tiết tại Đà Nẵng";
}

onMounted(async () => {
  try {
    // Da Nang city coordinates from Open-Meteo's geocoding API, not the venue pin.
    const response = await fetch(
      "https://api.open-meteo.com/v1/forecast?latitude=16.06778&longitude=108.22083&current=temperature_2m,weather_code&timezone=Asia%2FHo_Chi_Minh&forecast_days=1",
      { signal: AbortSignal.any([controller.signal, AbortSignal.timeout(10000)]) },
    );
    if (!response.ok) throw new Error("Weather unavailable");
    const data: unknown = await response.json();
    if (!data || typeof data !== "object" || !("current" in data)) throw new Error("Invalid weather");
    const current = data.current;
    if (!current || typeof current !== "object" ||
      !("temperature_2m" in current) || typeof current.temperature_2m !== "number" || !Number.isFinite(current.temperature_2m) ||
      !("weather_code" in current) || typeof current.weather_code !== "number" ||
      !("time" in current) || typeof current.time !== "string" || !/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(current.time)) {
      throw new Error("Invalid weather");
    }
    temperature.value = Math.round(current.temperature_2m);
    condition.value = describe(current.weather_code);
    updated.value = current.time.slice(11);
  } catch {
    if (!controller.signal.aborted) failed.value = true;
  } finally {
    loading.value = false;
  }
});

onBeforeUnmount(() => controller.abort());
</script>

<template>
  <aside class="weather-note" aria-labelledby="weather-title">
    <p class="eyebrow">Chuẩn bị cho chuyến đi</p>
    <h3 id="weather-title">Thời tiết Đà Nẵng</h3>
    <div role="status" aria-live="polite">
      <p v-if="loading" class="weather-status">Đang cập nhật thời tiết…</p>
      <p v-else-if="failed" class="weather-status">Chưa tải được thời tiết. Bạn vui lòng kiểm tra lại trước khi đi nhé.</p>
      <p v-else class="weather-reading">
        <strong>{{ temperature }}<span>°C</span></strong>
        <span>{{ condition }}<small>Hiện tại · {{ updated }} (giờ Việt Nam)</small></span>
      </p>
    </div>
    <p class="weather-disclaimer">Điều kiện hiện tại, không phải dự báo ngày {{ date.display }}. Vui lòng kiểm tra lại gần ngày dự tiệc.</p>
    <a href="https://open-meteo.com/" target="_blank" rel="noopener noreferrer">Nguồn: Open-Meteo</a>
  </aside>
</template>

<style scoped>
.weather-note {
  border: 1px solid var(--line);
  padding: clamp(24px, 4vw, 40px);
  background: var(--cream);
  background-image: var(--paper-grain);
}
h3 { font: 2.2rem/1.2 var(--display); margin: 18px 0 24px; }
.weather-reading { display: flex; align-items: center; gap: 24px; margin: 24px 0; }
.weather-reading strong { font: 4rem/1 var(--display); }
.weather-reading strong span { font-size: 1.5rem; vertical-align: top; }
small { display: block; margin-top: 8px; font-size: 0.8rem; }
.weather-status, .weather-disclaimer, small { color: var(--ink-soft); }
.weather-disclaimer, a { font-size: 0.85rem; line-height: 1.8; }
a { color: var(--ink); text-underline-offset: 4px; }
</style>
