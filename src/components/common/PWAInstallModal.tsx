// Modal guidant l'installation PWA sur Android, iOS et Desktop.
// Comme Safari ne supporte toujours pas beforeinstallprompt, je donne le tuto manuel Share > Sur l'écran d'accueil.
import React from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { usePWAInstall } from '../../hooks/usePWAInstall';
import { useApp } from '../../context/AppContext';
import { Download, CheckCircle2, Smartphone, Globe, Laptop } from 'lucide-react';

export function PWAInstallModal() {
  const { pwaModalOpen, setPwaModalOpen, language } = useApp();
  const { isInstallable, isInstalled, triggerInstall } = usePWAInstall();

  const handleInstallClick = async () => {
    const installed = await triggerInstall();
    if (installed) {
      setPwaModalOpen(false);
    }
  };

  return (
    <Modal
      isOpen={pwaModalOpen}
      onClose={() => setPwaModalOpen(false)}
      title={language === 'fr' ? 'Application Web Progressive (PWA)' : 'Progressive Web App (PWA)'}
      description={
        language === 'fr'
          ? 'Installez DevConnect sur votre appareil pour un accès instantané et une disponibilité hors-ligne totale.'
          : 'Install DevConnect on your device for immediate access and full offline availability.'
      }
      maxWidth="md"
    >
      <div className="space-y-5 text-sm">
        <div className="p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-blue-100 text-[#0066FF] dark:bg-cyan-950/60 dark:text-cyan-400 flex items-center justify-center shrink-0">
              <Download className="w-4 h-4" aria-hidden="true" />
            </div>
            <div>
              <p className="font-bold text-xs sm:text-sm text-slate-900 dark:text-slate-200">
                {language === 'fr' ? 'Statut d\'installation' : 'Installation status'}
              </p>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                {isInstalled
                  ? language === 'fr'
                    ? 'Application déjà installée en mode autonome'
                    : 'Application already installed in standalone mode'
                  : isInstallable
                  ? language === 'fr'
                    ? 'Prête à être installée en un clic'
                    : 'Ready to install in one click'
                  : language === 'fr'
                  ? 'Exécutable directement depuis le navigateur'
                  : 'Executable directly from browser'}
              </p>
            </div>
          </div>
          {isInstalled && (
            <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" aria-hidden="true" />
          )}
        </div>

        {isInstallable && !isInstalled && (
          <Button
            variant="primary"
            fullWidth
            iconLeft={<Download className="w-4 h-4" />}
            onClick={handleInstallClick}
          >
            {language === 'fr' ? 'Installer maintenant' : 'Install now'}
          </Button>
        )}

        <div className="space-y-3">
          <h3 className="text-xs font-bold text-slate-700 dark:text-slate-400 uppercase tracking-wider">
            {language === 'fr' ? 'Instructions manuelles' : 'Manual instructions'}
          </h3>
          <div className="grid gap-2.5">
            <div className="p-3 rounded-2xl border border-slate-200 dark:border-slate-800/80 bg-white dark:bg-slate-900/40 flex items-start gap-3">
              <Laptop className="w-4 h-4 text-[#0066FF] dark:text-cyan-400 shrink-0 mt-0.5" aria-hidden="true" />
              <div>
                <p className="font-bold text-xs text-slate-900 dark:text-slate-200">
                  Chrome / Edge (Bureau)
                </p>
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  {language === 'fr'
                    ? 'Cliquez sur l\'icône d\'installation dans la barre d\'adresses de votre navigateur.'
                    : 'Click the install icon in the browser address bar.'}
                </p>
              </div>
            </div>

            <div className="p-3 rounded-2xl border border-slate-200 dark:border-slate-800/80 bg-white dark:bg-slate-900/40 flex items-start gap-3">
              <Smartphone className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" aria-hidden="true" />
              <div>
                <p className="font-bold text-xs text-slate-900 dark:text-slate-200">
                  iOS Safari
                </p>
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  {language === 'fr'
                    ? 'Appuyez sur Partager puis sur « Sur l\'écran d\'accueil ».'
                    : 'Tap Share then tap « Add to Home Screen ».'}
                </p>
              </div>
            </div>

            <div className="p-3 rounded-2xl border border-slate-200 dark:border-slate-800/80 bg-white dark:bg-slate-900/40 flex items-start gap-3">
              <Globe className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" aria-hidden="true" />
              <div>
                <p className="font-bold text-xs text-slate-900 dark:text-slate-200">
                  Android Chrome
                </p>
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  {language === 'fr'
                    ? 'Ouvrez le menu (3 points) et choisissez « Installer l\'application ».'
                    : 'Open the menu (3 dots) and select « Install app ».'}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-2 border-t border-slate-200 dark:border-slate-800/80">
          <Button variant="secondary" size="sm" onClick={() => setPwaModalOpen(false)}>
            {language === 'fr' ? 'Fermer' : 'Close'}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
