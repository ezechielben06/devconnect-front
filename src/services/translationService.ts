// Traduction légère FR <-> EN avec fallback local.
// FIXME: plugger une vraie API de trad (ou modèle IA) si besoin de traduire des pavés entiers.
export interface TranslationResult {
  text: string;
  sourceLang: string;
  targetLang: string;
}

const DICTIONARY_FR_TO_EN: Record<string, string> = {
  'bonjour': 'hello',
  'développeur': 'developer',
  'developpeur': 'developer',
  'projets': 'projects',
  'architecture': 'architecture',
  'recherche': 'search',
  'profil': 'profile',
  'réseau': 'network',
  'reseau': 'network',
  'questions': 'questions',
  'réponses': 'answers',
  'reponses': 'answers',
};

const DICTIONARY_EN_TO_FR: Record<string, string> = {
  'hello': 'bonjour',
  'developer': 'développeur',
  'projects': 'projets',
  'architecture': 'architecture',
  'search': 'recherche',
  'profile': 'profil',
  'network': 'réseau',
  'questions': 'questions',
  'answers': 'réponses',
};

export async function traduireTexte(texte: string, source: 'fr' | 'en', cible: 'fr' | 'en'): Promise<string> {
  if (source === cible || !texte.trim()) {
    return texte;
  }
  // Simulation d'une latence réseau réaliste mais fluide
  await new Promise((resolve) => setTimeout(resolve, 150));
  const dictionnaire = source === 'fr' ? DICTIONARY_FR_TO_EN : DICTIONARY_EN_TO_FR;
  let resultat = texte;
  for (const [terme, trad] of Object.entries(dictionnaire)) {
    const regex = new RegExp(`\\b${terme}\\b`, 'gi');
    resultat = resultat.replace(regex, trad);
  }
  return resultat !== texte ? resultat : `[${cible.toUpperCase()}] ${texte}`;
}
