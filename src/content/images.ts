export function albumSrcset(src: string, width = 640): string {
  const smallSrc = src.replace("/assets/album/", "/assets/album/small/");
  const isWideCover =
    src === "/assets/album/album-cover.webp" ||
    src === "/assets/album/together.webp";
  if (
    src === "/assets/album/13.webp" ||
    src === "/assets/album/09.webp" ||
    isWideCover
  ) {
    const baseWidth = isWideCover ? 1920 : 1280;
    const fullSrc = src.replace("/assets/album/", "/assets/album/full/");
    return `${smallSrc} ${baseWidth / 2}w, ${src} ${baseWidth}w, ${fullSrc} ${baseWidth * 2}w`;
  }
  return `${smallSrc} ${width / 2}w, ${src} ${width}w`;
}
