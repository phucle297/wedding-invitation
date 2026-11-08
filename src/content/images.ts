export function albumSrcset(src: string, width = 640): string {
  const smallSrc = src.replace("/assets/album/", "/assets/album/small/");
  if (src === "/assets/album/13.webp") {
    const fullSrc = src.replace("/assets/album/", "/assets/album/full/");
    return `${smallSrc} 640w, ${src} 1280w, ${fullSrc} 2560w`;
  }
  return `${smallSrc} ${width / 2}w, ${src} ${width}w`;
}
