/** Biên Hòa shuttle. Keep station ids and names identical in apps-script/Code.gs. */
export const shuttleTrips = [
  { id: "trip-1", label: "Chuyến 1", depart: "07:00", arrive: "10:00" },
  { id: "trip-2", label: "Chuyến 2", depart: "07:45", arrive: "10:45" },
] as const;

export type TripId = (typeof shuttleTrips)[number]["id"];
export type TransportChoice = "shuttle" | "own";
export type OutboundChoice = TripId | "self" | "none";
export type ReturnChoice = "same" | "self";

export const shuttleStations = [
  { id: "cong-vien-30-4", name: "Công viên 30/4, Quận 1", times: { "trip-1": "07:00", "trip-2": "07:45" } },
  { id: "landmark-81", name: "Landmark 81, Bình Thạnh", times: { "trip-1": "07:20", "trip-2": "08:05" } },
  { id: "hang-xanh", name: "Ngã tư Hàng Xanh", times: { "trip-1": "07:35", "trip-2": "08:20" } },
  { id: "vincom-thu-duc", name: "Vincom Thủ Đức", times: { "trip-1": "07:55", "trip-2": "08:40" } },
  { id: "binh-phuoc", name: "Ngã tư Bình Phước", times: { "trip-1": "08:15", "trip-2": "09:00" } },
  { id: "mien-dong", name: "Bến xe Miền Đông mới", times: { "trip-1": "08:35", "trip-2": "09:20" } },
  { id: "suoi-tien", name: "Cổng KDL Suối Tiên", times: { "trip-1": "08:55", "trip-2": "09:40" } },
] as const;

export const shuttle = {
  legend: "Xe đưa đón",
  note: "Bên nhà mình cung cấp xe cho khách với 2 chuyến.",
  useLabel: "Mình dùng xe đưa đón",
  ownLabel: "Mình tự sắp xếp",
  viewRoute: "Xem lộ trình",
  routeTitle: "Lộ trình xe đưa đón",
  routeLead: "Hai chuyến cùng các trạm, khác giờ xuất phát. Xe đến The Mira Central Park trước giờ đón khách 11:00. Chiều về, xe trả đúng trạm đã đón.",
  closeRoute: "Đóng",
  outboundLegend: "Chiều đi",
  selfOutbound: "Tự đi",
  noneOutbound: "Không đi",
  stationLabel: "Trạm đón",
  stationPlaceholder: "Chọn trạm",
  returnLegend: "Chiều về",
  returnSame: "Xe chở về theo đúng xe cũ",
  returnSelf: "Tự về",
  destination: "The Mira Central Park",
};
