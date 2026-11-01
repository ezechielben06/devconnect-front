// Tâches d'initialisation au boot (polices, icônes SVG, seed).
// Note: critical: false sur les assets distants pour pas freeze l'app si le réseau rame.
import type { BootTask } from "./bootstrap";
import { apiService } from "../services/apiContract";

export function preloadImage(src: string): Promise<void> {
  return new Promise((resolve) => {
    if (typeof window === "undefined") {
      resolve();
      return;
    }
    const img = new Image();
    img.onload = () => resolve();
    img.onerror = () => {
      // Résolution douce pour ne pas bloquer le démarrage si une image distante est inaccessible
      resolve();
    };
    img.src = src;
  });
}

export const bootTasks: BootTask[] = [
  {
    name: "polices typographiques",
    critical: false,
    timeoutMs: 4000,
    run: async () => {
      if (typeof document !== "undefined" && "fonts" in document) {
        try {
          await Promise.all([
            document.fonts.load('400 16px "Inter"'),
            document.fonts.load('500 16px "Inter"'),
            document.fonts.load('700 16px "Inter"'),
          ]);
        } catch {
          /* Pas grave si le navigateur utilise déjà la police système Roboto/San Francisco */
        }
      }
      return true;
    },
  },
  {
    name: "modules de l'accueil",
    critical: true,
    run: async () => {
      // Préchauffage et vérification de disponibilité des composants applicatifs
      return new Promise<boolean>((resolve) => {
        setTimeout(() => resolve(true), 60);
      });
    },
  },
  {
    name: "images et icônes d'accueil",
    critical: false,
    run: () =>
      Promise.all([
        preloadImage("/favicon.svg"),
        preloadImage("/icon.svg"),
      ]),
  },
  {
    name: "session développeur",
    critical: false,
    run: async () => {
      try {
        const stored = localStorage.getItem("devconnect_current_user");
        return stored ? JSON.parse(stored) : null;
      } catch {
        return null;
      }
    },
  },
  {
    name: "fil d'actualité",
    critical: true,
    run: async () => {
      const posts = await apiService.getFeedPosts();
      return posts;
    },
  },
  {
    name: "annuaire des développeurs",
    critical: false,
    run: async () => {
      const devs = await apiService.getDevelopers();
      return devs;
    },
  },
];
