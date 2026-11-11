/** Biên Hòa shuttle options. Station names are display text; Apps Script does not keep this list. */
export const shuttleTrips = [
  {
    id: "trip-1", seats: 45, depart: "09:10", arrive: "11:00",
    stops: [
      { name: "Phú Lâm Bình Chánh", address: "Phú Lâm Bình Chánh", time: "09:10" },
      { name: "Đường 3/2", address: "Đối diện Khách sạn Kỳ Hòa", time: "09:30" },
      { name: "Vòng xoay Dân Chủ – CMT8", address: "Trạm Bus CMT8 đối diện Sân khấu 126", time: "09:35" },
      { name: "Công viên Lê Văn Tám", address: "Trạm xe bus, 181 Điện Biên Phủ", time: "09:40" },
      { name: "Vòng xoay Hàng Xanh", address: "Trạm Phương Trang – 486J Điện Biên Phủ", time: "09:50" },
      { name: "Ngã tư Thủ Đức – Xa lộ Hà Nội", address: "Công an Quận 9 – đối diện ĐH Sư phạm Kỹ thuật", time: "10:00" },
      { name: "Suối Tiên", address: "Cổng KDL Suối Tiên", time: "10:05" },
    ],
  },
  {
    id: "trip-2", seats: 29, depart: "09:00", arrive: "11:00",
    stops: [
      { name: "UOA Tower", address: "06 Tân Trào", time: "09:00" },
      { name: "Cầu vượt Hàng Xanh", address: "Cửa hàng xăng dầu Petrolimex số 19 – 178/6 Điện Biên Phủ", time: "09:30" },
      { name: "Ngã tư Thủ Đức – Xa lộ Hà Nội", address: "Công an Quận 9 – đối diện ĐH Sư phạm Kỹ thuật", time: "09:45" },
    ],
  },
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

export const shuttle = {
  legend: "Xe đưa đón",
  note: "Chiều đi và chiều về chọn riêng. Có thể tự đi, rồi đi xe về.",
  useLabel: "Mình dùng xe đưa đón",
  ownLabel: "Mình tự sắp xếp",
  viewRoute: "Xem lộ trình",
  routeTitle: "Lộ trình xe đưa đón",
  routeLead: "Xe 1 (45 chỗ) và Xe 2 (29 chỗ) có lộ trình riêng, cùng đến The Mira Central Park (Biên Hòa). Quý khách vui lòng có mặt tại trạm đón trước 10 phút so với giờ xe dự kiến đến. Chiều về chọn xe và trạm trả riêng.",
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
  destination: "The Mira Central Park (Biên Hòa)",
};
