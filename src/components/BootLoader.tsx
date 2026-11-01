// Séquence de démarrage animée (tracé du logo en 'D' carreau par carreau).
// Timings calibrés à la main pour que ce soit fluide sans faire poireauter l'utilisateur 10 plombes.

import { useEffect, useState, type CSSProperties } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";

// Palette officielle du boot
const COLOR_IDLE = "#333b4f"; // Gris graphite bleuté sobre pour le tracé initial
const COLOR_LIT = "#F59E0B";  // Ambre éclatant officiel DevConnect
const COLOR_TILE_BG = "#060911"; // Noir profond bleuté

// Cadence posée pour le dessin des carreaux (140ms par carreau = ~1.4s de construction calme)
const DRAW_INTERVAL_MS = 140;
// Pause posée une fois les 10 carreaux dessinés avant d'allumer les couleurs
const POISE_PAUSE_MS = 380;
// Décalage pour l'allumage ambré progressif
const COLOR_STAGGER_S = 0.085;

// Les 10 coordonnées canoniques du "D" DevConnect (grille 4x4)
const PIXELS = [
  { x: 14, y: 14 }, { x: 14, y: 38 }, { x: 14, y: 62 }, { x: 14, y: 86 }, // Montant gauche (4 carreaux)
  { x: 38, y: 14 }, { x: 38, y: 86 },                                     // Haut et bas intermédiaires
  { x: 62, y: 14 }, { x: 62, y: 86 },                                     // Haut et bas droits
  { x: 86, y: 38 }, { x: 86, y: 62 },                                     // Courbure droite fermante
];

const TOTAL_TILES = PIXELS.length; // Exactement 10 carreaux
const pivot: CSSProperties = { transformBox: "fill-box", transformOrigin: "center" };

type BootLoaderProps = {
  progress: number;
  ready: boolean;
  error: string | null;
  onRetry: () => void;
  onDone: () => void;
};

