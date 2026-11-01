// Formatage des noms : Prénoms en casse normale et NOMS en MAJUSCULES (convention CADEV).
// Ex: "josué affagnon" -> "Josué AFFAGNON"

/**
 * Capitalise proprement un mot ou un prénom composé (ex: "jean-paul" -> "Jean-Paul")
 */
export function capitalizeWord(word: string): string {
  if (!word) return '';
  return word
    .split('-')
    .map((part) => (part.length > 0 ? part.charAt(0).toUpperCase() + part.slice(1).toLowerCase() : ''))
    .join('-');
}

/**
 * Formate un nom complet avec les prénoms en minuscules capitalisées
 * et uniquement le(s) nom(s) de famille en MAJUSCULES strictes.
 * Exemples :
 * - "josué affagnon" -> "Josué AFFAGNON"
 * - "GBENAGNON NARCISSE AVLESSI" -> "Gbenagnon Narcisse AVLESSI"
 * - "mahukpégo vertueux noukpo" -> "Mahukpégo Vertueux NOUKPO"
 */
export function formatFullName(firstName: string, lastName: string): string {
  const cleanFirst = firstName
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .map(capitalizeWord)
    .join(' ');

  const cleanLast = lastName
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .join(' ')
    .toUpperCase();

  if (!cleanFirst) return cleanLast;
  if (!cleanLast) return cleanFirst;
  return `${cleanFirst} ${cleanLast}`;
}

/**
 * Parse et reformate une chaîne de nom complet existante
 * selon la règle : prénoms en minuscules (capitalisées), nom(s) en MAJUSCULES.
 * Si le nom comprend plusieurs tokens, le dernier token (ou les tokens déjà majuscules)
 * sont traités comme nom de famille.
 */
export function formatNameWithUpperLastName(fullName: string): string {
  if (!fullName) return '';
  const tokens = fullName.trim().split(/\s+/).filter(Boolean);
  if (tokens.length === 1) {
    return capitalizeWord(tokens[0]);
  }

  // Convention béninoise : Prénom(s) en premier, Nom(s) en dernier
  const firstNameTokens = tokens.slice(0, tokens.length - 1);
  const lastNameToken = tokens[tokens.length - 1];

  const formattedFirst = firstNameTokens.map(capitalizeWord).join(' ');
  const formattedLast = lastNameToken.toUpperCase();

  return `${formattedFirst} ${formattedLast}`;
}

/**
 * Formatage des montants en Francs CFA (XOF)
 */
export function formatFCFA(montant: number): string {
  return new Intl.NumberFormat('fr-FR', {
    style: 'decimal',
    maximumFractionDigits: 0,
  }).format(montant) + ' FCFA';
}
