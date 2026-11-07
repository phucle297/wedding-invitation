export function albumSrcset(src: string, width = 640): string {
  const smallSrc = src.replace("/assets/album/", "/assets/album/small/");
  return `${smallSrc} ${width / 2}w, ${src} ${width}w`;
}
