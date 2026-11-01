// Plan du site interactif (Sitemap modal) avec raccourcis claviers Enter/Space.
// Permet de switcher d'un module à l'autre en un clic sans chercher dans la TopBar.
import React from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { useApp } from '../../context/AppContext';
import { ActiveTab } from '../../types';
import { Users, Briefcase, HelpCircle, MessageSquare, User, ExternalLink } from 'lucide-react';

export function SitemapModal() {
  const { sitemapModalOpen, setSitemapModalOpen, setActiveTab, language } = useApp();

  const handleNavigate = (tab: ActiveTab) => {
    setActiveTab(tab);
    setSitemapModalOpen(false);
  };

  const sections: {
    tab: ActiveTab;
    titleFr: string;
    titleEn: string;
    descFr: string;
    descEn: string;
    icon: React.ReactNode;
  }[] = [
    {
      tab: 'matching',
      titleFr: 'Réseau de Développeurs',
      titleEn: 'Developer Network',
      descFr: 'Annuaire des ingénieurs certifiés au Bénin et à l\'international, recherche par technologies et filtres de disponibilité.',
      descEn: 'Directory of certified engineers, technology filters, and availability search.',
      icon: <Users className="w-4 h-4 text-[#0066FF] dark:text-cyan-400" />,
    },
    {
      tab: 'projects',
      titleFr: 'Tableau des Projets & Missions',
      titleEn: 'Projects & Freelance Board',
      descFr: 'Offres de missions techniques à pourvoir, budgets clairs en FCFA, niveaux d\'expertise et dépôt de candidatures.',
      descEn: 'Technical freelance projects, transparent budgets in FCFA, difficulty levels, and applications.',
      icon: <Briefcase className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />,
    },
    {
      tab: 'qa',
      titleFr: 'Échanges Techniques & Q&A',
      titleEn: 'Technical Q&A',
      descFr: 'Discussions approfondies sur React 19, TypeScript, Rust, microservices et architectures distribuées.',
      descEn: 'In-depth discussions on React 19, TypeScript, Rust, distributed systems, and architectures.',
      icon: <HelpCircle className="w-4 h-4 text-amber-600 dark:text-amber-400" />,
    },
    {
      tab: 'chat',
      titleFr: 'Canaux de Chat Direct & Code',
      titleEn: 'Chat Channels & Code',
      descFr: 'Salons de discussion thématiques avec coloration syntaxique VS Code et partage de code sécurisé.',
      descEn: 'Thematic discussion channels with instant translation and syntax-highlighted code sharing.',
      icon: <MessageSquare className="w-4 h-4 text-sky-600 dark:text-sky-400" />,
    },
    {
      tab: 'profile',
      titleFr: 'Profil Professionnel & Portfolio',
      titleEn: 'Professional Profile & Portfolio',
      descFr: 'Gestion de vos compétences certifiées, réseaux sociaux, état civil et paramètres de confidentialité.',
      descEn: 'Manage your verified skills, reputation score, social links, and privacy settings.',
      icon: <User className="w-4 h-4 text-purple-600 dark:text-purple-400" />,
    },
  ];

  return (
    <Modal
      isOpen={sitemapModalOpen}
      onClose={() => setSitemapModalOpen(false)}
      title={language === 'fr' ? 'Plan du site DevConnect' : 'DevConnect Site Structure'}
      description={
        language === 'fr'
          ? 'Vue panoramique de tous les modules de la plateforme avec accès direct.'
          : 'High-level overview of all platform modules with immediate access.'
      }
      maxWidth="lg"
    >
      <div className="space-y-4">
        <div className="grid gap-2.5">
          {sections.map((sec) => (
            <div
              key={sec.tab}
              onClick={() => handleNavigate(sec.tab)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  handleNavigate(sec.tab);
                }
              }}
              className="p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800/80 bg-slate-50/70 dark:bg-slate-900/40 hover:border-[#0066FF]/60 hover:bg-blue-50/40 dark:hover:bg-slate-800/60 transition-all flex items-center justify-between cursor-pointer group"
            >
              <div className="flex items-start gap-3 min-w-0 pr-3">
                <div className="p-2 rounded-xl bg-white dark:bg-slate-800/80 shadow-xs shrink-0 mt-0.5">
                  {sec.icon}
                </div>
                <div className="min-w-0">
                  <h4 className="text-sm font-bold text-slate-900 dark:text-slate-200 group-hover:text-[#0066FF] dark:group-hover:text-cyan-400 transition-colors">
                    {language === 'fr' ? sec.titleFr : sec.titleEn}
                  </h4>
                  <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-1 mt-0.5">
                    {language === 'fr' ? sec.descFr : sec.descEn}
                  </p>
                </div>
              </div>
              <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-[#0066FF] dark:group-hover:text-cyan-400 shrink-0 transition-colors" aria-hidden="true" />
            </div>
          ))}
        </div>

        <div className="flex justify-end pt-3 border-t border-slate-200 dark:border-slate-800/80">
          <Button variant="secondary" size="sm" onClick={() => setSitemapModalOpen(false)}>
            {language === 'fr' ? 'Fermer' : 'Close'}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
