import { date } from "../../content/date";
import { reception } from "../reception/content";

export const timeline = {
  title: "Trong ngày",
  items: [
    {
      time: date.ceremonyTime,
      datetime: date.isoCeremony,
      title: "Lễ vu quy",
      detail: "Tại tư gia",
    },
    {
      time: reception.hours[0].time,
      datetime: date.isoWelcome,
      title: "Đón khách",
      detail: reception.hall,
    },
    {
      time: date.receptionTime,
      datetime: date.isoReception,
      title: "Khai tiệc",
      detail: reception.name,
    },
  ],
};
