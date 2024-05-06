export function getPdb(pdbId) {
  return new URL(`./${pdbId}.pdb`, import.meta.url).href;
}
