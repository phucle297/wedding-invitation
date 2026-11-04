import { onMounted, onUnmounted, ref } from "vue";

function pad(value: number) {
  return String(value).padStart(2, "0");
}

interface CountdownOptions {
  target: string;
  dayEnd: string;
  notes: { during: string; after: string };
}

export function useCountdown({ target, dayEnd, notes }: CountdownOptions) {
  const days = ref("--");
  const hours = ref("--");
  const minutes = ref("--");
  const seconds = ref("--");
  const note = ref("");
  const targetAt = new Date(target).getTime();
  const endAt = new Date(dayEnd).getTime();
  let timer = 0;

  function tick() {
    const now = Date.now();
    if (now >= endAt || now >= targetAt) {
      days.value = "00";
      hours.value = "00";
      minutes.value = "00";
      seconds.value = "00";
      note.value = now >= endAt ? notes.after : notes.during;
      return;
    }
    const total = Math.floor((targetAt - now) / 1000);
    days.value = pad(Math.floor(total / 86400));
    hours.value = pad(Math.floor((total % 86400) / 3600));
    minutes.value = pad(Math.floor((total % 3600) / 60));
    seconds.value = pad(total % 60);
    note.value = "";
  }

  onMounted(() => {
    tick();
    timer = window.setInterval(tick, 1000);
  });

  onUnmounted(() => window.clearInterval(timer));

  return { days, hours, minutes, seconds, note };
}
