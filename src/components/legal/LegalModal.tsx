// Modale juridique regroupant CGU, politique APDP Bénin (Loi 2017-20) et mentions officielles NV TEAM.
// Tout est rédigé au carré pour la conformité CADEV 2026.
import React from 'react';
import { useApp } from '../../context/AppContext';
import { ShieldCheck, FileText, Scale, X, CheckCircle, Trophy } from 'lucide-react';
import { Button } from '../ui/Button';

export type LegalTab = 'cgu' | 'privacy' | 'mentions' | 'apdp' | 'sitemap';

export function LegalModal() {
  const { legalModalOpen, setLegalModalOpen, legalModalTab, setLegalModalTab } = useApp();

  if (!legalModalOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="legal-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-md animate-fadeIn"
      onClick={(e) => {
        if (e.target === e.currentTarget) setLegalModalOpen(false);
      }}
    >
      <div className="relative w-full max-w-3xl max-h-[85vh] flex flex-col bg-white/95 dark:bg-slate-900/95 backdrop-blur-2xl border border-white/60 dark:border-white/10 rounded-3xl shadow-[0_20px_60px_-15px_rgba(0,102,255,0.25)] overflow-hidden">
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-200/80 dark:border-slate-800 bg-gradient-to-r from-blue-50/50 via-white to-blue-50/30 dark:from-slate-900 dark:via-slate-900 dark:to-slate-900 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-500/10 dark:bg-blue-500/20 text-[#0066FF] flex items-center justify-center border border-blue-500/20 shadow-xs">
              <Scale className="w-5 h-5" />
            </div>
            <div>
              <h2 id="legal-modal-title" className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                Cadre Juridique & Protection des Données
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                République du Bénin &middot; Code du Numérique (Loi 2017-20) &middot; NV TEAM (CADEV 2026)
              </p>
            </div>
          </div>
          <button
            onClick={() => setLegalModalOpen(false)}
            className="w-9 h-9 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            aria-label="Fermer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex items-center gap-2 px-6 pt-3 pb-2 border-b border-slate-200/60 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40 overflow-x-auto no-scrollbar shrink-0">
          <button
            onClick={() => setLegalModalTab('cgu')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all whitespace-nowrap cursor-pointer ${
              legalModalTab === 'cgu'
                ? 'bg-[#0066FF] text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200/60 dark:hover:bg-slate-800'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Conditions Générales (CGU)</span>
          </button>
          <button
            onClick={() => setLegalModalTab('privacy')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all whitespace-nowrap cursor-pointer ${
              legalModalTab === 'privacy'
                ? 'bg-[#0066FF] text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200/60 dark:hover:bg-slate-800'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Politique de Confidentialité</span>
          </button>
          <button
            onClick={() => setLegalModalTab('mentions')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all whitespace-nowrap cursor-pointer ${
              legalModalTab === 'mentions'
                ? 'bg-[#0066FF] text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200/60 dark:hover:bg-slate-800'
            }`}
          >
            <Scale className="w-3.5 h-3.5" />
            <span>Mentions Légales & NV TEAM</span>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto no-scrollbar p-6 text-sm text-slate-700 dark:text-slate-300 space-y-4">
          {legalModalTab === 'cgu' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-blue-50/60 dark:bg-blue-950/30 border border-blue-200/60 dark:border-blue-900/40">
                <h3 className="font-semibold text-blue-900 dark:text-blue-200 flex items-center gap-2 text-sm">
                  <CheckCircle className="w-4 h-4 text-[#0066FF]" />
                  Règles d'utilisation de la plateforme DevConnect
                </h3>
                <p className="text-xs text-blue-800/80 dark:text-blue-300/80 mt-1">
                  En vigueur pour le Challenge CADEV 2026. Applicable à l'ensemble des développeurs, recruteurs et partenaires au Bénin.
                </p>
              </div>

              <section className="space-y-1.5">
                <h4 className="font-bold text-slate-900 dark:text-white text-xs sm:text-sm">Article 1 &mdash; Objet & Cadre CADEV 2026</h4>
                <p className="text-xs leading-relaxed text-slate-600 dark:text-slate-300">
                  DevConnect est une plateforme d'élite conçue par la <strong>NV TEAM</strong> dans le cadre de la compétition d'innovation <strong>CADEV 2026</strong>. Elle fédère les compétences tech béninoises, simplifie les recrutements techniques et encourage le partage de connaissances en open-source.
                </p>
              </section>

              <section className="space-y-1.5">
                <h4 className="font-bold text-slate-900 dark:text-white text-xs sm:text-sm">Article 2 &mdash; Tarifs & Devis exclusivement en FCFA</h4>
                <p className="text-xs leading-relaxed text-slate-600 dark:text-slate-300">
                  Conformément aux normes économiques de l'UEMOA, l'ensemble des taux horaires et des budgets de projets sont libellés en <strong>Francs CFA (XOF / FCFA)</strong>. Les passerelles de paiement prévues supporteront les opérateurs béninois (MTN MoMo, Moov Money, Celtiis Cash) ainsi que les virements interbancaires.
                </p>
              </section>

              <section className="space-y-1.5">
                <h4 className="font-bold text-slate-900 dark:text-white text-xs sm:text-sm">Article 3 &mdash; Propriété Intellectuelle</h4>
                <p className="text-xs leading-relaxed text-slate-600 dark:text-slate-300">
                  Les codes sources partagés sur le fil public relèvent de la responsabilité de leurs auteurs respectifs. Les droits patrimoniaux sur les missions privées sont protégés conformément aux accords bilatéraux et aux dispositions de l'OAPI.
                </p>
              </section>
            </div>
          )}

          {legalModalTab === 'privacy' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-200/60 dark:border-emerald-900/40">
                <h3 className="font-semibold text-emerald-900 dark:text-emerald-200 flex items-center gap-2 text-sm">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  Protection de la Vie Privée (Loi n° 2017-20)
                </h3>
                <p className="text-xs text-emerald-800/80 dark:text-emerald-300/80 mt-1">
                  Protection rigoureuse des données à caractère personnel et respect de la vie privée.
                </p>
              </div>

              <section className="space-y-1.5">
                <h4 className="font-bold text-slate-900 dark:text-white text-xs sm:text-sm">1. Données demandées lors de l'inscription</h4>
                <p className="text-xs leading-relaxed text-slate-600 dark:text-slate-300">
                  Pour garantir l'authenticité de l'annuaire, nous recueillons : Prénom, Nom (affiché en majuscules pour une identification formelle), email, téléphone béninois (+229), date de naissance, situation matrimoniale, ville de résidence et compétences.
                </p>
              </section>

              <section className="space-y-1.5">
                <h4 className="font-bold text-slate-900 dark:text-white text-xs sm:text-sm">2. Droit de masquage de la vie privée</h4>
                <p className="text-xs leading-relaxed text-slate-600 dark:text-slate-300">
                  Vous disposez d'un contrôle total : vous pouvez décider de rendre publique ou de garder strictement confidentielle votre date de naissance, votre situation matrimoniale ou votre numéro de téléphone via les curseurs de visibilité du profil.
                </p>
              </section>
            </div>
          )}

          {legalModalTab === 'mentions' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-gradient-to-br from-blue-500/10 via-indigo-500/10 to-blue-500/5 dark:bg-blue-950/40 border border-blue-500/30 space-y-3">
                <div className="flex items-center gap-2 text-[#0066FF] dark:text-cyan-300 font-bold text-sm">
                  <Trophy className="w-4 h-4 text-amber-500" />
                  <span>Projet Candidat &middot; Challenge CADEV 2026</span>
                </div>
                <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                  L'application <strong>DevConnect</strong> est une réalisation conjointe de la <strong>NV TEAM</strong>, constituée des deux co-fondateurs ci-dessous, dans le cadre de la compétition d'excellence technologique <strong>CADEV 2026</strong> au Bénin :
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <div className="p-3 rounded-xl bg-white/90 dark:bg-slate-900/90 border border-blue-200/60 dark:border-slate-800">
                    <p className="text-xs font-extrabold text-slate-900 dark:text-white">
                      Gbenagnon Narcisse AVLESSI
                    </p>
                    <p className="text-[11px] text-[#0066FF] dark:text-cyan-400 font-semibold mt-0.5">
                      Lead Architecture Frontend & UI/UX
                    </p>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1 leading-snug">
                      En charge de toute l'implémentation client, interfaces glassmorphism iOS, réactivité React 19, typographie, conformité et accessibilité.
                    </p>
                  </div>
                  <div className="p-3 rounded-xl bg-white/90 dark:bg-slate-900/90 border border-blue-200/60 dark:border-slate-800">
                    <p className="text-xs font-extrabold text-slate-900 dark:text-white">
                      Mahukpégo Vertueux NOUKPO
                    </p>
                    <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold mt-0.5">
                      Lead Architecture Backend & Systèmes
                    </p>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1 leading-snug">
                      En charge de la future architecture serveur, bases de données relationnelles, sécurité des APIs, microservices et logique métier.
                    </p>
                  </div>
                </div>
              </div>

              <section className="space-y-2">
                <h4 className="font-bold text-slate-900 dark:text-white text-xs sm:text-sm">Informations Générales de l'Éditeur</h4>
                <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 text-xs space-y-1.5 leading-relaxed">
                  <p><strong className="text-slate-900 dark:text-white">Collectif Éditeur :</strong> DevConnect Bénin &middot; CADEV 2026</p>
                  <p><strong className="text-slate-900 dark:text-white">Directeurs de publication :</strong> Gbenagnon Narcisse AVLESSI & Mahukpégo Vertueux NOUKPO</p>
                  <p><strong className="text-slate-900 dark:text-white">Cadre d'évaluation :</strong> Challenge National CADEV 2026</p>
                  <p><strong className="text-slate-900 dark:text-white">Siège & Coordination :</strong> Cotonou, République du Bénin</p>
                  <p><strong className="text-slate-900 dark:text-white">Contact officiel :</strong> <a href="mailto:contact@devconnect.bj" title="Écrire à l'équipe DevConnect" className="text-blue-600 dark:text-cyan-400 hover:underline">contact@devconnect.bj</a> &middot; +229 01 00 00 00</p>
                </div>
              </section>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between px-6 py-4 border-t border-slate-200/80 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/60 shrink-0">
          <span className="text-xs text-slate-500 font-medium">
            NV TEAM &middot; Challenge CADEV 2026
          </span>
          <Button
            variant="primary"
            size="sm"
            onClick={() => setLegalModalOpen(false)}
            className="rounded-xl px-5 cursor-pointer"
          >
            Fermer le document
          </Button>
        </div>
      </div>
    </div>
  );
}
