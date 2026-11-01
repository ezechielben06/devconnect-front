// Logo officiel en grille de pixels SVG avec tracé séquentiel animé via motion.
import { motion, useReducedMotion, type Variants } from "motion/react";

// Géométrie et couleurs : doivent rester identiques à scripts/generate_icons.py
const VIEWBOX = 120;
const CELL = 20; // taille d'un pixel
const GAP = 4; // espace entre deux pixels
const ORIGIN = 14; // décalage de la grille dans le repère
const PIXEL_RADIUS = 3; // arrondi des pixels
const COLOR_PIXEL = "#F59E0B";
const COLOR_TILE = "#0B0B0C";

// Motif en D : 1 = pixel allumé, 0 = pixel éteint
const PATTERN = [
  [1, 1, 1, 0],
  [1, 0, 0, 1],
  [1, 0, 0, 1],
  [1, 1, 1, 0],
] as const;

// Tracé séquentiel posé des dix carreaux formant le contour du D
const SEQUENTIAL_COORDS: [number, number][] = [
  [0, 0], // 1. Sommet gauche
  [1, 0], // 2. Tronc gauche haut
  [2, 0], // 3. Tronc gauche bas
  [3, 0], // 4. Base gauche
  [3, 1], // 5. Base milieu
  [3, 2], // 6. Base droite
  [2, 3], // 7. Courbe droite inférieure
  [1, 3], // 8. Courbe droite supérieure
  [0, 2], // 9. Sommet droit
  [0, 1], // 10. Sommet milieu
];

type Pixel = { x: number; y: number; index: number };

const pixels: Pixel[] = SEQUENTIAL_COORDS.map(([r, c], index) => ({
  x: ORIGIN + c * (CELL + GAP),
  y: ORIGIN + r * (CELL + GAP),
  index,
}));

// Animation standard (topbar, navigation, cartes)
const standardVariants: Variants = {
  hidden: { opacity: 0, scale: 0.4 },
  visible: (i: number) => ({
    opacity: 1,
    scale: 1,
    transition: { delay: i * 0.04 + 0.05, duration: 0.3, ease: "easeOut" },
  }),
  hover: (i: number) => ({
    scale: [1, 1.12, 1],
    transition: { delay: i * 0.03, duration: 0.4, ease: "easeInOut" },
  }),
};

// Animation posée étape par étape pour le chargement (dessin des 10 carreaux puis coloration douce)
const stagedVariants: Variants = {
  hidden: { opacity: 0, scale: 0.2, fill: "#334155" },
  visible: (i: number) => ({
    opacity: 1,
    scale: 1,
    fill: ["#334155", "#64748B", "#F59E0B"],
    transition: {
      opacity: { delay: i * 0.1, duration: 0.35, ease: "easeOut" },
      scale: { delay: i * 0.1, duration: 0.35, ease: "easeOut" },
      fill: { delay: 1.15, duration: 0.55, ease: "easeInOut" },
    },
  }),
  hover: (i: number) => ({
    scale: [1, 1.12, 1],
    transition: { delay: i * 0.03, duration: 0.4, ease: "easeInOut" },
  }),
};

type DevConnectLogoProps = {
  /** Taille en pixels (largeur = hauteur). */
  size?: number;
  /** Affiche le fond arrondi sombre derrière le motif. */
  withTile?: boolean;
  /** Active l'animation d'entrée et de survol. */
  animated?: boolean;
  /** Active l'animation posée (dessin séquentiel puis coloration au boot). */
  stagedIntro?: boolean;
  className?: string;
};

export function DevConnectLogo({
  size = 48,
  withTile = false,
  animated = true,
  stagedIntro = false,
  className,
}: DevConnectLogoProps) {
  // Respecte la préférence utilisateur de réduire les animations
  const reduceMotion = useReducedMotion();
  const shouldAnimate = animated && !reduceMotion;
  const activeVariants = stagedIntro ? stagedVariants : standardVariants;

  return (
    <motion.svg
      role="img"
      aria-label="DevConnect"
      width={size}
      height={size}
      viewBox={`0 0 ${VIEWBOX} ${VIEWBOX}`}
      className={className}
      initial={shouldAnimate ? "hidden" : false}
      animate="visible"
      whileHover={shouldAnimate ? "hover" : undefined}
    >
      {withTile && (
        <rect width={VIEWBOX} height={VIEWBOX} rx={26} fill={COLOR_TILE} />
      )}
      {pixels.map((pixel) => (
        <motion.rect
          key={pixel.index}
          x={pixel.x}
          y={pixel.y}
          width={CELL}
          height={CELL}
          rx={PIXEL_RADIUS}
          fill={stagedIntro ? undefined : COLOR_PIXEL}
          custom={pixel.index}
          variants={activeVariants}
          style={{ transformBox: "fill-box", transformOrigin: "center" }}
        />
      ))}
    </motion.svg>
  );
}

export default DevConnectLogo;
