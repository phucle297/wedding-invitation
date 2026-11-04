export interface AlbumPhoto {
  src: string;
  alt: string;
  width: number;
  height: number;
}

export const memories: AlbumPhoto[] = [
  {
    src: "/assets/album/memory-1.jpg",
    alt: "Linh Đan chụp ảnh trước gương trong chiếc váy trắng",
    width: 1200,
    height: 1600,
  },
  {
    src: "/assets/album/memory-2.jpg",
    alt: "Duy Phúc trong một hoạt động tập thể, mặc áo vàng và khăn xanh",
    width: 1600,
    height: 1066,
  },
  {
    src: "/assets/album/memory-3.jpg",
    alt: "Duy Phúc hôn má Linh Đan trong bức ảnh selfie ngoài phố",
    width: 1600,
    height: 1066,
  },
];

export const album: { title: string; photos: AlbumPhoto[] } = {
  title: "Album ảnh",
  photos: [
    {
      src: "/assets/album/01.jpg",
      alt: "Linh Đan và Duy Phúc cười dưới một lớp voan",
      width: 1067,
      height: 1600,
    },
    {
      src: "/assets/album/02.jpg",
      alt: "Hai người đứng trên cầu thang sảnh lớn",
      width: 1067,
      height: 1600,
    },
    {
      src: "/assets/album/03.jpg",
      alt: "Duy Phúc nghiêng đầu vào Linh Đan",
      width: 1067,
      height: 1600,
    },
    {
      src: "/assets/album/04.jpg",
      alt: "Hai người nắm tay trong vườn, voan bay phía trước",
      width: 1067,
      height: 1600,
    },
    {
      src: "/assets/album/05.jpg",
      alt: "Duy Phúc và Linh Đan trong studio",
      width: 1067,
      height: 1600,
    },
    {
      src: "/assets/album/06.jpg",
      alt: "Duy Phúc ôm Linh Đan giữa vườn",
      width: 1067,
      height: 1600,
    },
    {
      src: "/assets/album/07.jpg",
      alt: "Linh Đan cầm hoa đi trên lối đá trong vườn, voan kéo phía sau",
      width: 1067,
      height: 1600,
    },
    {
      src: "/assets/album/08.jpg",
      alt: "Duy Phúc và Linh Đan hôn nhau sau tấm thiệp trên tay",
      width: 1067,
      height: 1600,
    },
    {
      src: "/assets/album/09.jpg",
      alt: "Hai người tựa trán dưới một lớp voan",
      width: 1067,
      height: 1600,
    },
    {
      src: "/assets/album/10.jpg",
      alt: "Hai người nhìn nhau trước bức tường cây xanh",
      width: 1067,
      height: 1600,
    },
    {
      src: "/assets/album/11.jpg",
      alt: "Duy Phúc ôm Linh Đan trên lối đi giữa khu vườn",
      width: 1600,
      height: 1067,
    },
    {
      src: "/assets/album/12.jpg",
      alt: "Cận mặt Linh Đan qua lớp voan",
      width: 1067,
      height: 1600,
    },
    {
      src: "/assets/album/13.jpg",
      alt: "Duy Phúc mặc vest be, Linh Đan cầm bó hoa trong sảnh",
      width: 1067,
      height: 1600,
    },
    {
      src: "/assets/album/14.jpg",
      alt: "Hai người đứng tựa ban công",
      width: 1067,
      height: 1600,
    },
    {
      src: "/assets/album/15.jpg",
      alt: "Duy Phúc vest đen và Linh Đan tạo dáng trong studio",
      width: 1067,
      height: 1600,
    },
    {
      src: "/assets/album/16.jpg",
      alt: "Duy Phúc nâng tay Linh Đan dưới vòm cây",
      width: 1067,
      height: 1600,
    },
    {
      src: "/assets/album/17.jpg",
      alt: "Duy Phúc dắt tay Linh Đan xoay giữa khu vườn",
      width: 1067,
      height: 1600,
    },
    {
      src: "/assets/album/18.jpg",
      alt: "Hai người tung cánh hoa dưới tán cây",
      width: 1067,
      height: 1600,
    },
  ],
};
