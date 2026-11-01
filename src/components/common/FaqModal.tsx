// Modale FAQ interactive avec recherche en temps réel et filtres par catégorie.
// Pratique pour onboarder les devs sans qu'ils nous spamment en DM sur WhatsApp.
import React, { useState, useMemo } from 'react';
import {
  X,
  HelpCircle,
  ChevronDown,
  Search,
} from 'lucide-react';

interface FaqModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface FaqItem {
  id: string;
  category: 'missions' | 'code' | 'cadev' | 'apdp' | 'pwa' | 'social';
  categoryLabel: string;
  question: string;
  answer: string;
}

const FAQ_ITEMS: FaqItem[] = [
  {
    id: '1',
    category: 'missions',
    categoryLabel: 'Missions & FCFA',
    question: 'Pourquoi tous les prix et budgets sont-ils affichés en FCFA ?',
    answer:
      "DevConnect est profondément ancré dans l'économie technologique béninoise et de l'espace UEMOA. Tous les budgets de projets, salaires, devis et tarifs journaliers moyens (TJM) sont strictement libellés en FCFA pour garantir une clarté absolue, éviter les frais de conversion de change et valoriser équitablement le travail des développeurs locaux.",
  },
  {
    id: '2',
    category: 'missions',
    categoryLabel: 'Missions & FCFA',
    question: 'Comment postuler à une mission ou recruter un développeur freelance ?',
    answer:
      'Dans l\'onglet "Missions FCFA", parcourez les projets par technologie (React, Node, Python, Mobile Money) et budget. Cliquez sur "Détails & Postuler" pour soumettre votre candidature. Les recruteurs peuvent également filtrer l\'annuaire des développeurs et envoyer une proposition de mission directe.',
  },
  {
    id: '3',
    category: 'code',
    categoryLabel: 'Éditeur & VS Code',
    question: 'Comment fonctionne la coloration syntaxique VS Code Dark+ intégrée ?',
    answer:
      "DevConnect embarque un moteur de coloration temps réel conforme au thème officiel Visual Studio Code Dark+. Que vous saisissiez du code en HTML, CSS, TypeScript, JavaScript, Python, Java, Go, C#, PHP ou SQL dans le fil d'actualité ou les salons de discussion, la syntaxe est mise en valeur instantanément avec numérotation de ligne, indentation fidèle et bouton de copie en un clic.",
  },
  {
    id: '4',
    category: 'code',
    categoryLabel: 'Éditeur & VS Code',
    question: 'Le système détecte-t-il automatiquement le langage de programmation tapé ?',
    answer:
      'Oui ! Notre analyseur heuristique inspecte les balises, mots-clés et déclarations (comme "func", "interface", "SELECT", "<div>", "def") pour identifier et suggérer le langage approprié. Vous pouvez aussi basculer manuellement d\'un langage à un autre grâce au sélecteur en tête d\'éditeur.',
  },
  {
    id: '5',
    category: 'cadev',
    categoryLabel: 'CADEV 2026',
    question: "Qu'est-ce que le Challenge CADEV 2026 et qui est la NV TEAM ?",
    answer:
      "Le Challenge CADEV 2026 est la compétition d'excellence technologique réunissant les talents de pointe du numérique au Bénin. DevConnect est la plateforme officielle portée par la NV TEAM : Gbenagnon Narcisse AVLESSI (Lead Frontend & Expérience Utilisateur) et Mahukpégo Vertueux NOUKPO (Architecture Backend & API).",
  },
  {
    id: '6',
    category: 'apdp',
    categoryLabel: 'Confidentialité & Sécurité',
    question: 'Mes données personnelles sont-elles protégées ?',
    answer:
      'Absolument. Conformément à la Loi n° 2017-20 portant Code du Numérique en République du Bénin, DevConnect garantit la protection stricte de la vie privée, le consentement granulaire pour les cookies, le chiffrement de bout en bout et un droit de rectification immédiat auprès de notre délégué à la protection des données joignable à dpo@devconnect.bj ou au +229 01 00 00 00.',
  },
  {
    id: '7',
    category: 'pwa',
    categoryLabel: 'PWA & Hors-Ligne',
    question: 'Comment installer DevConnect sur smartphone ou PC ?',
    answer:
      'DevConnect est une Progressive Web App (PWA) certifiée. Sur Safari iOS (iPhone/iPad), appuyez sur le bouton Partager puis choisissez "Sur l\'écran d\'accueil". Sur Google Chrome (Android, Windows, macOS, Linux), cliquez sur le menu (⋮) ou l\'icône dans la barre d\'adresse puis "Installer l\'application".',
  },

  {
    id: '9',
    category: 'social',
    categoryLabel: 'Salons & Entraide',
    question: 'Comment fonctionnent les salons de discussion et questions/réponses ?',
    answer:
      "Les salons (#react-benin, #fintech-momo-uemoa, #missions-freelance-fcfa) permettent d'échanger en temps réel entre pairs, de poster des extraits de code et d'obtenir de l'aide technique. La section Q&A vous permet de poser des questions précises et de voter pour les meilleures solutions.",
  },
  {
    id: '10',
    category: 'social',
    categoryLabel: 'Salons & Entraide',
    question: 'Comment fonctionnent les Stories de développeurs ?',
    answer:
      "Les stories permettent de partager des statuts éphémères, des aperçus de code en cours de conception ou des victoires de débogage. Elles apparaissent en haut du fil d'actualité dans un format compact et immersif.",
  },
];

