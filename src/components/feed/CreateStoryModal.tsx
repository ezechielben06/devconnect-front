import React, { useState, useRef, useEffect } from 'react';
import { X, Image, Upload, Sparkles, Check, Camera, RefreshCw } from 'lucide-react';
import { useBodyScrollLock } from '../../hooks/useBodyScrollLock';
import { CurrentUserProfile, FeedStory } from '../../types';
import { Button } from '../ui/Button';

interface CreateStoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: CurrentUserProfile;
  onPublishStory: (newStory: FeedStory) => void;
}

const PRESET_GALLERY_PHOTOS = [
  {
    id: 'photo-setup',
    title: 'Setup Dev Bénin',
    url: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'photo-code',
    title: 'Code React & Node',
    url: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'photo-team',
    title: 'Hackathon CADEV',
    url: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'photo-coffee',
    title: 'Focus & Architecture',
    url: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=800&q=80',
  },
];

const GRADIENTS = [
  { id: 'grad-blue', label: 'Tech Azur', class: 'from-[#0066FF] via-blue-700 to-indigo-950' },
  { id: 'grad-emerald', label: 'Cotonou Vert', class: 'from-emerald-500 via-teal-700 to-slate-950' },
  { id: 'grad-sunset', label: 'Coucher Océan', class: 'from-rose-500 via-amber-600 to-slate-900' },
  { id: 'grad-purple', label: 'Cyber Violet', class: 'from-purple-600 via-indigo-800 to-slate-950' },
  { id: 'grad-dark', label: 'Minimal Noir', class: 'from-slate-900 via-slate-950 to-black' },
];

