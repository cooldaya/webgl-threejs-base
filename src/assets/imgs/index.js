export function getHdr(name) {
  return new URL(`./${name}.hdr`, import.meta.url).href;
}

export function getImg(name) {
  return new URL(`./${name}`, import.meta.url).href;
}

