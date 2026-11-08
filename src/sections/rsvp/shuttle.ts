/** Biên Hòa shuttle options. Station names are display text; Apps Script does not keep this list. */
export const shuttleTrips = [
  { id: "trip-1", label: "Chuyến 1", depart: "07:00", arrive: "10:00" },
  { id: "trip-2", label: "Chuyến 2", depart: "07:45", arrive: "10:45" },
] as const;

export type TripId = (typeof shuttleTrips)[number]["id"];
export type TransportChoice = "shuttle" | "own";
export type OutboundChoice = TripId | "self" | "none";
export type ReturnChoice = "self" | "shuttle";

/** Car names are display text. Apps Script does not keep this list. */
export const shuttleVehicles = [
  { name: "Xe 1", tripId: "trip-1" },
  { name: "Xe 2", tripId: "trip-2" },
] as const;

export const shuttleStations = [
  { name: "Công viên 30/4, Quận 1", times: { "trip-1": "07:00", "trip-2": "07:45" } },
  { name: "Landmark 81, Bình Thạnh", times: { "trip-1": "07:20", "trip-2": "08:05" } },
  { name: "Ngã tư Hàng Xanh", times: { "trip-1": "07:35", "trip-2": "08:20" } },
  { name: "Vincom Thủ Đức", times: { "trip-1": "07:55", "trip-2": "08:40" } },
  { name: "Ngã tư Bình Phước", times: { "trip-1": "08:15", "trip-2": "09:00" } },
  { name: "Bến xe Miền Đông mới", times: { "trip-1": "08:35", "trip-2": "09:20" } },
  { name: "Cổng KDL Suối Tiên", times: { "trip-1": "08:55", "trip-2": "09:40" } },
] as const;

export const shuttle = {
  legend: "Xe đưa đón",
  note: "Chiều đi và chiều về chọn riêng. Có thể tự đi, rồi đi xe về.",
  useLabel: "Mình dùng xe đưa đón",
  ownLabel: "Mình tự sắp xếp",
  viewRoute: "Xem lộ trình",
  routeTitle: "Lộ trình xe đưa đón",
  routeLead: "Hai chuyến cùng các trạm, khác giờ xuất phát. Xe đến The Mira Central Park trước giờ đón khách 11:00. Chiều về chọn xe và trạm trả riêng.",
  closeRoute: "Đóng",
  outboundLegend: "Chiều đi",
  selfOutbound: "Tự đi",
  noneOutbound: "Không đi",
  stationLabel: "Trạm đón",
  stationPlaceholder: "Chọn trạm đón",
  returnLegend: "Chiều về",
  returnSelf: "Tự về",
  returnStationLabel: "Trạm trả",
  returnStationPlaceholder: "Chọn trạm trả",
  destination: "The Mira Central Park",
};
