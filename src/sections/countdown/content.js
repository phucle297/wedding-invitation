import { date } from "../../content/date.js";

export const countdown = {
  title: "Đếm đến giờ làm lễ",
  lead: `${date.ceremonyTime}, ${date.weekday} ${date.display}`,
  isoCeremony: date.isoCeremony,
  isoDayEnd: date.isoDayEnd,
  notes: {
    during: "Hôm nay là ngày làm lễ.",
    after: "Cảm ơn quý khách đã chung vui.",
  },
};
