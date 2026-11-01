// Runner de promesses en parallèle avec timeout individuel et gestion d'AbortSignal.

export type BootTask<T = unknown> = {
  name: string;
  /** Si vrai, un échec bloque le démarrage et affiche une erreur. */
  critical: boolean;
  /** Délai maximum avant abandon, en millisecondes. */
  timeoutMs?: number;
  run: (signal: AbortSignal) => Promise<T>;
};

export type BootResult = {
  data: Record<string, unknown>;
  failed: string[];
};

/**
 * Lance toutes les tâches en parallèle.
 * onProgress est appelé à chaque tâche terminée : c'est lui qui fait avancer le loader.
 */
export async function runBootTasks(
  tasks: BootTask[],
  onProgress: (done: number, total: number) => void,
  parentSignal?: AbortSignal,
): Promise<BootResult> {
  const data: Record<string, unknown> = {};
  const failed: string[] = [];
  let done = 0;

  await Promise.all(
    tasks.map(async (task) => {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), task.timeoutMs ?? 8000);
      const abort = () => controller.abort();
      parentSignal?.addEventListener("abort", abort, { once: true });

      // Permet d'abandonner aussi les tâches qui ne savent pas annuler (import, etc.)
      const aborted = new Promise<never>((_, reject) => {
        controller.signal.addEventListener(
          "abort",
          () => reject(new Error(`Délai dépassé : ${task.name}`)),
          { once: true },
        );
      });

      try {
        data[task.name] = await Promise.race([task.run(controller.signal), aborted]);
      } catch (error) {
        if (task.critical) throw error;
        failed.push(task.name);
      } finally {
        clearTimeout(timeout);
        parentSignal?.removeEventListener("abort", abort);
        onProgress(++done, tasks.length);
      }
    }),
  );

  return { data, failed };
}