export function FaqModal({ isOpen, onClose }: FaqModalProps) {
  const [openIds, setOpenIds] = useState<Record<string, boolean>>({ '1': true, '3': true });
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filteredItems = useMemo(() => {
    return FAQ_ITEMS.filter((item) => {
      const matchCategory = selectedCategory === 'all' || item.category === selectedCategory;
      const q = searchQuery.trim().toLowerCase();
      const matchSearch =
        !q ||
        item.question.toLowerCase().includes(q) ||
        item.answer.toLowerCase().includes(q) ||
        item.categoryLabel.toLowerCase().includes(q);
      return matchCategory && matchSearch;
    });
  }, [selectedCategory, searchQuery]);

  if (!isOpen) return null;

  const toggleItem = (id: string) => {
    setOpenIds((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const categories = [
    { id: 'all', label: 'Toutes les questions', count: FAQ_ITEMS.length },
    { id: 'missions', label: 'Missions & FCFA', count: FAQ_ITEMS.filter((i) => i.category === 'missions').length },
    { id: 'code', label: 'Éditeur VS Code', count: FAQ_ITEMS.filter((i) => i.category === 'code').length },
    { id: 'cadev', label: 'CADEV 2026', count: FAQ_ITEMS.filter((i) => i.category === 'cadev').length },
    { id: 'apdp', label: 'APDP & Sécurité', count: FAQ_ITEMS.filter((i) => i.category === 'apdp').length },
    { id: 'pwa', label: 'PWA & Hors-Ligne', count: FAQ_ITEMS.filter((i) => i.category === 'pwa').length },
    { id: 'social', label: 'Salons & Entraide', count: FAQ_ITEMS.filter((i) => i.category === 'social').length },
  ];

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Foire aux questions DevConnect Bénin"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/80 backdrop-blur-md animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl bg-white/95 dark:bg-[#0A1024]/95 backdrop-blur-2xl border border-blue-200/80 dark:border-slate-800 rounded-3xl shadow-[0_25px_70px_-15px_rgba(0,102,255,0.35)] overflow-hidden transition-all max-h-[88vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-5 sm:p-6 pb-3 border-b border-slate-200/80 dark:border-slate-800/80 flex items-start justify-between gap-4 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-[#0066FF] to-cyan-400 text-white flex items-center justify-center shrink-0 shadow-lg shadow-blue-500/20">
              <HelpCircle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white">
                Foire Aux Questions
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Tout comprendre sur les missions en FCFA, l'éditeur VS Code et la plateforme.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer shrink-0"
            aria-label="Fermer la FAQ"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="px-5 pt-3 pb-2 space-y-2.5 bg-slate-50/50 dark:bg-slate-900/30 border-b border-slate-200/60 dark:border-slate-800/60 shrink-0">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Rechercher une réponse (ex: FCFA, VS Code, CADEV, PWA, APDP...)"
              className="w-full pl-9 pr-8 py-2 rounded-xl text-xs bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-[#0066FF]"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-xs"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1 text-[11px]">
            {categories.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-2.5 py-1 rounded-xl font-bold whitespace-nowrap transition-all cursor-pointer ${
                  selectedCategory === cat.id
                    ? 'bg-[#0066FF] text-white shadow-sm'
                    : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                {cat.label} ({cat.count})
              </button>
            ))}
          </div>
        </div>

        <div className="p-5 overflow-y-auto overflow-x-hidden no-scrollbar flex-1 space-y-3">
          {filteredItems.length === 0 ? (
            <div className="py-10 text-center space-y-2">
              <HelpCircle className="w-8 h-8 text-slate-300 dark:text-slate-600 mx-auto" />
              <p className="text-sm font-bold text-slate-700 dark:text-slate-300">
                Aucune question trouvée pour « {searchQuery} »
              </p>
              <p className="text-xs text-slate-400">
                Essayez d'autres mots-clés ou sélectionnez une autre catégorie ci-dessus.
              </p>
            </div>
          ) : (
            filteredItems.map((item) => {
              const isOpen = !!openIds[item.id];
              return (
                <div
                  key={item.id}
                  className="rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-slate-50/70 dark:bg-slate-900/50 overflow-hidden transition-all duration-300"
                >
                  <button
                    type="button"
                    onClick={() => toggleItem(item.id)}
                    className="w-full p-4 flex items-center justify-between gap-3 text-left cursor-pointer hover:bg-blue-50/40 dark:hover:bg-slate-800/40 transition-colors"
                  >
                    <div className="space-y-0.5">
                      <span className="text-[10px] font-bold text-[#0066FF] dark:text-cyan-400 uppercase tracking-wider block">
                        {item.categoryLabel}
                      </span>
                      <span className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white block leading-snug">
                        {item.question}
                      </span>
                    </div>
                    <div className="p-1.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-500 shrink-0">
                      <ChevronDown
                        className={`w-4 h-4 transform transition-transform duration-300 ease-out ${
                          isOpen ? 'rotate-180 text-[#0066FF] dark:text-cyan-400' : 'rotate-0'
                        }`}
                      />
                    </div>
                  </button>
                  {isOpen && (
                    <div className="px-4 pb-4 pt-1.5 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed border-t border-slate-200/60 dark:border-slate-800/60 animate-fadeIn">
                      {item.answer}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>


      </div>
    </div>
  );
}
