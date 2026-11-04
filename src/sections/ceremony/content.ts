import { date } from "../../content/date";

export const ceremony = {
  title: "Nơi diễn ra",
  eyebrow: "Hôn lễ",
  place: "Tại tư gia",
  when: `${date.ceremonyTime} · ${date.weekday}, ${date.display}`,
  lunar: date.lunar,
};