export function BootLoader({ ready, error, onRetry, onDone }: BootLoaderProps) {
  const reduce = useReducedMotion() ?? false;

  // États séquentiels de notre chorégraphie
  const [drawnCount, setDrawnCount] = useState(0);       // De 0 à 10 carreaux posés
  const [isAssembled, setIsAssembled] = useState(false); // Vrai quand les 10 sont tous posés
  const [isColoring, setIsColoring] = useState(false);   // Déclenche l'onde ambrée
  const [isFullyColored, setIsFullyColored] = useState(false); // Vrai quand la couleur est posée
  const [showBrand, setShowBrand] = useState(false);     // Déclenche l'apparition douce du texte
  const [showOverlay, setShowOverlay] = useState(true);  // Gère la disparition finale

  // --------------------------------------------------------------------------
  // Phase 1 : Dessin calme, posé et méthodique des 10 carreaux
  // --------------------------------------------------------------------------
  useEffect(() => {
    if (drawnCount >= TOTAL_TILES) {
      setIsAssembled(true);
      return;
    }
    const timer = setTimeout(() => {
      setDrawnCount((c) => c + 1);
    }, reduce ? 0 : DRAW_INTERVAL_MS);
    return () => clearTimeout(timer);
  }, [drawnCount, reduce]);

  // --------------------------------------------------------------------------
  // Phase 2 : Pause posée une fois les 10 carreaux dessinés, puis coloriage
  // --------------------------------------------------------------------------
  useEffect(() => {
    if (!isAssembled) return;
    // Petite respiration : les 10 carreaux sont posés, on laisse l'œil apprécier
    const pauseTimer = setTimeout(() => {
      setIsColoring(true);
    }, reduce ? 0 : POISE_PAUSE_MS);
    return () => clearTimeout(pauseTimer);
  }, [isAssembled, reduce]);

  // --------------------------------------------------------------------------
  // Phase 3 : Coloriage progressif en ambre de tous les carreaux
  // --------------------------------------------------------------------------
  useEffect(() => {
    if (!isColoring) return;
    const totalColorTimeMs = reduce ? 0 : Math.round(TOTAL_TILES * COLOR_STAGGER_S * 1000 + 350);
    const colorTimer = setTimeout(() => {
      setIsFullyColored(true);
    }, totalColorTimeMs);
    return () => clearTimeout(colorTimer);
  }, [isColoring, reduce]);

  // --------------------------------------------------------------------------
  // Phase 4 : Révélation douce du texte en bas APRÈS le coloriage complet
  // --------------------------------------------------------------------------
  useEffect(() => {
    if (!isFullyColored) return;
    // Déclenchement de la révélation douce du texte
    const textTimer = setTimeout(() => {
      setShowBrand(true);
    }, reduce ? 0 : 200);
    return () => clearTimeout(textTimer);
  }, [isFullyColored, reduce]);

  // --------------------------------------------------------------------------
  // Phase 5 : Clôture du loader une fois la marque admirée et l'app prête
  // --------------------------------------------------------------------------
  useEffect(() => {
    if (!showBrand) return;
    // On laisse le temps à l'utilisateur de savourer le logo complet (1.6s)
    const exitTimer = setTimeout(() => {
      setShowOverlay(false);
    }, reduce ? 200 : 1600);
    return () => clearTimeout(exitTimer);
  }, [showBrand, ready, reduce]);

  return (
    <AnimatePresence onExitComplete={onDone}>
      {showOverlay && (
        <motion.div
          role="status"
          aria-live="polite"
          aria-label="Chargement de DevConnect"
          className="fixed inset-0 z-[99999] flex flex-col items-center justify-center gap-8 select-none overflow-hidden"
          style={{ backgroundColor: COLOR_TILE_BG }}
          exit={{ opacity: 0, transition: { duration: reduce ? 0 : 0.65, ease: [0.22, 1, 0.36, 1] } }}
        >
          {/* Lueur atmosphérique douce en arrière-plan */}
          <motion.div
            initial={{ opacity: 0.3, scale: 0.9 }}
            animate={{
              opacity: isColoring ? [0.4, 0.8, 0.5] : 0.3,
              scale: isColoring ? [1, 1.08, 1] : 0.95,
            }}
            transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-amber-500/15 blur-[110px] rounded-full pointer-events-none"
          />
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-blue-600/12 blur-[120px] rounded-full pointer-events-none" />

          {/* ================================================================= */}
          {/* Le 'D' de DevConnect : Dessin posé des 10 carreaux puis onde ambrée */}
          {/* ================================================================= */}
          <div className="relative">
            <svg
              width={132}
              height={132}
              viewBox="0 0 120 120"
              aria-hidden="true"
              className={`overflow-visible transition-all duration-700 ${
                isColoring ? "drop-shadow-[0_0_28px_rgba(245,158,11,0.45)]" : "drop-shadow-[0_4px_16px_rgba(0,0,0,0.5)]"
              }`}
            >
              {PIXELS.map((p, i) => {
                const isDrawn = i < drawnCount;
                const litDelay = isColoring ? i * COLOR_STAGGER_S : 0;
                return (
                  <motion.rect
                    key={i}
                    x={p.x}
                    y={p.y}
                    width={20}
                    height={20}
                    rx={5}
                    style={pivot}
                    initial={{ scale: 0, opacity: 0, fill: COLOR_IDLE }}
                    animate={{
                      // 1. Si pas encore dessiné : scale 0
                      // 2. Si dessiné mais pas encore colorié : bien posé scale 0.92 en gris bleuté
                      // 3. Quand la phase coloriage s'active : passe à scale 1.0 avec ambre chaud éclatant
                      scale: !isDrawn ? 0 : isColoring ? 1.0 : 0.92,
                      opacity: isDrawn ? 1 : 0,
                      fill: isColoring ? COLOR_LIT : COLOR_IDLE,
                    }}
                    transition={
                      reduce
                        ? { duration: 0 }
                        : {
                            scale: isColoring
                              ? { type: "spring", stiffness: 220, damping: 18, delay: litDelay }
                              : { type: "spring", stiffness: 260, damping: 20 },
                            fill: { duration: 0.45, ease: "easeInOut", delay: litDelay },
                            opacity: { duration: 0.25 },
                          }
                    }
                  />
                );
              })}
            </svg>
          </div>

          {/* ================================================================= */}
          {/* Texte DevConnect : N'apparaît qu'APRÈS la colorisation complète   */}
          {/* ================================================================= */}
          <div className="min-h-[72px] flex flex-col items-center justify-center">
            <AnimatePresence>
              {showBrand && (
                <motion.div
                  initial={{ opacity: 0, y: 18, filter: "blur(10px)", scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)", scale: 1 }}
                  exit={{ opacity: 0, y: -8, filter: "blur(4px)" }}
                  transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
                  className="flex flex-col items-center gap-2 text-center z-10"
                >
                  <div className="flex items-baseline tracking-tight font-black text-2xl sm:text-3xl text-white">
                    <span>Dev</span>
                    <span className="text-[#F59E0B] ml-0.5 drop-shadow-[0_0_14px_rgba(245,158,11,0.5)]">
                      Connect
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-zinc-400 font-medium tracking-wide max-w-xs">
                    Plateforme d'élite des Développeurs
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Gestion des erreurs de réseau éventuelles */}
          {error && (
            <div className="flex flex-col items-center gap-3 text-center z-10 animate-fadeIn">
              <p className="text-xs text-rose-400 max-w-xs">
                {error || "Connexion instable. Vérifiez votre réseau puis réessayez."}
              </p>
              <button
                type="button"
                onClick={onRetry}
                className="rounded-full border border-amber-500/50 bg-amber-500/10 px-4 py-1.5 text-xs font-bold text-amber-400 hover:bg-amber-500/20 cursor-pointer transition-all shadow-md"
              >
                Réessayer le chargement
              </button>
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
