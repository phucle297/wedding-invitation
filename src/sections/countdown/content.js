import { date } from "../../content/date.js";

export const countdown = {
  title: "Đếm đến giờ tiệc",
  lead: `${date.receptionTime}, ${date.weekday} ${date.display}`,
  isoReception: date.isoReception,
  isoDayEnd: date.isoDayEnd,
  notes: {
    during: "Đã đến giờ chung vui!",
    after: "Cảm ơn quý khách đã chung vui.",
  },
};
