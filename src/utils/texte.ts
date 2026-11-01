// Regex barbare pour virer tous les emojis et drapeaux Unicode (UI pro & sobre sans fioritures).
export function retirerEmojis(texte: string | null | undefined): string {
  if (!texte) return '';
  return texte
    // Plages Unicode pour symboles, emojis, pictographes et drapeaux
    .replace(
      /([\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF]|\uD83C[\uDDE6-\uDDFF]{2})/g,
      ''
    )
    .replace(/\s{2,}/g, ' ')
    .trim();
}

/**
 * Tronque un texte proprement avec points de suspension.
 */
export function tronquer(texte: string, longueurMax: number): string {
  if (!texte || texte.length <= longueurMax) return texte;
  return texte.slice(0, longueurMax).trimEnd() + '...';
}
