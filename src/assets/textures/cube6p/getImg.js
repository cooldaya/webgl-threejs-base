export default function getImg(name) {
  return new URL(`./${name}.jpg`, import.meta.url).href;
}
