// Module de matching & annuaire des devs (compétences, dispo, TJM en FCFA).
// Pas de reload de page au clic profil pour pas paumer l'état des filtres et le scroll.

import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { apiService } from '../../services/apiContract';
import { Developer } from '../../types';
import { retirerEmojis } from '../../utils/texte';
import { formatNameWithUpperLastName } from '../../utils/formatters';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Avatar } from '../ui/Avatar';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Modal } from '../ui/Modal';
import { Skeleton } from '../ui/Skeleton';
import { EmptyState } from '../ui/EmptyState';
import {
  Search,
  Filter,
  CheckCircle,
  MapPin,
  Clock,
  Star,
  Mail,
  Send,
  User,
  UserPlus,
  UserCheck,
  Users,
  Check,
  X,
} from 'lucide-react';

export function DeveloperMatchingModule() {
  const {
    language,
    setInspectDeveloper,
    connectedDevIds,
    pendingSentInvitations,
    pendingReceivedInvitations,
    sendInvitation,
    cancelInvitation,
    acceptInvitation,
    rejectInvitation,
    getConnectionStatus,
  } = useApp();
  const [developers, setDevelopers] = useState<Developer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [networkFilter, setNetworkFilter] = useState<'all' | 'connections' | 'invitations'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAvailability, setSelectedAvailability] = useState<string>('all');
  const [selectedSkill, setSelectedSkill] = useState<string>('all');

  const [contactModalDev, setContactModalDev] = useState<Developer | null>(null);
  const [contactSubject, setContactSubject] = useState('');
  const [contactMessage, setContactMessage] = useState('');
  const [contactSent, setContactSent] = useState(false);

  const fetchDevelopers = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await apiService.getDevelopers();
      setDevelopers(data);
    } catch {
      setError(
        language === 'fr'
          ? 'Impossible de charger l\'annuaire des développeurs pour le moment.'
          : 'Unable to load developer directory at the moment.'
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDevelopers();
  }, [language]);

  const allSkills = Array.from(
    new Set(developers.flatMap((d) => d.skills))
  ).slice(0, 8);

  const filteredDevelopers = developers.filter((dev) => {
    const matchesSearch =
      dev.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dev.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dev.skills.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase())) ||
      dev.location.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesAvailability =
      selectedAvailability === 'all' || dev.availability === selectedAvailability;

    const matchesSkill =
      selectedSkill === 'all' || dev.skills.includes(selectedSkill);

    const matchesNetwork =
      networkFilter === 'all' ||
      (networkFilter === 'connections' && connectedDevIds.includes(dev.id));

    return matchesSearch && matchesAvailability && matchesSkill && matchesNetwork;
  });

  const handleSendContact = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactMessage.trim()) return;

    setContactSent(true);
    setTimeout(() => {
      setContactSent(false);
      setContactModalDev(null);
      setContactSubject('');
      setContactMessage('');
    }, 1500);
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 py-6 space-y-6">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-200 dark:border-slate-800/80 pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="w-2 h-2 rounded-full bg-[#0066FF] dark:bg-cyan-400" />
            <span className="text-xs font-bold text-[#0066FF] dark:text-cyan-400 uppercase tracking-wider">
              {language === 'fr' ? 'Écosystème Numérique Bénin & Afrique' : 'Benin & Africa Digital Ecosystem'}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0A1128] dark:text-slate-100 tracking-tight">
            {language === 'fr' ? 'Annuaire des Ingénieurs d\'élite' : 'Elite Engineer Directory'}
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1 max-w-2xl">
            {language === 'fr'
              ? 'Réseau d\'architectes logiciels, leads tech et ingénieurs certifiés au Bénin. Profils vérifiés, compétences prouvées et disponibilité en temps réel.'
              : 'Verified network of software architects, tech leads, and certified engineers in Benin. Proven skills and live availability.'}
          </p>
        </div>

        <div className="flex items-center gap-6 text-xs text-slate-600 dark:text-slate-400 font-mono">
          <div className="text-left md:text-right">
            <span className="block text-lg font-bold text-[#0066FF] dark:text-cyan-400 tabular-nums">
              {developers.length}
            </span>
            <span className="text-[11px] font-sans text-slate-500">
              {language === 'fr' ? 'Profils certifiés' : 'Verified profiles'}
            </span>
          </div>
          <div className="text-left md:text-right">
            <span className="block text-lg font-bold text-emerald-600 dark:text-emerald-400 tabular-nums">
              {developers.filter((d) => d.availability === 'available').length}
            </span>
            <span className="text-[11px] font-sans text-slate-500">
              {language === 'fr' ? 'Disponibles de suite' : 'Available now'}
            </span>
          </div>
        </div>
      </div>

      {/* Barre de navigation des relations & invitations */}
      <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-white/70 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 backdrop-blur-md w-fit flex-wrap">
        <button
          type="button"
          onClick={() => setNetworkFilter('all')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            networkFilter === 'all'
              ? 'bg-[#0066FF] text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Users className="w-3.5 h-3.5" />
          <span>Tous les ingénieurs ({developers.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setNetworkFilter('connections')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            networkFilter === 'connections'
              ? 'bg-[#0066FF] text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <UserCheck className="w-3.5 h-3.5" />
          <span>Mes relations ({connectedDevIds.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setNetworkFilter('invitations')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            networkFilter === 'invitations'
              ? 'bg-[#0066FF] text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Clock className="w-3.5 h-3.5" />
          <span>Invitations reçues</span>
          {pendingReceivedInvitations.length > 0 && (
            <span className="w-5 h-5 rounded-full bg-amber-500 text-white text-[10px] flex items-center justify-center font-bold">
              {pendingReceivedInvitations.length}
            </span>
          )}
        </button>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
        <div className="relative flex-1">
          <Input
            placeholder={
              language === 'fr'
                ? 'Rechercher par nom, compétence, ville (Cotonou, Parakou...)'
                : 'Search by name, skill, or location...'
            }
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            iconLeft={<Search className="w-4 h-4 text-slate-400" />}
          />
        </div>

        <div className="flex items-center gap-2">
          <select
            value={selectedAvailability}
            onChange={(e) => setSelectedAvailability(e.target.value)}
            className="h-10 px-3 rounded-xl text-xs font-medium bg-white text-slate-900 border border-slate-300 dark:bg-[#090D1A] dark:text-slate-200 dark:border-slate-800 focus:outline-none focus:ring-2 focus:ring-[#0066FF]"
            aria-label="Filtrer par disponibilité"
          >
            <option value="all">{language === 'fr' ? 'Tous les statuts' : 'All availability'}</option>
            <option value="available">
              {language === 'fr' ? 'Disponible immédiatement' : 'Available immediately'}
            </option>
            <option value="open_to_offers">
              {language === 'fr' ? 'À l\'écoute d\'opportunités' : 'Open to offers'}
            </option>
            <option value="busy">{language === 'fr' ? 'Occupé pour le moment' : 'Currently busy'}</option>
          </select>
        </div>
      </div>

      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
        <span className="text-xs text-slate-500 font-medium shrink-0 mr-1">
          {language === 'fr' ? 'Technologies :' : 'Skills :'}
        </span>
        <button
          type="button"
          onClick={() => setSelectedSkill('all')}
          className={`px-2.5 py-1 rounded-lg text-xs transition-colors cursor-pointer whitespace-nowrap border ${
            selectedSkill === 'all'
              ? 'bg-blue-50 text-[#0066FF] border-blue-200 font-bold dark:bg-cyan-950/60 dark:text-cyan-300 dark:border-cyan-800/60'
              : 'text-slate-600 hover:text-slate-900 border-slate-200 dark:text-slate-400 dark:hover:text-slate-200 dark:border-slate-800'
          }`}
        >
          {language === 'fr' ? 'Toutes' : 'All'}
        </button>
        {allSkills.map((skill) => (
          <button
            key={skill}
            type="button"
            onClick={() => setSelectedSkill(skill)}
            className={`px-2.5 py-1 rounded-lg text-xs transition-colors cursor-pointer whitespace-nowrap border ${
              selectedSkill === skill
                ? 'bg-blue-50 text-[#0066FF] border-blue-200 font-bold dark:bg-cyan-950/60 dark:text-cyan-300 dark:border-cyan-800/60'
                : 'text-slate-600 hover:text-slate-900 border-slate-200 dark:text-slate-400 dark:hover:text-slate-200 dark:border-slate-800'
            }`}
          >
            {skill}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Card key={i} className="space-y-4">
              <div className="flex items-center gap-3">
                <Skeleton variant="circular" width={48} height={48} />
                <div className="space-y-1.5 flex-1">
                  <Skeleton width={140} height={16} />
                  <Skeleton width={100} height={12} />
                </div>
              </div>
              <Skeleton width="100%" height={32} />
              <div className="flex gap-2">
                <Skeleton width={60} height={20} />
                <Skeleton width={60} height={20} />
              </div>
            </Card>
          ))}
        </div>
      ) : error ? (
        <div className="p-6 rounded-2xl border border-rose-300 dark:border-rose-900/60 bg-rose-50 dark:bg-rose-950/30 text-center space-y-3">
          <p className="text-sm font-medium text-rose-700 dark:text-rose-300">{error}</p>
          <Button variant="outline" size="sm" onClick={fetchDevelopers}>
            {language === 'fr' ? 'Réessayer' : 'Retry'}
          </Button>
        </div>
      ) : filteredDevelopers.length === 0 ? (
        <EmptyState
          icon={<Filter className="w-6 h-6" />}
          title={language === 'fr' ? 'Aucun développeur correspondant' : 'No developers match your filters'}
          description={
            language === 'fr'
              ? 'Modifiez votre mot-clé ou réinitialisez les filtres pour élargir les résultats de recherche.'
              : 'Adjust your search terms or reset the filters to widen results.'
          }
          actionLabel={language === 'fr' ? 'Réinitialiser les filtres' : 'Reset filters'}
          onAction={() => {
            setSearchQuery('');
            setSelectedAvailability('all');
            setSelectedSkill('all');
          }}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4.5">
          {filteredDevelopers.map((dev) => {
            const countryWithoutEmoji = retirerEmojis(dev.country);
            const bio = language === 'fr' ? dev.bioFr : dev.bioEn;
            const formattedName = formatNameWithUpperLastName(dev.name);

            return (
              <Card
                key={dev.id}
                interactive
                className="flex flex-col justify-between h-full group bg-white dark:bg-[#090D1A] border-blue-100/90 dark:border-slate-800 hover:border-[#0066FF]/60 shadow-[0_4px_20px_rgba(0,102,255,0.04)]"
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <Avatar
                        src={dev.avatar}
                        name={formattedName}
                        size="lg"
                        status={dev.availability}
                      />
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <h3 className="text-sm font-black text-[#0A1128] dark:text-slate-100 truncate tracking-tight">
                            {formattedName}
                          </h3>
                          {dev.verified && (
                            <span title="Ingénieur vérifié par DevConnect">
                              <CheckCircle
                                className="w-3.5 h-3.5 text-[#0066FF] dark:text-cyan-400 shrink-0"
                                aria-label="Développeur certifié"
                              />
                            </span>
                          )}
                        </div>
                        <p className="text-xs font-medium text-slate-600 dark:text-slate-400 truncate mt-0.5">
                          {dev.title}
                        </p>
                      </div>
                    </div>
                    {/* Note et taux horaire en FCFA */}
                    <div className="text-right shrink-0">
                      <div className="flex items-center justify-end gap-1 text-amber-500 font-mono text-xs font-bold tabular-nums">
                        <Star className="w-3 h-3 fill-amber-400 text-amber-400" aria-hidden="true" />
                        <span>{dev.rating.toFixed(2)}</span>
                      </div>
                      <span className="text-xs font-mono tabular-nums text-[#0066FF] dark:text-cyan-300 font-bold block mt-0.5 whitespace-nowrap">
                        {dev.hourlyRate.toLocaleString('fr-FR')} FCFA/h
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mb-3 flex-wrap">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-[#0066FF] dark:text-cyan-400 shrink-0" aria-hidden="true" />
                      <span className="font-medium text-slate-700 dark:text-slate-300">{dev.location}, {countryWithoutEmoji}</span>
                    </span>
                    <span aria-hidden="true">&middot;</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-slate-400 shrink-0" aria-hidden="true" />
                      <span className="tabular-nums font-medium">{dev.experienceYears} {language === 'fr' ? 'ans d\'exp.' : 'yrs exp'}</span>
                    </span>
                  </div>

                  <p className="text-xs leading-relaxed text-slate-600 dark:text-slate-300 line-clamp-2 mb-4">
                    {bio}
                  </p>

                  <div className="flex flex-wrap gap-1.5 mb-5">
                    {dev.skills.slice(0, 4).map((skill) => (
                      <Badge key={skill} variant="neutral" size="sm">
                        {skill}
                      </Badge>
                    ))}
                    {dev.skills.length > 4 && (
                      <span className="text-[11px] text-slate-500 self-center font-medium">
                        +{dev.skills.length - 4}
                      </span>
                    )}
                  </div>
                </div>

                {/* Pied de carte avec boutons alignés proprement */}
                <div className="pt-3 border-t border-slate-200 dark:border-slate-800/80 flex items-center justify-between gap-2">
                  <span className="text-xs text-slate-500 dark:text-slate-400 font-medium truncate">
                    {dev.availability === 'available'
                      ? language === 'fr'
                        ? 'Disponible de suite'
                        : 'Available now'
                      : dev.availability === 'busy'
                      ? language === 'fr'
                        ? 'Occupé actuellement'
                        : 'Currently busy'
                      : language === 'fr'
                      ? 'À l\'écoute d\'offres'
                      : 'Open to offers'}
                  </span>
                  <div className="flex items-center gap-1.5 shrink-0 flex-wrap">
                    {(() => {
                      const status = getConnectionStatus(dev.id);
                      if (status === 'connected') {
                        return (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-bold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/60">
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
                        >
                          Inviter
                        </Button>
                      );
                    })()}
                    <Button
                      variant="outline"
                      size="sm"
                      iconLeft={<User className="w-3.5 h-3.5 text-[#0066FF] shrink-0" />}
                      onClick={() => setInspectDeveloper(dev)}
                    >
                      {language === 'fr' ? 'Profil' : 'Profile'}
                    </Button>
                    <Button
                      variant="primary"
                      size="sm"
                      iconLeft={<Mail className="w-3.5 h-3.5 shrink-0" />}
                      onClick={() => setContactModalDev(dev)}
                    >
                      {language === 'fr' ? 'Contacter' : 'Contact'}
                    </Button>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* Modale de contact direct */}
      <Modal
        isOpen={Boolean(contactModalDev)}
        onClose={() => setContactModalDev(null)}
        title={
          language === 'fr'
            ? `Proposer une mission à ${formatNameWithUpperLastName(contactModalDev?.name || '')}`
            : `Send proposal to ${formatNameWithUpperLastName(contactModalDev?.name || '')}`
        }
        description={
          language === 'fr'
            ? 'Votre proposition sera directement transmise sur sa messagerie professionnelle DevConnect.'
            : 'Your brief will be forwarded to their verified DevConnect inbox.'
        }
        maxWidth="md"
      >
        {contactSent ? (
          <div className="p-8 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400 flex items-center justify-center mx-auto">
              <CheckCircle className="w-6 h-6" />
            </div>
            <p className="text-base font-bold text-slate-900 dark:text-slate-100">
              {language === 'fr' ? 'Proposition transmise avec succès !' : 'Proposal successfully sent!'}
            </p>
            <p className="text-xs text-slate-500">
              {language === 'fr'
                ? 'L\'ingénieur a reçu une notification prioritaire et reviendra vers vous sous 24 heures.'
                : 'The developer has been notified and will reply within 24 hours.'}
            </p>
          </div>
        ) : (
          <form onSubmit={handleSendContact} className="space-y-4">
            <Input
              label={language === 'fr' ? 'Objet de la proposition' : 'Subject'}
              placeholder={
                language === 'fr'
                  ? 'Ex: Mission architecture microservices Cotonou'
                  : 'Ex: Microservices architecture brief'
              }
              value={contactSubject}
              onChange={(e) => setContactSubject(e.target.value)}
              required
            />
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                {language === 'fr' ? 'Détails du projet & attentes techniques' : 'Project details & technical expectations'}
              </label>
              <textarea
                rows={4}
                value={contactMessage}
                onChange={(e) => setContactMessage(e.target.value)}
                placeholder={
                  language === 'fr'
                    ? 'Décrivez votre contexte, le livrable attendu, la durée estimée et votre fourchette budgétaire en FCFA...'
                    : 'Describe your context, key deliverables, timeline, and budget in FCFA...'
                }
                required
                className="w-full p-3 rounded-xl text-sm bg-white text-slate-900 placeholder:text-slate-400 border border-slate-300 focus:border-[#0066FF] dark:bg-[#090D1A] dark:text-slate-100 dark:placeholder:text-slate-500 dark:border-slate-800 dark:focus:border-cyan-500 outline-none"
              />
            </div>
            <div className="flex justify-end gap-2 pt-2 border-t border-slate-200 dark:border-slate-800/80">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setContactModalDev(null)}
              >
                {language === 'fr' ? 'Annuler' : 'Cancel'}
              </Button>
              <Button
                type="submit"
                variant="primary"
                size="sm"
                iconRight={<Send className="w-3.5 h-3.5" />}
              >
                {language === 'fr' ? 'Envoyer la proposition' : 'Send proposal'}
              </Button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
}
