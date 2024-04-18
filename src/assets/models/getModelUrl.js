export default function getModelUrl(name) {
    return new URL(`./${name}`, import.meta.url).href;
  }
  