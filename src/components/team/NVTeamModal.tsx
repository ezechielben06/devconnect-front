// Fiche technique officielle de la NV TEAM pour le jury CADEV 2026.
// Narcisse (Lead Frontend & UI/UX) x Vertueux (Lead Backend & Architecte Systèmes Distribués).
import React from 'react';
import { X, CheckCircle2, Phone, Sparkles, Terminal, Database, MessageCircle } from 'lucide-react';
import { avatarNarcisse, avatarVertueux } from '../../services/mockData';

interface NVTeamModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function NVTeamModal({ isOpen, onClose }: NVTeamModalProps) {
  if (!isOpen) return null;

  const teamContact = '+229 01 00 00 00';
  const cleanContactNumber = '22901000000';

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/75 backdrop-blur-md animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl bg-white/95 dark:bg-[#0B1021]/95 backdrop-blur-2xl border border-white/60 dark:border-white/10 rounded-3xl p-5 sm:p-7 shadow-[0_25px_70px_-15px_rgba(0,102,255,0.35)] overflow-hidden transition-all max-h-[90vh] overflow-y-auto no-scrollbar"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="absolute -top-24 -left-24 w-60 h-60 bg-[#0066FF]/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-60 h-60 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />

        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all cursor-pointer z-10"
          aria-label="Fermer la présentation"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center space-y-2 mb-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 text-[#0066FF] dark:text-cyan-400 text-xs font-black uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Collectif Officiel &middot; Challenge CADEV 2026</span>
          </div>
          <h3 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            NV TEAM
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-md mx-auto leading-relaxed">
            Association d'ingénieurs béninois unissant leurs expertises pour concevoir <strong>DevConnect</strong>, la plateforme d'élite des développeurs au Bénin.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          <div className="p-4 sm:p-5 rounded-2xl bg-slate-50/80 dark:bg-slate-900/60 border border-blue-200/70 dark:border-slate-800 flex flex-col justify-between space-y-4 relative overflow-hidden group hover:border-[#0066FF]/60 transition-all">
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <img
                    src={avatarNarcisse}
                    alt="Gbenagnon Narcisse AVLESSI"
                    referrerPolicy="no-referrer"
                    loading="lazy"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src = 'https://images.unsplash.com/photo-1531384441138-2736e62e0919?auto=format&fit=crop&w=400&q=80';
                    }}
                    className="w-14 h-14 rounded-2xl object-cover ring-2 ring-[#0066FF]/30"
                  />
                  <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-[#0066FF] text-white flex items-center justify-center text-[10px] shadow">
                    <Terminal className="w-3 h-3" />
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-black text-slate-900 dark:text-white leading-tight">
                    Gbenagnon Narcisse AVLESSI
                  </h4>
                  <span className="inline-block mt-0.5 text-[11px] font-bold text-[#0066FF] dark:text-cyan-400">
                    Lead Architecte Frontend & UI/UX
                  </span>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400">
                    Co-fondateur NV TEAM
                  </p>
                </div>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                Spécialiste de l'architecture client haute performance : React 19, TypeScript strict, WebGL fluide, Tailwind CSS et ergonomie glassmorphism iOS 26.
              </p>
              <div className="flex flex-wrap gap-1.5 pt-1">
                {['React 19', 'TypeScript', 'UI/UX Glassmorphism', 'WebGL', 'PWA'].map((skill) => (
                  <span
                    key={skill}
                    className="text-[10px] font-semibold px-2 py-0.5 rounded-lg bg-blue-100/70 text-[#0066FF] dark:bg-blue-950/70 dark:text-cyan-300 border border-blue-200 dark:border-blue-900"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
            <div className="pt-2 border-t border-slate-200/60 dark:border-slate-800 text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
              <span>Charge exclusive du Frontend</span>
            </div>
          </div>

          <div className="p-4 sm:p-5 rounded-2xl bg-slate-50/80 dark:bg-slate-900/60 border border-emerald-200/70 dark:border-slate-800 flex flex-col justify-between space-y-4 relative overflow-hidden group hover:border-emerald-500/60 transition-all">
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <img
                    src={avatarVertueux}
                    alt="Mahukpégo Vertueux NOUKPO"
                    referrerPolicy="no-referrer"
                    loading="lazy"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src = 'https://images.unsplash.com/photo-1507152832244-10d45c7eda57?auto=format&fit=crop&w=400&q=80';
                    }}
                    className="w-14 h-14 rounded-2xl object-cover ring-2 ring-emerald-500/30"
                  />
                  <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[10px] shadow">
                    <Database className="w-3 h-3" />
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-black text-slate-900 dark:text-white leading-tight">
                    Mahukpégo Vertueux NOUKPO
                  </h4>
                  <span className="inline-block mt-0.5 text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
                    Lead Architecte Backend & Systèmes
                  </span>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400">
                    Co-fondateur NV TEAM
                  </p>
                </div>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                Ingénieur systèmes et bases de données : microservices distribués, sécurité OWASP, PostgreSQL, APIs résilientes et passerelles Mobile Money (MTN MoMo, Celtiis Cash).
              </p>
              <div className="flex flex-wrap gap-1.5 pt-1">
                {['Node.js', 'FastAPI', 'PostgreSQL', 'Docker', 'MoMo APIs'].map((skill) => (
                  <span
                    key={skill}
                    className="text-[10px] font-semibold px-2 py-0.5 rounded-lg bg-emerald-100/70 text-emerald-700 dark:bg-emerald-950/70 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-900"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
            <div className="pt-2 border-t border-slate-200/60 dark:border-slate-800 text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
              <span>Charge intégrale du Backend & APIs</span>
            </div>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-500/10 via-indigo-500/10 to-blue-500/5 dark:bg-blue-950/40 border border-blue-500/20 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#0066FF] text-white flex items-center justify-center shrink-0 shadow-md shadow-blue-500/20">
              <Phone className="w-4 h-4" />
            </div>
            <div>
              <span className="font-extrabold text-slate-900 dark:text-white block">
                Contact officiel de la NV TEAM :
              </span>
              <span className="text-xs font-mono font-bold text-[#0066FF] dark:text-cyan-400">
                {teamContact}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <a
              href={`https://wa.me/${cleanContactNumber}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold transition-all shadow-sm"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>WhatsApp</span>
            </a>
            <a
              href={`tel:${teamContact}`}
              className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#0066FF] hover:bg-blue-600 text-white font-bold transition-all shadow-sm"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>Appeler</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
