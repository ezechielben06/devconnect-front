import { useCallback, useEffect, useState } from "react";
import { runBootTasks, type BootTask } from "../lib/bootstrap";
import { bootTasks } from "../lib/boot-tasks";

// Hook d'amorçage initial. Utilise un AbortController pour survivre
// au double render du StrictMode de React 18 sans update de state zombie.

type BootData = {
  progress: number; // de 0 à 1
  ready: boolean;
  error: string | null;
  data: Record<string, unknown>;
};

const INITIAL: BootData = { progress: 0, ready: false, error: null, data: {} };

export function useBoot(tasks: BootTask[] = bootTasks) {
  const [attempt, setAttempt] = useState(0);
  const [state, setState] = useState<BootData>(INITIAL);

  useEffect(() => {
    const controller = new AbortController();
    setState(INITIAL);

    runBootTasks(
      tasks,
      (done, total) => {
        if (!controller.signal.aborted) {
          setState((s) => ({ ...s, progress: done / total }));
        }
      },
      controller.signal,
    )
      .then(({ data }) => {
        if (!controller.signal.aborted) {
          setState((s) => ({ ...s, progress: 1, ready: true, data }));
        }
      })
      .catch((error: unknown) => {
        if (!controller.signal.aborted) {
          setState((s) => ({
            ...s,
            error: error instanceof Error ? error.message : "Erreur de chargement",
          }));
        }
      });

    // Annule les requêtes en cours si le composant est démonté (ou en mode StrictMode)
    return () => controller.abort();
  }, [tasks, attempt]);

  const retry = useCallback(() => setAttempt((a) => a + 1), []);

  return { ...state, retry };
}
