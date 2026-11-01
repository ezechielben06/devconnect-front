import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  X,
  MapPin,
  Calendar,
  Heart,
  Phone,
  Mail,
  Star,
  CheckCircle2,
  ExternalLink,
  Copy,
  Check,
  Shield,
  Lock,
  Globe,
  Share2,
  Github,
  Linkedin,
  MessageCircle,
  Twitter,
  Instagram,
  Ghost,
  Video,
  Youtube,
  Send,
  UserPlus,
  UserCheck,
  Clock,
} from 'lucide-react';
import { Button } from '../ui/Button';
import { formatNameWithUpperLastName } from '../../utils/formatters';
import { parseBirthDateHelper } from './UserProfileModule';

// Modale d'inspection d'un profil dev (bio, stacks, dispo, contact direct).
// J'ai viré la navigation par URL pour cette vue : la modale évite de casser le flux de recherche et garde le scroll en place.
export function DeveloperDetailModal() {
  const {
    inspectDeveloper,
    setInspectDeveloper,
    sendInvitation,
    cancelInvitation,
    getConnectionStatus,
  } = useApp();
  const [copied, setCopied] = useState(false);

  if (!inspectDeveloper) return null;

  const dev = inspectDeveloper;

  const handleCopyProfile = () => {
    navigator.clipboard?.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="developer-detail-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/75 backdrop-blur-md animate-fadeIn"
      onClick={(e) => {
        if (e.target === e.currentTarget) setInspectDeveloper(null);
      }}
    >
      <div className="relative w-full max-w-2xl max-h-[90vh] flex flex-col bg-white/95 dark:bg-slate-900/95 backdrop-blur-2xl border border-white/60 dark:border-white/10 rounded-3xl shadow-[0_25px_70px_-15px_rgba(0,102,255,0.3)] overflow-hidden">
        {/* Bannière supérieure de profil vitrée avec reflets iOS 26 */}
        <div className="relative h-28 sm:h-36 bg-gradient-to-r from-[#0066FF] via-[#0052CC] to-[#0A1128] overflow-hidden shrink-0">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.25),transparent_60%)]" />
          <div className="absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-black/40 to-transparent" />
          
          {/* Bouton de fermeture supérieur */}
          <button
            onClick={() => setInspectDeveloper(null)}
            className="absolute top-3 right-3 sm:top-4 sm:right-4 w-9 h-9 rounded-full bg-black/40 hover:bg-black/60 text-white flex items-center justify-center backdrop-blur-md border border-white/20 transition-all z-20 cursor-pointer"
            aria-label="Fermer le profil"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Badge disponibilité en haut à gauche */}
          <div className="absolute top-3 left-3 sm:top-4 sm:left-4 z-10">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-white/90 dark:bg-slate-900/90 text-slate-800 dark:text-slate-100 backdrop-blur-md border border-white/40 shadow-sm">
              <span
                className={`w-2 h-2 rounded-full ${
                  dev.availability === 'available'
                    ? 'bg-emerald-500 ring-2 ring-emerald-300'
                    : dev.availability === 'open_to_offers'
                    ? 'bg-blue-500'
                    : 'bg-amber-500'
                }`}
              />
              {dev.availability === 'available'
                ? 'Disponible immédiatement'
                : dev.availability === 'open_to_offers'
                ? 'À l\'écoute d\'opportunités'
                : 'En mission'}
            </span>
          </div>
        </div>

        {/* En-tête profil flottant avec avatar et affichage responsive des prix */}
        <div className="px-5 sm:px-6 pb-2 relative shrink-0">
          <div className="flex flex-col items-center justify-center text-center gap-3 sm:gap-4 -mt-12 sm:-mt-16 mb-4">
            <div className="relative mx-auto">
              <div className="w-20 h-20 sm:w-28 sm:h-28 rounded-2xl sm:rounded-3xl p-1 bg-white dark:bg-slate-900 shadow-xl border-2 border-white/80 dark:border-slate-800 shrink-0 overflow-hidden mx-auto">
                <img
                  src={dev.avatar}
                  alt={`Portrait de ${formatNameWithUpperLastName(dev.name)}`}
                  className="w-full h-full object-cover rounded-xl sm:rounded-2xl"
                  referrerPolicy="no-referrer"
                  loading="lazy"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src = 'https://images.unsplash.com/photo-1531384441138-2736e62e0919?auto=format&fit=crop&w=400&q=80';
                  }}
                />
              </div>
              {dev.verified && (
                <div
                  className="absolute -bottom-1 -right-1 w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-[#0066FF] text-white flex items-center justify-center shadow-md border-2 border-white dark:border-slate-900"
                  title="Identité vérifiée par DevConnect Bénin"
                >
                  <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </div>
              )}
            </div>

            {/* Taux horaire en FCFA et réputation */}
            <div className="flex items-center justify-center gap-2 sm:gap-3 flex-wrap">
              <div className="px-3 py-1.5 sm:px-4 sm:py-2 rounded-2xl bg-blue-50/90 dark:bg-blue-950/50 border border-blue-200/80 dark:border-blue-900/50 text-center shrink-0">
                <div className="text-base sm:text-lg font-black text-[#0066FF] dark:text-cyan-400 tabular-nums whitespace-nowrap">
                  {dev.hourlyRate.toLocaleString('fr-FR')} FCFA
                </div>
                <div className="text-[10px] sm:text-[11px] text-slate-500 dark:text-slate-400 font-medium">Taux horaire /h</div>
              </div>

              <div className="px-3 py-1.5 sm:px-4 sm:py-2 rounded-2xl bg-slate-100/90 dark:bg-slate-800/70 border border-slate-200/80 dark:border-slate-700/70 text-center shrink-0">
                <div className="text-base sm:text-lg font-black text-amber-500 flex items-center justify-center gap-1">
                  <Star className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-amber-500 text-amber-500" />
                  <span className="text-slate-900 dark:text-white tabular-nums">{dev.rating}</span>
                </div>
                <div className="text-[10px] sm:text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                  {dev.completedProjectsCount} missions
                </div>
              </div>
            </div>
          </div>

          {/* Nom du profil au format standard CADEV 2026 */}
          <div className="flex flex-col items-center justify-center text-center">
            <div className="flex items-center justify-center gap-2 flex-wrap">
              <h2
                id="developer-detail-title"
                className="text-lg sm:2xl font-black text-slate-900 dark:text-white tracking-tight whitespace-nowrap"
              >
                {formatNameWithUpperLastName(dev.name)}
              </h2>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-blue-100 text-[#0066FF] dark:bg-blue-950 dark:text-cyan-400 font-bold border border-blue-200 dark:border-blue-800 whitespace-nowrap">
                PRO CERTIFIÉ
              </span>
            </div>
            <p className="text-xs sm:text-sm font-semibold text-[#0066FF] dark:text-cyan-400 mt-0.5 whitespace-nowrap">
              {dev.title || dev.role}
            </p>
            <div className="flex items-center justify-center gap-3 text-xs text-slate-500 dark:text-slate-400 mt-1.5 flex-wrap whitespace-nowrap">
              <span className="flex items-center gap-1 font-medium text-slate-700 dark:text-slate-300 shrink-0">
                <MapPin className="w-3.5 h-3.5 text-red-500 shrink-0" />
                {dev.residenceCity || dev.location}, {dev.country}
              </span>
              <span>&middot;</span>
              <span>{dev.experienceYears} ans d'expérience</span>
              <span>&middot;</span>
              <span className="text-emerald-600 dark:text-emerald-400 font-semibold">
                {dev.reputation} pts réputation
              </span>
            </div>
          </div>
        </div>

        {/* Contenu détaillé déroulant sans scrollbar visible */}
        <div className="flex-1 overflow-y-auto no-scrollbar px-5 sm:px-6 py-4 space-y-5 text-sm">
          {/* Biographie */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2">
              À propos du développeur
            </h3>
            <p className="text-xs sm:text-sm leading-relaxed text-slate-700 dark:text-slate-300 bg-slate-50/80 dark:bg-slate-800/40 p-4 rounded-2xl border border-slate-200/60 dark:border-slate-800">
              {dev.bioFr}
            </p>
          </div>

          {/* RÉSEAUX SOCIAUX & LIENS ACCESSIBLES ET VISIBLES */}
          <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-blue-50/60 via-slate-50 to-blue-50/30 dark:from-slate-800/50 dark:via-slate-900/60 dark:to-slate-800/40 border border-blue-200/70 dark:border-slate-700/70 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                <Globe className="w-4 h-4 text-[#0066FF] dark:text-cyan-400" />
                <span>Réseaux Sociaux & Liens Professionnels</span>
              </h3>
              <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold bg-emerald-100/70 dark:bg-emerald-950/70 px-2 py-0.5 rounded-full border border-emerald-300 dark:border-emerald-800">
                Vérifiés & Actifs
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
              {dev.whatsappUrl && (
                <a
                  href={dev.whatsappUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-between p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800/80 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100/70 transition-all group"
                >
                  <div className="flex items-center gap-2.5">
                    <MessageCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                    <span className="text-xs font-bold">WhatsApp Direct</span>
                  </div>
                  <ExternalLink className="w-3.5 h-3.5 opacity-70 group-hover:opacity-100 transition-opacity" />
                </a>
              )}

              {dev.linkedinUrl && (
                <a
                  href={dev.linkedinUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-between p-2.5 rounded-xl bg-blue-50 dark:bg-blue-950/50 border border-blue-200 dark:border-blue-800/80 text-[#0066FF] dark:text-cyan-300 hover:bg-blue-100/70 transition-all group"
                >
                  <div className="flex items-center gap-2.5">
                    <Linkedin className="w-4 h-4 text-[#0066FF] shrink-0" />
                    <span className="text-xs font-bold">LinkedIn</span>
                  </div>
                  <ExternalLink className="w-3.5 h-3.5 opacity-70 group-hover:opacity-100 transition-opacity" />
                </a>
              )}

              {dev.githubUrl && (
                <a
                  href={dev.githubUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-between p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 hover:bg-slate-200/70 transition-all group"
                >
                  <div className="flex items-center gap-2.5">
                    <Github className="w-4 h-4 text-slate-800 dark:text-slate-200 shrink-0" />
                    <span className="text-xs font-bold">GitHub Code</span>
                  </div>
                  <ExternalLink className="w-3.5 h-3.5 opacity-70 group-hover:opacity-100 transition-opacity" />
                </a>
              )}

              {dev.portfolioUrl && (
                <a
                  href={dev.portfolioUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-between p-2.5 rounded-xl bg-cyan-50 dark:bg-cyan-950/50 border border-cyan-200 dark:border-cyan-800/80 text-cyan-700 dark:text-cyan-300 hover:bg-cyan-100/70 transition-all group"
                >
                  <div className="flex items-center gap-2.5">
                    <Globe className="w-4 h-4 text-cyan-600 shrink-0" />
                    <span className="text-xs font-bold">Portfolio Web</span>
                  </div>
                  <ExternalLink className="w-3.5 h-3.5 opacity-70 group-hover:opacity-100 transition-opacity" />
                </a>
              )}

              {dev.twitterUrl && (
                <a
                  href={dev.twitterUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-between p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 hover:bg-slate-200/70 transition-all group"
                >
                  <div className="flex items-center gap-2.5">
                    <Twitter className="w-4 h-4 text-slate-900 dark:text-white shrink-0" />
                    <span className="text-xs font-bold">X (Twitter)</span>
                  </div>
                  <ExternalLink className="w-3.5 h-3.5 opacity-70 group-hover:opacity-100 transition-opacity" />
                </a>
              )}

              {dev.facebookUrl && (
                <a
                  href={dev.facebookUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-between p-2.5 rounded-xl bg-blue-50 dark:bg-blue-950/50 border border-blue-200 dark:border-blue-800/80 text-blue-700 dark:text-blue-300 hover:bg-blue-100/70 transition-all group"
                >
                  <div className="flex items-center gap-2.5">
                    <Share2 className="w-4 h-4 text-blue-600 shrink-0" />
                    <span className="text-xs font-bold">Facebook</span>
                  </div>
                  <ExternalLink className="w-3.5 h-3.5 opacity-70 group-hover:opacity-100 transition-opacity" />
                </a>
              )}

              {dev.instagramUrl && (
                <a
                  href={dev.instagramUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-between p-2.5 rounded-xl bg-pink-50 dark:bg-pink-950/50 border border-pink-200 dark:border-pink-800/80 text-pink-700 dark:text-pink-300 hover:bg-pink-100/70 transition-all group"
                >
                  <div className="flex items-center gap-2.5">
                    <Instagram className="w-4 h-4 text-pink-500 shrink-0" />
                    <span className="text-xs font-bold">Instagram</span>
                  </div>
                  <ExternalLink className="w-3.5 h-3.5 opacity-70 group-hover:opacity-100 transition-opacity" />
                </a>
              )}

              {dev.telegramUrl && (
                <a
                  href={dev.telegramUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-between p-2.5 rounded-xl bg-sky-50 dark:bg-sky-950/50 border border-sky-200 dark:border-sky-800/80 text-sky-700 dark:text-sky-300 hover:bg-sky-100/70 transition-all group"
                >
                  <div className="flex items-center gap-2.5">
                    <Send className="w-4 h-4 text-sky-500 shrink-0" />
                    <span className="text-xs font-bold">Telegram</span>
                  </div>
                  <ExternalLink className="w-3.5 h-3.5 opacity-70 group-hover:opacity-100 transition-opacity" />
                </a>
              )}

              {dev.youtubeUrl && (
                <a
                  href={dev.youtubeUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-between p-2.5 rounded-xl bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-800/80 text-red-700 dark:text-red-300 hover:bg-red-100/70 transition-all group"
                >
                  <div className="flex items-center gap-2.5">
                    <Youtube className="w-4 h-4 text-red-600 shrink-0" />
                    <span className="text-xs font-bold">Chaîne YouTube</span>
                  </div>
                  <ExternalLink className="w-3.5 h-3.5 opacity-70 group-hover:opacity-100 transition-opacity" />
                </a>
              )}

              {dev.snapchatUrl && (
                <a
                  href={dev.snapchatUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-between p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-800/80 text-amber-700 dark:text-amber-300 hover:bg-amber-100/70 transition-all group"
                >
                  <div className="flex items-center gap-2.5">
                    <Ghost className="w-4 h-4 text-amber-500 shrink-0" />
                    <span className="text-xs font-bold">Snapchat</span>
                  </div>
                  <ExternalLink className="w-3.5 h-3.5 opacity-70 group-hover:opacity-100 transition-opacity" />
                </a>
              )}

              {dev.tiktokUrl && (
                <a
                  href={dev.tiktokUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-between p-2.5 rounded-xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800/80 text-rose-700 dark:text-rose-300 hover:bg-rose-100/70 transition-all group"
                >
                  <div className="flex items-center gap-2.5">
                    <Video className="w-4 h-4 text-rose-500 shrink-0" />
                    <span className="text-xs font-bold">TikTok</span>
                  </div>
                  <ExternalLink className="w-3.5 h-3.5 opacity-70 group-hover:opacity-100 transition-opacity" />
                </a>
              )}
            </div>
          </div>

          {/* INFORMATIONS COMPLÉMENTAIRES D'IDENTIFICATION & CONFIDENTIALITÉ */}
          <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center justify-between">
              <span>Informations Complémentaires & État Civil</span>
              <span className="text-[10px] font-normal normal-case text-slate-400 flex items-center gap-1">
                <Shield className="w-3.5 h-3.5 text-[#0066FF]" />
                Conformité APDP Bénin
              </span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* Date de naissance */}
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-700/60">
                <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 font-medium">
                  <Calendar className="w-3.5 h-3.5 text-[#0066FF]" />
                  <span>Date de naissance</span>
                </div>
                <div className="mt-1 font-semibold text-slate-800 dark:text-slate-200 text-xs">
                  {dev.isBirthDatePublic && dev.birthDate ? (
                    <span className="text-emerald-700 dark:text-emerald-400 font-semibold">
                      {(() => {
                        const parsed = parseBirthDateHelper(dev.birthDate);
                        return parsed.isValid
                          ? `${parsed.formatted}${parsed.age !== undefined ? ` (${parsed.age} ans)` : ''}`
                          : dev.birthDate;
                      })()}
                    </span>
                  ) : (
                    <span className="text-slate-400 flex items-center gap-1 font-normal italic">
                      <Lock className="w-3 h-3" /> Privé
                    </span>
                  )}
                </div>
              </div>

              {/* Situation matrimoniale */}
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-700/60">
                <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 font-medium">
                  <Heart className="w-3.5 h-3.5 text-rose-500" />
                  <span>Situation matrimoniale</span>
                </div>
                <div className="mt-1 font-semibold text-slate-800 dark:text-slate-200 text-xs">
                  {dev.isMaritalStatusPublic && dev.maritalStatus ? (
                    <span className="text-slate-900 dark:text-white">{dev.maritalStatus}</span>
                  ) : (
                    <span className="text-slate-400 flex items-center gap-1 font-normal italic">
                      <Lock className="w-3 h-3" /> Privé
                    </span>
                  )}
                </div>
              </div>

              {/* Numéro de téléphone */}
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-700/60">
                <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 font-medium">
                  <Phone className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Téléphone direct</span>
                </div>
                <div className="mt-1 font-semibold text-slate-800 dark:text-slate-200 text-xs">
                  {dev.isPhonePublic && dev.phoneNumber ? (
                    <a
                      href={`tel:${dev.phoneNumber}`}
                      className="text-[#0066FF] hover:underline font-mono"
                    >
                      {dev.phoneNumber}
                    </a>
                  ) : (
                    <span className="text-slate-400 flex items-center gap-1 font-normal italic">
                      <Lock className="w-3 h-3" /> Masqué
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Email professionnel si disponible */}
            {dev.email && (
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-700/60 text-xs">
                <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                  <Mail className="w-4 h-4 text-[#0066FF]" />
                  <span className="font-mono">{dev.email}</span>
                </div>
                <a
                  href={`mailto:${dev.email}`}
                  className="font-bold text-[#0066FF] hover:underline"
                >
                  Envoyer un email
                </a>
              </div>
            )}
          </div>

          {/* Compétences techniques validées */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2.5">
              Stack technique & Maîtrises certifiées
            </h3>
            <div className="flex flex-wrap gap-2">
              {dev.skills.map((skill) => (
                <span
                  key={skill}
                  className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs font-semibold border border-slate-200/80 dark:border-slate-700/80 shadow-2xs"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Barre d'actions inférieure fixe avec boutons impeccablement alignés */}
        <div className="p-4 sm:p-5 border-t border-slate-200/80 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-950/80 flex items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setInspectDeveloper(null)}
              className="rounded-xl px-4"
            >
              Fermer
            </Button>
            <button
              onClick={handleCopyProfile}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors border border-slate-200 dark:border-slate-700 cursor-pointer shadow-2xs"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Lien copié !' : 'Partager'}</span>
            </button>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {(() => {
              const status = getConnectionStatus(dev.id);
              if (status === 'connected') {
                return (
                  <span className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/60 shrink-0">
                    <UserCheck className="w-3.5 h-3.5" />
                    <span>Connecté</span>
                  </span>
                );
              }
              if (status === 'pending') {
                return (
                  <Button
                    variant="secondary"
                    size="sm"
                    iconLeft={<Clock className="w-3.5 h-3.5 text-amber-500 shrink-0" />}
                    onClick={() => cancelInvitation(dev.id)}
                    className="rounded-xl px-3"
                    title="Cliquer pour annuler l'invitation"
                  >
                    En attente
                  </Button>
                );
              }
              return (
                <Button
                  variant="outline"
                  size="sm"
                  iconLeft={<UserPlus className="w-3.5 h-3.5 text-[#0066FF] shrink-0" />}
                  onClick={() => sendInvitation(dev.id, dev.name)}
                  className="rounded-xl px-3"
                >
                  Ajouter au réseau
                </Button>
              );
            })()}
            {dev.whatsappUrl && (
              <a
                href={dev.whatsappUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white transition-all shadow-sm"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>WhatsApp</span>
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
