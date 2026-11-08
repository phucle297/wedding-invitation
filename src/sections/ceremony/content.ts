import { date } from "../../content/date";

export const ceremony = {
  title: "Nơi diễn ra",
  eyebrow: "Lễ vu quy",
  place: "Tại tư gia",
  when: `${date.ceremonyTime}, ${date.weekday}, ${date.display}`,
  lunar: date.lunar,
};