export function CreateStoryModal({
  isOpen,
  onClose,
  currentUser,
  onPublishStory,
}: CreateStoryModalProps) {
  useBodyScrollLock(isOpen);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [caption, setCaption] = useState('');
  const [selectedGradient, setSelectedGradient] = useState(GRADIENTS[0]);
  const [publishing, setPublishing] = useState(false);

  // Déclenche automatiquement le sélecteur de fichier lors de l'ouverture
  useEffect(() => {
    if (isOpen && !selectedImage) {
      const timer = setTimeout(() => {
        fileInputRef.current?.click();
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setSelectedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePublish = () => {
    setPublishing(true);
    const newStory: FeedStory = {
      id: `story-${Date.now()}`,
      authorId: currentUser.id,
      authorName: currentUser.name,
      authorAvatar: currentUser.avatar,
      timeAgo: "À l'instant",
      seen: false,
      snippet: caption.trim() || 'Nouvelle story partagée avec la communauté !',
      mediaUrl: selectedImage || undefined,
      gradient: selectedGradient.class,
    };

    setTimeout(() => {
      onPublishStory(newStory);
      setPublishing(false);
      setSelectedImage(null);
      setCaption('');
      onClose();
    }, 600);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Créer une Story"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/80 backdrop-blur-md animate-fadeIn"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="relative w-full max-w-2xl bg-white/95 dark:bg-[#0A1022]/95 backdrop-blur-2xl border border-white/60 dark:border-slate-800 rounded-3xl shadow-[0_25px_70px_-15px_rgba(0,102,255,0.4)] overflow-hidden flex flex-col max-h-[92vh]">
        {/* En-tête */}
        <div className="px-5 py-4 border-b border-slate-200/80 dark:border-slate-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-[#0066FF]/10 text-[#0066FF] dark:text-cyan-400 flex items-center justify-center font-bold">
              <Camera className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-black text-slate-900 dark:text-white leading-tight">
                Publier une Story
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Visible pendant 24h auprès de la communauté tech
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-full text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            aria-label="Fermer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Input fichier caché pour galerie / photos */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*,video/*"
          className="hidden"
          onChange={handleFileChange}
        />

        {/* Corps modal : grille aperçu 9:16 + contrôles */}
        <div className="flex-1 overflow-y-auto no-scrollbar p-5 sm:p-6 grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
          {/* COLONNE GAUCHE : APERÇU CARTE STORY 9:16 */}
          <div className="flex flex-col items-center">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2">
              Aperçu en direct (Format 9:16)
            </span>
            <div
              className={`relative w-52 sm:w-60 h-80 sm:h-96 rounded-3xl overflow-hidden shadow-2xl border-2 border-white/40 dark:border-white/10 flex flex-col justify-between p-3.5 bg-gradient-to-br ${selectedGradient.class}`}
            >
              {/* Image d'arrière-plan si présente */}
              {selectedImage && (
                <img
                  src={selectedImage}
                  alt="Aperçu Story"
                  className="absolute inset-0 w-full h-full object-cover"
                />
              )}

              {/* Voile assombrissant pour lisibilité */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-black/60 pointer-events-none" />

              {/* Barre de progression story */}
              <div className="relative z-10 w-full bg-white/30 h-1 rounded-full overflow-hidden">
                <div className="bg-white h-full w-2/3 rounded-full" />
              </div>

              {/* Auteur en-tête */}
              <div className="relative z-10 flex items-center gap-2 mt-2">
                <img
                  src={currentUser.avatar}
                  alt=""
                  referrerPolicy="no-referrer"
                  className="w-8 h-8 rounded-full object-cover ring-2 ring-white/90"
                />
                <div className="min-w-0 text-left">
                  <p className="text-xs font-black text-white truncate drop-shadow-md">
                    {currentUser.name.split(' ')[0]}
                  </p>
                  <p className="text-[9px] text-white/80 font-medium">À l'instant</p>
                </div>
              </div>

              {/* Légende superposée */}
              <div className="relative z-10 my-auto text-center px-2">
                {caption ? (
                  <p className="text-xs sm:text-sm font-bold text-white bg-black/40 backdrop-blur-md p-3 rounded-2xl border border-white/20 shadow-lg leading-relaxed">
                    {caption}
                  </p>
                ) : (
                  <p className="text-[11px] font-medium text-white/70 italic bg-black/20 p-2 rounded-xl">
                    Ajoutez une légende ci-contre...
                  </p>
                )}
              </div>

              {/* Footer de l'aperçu */}
              <div className="relative z-10 flex items-center justify-between pt-2 border-t border-white/20 text-white/80 text-[10px]">
                <span>DevConnect Stories</span>
                <span className="flex items-center gap-1 font-bold">
                  <Sparkles className="w-3 h-3 text-cyan-300" /> 24h
                </span>
              </div>
            </div>
          </div>

          {/* COLONNE DROITE : CONTRÔLES & SÉLECTION PHOTOS */}
          <div className="space-y-4">
            {/* Bouton pour déclencher la galerie de l'appareil */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                Photo ou Vidéo de la Story
              </label>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex-1 py-3 px-4 rounded-2xl border-2 border-dashed border-[#0066FF]/60 dark:border-cyan-400/40 bg-[#0066FF]/5 dark:bg-cyan-950/20 hover:bg-[#0066FF]/10 text-[#0066FF] dark:text-cyan-300 flex items-center justify-center gap-2 text-xs font-bold transition-all cursor-pointer shadow-xs"
                >
                  <Upload className="w-4 h-4 shrink-0" />
                  <span>{selectedImage ? 'Changer de photo' : 'Ouvrir la galerie / Mes photos'}</span>
                </button>
                {selectedImage && (
                  <button
                    type="button"
                    onClick={() => setSelectedImage(null)}
                    className="p-3 rounded-2xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 border border-rose-200 dark:border-rose-900 hover:bg-rose-100 transition-colors cursor-pointer"
                    title="Supprimer la photo"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            {/* Galerie de clichés instantanés suggérés */}
            <div>
              <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 block mb-1.5">
                Ou choisir un cliché tech de la galerie :
              </span>
              <div className="grid grid-cols-4 gap-2">
                {PRESET_GALLERY_PHOTOS.map((photo) => (
                  <div
                    key={photo.id}
                    onClick={() => setSelectedImage(photo.url)}
                    className={`relative h-16 rounded-xl overflow-hidden cursor-pointer border-2 transition-all ${
                      selectedImage === photo.url
                        ? 'border-[#0066FF] dark:border-cyan-400 scale-102 ring-2 ring-blue-500/20'
                        : 'border-slate-200 dark:border-slate-700 hover:opacity-90'
                    }`}
                  >
                    <img
                      src={photo.url}
                      alt={photo.title}
                      className="w-full h-full object-cover"
                    />
                    {selectedImage === photo.url && (
                      <div className="absolute inset-0 bg-blue-600/40 flex items-center justify-center text-white">
                        <Check className="w-4 h-4" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Texte / Légende */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                Légende / Message
              </label>
              <textarea
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                placeholder="Partagez votre humeur tech, votre avancée ou un conseil du jour..."
                maxLength={180}
                rows={3}
                className="w-full px-3.5 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0066FF] resize-none"
              />
              <span className="text-[10px] text-slate-400 text-right block mt-0.5">
                {caption.length}/180 caractères
              </span>
            </div>

            {/* Thème de dégradé d'ambiance */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                Palette atmosphérique de fond
              </label>
              <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
                {GRADIENTS.map((grad) => (
                  <button
                    key={grad.id}
                    type="button"
                    onClick={() => setSelectedGradient(grad)}
                    className={`w-7 h-7 rounded-full bg-gradient-to-tr ${grad.class} shrink-0 transition-transform cursor-pointer border-2 ${
                      selectedGradient.id === grad.id
                        ? 'border-white ring-2 ring-[#0066FF] scale-110'
                        : 'border-transparent hover:scale-105'
                    }`}
                    title={grad.label}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Pied de modal avec bouton de publication */}
        <div className="p-4 sm:p-5 border-t border-slate-200/80 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-900/60 flex items-center justify-between gap-3 shrink-0">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onClose}
            className="rounded-xl px-4"
          >
            Annuler
          </Button>

          <Button
            type="button"
            variant="primary"
            size="sm"
            disabled={publishing}
            onClick={handlePublish}
            className="rounded-xl px-6 py-2.5 font-bold shadow-lg shadow-blue-500/25 flex items-center gap-2 cursor-pointer"
          >
            {publishing ? (
              <RefreshCw className="w-4 h-4 animate-spin shrink-0" />
            ) : (
              <Sparkles className="w-4 h-4 shrink-0" />
            )}
            <span>{publishing ? 'Publication en cours...' : 'Publier ma Story'}</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
