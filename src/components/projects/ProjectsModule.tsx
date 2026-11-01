// Marketplace des missions tech rémunérées en FCFA, branchée sur le backend Laravel.

import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import api from '../../api';
import { Project } from '../../types';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Modal } from '../ui/Modal';
import { Skeleton } from '../ui/Skeleton';
import { EmptyState } from '../ui/EmptyState';
import {
  Briefcase,
  Plus,
  Search,
  Clock,
  Banknote,
  Users,
  CheckCircle2,
  ArrowRight,
} from 'lucide-react';

export function ProjectsModule() {
  const { language, currentUser } = useApp();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');

  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newCategory, setNewCategory] = useState<Project['category']>('frontend');
  const [newBudgetMin, setNewBudgetMin] = useState(1500000);
  const [newBudgetMax, setNewBudgetMax] = useState(3500000);
  const [newTimeline, setNewTimeline] = useState('4 à 6 semaines');
  const [newSkills, setNewSkills] = useState('React 19, TypeScript, Tailwind');
  const [newDifficulty, setNewDifficulty] = useState<Project['difficulty']>('senior');

  const [applyModalProject, setApplyModalProject] = useState<Project | null>(null);
  const [applyMessage, setApplyMessage] = useState('');
  const [applySuccess, setApplySuccess] = useState(false);

  const fetchProjects = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get('/projects');

      const backendProjects: Project[] = response.data.data.map((p: any) => ({
        id: String(p.id),
        titleFr: p.title,
        titleEn: p.title,
        descriptionFr: p.description,
        descriptionEn: p.description,
        category: 'backend',
        budgetMin: 0,
        budgetMax: 0,
        currency: 'FCFA',
        timeline: 'À définir',
        skillsRequired: p.roles ? p.roles.map((r: any) => r.title) : [],
        authorId: String(p.owner.id),
        authorName: p.owner.name,
        authorAvatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(p.owner.name)}&background=0066FF&color=fff`,
        status: p.status === 'open' ? 'open' : p.status === 'closed' ? 'completed' : 'in_progress',
        difficulty: 'senior',
        featured: false,
        applicantsCount: p.roles ? p.roles.reduce((acc: number, r: any) => acc + (r.applications_count || 0), 0) : 0,
        createdAt: new Date(p.created_at).toLocaleDateString(),
      }));

      setProjects(backendProjects);
    } catch (err) {
      console.error(err);
      setError("Impossible de charger les projets depuis le serveur.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, [language]);

  const filteredProjects = projects.filter((p) => {
    const title = language === 'fr' ? p.titleFr : p.titleEn;
    const desc = language === 'fr' ? p.descriptionFr : p.descriptionEn;
    const matchesSearch =
      title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      desc.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.skillsRequired.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCategory = selectedCategory === 'all' || p.category === selectedCategory;
    const matchesDifficulty =
      selectedDifficulty === 'all' || p.difficulty === selectedDifficulty;

    return matchesSearch && matchesCategory && matchesDifficulty;
  });

  const featuredProject = filteredProjects.find((p) => p.featured) || filteredProjects[0];
  const regularProjects = filteredProjects.filter((p) => p.id !== featuredProject?.id);

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newDesc.trim()) return;

    try {
      await api.post('/projects', {
        title: newTitle.trim(),
        description: newDesc.trim(),
        roles: newSkills.split(',').map(s => ({ title: s.trim() }))
      });

      setCreateModalOpen(false);
      setNewTitle('');
      setNewDesc('');
      fetchProjects();
    } catch (err) {
      console.error("Erreur création projet", err);
      alert("Erreur lors de la création du projet. Vérifie la console.");
    }
  };

  const handleApply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!applyMessage.trim() || !applyModalProject) return;

    try {
      const roleId = 1;

      await api.post(`/projects/${applyModalProject.id}/roles/${roleId}/applications`, {
        message: applyMessage.trim()
      });

      setApplySuccess(true);
      setTimeout(() => {
        setApplySuccess(false);
        setApplyModalProject(null);
        setApplyMessage('');
      }, 1500);
    } catch (err) {
      console.error(err);
      alert("Erreur lors de la candidature. Vérifie la console.");
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 py-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-slate-200 dark:border-slate-800/80 pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
              {language === 'fr' ? 'Recrutement Technique Certifié' : 'Verified Technical Recruitment'}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0A1128] dark:text-slate-100 tracking-tight">
            {language === 'fr' ? 'Tableau des Missions & Projets' : 'Mission & Project Board'}
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1 max-w-2xl">
            {language === 'fr'
              ? 'Opportunités professionnelles qualifiées au Bénin et en remote : architecture logicielle, développement applicatif et modernisation de systèmes.'
              : 'Qualified software engineering projects in Benin and remote: architecture, application development, and systems scaling.'}
          </p>
        </div>

        <Button
          variant="primary"
          iconLeft={<Plus className="w-4 h-4" />}
          onClick={() => setCreateModalOpen(true)}
          className="shrink-0"
        >
          {language === 'fr' ? 'Publier une mission' : 'Post a project'}
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
        <div className="relative flex-1">
          <Input
            placeholder={
              language === 'fr'
                ? 'Rechercher par titre de mission, mot-clé ou technologie...'
                : 'Search projects by title or tech...'
            }
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            iconLeft={<Search className="w-4 h-4 text-slate-400" />}
          />
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="h-10 px-3 rounded-xl text-xs font-medium bg-white text-slate-900 border border-slate-300 dark:bg-[#090D1A] dark:text-slate-200 dark:border-slate-800 focus:outline-none focus:ring-2 focus:ring-[#0066FF]"
            aria-label="Filtrer par domaine"
          >
            <option value="all">{language === 'fr' ? 'Tous les domaines' : 'All domains'}</option>
            <option value="frontend">Frontend & Design System</option>
            <option value="backend">Backend & Systèmes Distribués</option>
            <option value="mobile">Mobile & Fintech</option>
            <option value="devops">DevOps & Cloud</option>
            <option value="ai">Intelligence Artificielle</option>
          </select>

          <select
            value={selectedDifficulty}
            onChange={(e) => setSelectedDifficulty(e.target.value)}
            className="h-10 px-3 rounded-xl text-xs font-medium bg-white text-slate-900 border border-slate-300 dark:bg-[#090D1A] dark:text-slate-200 dark:border-slate-800 focus:outline-none focus:ring-2 focus:ring-[#0066FF]"
            aria-label="Filtrer par niveau d'expertise"
          >
            <option value="all">{language === 'fr' ? 'Tous niveaux' : 'All levels'}</option>
            <option value="senior">{language === 'fr' ? 'Senior & Lead' : 'Senior & Lead'}</option>
            <option value="intermediate">{language === 'fr' ? 'Intermédiaire' : 'Intermediate'}</option>
            <option value="junior">Junior</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="space-y-4">
          <Card featured className="p-6">
            <Skeleton width="40%" height={24} className="mb-2" />
            <Skeleton width="100%" height={60} className="mb-4" />
            <div className="flex gap-3">
              <Skeleton width={100} height={20} />
              <Skeleton width={100} height={20} />
            </div>
          </Card>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[1, 2, 3, 4].map((i) => (               <Card key={i} className="p-5 space-y-3">
                <Skeleton width="60%" height={20} />
                <Skeleton width="100%" height={40} />
                <Skeleton width={80} height={16} />
              </Card>
            ))}
          </div>
        </div>
      ) : error ? (
        <div className="p-6 rounded-2xl border border-rose-300 dark:border-rose-900/60 bg-rose-50 dark:bg-rose-950/30 text-center space-y-3">
          <p className="text-sm font-medium text-rose-700 dark:text-rose-300">{error}</p>
          <Button variant="outline" size="sm" onClick={fetchProjects}>
            {language === 'fr' ? 'Réessayer' : 'Retry'}
          </Button>
        </div>
      ) : filteredProjects.length === 0 ? (
        <EmptyState
          icon={<Briefcase className="w-6 h-6" />}
          title={language === 'fr' ? 'Aucune mission ne correspond à vos critères' : 'No projects match your criteria'}
          description={
            language === 'fr'
              ? 'Essayez de modifier votre mot-clé de recherche ou réinitialisez les filtres pour afficher l\'ensemble des opportunités.'
              : 'Adjust your search terms or reset filters to see all available missions.'
          }
          actionLabel={language === 'fr' ? 'Réinitialiser les filtres' : 'Reset filters'}
          onAction={() => {
            setSearchQuery('');
            setSelectedCategory('all');
            setSelectedDifficulty('all');
          }}
        />
      ) : (
        <div className="space-y-6">
          {featuredProject && (
            <Card
              featured
              className="p-6 sm:p-7 relative overflow-hidden bg-white dark:bg-[#090D1A] border-[#0066FF]/40 dark:border-cyan-500/40 shadow-md"
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div className="space-y-3 max-w-3xl">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="px-2.5 py-0.5 rounded-lg text-[11px] font-bold bg-blue-50 text-[#0066FF] border border-blue-200 dark:bg-cyan-950/80 dark:text-cyan-300 dark:border-cyan-800">
                      {language === 'fr' ? 'Mission prioritaire' : 'Featured Brief'}
                    </span>
                    <Badge variant="neutral" size="sm">
                      {featuredProject.category.toUpperCase()}
                    </Badge>
                    <Badge variant="warning" size="sm">
                      {featuredProject.difficulty.toUpperCase()}
                    </Badge>
                  </div>

                  <h2 className="text-lg sm:text-xl font-bold text-[#0A1128] dark:text-slate-100">
                    {language === 'fr' ? featuredProject.titleFr : featuredProject.titleEn}
                  </h2>

                  <p className="text-xs sm:text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                    {language === 'fr' ? featuredProject.descriptionFr : featuredProject.descriptionEn}
                  </p>

                  <div className="flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400 pt-1 flex-wrap">
                    <span className="font-semibold text-slate-800 dark:text-slate-200">
                      {featuredProject.authorName}
                    </span>
                    <span aria-hidden="true">&middot;</span>
                    <span className="flex items-center gap-1 font-mono tabular-nums font-bold text-[#0066FF] dark:text-cyan-300">
                      <Banknote className="w-3.5 h-3.5" aria-hidden="true" />
                      <span>{featuredProject.budgetMin.toLocaleString('fr-FR')} – {featuredProject.budgetMax.toLocaleString('fr-FR')} FCFA</span>
                    </span>
                    <span aria-hidden="true">&middot;</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-slate-400" aria-hidden="true" />
                      <span>{featuredProject.timeline}</span>
                    </span>
                    <span aria-hidden="true">&middot;</span>
                    <span className="flex items-center gap-1">
                      <Users className="w-3.5 h-3.5 text-slate-400" aria-hidden="true" />
                      <span className="tabular-nums font-medium">{featuredProject.applicantsCount} {language === 'fr' ? 'candidatures' : 'applicants'}</span>
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {featuredProject.skillsRequired.map((skill) => (
                      <Badge key={skill} variant="neutral" size="sm">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="shrink-0 self-start lg:self-center">
                  <Button
                    variant="primary"
                    size="md"
                    iconRight={<ArrowRight className="w-4 h-4" />}
                    onClick={() => setApplyModalProject(featuredProject)}
                  >
                    {language === 'fr' ? 'Postuler à la mission' : 'Apply for mission'}
                  </Button>
                </div>
              </div>
            </Card>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4.5">
            {regularProjects.map((p) => {
              const title = language === 'fr' ? p.titleFr : p.titleEn;
              const desc = language === 'fr' ? p.descriptionFr : p.descriptionEn;
              return (
                <Card
                  key={p.id}
                  interactive
                  className="flex flex-col justify-between h-full bg-white dark:bg-[#090D1A] border-blue-100/90 dark:border-slate-800 hover:border-[#0066FF]/60 shadow-[0_4px_20px_rgba(0,102,255,0.04)]"
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-2">
                        <Badge variant="neutral" size="sm">
                          {p.category.toUpperCase()}
                        </Badge>
                        <Badge
                          variant={p.difficulty === 'senior' ? 'warning' : 'neutral'}
                          size="sm"
                        >
                          {p.difficulty.toUpperCase()}
                        </Badge>
                      </div>
                      <span className="text-xs font-mono font-bold tabular-nums text-[#0066FF] dark:text-cyan-400 whitespace-nowrap">
                        {p.budgetMin.toLocaleString('fr-FR')} – {p.budgetMax.toLocaleString('fr-FR')} FCFA
                      </span>
                    </div>

                    <h3 className="text-sm font-bold text-[#0A1128] dark:text-slate-100 line-clamp-1">
                      {title}
                    </h3>

                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed line-clamp-2">
                      {desc}
                    </p>

                    <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400 pt-1 flex-wrap">
                      <span className="font-medium text-slate-700 dark:text-slate-300">
                        {p.authorName}
                      </span>
                      <span aria-hidden="true">&middot;</span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-slate-400" aria-hidden="true" />
                        <span>{p.timeline}</span>
                      </span>
                      <span aria-hidden="true">&middot;</span>
                      <span className="tabular-nums font-medium">
                        {p.applicantsCount} {language === 'fr' ? 'candidatures' : 'applicants'}
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {p.skillsRequired.map((s) => (
                        <Badge key={s} variant="neutral" size="sm">
                          {s}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="pt-4 mt-4 border-t border-slate-200 dark:border-slate-800/80 flex items-center justify-between gap-2">
                    <span className="text-xs text-slate-500 font-medium">
                      {language === 'fr' ? 'Publié récemment' : 'Recently posted'}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setApplyModalProject(p)}
                    >
                      {language === 'fr' ? 'Détails & Postuler' : 'Details & Apply'}
                    </Button>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      )}

      {/* Modale de création d'une nouvelle mission */}
      <Modal
        isOpen={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        title={language === 'fr' ? 'Publier une nouvelle offre de mission' : 'Post a new mission'}
        description={
          language === 'fr'
            ? 'Votre offre sera soumise à notre réseau d\'ingénieurs vérifiés au Bénin et en Afrique de l\'Ouest.'
            : 'Your brief will be broadcast to our verified developer network.'
        }
        maxWidth="lg"
      >
        <form onSubmit={handleCreateProject} className="space-y-4">
          <Input
            label={language === 'fr' ? 'Intitulé de la mission' : 'Mission title'}
            placeholder={
              language === 'fr'
                ? 'Ex: Refonte du moteur de paiement mobile sous React 19'
                : 'Ex: Mobile payment engine rewrite with React 19'
            }
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            required
          />
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              {language === 'fr' ? 'Cahier des charges & objectifs techniques' : 'Technical requirements & goals'}
            </label>
            <textarea
              rows={4}
              value={newDesc}
              onChange={(e) => setNewDesc(e.target.value)}
              placeholder={
                language === 'fr'
                  ? 'Détaillez le périmètre technique, les technologies requises et les critères d\'acceptation...'
                  : 'Specify technical scope, required technologies, and acceptance criteria...'
              }
              required
              className="w-full p-3 rounded-xl text-sm bg-white text-slate-900 placeholder:text-slate-400 border border-slate-300 focus:border-[#0066FF] dark:bg-[#090D1A] dark:text-slate-100 dark:placeholder:text-slate-500 dark:border-slate-800 dark:focus:border-cyan-500 outline-none"
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                {language === 'fr' ? 'Domaine technique' : 'Technical domain'}
              </label>
              <select
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value as Project['category'])}
                className="w-full h-10 px-3 rounded-xl text-sm bg-white text-slate-900 border border-slate-300 dark:bg-[#090D1A] dark:text-slate-100 dark:border-slate-800 outline-none"
              >
                <option value="frontend">Frontend & Design Systems</option>
                <option value="backend">Backend & Systèmes Distribués</option>
                <option value="mobile">Mobile & Fintech</option>
                <option value="devops">DevOps & Cloud</option>
                <option value="ai">Intelligence Artificielle</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                {language === 'fr' ? 'Niveau d\'expertise attendu' : 'Expertise level'}
              </label>
              <select
                value={newDifficulty}
                onChange={(e) => setNewDifficulty(e.target.value as Project['difficulty'])}
                className="w-full h-10 px-3 rounded-xl text-sm bg-white text-slate-900 border border-slate-300 dark:bg-[#090D1A] dark:text-slate-100 dark:border-slate-800 outline-none"
              >
                <option value="junior">Junior</option>
                <option value="intermediate">Intermédiaire</option>
                <option value="senior">Senior & Lead</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <Input
              label={language === 'fr' ? 'Budget Min (FCFA)' : 'Min Budget (FCFA)'}
              type="number"
              value={newBudgetMin}
              onChange={(e) => setNewBudgetMin(Number(e.target.value))}
              required
            />
            <Input
              label={language === 'fr' ? 'Budget Max (FCFA)' : 'Max Budget (FCFA)'}
              type="number"
              value={newBudgetMax}
              onChange={(e) => setNewBudgetMax(Number(e.target.value))}
              required
            />
            <Input
              label={language === 'fr' ? 'Délai estimé' : 'Estimated timeline'}
              value={newTimeline}
              onChange={(e) => setNewTimeline(e.target.value)}
              placeholder="Ex: 4 à 6 semaines"
              required
            />
          </div>
          <Input
            label={language === 'fr' ? 'Compétences exigées (séparées par des virgules)' : 'Required skills (comma-separated)'}
            value={newSkills}
            onChange={(e) => setNewSkills(e.target.value)}
            required
          />
          <div className="flex justify-end gap-2 pt-3 border-t border-slate-200 dark:border-slate-800/80">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setCreateModalOpen(false)}
            >
              {language === 'fr' ? 'Annuler' : 'Cancel'}
            </Button>
            <Button type="submit" variant="primary" size="sm">
              {language === 'fr' ? 'Publier la mission' : 'Publish mission'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Modale de candidature */}
      <Modal
        isOpen={Boolean(applyModalProject)}
        onClose={() => setApplyModalProject(null)}
        title={
          language === 'fr'
            ? `Postuler à : ${applyModalProject?.titleFr}`
            : `Apply for: ${applyModalProject?.titleEn}`
        }
        description={
          language === 'fr'
            ? 'Transmettez votre intérêt et votre approche technique au porteur du projet.'
            : 'Send your technical pitch and availability to the project author.'
        }
        maxWidth="md"
      >
        {applySuccess ? (
          <div className="p-8 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <p className="text-base font-bold text-slate-900 dark:text-slate-100">
              {language === 'fr' ? 'Candidature transmise avec succès !' : 'Application sent successfully!'}
            </p>
            <p className="text-xs text-slate-500">
              {language === 'fr'
                ? 'Votre profil vérifié DevConnect et votre proposition ont été notifiés au donneur d\'ordres.'
                : 'Your verified DevConnect profile and pitch have been sent to the client.'}
            </p>
          </div>
        ) : (
          <form onSubmit={handleApply} className="space-y-4">
            <div className="p-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-blue-50/40 dark:bg-slate-900/40 text-xs text-slate-600 dark:text-slate-300">
              <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">
                {language === 'fr' ? 'Candidature émise sous votre identité :' : 'Application submitted as:'}
              </p>
              <p className="font-bold text-[#0066FF] dark:text-cyan-400 font-mono">
                {currentUser.name} &middot; {currentUser.title}
              </p>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                {language === 'fr' ? 'Pourquoi êtes-vous le bon ingénieur pour cette mission ?' : 'Why are you the right engineer?'}
              </label>
              <textarea
                rows={4}
                value={applyMessage}
                onChange={(e) => setApplyMessage(e.target.value)}
                placeholder={
                  language === 'fr'
                    ? 'Présentez vos réalisations similaires, votre approche d\'architecture et votre disponibilité...'
                    : 'Detail similar achievements, architecture approach, and availability...'
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
                onClick={() => setApplyModalProject(null)}
              >
                {language === 'fr' ? 'Annuler' : 'Cancel'}
              </Button>
              <Button type="submit" variant="primary" size="sm">
                {language === 'fr' ? 'Confirmer la candidature' : 'Confirm application'}
              </Button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
}