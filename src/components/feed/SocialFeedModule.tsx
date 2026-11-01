// Fil d'actualité dev (posts, code snippets VS Code, stories, events).
// FIXME: penser à brancher un Infinite Scroll avec IntersectionObserver si la timeline dépasse 50 posts pour économiser les nodes DOM.

import React, { useState, useEffect, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import {
  MOCK_FEED_POSTS,
  MOCK_STORIES,
  MOCK_TECH_EVENTS,
  MOCK_TRENDING_TOPICS,
  MOCK_DEVELOPERS,
} from '../../services/mockData';
import { FeedPost, FeedReactionType, FeedStory, TechEvent } from '../../types';
import {
  MessageCircle,
  Share2,
  Send,
  Sparkles,
  Code2,
  CheckCircle2,
  Calendar,
  MapPin,
  TrendingUp,
  Bookmark,
  Check,
  Plus,
  BarChart2,
  X,
  Users,
  MessageSquare,
  MoreHorizontal,
  Edit3,
  Trash2,
  Pin,
  PinOff,
  Copy,
  Clock,
  EyeOff,
  RotateCcw,
  UserPlus,
  UserCheck,
} from 'lucide-react';
import { Button } from '../ui/Button';
import { CodeBlock } from '../common/CodeBlock';
import { VSCodeEditor } from '../common/VSCodeEditor';
import { CreateStoryModal } from './CreateStoryModal';
import { useBodyScrollLock } from '../../hooks/useBodyScrollLock';
import { formatNameWithUpperLastName } from '../../utils/formatters';
import { isCodeContent, detectLanguageFromCode, SUPPORTED_LANGUAGES } from '../../utils/codeHighlighter';

const REACTION_CONFIG: Record<
  FeedReactionType,
  { label: string; icon: string; color: string; bg: string }
> = {
  like: { label: "J'aime", icon: '👍', color: 'text-blue-600', bg: 'bg-blue-50 dark:bg-blue-950/40' },
  love: { label: 'Adore', icon: '❤️', color: 'text-rose-600', bg: 'bg-rose-50 dark:bg-rose-950/40' },
  fire: { label: 'Inspirant', icon: '🔥', color: 'text-amber-500', bg: 'bg-amber-50 dark:bg-amber-950/40' },
  idea: { label: 'Génie', icon: '💡', color: 'text-yellow-500', bg: 'bg-yellow-50 dark:bg-yellow-950/40' },
  celebrate: { label: 'Bravo', icon: '🎉', color: 'text-emerald-600', bg: 'bg-emerald-50 dark:bg-emerald-950/40' },
};

export function SocialFeedModule() {
  const {
    currentUser,
    setInspectDeveloper,
    setActiveTab,
    connectedDevIds,
    pendingSentInvitations,
    pendingReceivedInvitations,
    sendInvitation,
    cancelInvitation,
    acceptInvitation,
    rejectInvitation,
    getConnectionStatus,
    triggerToast,
  } = useApp();
  const [posts, setPosts] = useState<FeedPost[]>(MOCK_FEED_POSTS);
  const [stories, setStories] = useState<FeedStory[]>(MOCK_STORIES);
  const [createStoryModalOpen, setCreateStoryModalOpen] = useState(false);
  const [events, setEvents] = useState<TechEvent[]>(MOCK_TECH_EVENTS);

  const [newPostContent, setNewPostContent] = useState('');
  const [newPostTag, setNewPostTag] = useState('#React19Bénin');
  const [newPostAudience, setNewPostAudience] = useState<'public' | 'community'>('public');

  const [showCodeComposer, setShowCodeComposer] = useState(false);
  const [newCodeSnippet, setNewCodeSnippet] = useState('');
  const [newCodeLanguage, setNewCodeLanguage] = useState('typescript');
  const [newCodeFilename, setNewCodeFilename] = useState(() => {
    return SUPPORTED_LANGUAGES.find((l) => l.id === 'typescript')?.defaultFilename || 'main.ts';
  });

  const handleLanguageChange = (lang: string) => {
    setNewCodeLanguage(lang);
    const defaultFile = SUPPORTED_LANGUAGES.find((l) => l.id === lang)?.defaultFilename || 'main.ts';
    setNewCodeFilename(defaultFile);
  };

  const handlePostContentChange = (val: string) => {
    setNewPostContent(val);
    if (!showCodeComposer && isCodeContent(val)) {
      const detected = detectLanguageFromCode(val);
      handleLanguageChange(detected);
      setNewCodeSnippet(val);
      setShowCodeComposer(true);
      setNewPostContent('Extrait de code partagé avec la communauté tech béninoise');
    }
  };

  const [activeStory, setActiveStory] = useState<FeedStory | null>(null);
  useBodyScrollLock(Boolean(activeStory || createStoryModalOpen));

  const [commentInputs, setCommentInputs] = useState<Record<string, string>>({});
  const [expandedComments, setExpandedComments] = useState<Record<string, boolean>>({
    'post-1': true,
  });
  const [hoveredReactionPostId, setHoveredReactionPostId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  const [animatedPlaceholder, setAnimatedPlaceholder] = useState('');
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  const placeholderPhrases = useMemo(() => [
    `Que partagez-vous avec la communauté tech, ${formatNameWithUpperLastName(currentUser.name)} ?`,
    'Un snippet de code, un bug insolite ou une question d\'architecture ?',
    'Partagez un projet en cours, un retour d\'expérience ou un tips React...',
    'Une opportunité de mission en FCFA ou un événement tech au Bénin ?',
  ], [currentUser.name]);

  useEffect(() => {
    if (newPostContent) return;

    const currentFullText = placeholderPhrases[placeholderIndex % placeholderPhrases.length];
    let timer: ReturnType<typeof setTimeout>;

    if (!isDeleting) {
      if (charIndex < currentFullText.length) {
        timer = setTimeout(() => {
          setAnimatedPlaceholder(currentFullText.slice(0, charIndex + 1));
          setCharIndex((prev) => prev + 1);
        }, 40);
      } else {
        timer = setTimeout(() => {
          setIsDeleting(true);
        }, 2400);
      }
    } else {
      if (charIndex > 0) {
        timer = setTimeout(() => {
          setAnimatedPlaceholder(currentFullText.slice(0, charIndex - 1));
          setCharIndex((prev) => prev - 1);
        }, 20);
      } else {
        setIsDeleting(false);
        setPlaceholderIndex((prev) => (prev + 1) % placeholderPhrases.length);
      }
    }

    return () => clearTimeout(timer);
  }, [charIndex, isDeleting, placeholderIndex, placeholderPhrases, newPostContent]);

  const handlePublishPost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPostContent.trim()) return;

    const newPost: FeedPost = {
      id: `post-${Date.now()}`,
      authorId: currentUser.id,
      authorName: formatNameWithUpperLastName(currentUser.name),
      authorRole: currentUser.role || 'Développeur Élite',
      authorAvatar: currentUser.avatar,
      authorCity: currentUser.residenceCity || 'Cotonou, Bénin',
      timestamp: "À l'instant",
      createdAt: Date.now(),
      content: newPostContent.trim(),
      tags: [newPostTag],
      audience: newPostAudience,
      reactions: {
        like: 1,
        love: 0,
        fire: 0,
        idea: 0,
        celebrate: 0,
      },
      userReaction: 'like',
      sharesCount: 0,
      codeSnippet: showCodeComposer && newCodeSnippet.trim() ? {
        language: newCodeLanguage,
        filename: newCodeFilename || `snippet.${newCodeLanguage === 'typescript' ? 'ts' : newCodeLanguage === 'javascript' ? 'js' : newCodeLanguage === 'html' ? 'html' : newCodeLanguage === 'css' ? 'css' : newCodeLanguage === 'java' ? 'java' : newCodeLanguage === 'go' ? 'go' : newCodeLanguage === 'python' ? 'py' : newCodeLanguage === 'rust' ? 'rs' : newCodeLanguage === 'sql' ? 'sql' : newCodeLanguage}`,
        code: newCodeSnippet.trim(),
      } : undefined,
      comments: [],
    };

    setPosts([newPost, ...posts]);
    setNewPostContent('');
    setShowCodeComposer(false);
    setNewCodeSnippet('');
    showToast('Publication partagée avec succès sur le fil DevConnect !');
  };

  const POST_EDIT_LIMIT_MINUTES = 15;
  const [openPostMenuId, setOpenPostMenuId] = useState<string | null>(null);
  const [editingPostId, setEditingPostId] = useState<string | null>(null);
  const [editingContent, setEditingContent] = useState('');
  const [editingTags, setEditingTags] = useState('');
  const [deletedPostBackup, setDeletedPostBackup] = useState<{ post: FeedPost; index: number } | null>(null);

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('.post-menu-trigger') && !target.closest('.post-menu-dropdown')) {
        setOpenPostMenuId(null);
      }
    };
    window.addEventListener('click', handleOutsideClick);
    return () => window.removeEventListener('click', handleOutsideClick);
  }, []);

  const isPostAuthor = (post: FeedPost) => {
    return (
      post.authorId === currentUser.id ||
      post.authorName.toLowerCase() === currentUser.name.toLowerCase() ||
      post.id === 'post-cad-nvteam'
    );
  };

  const getEditStatus = (post: FeedPost): { canEdit: boolean; remainingMinutes: number; reason?: string } => {
    if (!isPostAuthor(post)) {
      return { canEdit: false, remainingMinutes: 0, reason: "Vous n'êtes pas l'auteur de cette publication" };
    }
    const createdTime = post.createdAt || (Date.now() - 4 * 60 * 1000);
    const elapsedMinutes = (Date.now() - createdTime) / (1000 * 60);
    const remaining = Math.max(0, Math.ceil(POST_EDIT_LIMIT_MINUTES - elapsedMinutes));
    if (elapsedMinutes > POST_EDIT_LIMIT_MINUTES) {
      return { canEdit: false, remainingMinutes: 0, reason: `Délai de ${POST_EDIT_LIMIT_MINUTES} min expiré (règle des réseaux sociaux)` };
    }
    return { canEdit: true, remainingMinutes: remaining };
  };

  const handleStartEdit = (post: FeedPost) => {
    const status = getEditStatus(post);
    if (!status.canEdit) {
      showToast(status.reason || 'Modification non disponible');
      setOpenPostMenuId(null);
      return;
    }
    setEditingPostId(post.id);
    setEditingContent(post.content);
    setEditingTags(post.tags.join(' '));
    setOpenPostMenuId(null);
  };

  const handleSaveEdit = (postId: string) => {
    if (!editingContent.trim()) {
      showToast('Le texte de la publication ne peut pas être vide.');
      return;
    }
    const cleanedTags = editingTags
      .split(/\s+/)
      .map((t) => (t.startsWith('#') ? t : `#${t}`))
      .filter((t) => t.length > 1);

    setPosts((prev) =>
      prev.map((p) => {
        if (p.id !== postId) return p;
        return {
          ...p,
          content: editingContent.trim(),
          tags: cleanedTags.length > 0 ? cleanedTags : p.tags,
          isEdited: true,
          editedAt: "À l'instant",
        };
      })
    );
    setEditingPostId(null);
    showToast('Publication modifiée avec succès (mise à jour enregistrée) !');
  };

  const handleCancelEdit = () => {
    setEditingPostId(null);
  };

  const handleDeletePost = (postId: string) => {
    const postIndex = posts.findIndex((p) => p.id === postId);
    if (postIndex === -1) return;
    const postToDelete = posts[postIndex];
    setDeletedPostBackup({ post: postToDelete, index: postIndex });
    setPosts((prev) => prev.filter((p) => p.id !== postId));
    setOpenPostMenuId(null);
    showToast('Publication supprimée.');
  };

  const handleUndoDelete = () => {
    if (!deletedPostBackup) return;
    setPosts((prev) => {
      const copy = [...prev];
      copy.splice(deletedPostBackup.index, 0, deletedPostBackup.post);
      return copy;
    });
    setDeletedPostBackup(null);
    showToast('Publication restaurée avec succès !');
  };

  const handleTogglePinPost = (postId: string) => {
    setPosts((prev) => {
      const target = prev.find((p) => p.id === postId);
      if (!target) return prev;
      const willPin = !target.isPinned;
      const updated = prev.map((p) => (p.id === postId ? { ...p, isPinned: willPin } : p));
      return updated.sort((a, b) => (b.isPinned ? 1 : 0) - (a.isPinned ? 1 : 0));
    });
    setOpenPostMenuId(null);
    const post = posts.find((p) => p.id === postId);
    showToast(post?.isPinned ? 'Publication détachée.' : '📌 Publication épinglée en haut de votre fil !');
  };

  const handleCopyPostLink = (postId: string) => {
    const url = `${window.location.origin}#post-${postId}`;
    navigator.clipboard?.writeText(url).catch(() => {});
    setOpenPostMenuId(null);
    showToast('Lien de la publication copié dans le presse-papier !');
  };

  const handleToggleBookmark = (postId: string) => {
    setPosts((prev) =>
      prev.map((p) => (p.id === postId ? { ...p, isBookmarked: !p.isBookmarked } : p))
    );
    const post = posts.find((p) => p.id === postId);
    setOpenPostMenuId(null);
    showToast(post?.isBookmarked ? 'Retiré de vos favoris.' : 'Publication enregistrée dans vos favoris !');
  };

  const handleHidePost = (postId: string) => {
    setPosts((prev) => prev.filter((p) => p.id !== postId));
    setOpenPostMenuId(null);
    showToast('Publication masquée de votre fil.');
  };

  const handleToggleReaction = (postId: string, reactionType: FeedReactionType) => {
    setPosts((prev) =>
      prev.map((post) => {
        if (post.id !== postId) return post;
        const currentReaction = post.userReaction;
        const newReactions = { ...post.reactions };

        if (currentReaction === reactionType) {
          newReactions[reactionType] = Math.max(0, newReactions[reactionType] - 1);
          return {
            ...post,
            userReaction: undefined,
            reactions: newReactions,
          };
        } else {
          if (currentReaction) {
            newReactions[currentReaction] = Math.max(0, newReactions[currentReaction] - 1);
          }
          newReactions[reactionType] += 1;
          return {
            ...post,
            userReaction: reactionType,
            reactions: newReactions,
          };
        }
      })
    );
    setHoveredReactionPostId(null);
  };

  const handleAddComment = (postId: string) => {
    const text = commentInputs[postId]?.trim();
    if (!text) return;

    const newComment = {
      id: `c-${Date.now()}`,
      authorId: currentUser.id,
      authorName: formatNameWithUpperLastName(currentUser.name),
      authorAvatar: currentUser.avatar,
      authorRole: currentUser.role || 'Membre DevConnect',
      timestamp: "À l'instant",
      content: text,
      likes: 0,
    };

    setPosts((prev) =>
      prev.map((p) => {
        if (p.id !== postId) return p;
        return {
          ...p,
          comments: [...p.comments, newComment],
        };
      })
    );
    setCommentInputs((prev) => ({ ...prev, [postId]: '' }));
    setExpandedComments((prev) => ({ ...prev, [postId]: true }));
    showToast('Commentaire publié !');
  };

  const handleToggleEventAttendance = (eventId: string) => {
    setEvents((prev) =>
      prev.map((evt) => {
        if (evt.id !== eventId) return evt;
        const willAttend = !evt.isAttending;
        return {
          ...evt,
          isAttending: willAttend,
          attendeesCount: willAttend ? evt.attendeesCount + 1 : evt.attendeesCount - 1,
        };
      })
    );
    showToast('Votre statut de participation a été mis à jour.');
  };

  const handleVotePoll = (postId: string, optionId: string) => {
    setPosts((prev) =>
      prev.map((p) => {
        if (p.id !== postId || !p.poll || p.poll.userVotedOptionId) return p;
        const updatedOptions = p.poll.options.map((opt) =>
          opt.id === optionId ? { ...opt, votes: opt.votes + 1 } : opt
        );
        return {
          ...p,
          poll: {
            ...p.poll,
            options: updatedOptions,
            totalVotes: p.poll.totalVotes + 1,
            userVotedOptionId: optionId,
          },
        };
      })
    );
    showToast('Vote enregistré !');
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-3 sm:px-6 py-6 animate-fadeIn relative">
      {toastMessage && (
        <div className="fixed bottom-20 sm:bottom-6 right-4 sm:right-6 z-50 p-3.5 sm:p-4 rounded-2xl bg-slate-900/95 dark:bg-blue-600 text-white shadow-2xl border border-white/20 flex items-center gap-2.5 text-xs font-bold animate-fadeIn backdrop-blur-xl">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
          {deletedPostBackup && (
            <button
              onClick={handleUndoDelete}
              className="ml-2 px-2.5 py-1 rounded-xl bg-white/20 hover:bg-white/30 text-white text-[11px] font-bold cursor-pointer transition-colors flex items-center gap-1 shrink-0"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Annuler</span>
            </button>
          )}
        </div>
      )}

      {/* Modal d'aperçu de Story */}
      {activeStory && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/85 backdrop-blur-md animate-fadeIn"
          onClick={() => setActiveStory(null)}
        >
          <div
            className="relative w-full max-w-[330px] h-[510px] rounded-[30px] overflow-hidden bg-gradient-to-b from-slate-900 via-[#0B1021] to-black border border-white/20 text-white shadow-[0_25px_60px_rgba(0,0,0,0.85)] flex flex-col justify-between p-4 sm:p-5"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-full bg-white/20 h-1 rounded-full overflow-hidden mb-3">
              <div className="bg-gradient-to-r from-cyan-400 to-[#0066FF] h-full w-full rounded-full animate-[pulse_3s_ease-in-out_infinite]" />
            </div>
            <div className="flex items-center justify-between gap-2 shrink-0">
              <div className="flex items-center gap-2.5 min-w-0">
                <img
                  src={activeStory.authorAvatar}
                  alt=""
                  referrerPolicy="no-referrer"
                  loading="lazy"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src = 'https://images.unsplash.com/photo-1507152832244-10d45c7eda57?auto=format&fit=crop&w=400&q=80';
                  }}
                  className="w-9 h-9 rounded-full object-cover ring-2 ring-cyan-400 shrink-0"
                />
                <div className="min-w-0">
                  <h4 className="font-extrabold text-xs text-white truncate">
                    {activeStory.authorName}
                  </h4>
                  <p className="text-[10px] text-slate-400">
                    {activeStory.timeAgo} &middot; Cotonou
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setActiveStory(null)}
                className="w-7 h-7 rounded-full bg-white/15 hover:bg-white/25 flex items-center justify-center text-white transition-colors cursor-pointer shrink-0"
                aria-label="Fermer la story"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="my-auto py-3 space-y-3">
              {activeStory.mediaUrl && (
                <div className="rounded-2xl overflow-hidden max-h-72 border border-white/20 shadow-xl">
                  <img
                    src={activeStory.mediaUrl}
                    alt="Story média"
                    className="w-full h-full object-cover max-h-72"
                  />
                </div>
              )}
              <div className="p-4 rounded-2xl bg-white/10 dark:bg-white/5 backdrop-blur-xl border border-white/15 space-y-2.5 shadow-lg">
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-cyan-950/80 text-cyan-300 border border-cyan-800/80 inline-block">
                  Status Développeur
                </span>
                <p className="text-xs sm:text-sm leading-relaxed text-slate-100 font-medium">
                  {activeStory.snippet}
                </p>
              </div>
            </div>

            <div className="space-y-2.5 shrink-0 pt-2 border-t border-white/10">
              <div className="flex items-center justify-around text-base">
                {['👍', '🔥', '🚀', '❤️', '💡'].map((emoji) => (
                  <button
                    key={emoji}
                    type="button"
                    onClick={() => showToast(`Réaction ${emoji} envoyée !`)}
                    className="hover:scale-125 transform transition-transform cursor-pointer p-1"
                  >
                    {emoji}
                  </button>
                ))}
              </div>
              <button
                type="button"
                onClick={() => {
                  setActiveStory(null);
                  setActiveTab('chat');
                }}
                className="w-full py-2 px-3 rounded-xl bg-[#0066FF] hover:bg-blue-600 text-white text-xs font-bold transition-all shadow-md shadow-blue-500/25 flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>Répondre en privé</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de création et galerie photo pour Story */}
      <CreateStoryModal
        isOpen={createStoryModalOpen}
        onClose={() => setCreateStoryModalOpen(false)}
        currentUser={currentUser}
        onPublishStory={(newStory) => {
          setStories([newStory, ...stories]);
          setActiveStory(newStory);
          triggerToast("Story publiée avec succès ! Visible pendant 24h.");
        }}
      />

      {/* Disposition principale */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* COLONNE CENTRALE */}
        <div className="lg:col-span-8 space-y-6">
          {/* BARRE DES STORIES */}
          <div className="p-4 rounded-3xl bg-white/90 dark:bg-slate-900/80 backdrop-blur-2xl border border-blue-200/60 dark:border-white/10 shadow-[0_4px_20px_rgba(0,102,255,0.06)] overflow-hidden">
            <div className="flex items-center justify-between mb-3 px-1 gap-2 overflow-hidden">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5 whitespace-nowrap shrink min-w-0">
                <Sparkles className="w-3.5 h-3.5 text-[#0066FF] shrink-0" />
                <span className="truncate">STORIES DES DÉVELOPPEURS</span>
              </h2>
              <span className="text-[11px] text-slate-400 font-medium shrink-0 whitespace-nowrap">Temps réel</span>
            </div>

            <div className="flex items-center gap-3.5 overflow-x-auto pb-2 no-scrollbar">
              <div
                onClick={() => setCreateStoryModalOpen(true)}
                className="group flex flex-col items-center justify-center w-24 h-32 sm:w-28 sm:h-36 rounded-2xl bg-gradient-to-b from-blue-100/70 to-blue-50/40 dark:from-slate-800 dark:to-slate-900 border border-blue-200/90 dark:border-slate-700/80 shrink-0 cursor-pointer hover:scale-102 transition-all p-2 text-center shadow-xs"
              >
                <div className="relative mb-2">
                  <img
                    src={currentUser.avatar}
                    alt=""
                    loading="lazy"
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src = 'https://images.unsplash.com/photo-1531384441138-2736e62e0919?auto=format&fit=crop&w=400&q=80';
                    }}
                    className="w-11 h-11 rounded-full object-cover ring-2 ring-white dark:ring-slate-800"
                  />
                  <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-[#0066FF] text-white flex items-center justify-center shadow-md">
                    <Plus className="w-3.5 h-3.5" />
                  </div>
                </div>
                <span className="text-[11px] font-bold text-slate-800 dark:text-slate-200 line-clamp-2 leading-tight">
                  Ajouter une Story
                </span>
              </div>

              {stories.map((story) => (
                <div
                  key={story.id}
                  onClick={() => setActiveStory(story)}
                  className="group flex flex-col items-center justify-between w-24 h-32 sm:w-28 sm:h-36 rounded-2xl p-2 bg-gradient-to-b from-blue-50/60 to-white dark:from-slate-800/90 dark:to-slate-900/90 border border-blue-200/70 dark:border-slate-700/80 shrink-0 cursor-pointer hover:scale-102 hover:shadow-md transition-all text-center relative overflow-hidden"
                >
                  <div className="p-0.5 rounded-full bg-gradient-to-tr from-[#0066FF] via-emerald-400 to-amber-400">
                    <img
                      src={story.authorAvatar}
                      alt=""
                      loading="lazy"
                      referrerPolicy="no-referrer"
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).src = 'https://images.unsplash.com/photo-1507152832244-10d45c7eda57?auto=format&fit=crop&w=400&q=80';
                      }}
                      className="w-11 h-11 rounded-full object-cover border-2 border-white dark:border-slate-900"
                    />
                  </div>
                  <span className="text-[10px] font-extrabold text-slate-900 dark:text-white line-clamp-1">
                    {story.authorName.split(' ')[0]}
                  </span>
                  <span className="text-[9px] text-slate-500 font-medium">
                    {story.timeAgo}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* COMPOSITEUR DE PUBLICATION */}
          <div className="p-5 rounded-3xl bg-white/90 dark:bg-slate-900/85 backdrop-blur-2xl border border-blue-200/60 dark:border-white/10 shadow-[0_8px_30px_rgba(0,102,255,0.07)] space-y-4">
            <div className="flex items-center gap-3">
              <img
                src={currentUser.avatar}
                alt=""
                loading="lazy"
                referrerPolicy="no-referrer"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src = 'https://images.unsplash.com/photo-1531384441138-2736e62e0919?auto=format&fit=crop&w=400&q=80';
                }}
                className="w-10 h-10 rounded-2xl object-cover ring-2 ring-blue-500/30 shrink-0"
              />
              <div className="flex-1 min-w-0">
                <input
                  type="text"
                  value={newPostContent}
                  onChange={(e) => handlePostContentChange(e.target.value)}
                  placeholder={animatedPlaceholder || `Que partagez-vous avec la communauté tech, ${formatNameWithUpperLastName(currentUser.name)} ?`}
                  className="w-full px-4 py-2.5 rounded-2xl bg-blue-50/60 dark:bg-slate-800/70 border border-blue-200/70 dark:border-slate-700/70 text-slate-900 dark:text-white placeholder:text-slate-400 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#0066FF] transition-all"
                />
              </div>
            </div>

            {showCodeComposer && (
              <div className="space-y-2 animate-fadeIn">
                <div className="flex items-center justify-between text-xs font-mono text-slate-500 dark:text-slate-400 px-1">
                  <span className="flex items-center gap-1.5 font-bold text-[#0066FF] dark:text-cyan-400">
                    <Code2 className="w-4 h-4 shrink-0" />
                    <span>
                      Éditeur VS Code
                      <span className="hidden sm:inline"> &middot; Coloration en temps réel</span>
                    </span>
                  </span>
                  <input
                    type="text"
                    value={newCodeFilename}
                    onChange={(e) => setNewCodeFilename(e.target.value)}
                    placeholder="nom-fichier.ts"
                    className="px-2.5 py-1 rounded-lg text-[11px] bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-mono border border-slate-300 dark:border-slate-700 outline-none focus:border-[#0066FF]"
                  />
                </div>
                <VSCodeEditor
                  value={newCodeSnippet}
                  onChange={setNewCodeSnippet}
                  language={newCodeLanguage}
                  onLanguageChange={handleLanguageChange}
                  filename={newCodeFilename}
                  onFilenameChange={setNewCodeFilename}
                  placeholder="// Saisissez votre code HTML, CSS, TypeScript, Java, Go, Python, PHP, etc..."
                  minHeight="150px"
                />
              </div>
            )}

            <div className="flex items-center justify-between pt-2 border-t border-slate-200/60 dark:border-slate-800 gap-2 overflow-x-auto no-scrollbar">
              <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => setShowCodeComposer(!showCodeComposer)}
                  className={`px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                    showCodeComposer
                      ? 'bg-blue-100 text-[#0066FF] dark:bg-blue-950 dark:text-cyan-400'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <Code2 className="w-4 h-4 text-[#0066FF] shrink-0" />
                  <span className="hidden sm:inline">Partager du Code (VS Code)</span>
                  <span className="sm:hidden font-mono">VS Code</span>
                </button>

                <select
                  value={newPostTag}
                  onChange={(e) => setNewPostTag(e.target.value)}
                  className="px-2 sm:px-2.5 py-1.5 rounded-xl text-xs font-semibold bg-blue-50/70 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-blue-200/60 dark:border-transparent cursor-pointer whitespace-nowrap shrink-0"
                >
                  <option value="#React19Bénin">#React19Bénin</option>
                  <option value="#FintechCFA">#FintechCFA</option>
                  <option value="#MoMoAPIs">#MoMoAPIs</option>
                  <option value="#SèmèCity">#SèmèCity</option>
                  <option value="#OpenSource">#OpenSource</option>
                </select>

                <select
                  value={newPostAudience}
                  onChange={(e) => setNewPostAudience(e.target.value as 'public' | 'community')}
                  className="px-2 sm:px-2.5 py-1.5 rounded-xl text-xs font-semibold bg-blue-50/70 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-blue-200/60 dark:border-transparent cursor-pointer whitespace-nowrap shrink-0"
                >
                  <option value="public">🌐 Public</option>
                  <option value="community">👥 Développeurs</option>
                </select>
              </div>

              <Button
                variant="primary"
                size="sm"
                onClick={handlePublishPost}
                disabled={!newPostContent.trim()}
                className="rounded-2xl px-4 sm:px-5 font-bold shadow-md shadow-blue-500/20 shrink-0 whitespace-nowrap ml-auto"
              >
                <span>Publier</span>
              </Button>
            </div>
          </div>

          {/* FLUX DES PUBLICATIONS */}
          <div className="space-y-6">
            {posts.map((post) => {
              const userRec = post.userReaction ? REACTION_CONFIG[post.userReaction] : null;
              const isCommentsOpen = !!expandedComments[post.id];

              return (
                <article
                  key={post.id}
                  className="rounded-3xl bg-white/92 dark:bg-slate-900/90 backdrop-blur-2xl border border-blue-100/90 dark:border-white/10 shadow-[0_6px_25px_rgba(0,102,255,0.06)] overflow-hidden transition-all duration-300 hover:shadow-[0_12px_35px_rgba(0,102,255,0.1)] hover:border-blue-200/90"
                >
                  <div className="p-5 pb-3 flex items-start justify-between gap-3">
                    <div
                      className="flex items-center gap-3 cursor-pointer group min-w-0"
                      onClick={() => {
                        const dev = MOCK_DEVELOPERS.find((d) => d.name.toLowerCase() === post.authorName.toLowerCase());
                        if (dev) setInspectDeveloper(dev);
                      }}
                    >
                      <img
                        src={post.authorAvatar}
                        alt=""
                        loading="lazy"
                        onError={(e) => {
                          (e.currentTarget as HTMLImageElement).src = 'https://images.unsplash.com/photo-1507152832244-10d45c7eda57?auto=format&fit=crop&w=400&q=80';
                        }}
                        className="w-11 h-11 rounded-2xl object-cover ring-2 ring-blue-500/20 group-hover:ring-[#0066FF] transition-all shrink-0"
                      />
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <h3 className="font-black text-sm text-slate-900 dark:text-white group-hover:text-[#0066FF] transition-colors truncate">
                            {formatNameWithUpperLastName(post.authorName)}
                          </h3>
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#0066FF] shrink-0" />
                        </div>
                        <p className="text-xs text-slate-500 dark:text-slate-400 font-medium truncate">
                          {post.authorRole}
                        </p>
                        <div className="flex items-center gap-1.5 text-[11px] text-slate-400 mt-0.5 whitespace-nowrap overflow-hidden">
                          <span className="shrink-0">{post.timestamp}</span>
                          {post.isEdited && (
                            <span className="text-slate-400 italic font-medium shrink-0">• Modifié</span>
                          )}
                          <span className="shrink-0">&middot;</span>
                          <span className="flex items-center gap-0.5 shrink-0 truncate max-w-[130px] sm:max-w-none">
                            <MapPin className="w-3 h-3 text-red-500 shrink-0" />
                            <span className="truncate">{post.authorCity}</span>
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      {post.authorId !== currentUser.id && (() => {
                        const dev = MOCK_DEVELOPERS.find((d) => d.name.toLowerCase() === post.authorName.toLowerCase());
                        const devId = dev?.id || post.authorId;
                        const status = getConnectionStatus(devId);
                        if (status === 'connected') {
                          return (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full text-[10px] font-bold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/60 shrink-0">
                              <UserCheck className="w-3 h-3" />
                              <span>En relation</span>
                            </span>
                          );
                        }
                        if (status === 'pending') {
                          return (
                            <button
                              type="button"
                              onClick={() => cancelInvitation(devId)}
                              className="inline-flex items-center gap-1 px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full text-[10px] font-bold bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800/60 hover:bg-amber-100 transition-colors cursor-pointer shrink-0"
                              title="Cliquer pour annuler l'invitation"
                            >
                              <Clock className="w-3 h-3" />
                              <span>En attente</span>
                            </button>
                          );
                        }
                        return (
                          <button
                            type="button"
                            onClick={() => sendInvitation(devId, post.authorName)}
                            className="inline-flex items-center gap-1 px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full text-[10px] font-bold bg-blue-50 hover:bg-blue-100 dark:bg-slate-800 dark:hover:bg-slate-700 text-[#0066FF] dark:text-cyan-400 border border-blue-200/80 dark:border-slate-700 transition-all cursor-pointer shadow-2xs shrink-0"
                            title="Envoyer une invitation de connexion"
                          >
                            <UserPlus className="w-3 h-3" />
                            <span>Ajouter</span>
                          </button>
                        );
                      })()}
                      {post.isPinned && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-[#0066FF] dark:bg-blue-950/60 dark:text-cyan-300 border border-blue-200 dark:border-blue-900/40 shrink-0 whitespace-nowrap">
                          <Pin className="w-2.5 h-2.5 fill-current" />
                          <span>Épinglé</span>
                        </span>
                      )}
                      <button
                        onClick={() => handleToggleBookmark(post.id)}
                        className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors cursor-pointer shrink-0 ${
                          post.isBookmarked
                            ? 'text-[#0066FF] bg-blue-50 dark:bg-blue-950/40'
                            : 'text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                        }`}
                        title={post.isBookmarked ? 'Retirer des favoris' : 'Enregistrer'}
                      >
                        <Bookmark className={`w-4 h-4 ${post.isBookmarked ? 'fill-current' : ''}`} />
                      </button>

                      {/* Menu 3-points façon réseaux sociaux */}
                      <div className="relative shrink-0">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setOpenPostMenuId(openPostMenuId === post.id ? null : post.id);
                          }}
                          className="post-menu-trigger w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                          aria-label="Options de la publication"
                        >
                          <MoreHorizontal className="w-4 h-4" />
                        </button>

                        {openPostMenuId === post.id && (
                          <div
                            className="post-menu-dropdown absolute right-0 top-9 z-30 w-52 sm:w-56 rounded-2xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-2xl border border-slate-200 dark:border-slate-800 shadow-2xl p-1.5 space-y-0.5 animate-fadeIn text-xs whitespace-nowrap"
                            onClick={(e) => e.stopPropagation()}
                          >
                            {/* Options Auteur */}
                            {isPostAuthor(post) && (
                              <>
                                {(() => {
                                  const editStatus = getEditStatus(post);
                                  return (
                                    <button
                                      type="button"
                                      disabled={!editStatus.canEdit}
                                      onClick={() => handleStartEdit(post)}
                                      className={`w-full flex items-center justify-between px-3 py-2 rounded-xl font-bold transition-all whitespace-nowrap ${
                                        editStatus.canEdit
                                          ? 'text-slate-800 dark:text-slate-200 hover:bg-blue-50 dark:hover:bg-slate-800 hover:text-[#0066FF] cursor-pointer'
                                          : 'text-slate-400 dark:text-slate-600 cursor-not-allowed opacity-60'
                                      }`}
                                    >
                                      <span className="flex items-center gap-2">
                                        <Edit3 className="w-3.5 h-3.5 text-[#0066FF] shrink-0" />
                                        <span>Modifier le texte</span>
                                      </span>
                                      <span className="text-[10px] font-semibold text-slate-400 flex items-center gap-0.5 shrink-0">
                                        <Clock className="w-2.5 h-2.5" />
                                        {editStatus.canEdit ? `${editStatus.remainingMinutes} min` : 'Expiré'}
                                      </span>
                                    </button>
                                  );
                                })()}

                                <button
                                  type="button"
                                  onClick={() => handleTogglePinPost(post.id)}
                                  className="w-full flex items-center gap-2 px-3 py-2 rounded-xl font-bold text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all cursor-pointer whitespace-nowrap"
                                >
                                  {post.isPinned ? (
                                    <>
                                      <PinOff className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                                      <span>Détacher le post</span>
                                    </>
                                  ) : (
                                    <>
                                      <Pin className="w-3.5 h-3.5 text-[#0066FF] shrink-0" />
                                      <span>Épingler sur mon profil</span>
                                    </>
                                  )}
                                </button>
                                <div className="h-px bg-slate-200 dark:bg-slate-800 my-1" />
                              </>
                            )}

                            {/* Options Universelles */}
                            <button
                              type="button"
                              onClick={() => handleCopyPostLink(post.id)}
                              className="w-full flex items-center gap-2 px-3 py-2 rounded-xl font-bold text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all cursor-pointer whitespace-nowrap"
                            >
                              <Copy className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                              <span>Copier le lien direct</span>
                            </button>

                            <button
                              type="button"
                              onClick={() => handleToggleBookmark(post.id)}
                              className="w-full flex items-center gap-2 px-3 py-2 rounded-xl font-bold text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all cursor-pointer whitespace-nowrap"
                            >
                              <Bookmark className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                              <span>{post.isBookmarked ? 'Retirer des favoris' : 'Enregistrer en favoris'}</span>
                            </button>

                            <button
                              type="button"
                              onClick={() => handleHidePost(post.id)}
                              className="w-full flex items-center gap-2 px-3 py-2 rounded-xl font-bold text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all cursor-pointer whitespace-nowrap"
                            >
                              <EyeOff className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                              <span>Masquer la publication</span>
                            </button>

                            {/* Option Suppression */}
                            {isPostAuthor(post) && (
                              <>
                                <div className="h-px bg-slate-200 dark:bg-slate-800 my-1" />
                                <button
                                  type="button"
                                  onClick={() => handleDeletePost(post.id)}
                                  className="w-full flex items-center gap-2 px-3 py-2 rounded-xl font-bold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-all cursor-pointer whitespace-nowrap"
                                >
                                  <Trash2 className="w-3.5 h-3.5 shrink-0" />
                                  <span>Supprimer la publication</span>
                                </button>
                              </>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Corps de la publication : Mode Édition ou Affichage standard */}
                  {editingPostId === post.id ? (
                    <div className="mx-5 my-2 p-4 rounded-2xl bg-blue-50/50 dark:bg-slate-800/60 border border-[#0066FF]/30 space-y-3 animate-fadeIn">
                      <div className="flex items-center justify-between text-xs text-blue-600 dark:text-cyan-400 font-bold">
                        <span className="flex items-center gap-1.5">
                          <Edit3 className="w-3.5 h-3.5" />
                          <span>Modifier la publication</span>
                        </span>
                        <span className="text-[11px] text-slate-500 font-medium flex items-center gap-1">
                          <Clock className="w-3 h-3 text-amber-500" />
                          Délai de {POST_EDIT_LIMIT_MINUTES} min (réseaux sociaux)
                        </span>
                      </div>
                      <textarea
                        value={editingContent}
                        onChange={(e) => setEditingContent(e.target.value)}
                        rows={4}
                        className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#0066FF] resize-none"
                        placeholder="Modifiez votre texte..."
                      />
                      <div>
                        <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 mb-1">
                          Hashtags (séparés par des espaces)
                        </label>
                        <input
                          type="text"
                          value={editingTags}
                          onChange={(e) => setEditingTags(e.target.value)}
                          className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-xs focus:outline-none focus:ring-2 focus:ring-[#0066FF]"
                          placeholder="#React19 #DevConnect"
                        />
                      </div>
                      <div className="flex items-center justify-end gap-2 pt-1">
                        <button
                          type="button"
                          onClick={handleCancelEdit}
                          className="px-3.5 py-1.5 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer"
                        >
                          Annuler
                        </button>
                        <button
                          type="button"
                          onClick={() => handleSaveEdit(post.id)}
                          className="px-4 py-1.5 rounded-xl text-xs font-bold bg-[#0066FF] hover:bg-blue-600 text-white shadow-sm flex items-center gap-1.5 transition-all cursor-pointer"
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>Enregistrer les modifications</span>
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="px-5 py-2 text-sm leading-relaxed text-slate-800 dark:text-slate-200 whitespace-pre-line font-normal">
                        {post.content}
                      </div>

                      {post.tags.length > 0 && (
                        <div className="px-5 py-1.5 flex flex-wrap gap-2">
                          {post.tags.map((t) => (
                            <span
                              key={t}
                              className="text-xs font-bold text-[#0066FF] dark:text-cyan-400 hover:underline cursor-pointer"
                            >
                              {t}
                            </span>
                          ))}
                        </div>
                      )}
                    </>
                  )}

                  {post.codeSnippet && (
                    <div className="px-5 py-2">
                      <CodeBlock
                        code={post.codeSnippet.code}
                        language={post.codeSnippet.language}
                        filename={post.codeSnippet.filename}
                      />
                    </div>
                  )}

                  {post.poll && (
                    <div className="mx-5 my-3 p-4 rounded-2xl bg-blue-50/60 dark:bg-slate-800/60 border border-blue-100 dark:border-slate-700/60 space-y-3">
                      <div className="flex items-center gap-2">
                        <BarChart2 className="w-4 h-4 text-[#0066FF]" />
                        <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                          {post.poll.question}
                        </h4>
                      </div>
                      <div className="space-y-2">
                        {post.poll.options.map((option) => {
                          const pct =
                            post.poll!.totalVotes > 0
                              ? Math.round((option.votes / post.poll!.totalVotes) * 100)
                              : 0;
                          const isSelected = post.poll!.userVotedOptionId === option.id;

                          return (
                            <button
                              key={option.id}
                              onClick={() => handleVotePoll(post.id, option.id)}
                              className={`w-full p-2.5 rounded-xl border text-left relative overflow-hidden transition-all cursor-pointer ${
                                isSelected
                                  ? 'border-[#0066FF] bg-blue-100/50 dark:bg-blue-950/60'
                                  : 'border-slate-200/80 dark:border-slate-700 bg-white dark:bg-slate-900'
                              }`}
                            >
                              <div
                                className="absolute inset-y-0 left-0 bg-blue-500/15 transition-all duration-500"
                                style={{ width: `${pct}%` }}
                              />
                              <div className="relative z-10 flex items-center justify-between text-xs font-semibold">
                                <span className="flex items-center gap-2">
                                  {isSelected && <Check className="w-3.5 h-3.5 text-[#0066FF]" />}
                                  <span className="text-slate-800 dark:text-slate-100">{option.text}</span>
                                </span>
                                <span className="text-slate-500 font-mono text-[11px] tabular-nums">
                                  {pct}% ({option.votes})
                                </span>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                      <div className="text-[10px] text-slate-400 font-medium">
                        {post.poll.totalVotes} votes au total
                      </div>
                    </div>
                  )}

                  <div className="px-5 py-2 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 border-b border-slate-100 dark:border-slate-800/80">
                    <div className="flex items-center gap-1.5">
                      <span className="inline-flex items-center -space-x-1">
                        <span className="w-5 h-5 rounded-full bg-blue-500 text-white text-[10px] flex items-center justify-center">👍</span>
                        <span className="w-5 h-5 rounded-full bg-rose-500 text-white text-[10px] flex items-center justify-center">❤️</span>
                        <span className="w-5 h-5 rounded-full bg-amber-500 text-white text-[10px] flex items-center justify-center">🔥</span>
                      </span>
                      <span className="font-semibold text-slate-700 dark:text-slate-300 tabular-nums">
                        {post.reactions.like +
                          post.reactions.love +
                          post.reactions.fire +
                          post.reactions.idea +
                          post.reactions.celebrate}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span>{post.comments.length} commentaires</span>
                      <span>&middot;</span>
                      <span>{post.sharesCount} partages</span>
                    </div>
                  </div>

                  {/* BARRE D'ACTIONS AVEC BOUTONS BIEN ALIGNÉS */}
                  <div className="px-3 py-1.5 relative flex items-center justify-around border-b border-slate-100 dark:border-slate-800/80">
                    {hoveredReactionPostId === post.id && (
                      <div
                        onMouseLeave={() => setHoveredReactionPostId(null)}
                        className="absolute -top-12 left-4 z-30 p-1.5 rounded-full bg-white dark:bg-slate-800 shadow-2xl border border-slate-200 dark:border-slate-700 flex items-center gap-1.5"
                      >
                        {(Object.keys(REACTION_CONFIG) as FeedReactionType[]).map((rType) => {
                          const item = REACTION_CONFIG[rType];
                          return (
                            <button
                              key={rType}
                              onClick={() => handleToggleReaction(post.id, rType)}
                              className="w-9 h-9 rounded-full flex items-center justify-center text-lg hover:scale-125 transition-transform cursor-pointer"
                              title={item.label}
                            >
                              {item.icon}
                            </button>
                          );
                        })}
                      </div>
                    )}

                    <button
                      onMouseEnter={() => setHoveredReactionPostId(post.id)}
                      onClick={() => handleToggleReaction(post.id, post.userReaction || 'like')}
                      className={`flex-1 py-2 px-2 rounded-2xl flex items-center justify-center gap-1.5 sm:gap-2 text-xs font-bold transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                        userRec
                          ? `${userRec.color} ${userRec.bg}`
                          : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                      }`}
                    >
                      <span className="text-base">{userRec ? userRec.icon : '👍'}</span>
                      <span>{userRec ? userRec.label : "J'aime"}</span>
                    </button>

                    <button
                      onClick={() =>
                        setExpandedComments((prev) => ({ ...prev, [post.id]: !prev[post.id] }))
                      }
                      className="flex-1 py-2 px-2 rounded-2xl flex items-center justify-center gap-1.5 sm:gap-2 text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer whitespace-nowrap shrink-0"
                    >
                      <MessageCircle className="w-4 h-4 shrink-0" />
                      <span>Commenter</span>
                    </button>

                    <button
                      onClick={() => {
                        navigator.clipboard?.writeText(window.location.href);
                        showToast('Lien de la publication copié dans le presse-papier !');
                      }}
                      className="flex-1 py-2 px-2 rounded-2xl flex items-center justify-center gap-1.5 sm:gap-2 text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer whitespace-nowrap shrink-0"
                    >
                      <Share2 className="w-4 h-4 shrink-0" />
                      <span>Partager</span>
                    </button>
                  </div>

                  {/* SECTION DES COMMENTAIRES DÉROULANTE */}
                  {isCommentsOpen && (
                    <div className="p-4 sm:p-5 bg-slate-50/70 dark:bg-slate-950/40 space-y-4">
                      <div className="flex items-start gap-2.5">
                        <img
                          src={currentUser.avatar}
                          alt=""
                          referrerPolicy="no-referrer"
                          loading="lazy"
                          onError={(e) => {
                            (e.currentTarget as HTMLImageElement).src = 'https://images.unsplash.com/photo-1531384441138-2736e62e0919?auto=format&fit=crop&w=400&q=80';
                          }}
                          className="w-8 h-8 rounded-full object-cover shrink-0 mt-0.5"
                        />
                        <div className="flex-1 relative">
                          <input
                            type="text"
                            value={commentInputs[post.id] || ''}
                            onChange={(e) =>
                              setCommentInputs((prev) => ({ ...prev, [post.id]: e.target.value }))
                            }
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') handleAddComment(post.id);
                            }}
                            placeholder="Écrire un commentaire..."
                            className="w-full pl-3.5 pr-10 py-2 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#0066FF]"
                          />
                          <button
                            onClick={() => handleAddComment(post.id)}
                            className="absolute right-2 top-2 text-[#0066FF] hover:text-blue-700 p-1 cursor-pointer"
                            title="Envoyer"
                          >
                            <Send className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      <div className="space-y-3 pt-1">
                        {post.comments.map((comment) => (
                          <div key={comment.id} className="flex items-start gap-2.5">
                            <img
                              src={comment.authorAvatar}
                              alt=""
                              referrerPolicy="no-referrer"
                              loading="lazy"
                              onError={(e) => {
                                (e.currentTarget as HTMLImageElement).src = 'https://images.unsplash.com/photo-1522529599102-193c0d76b5b6?auto=format&fit=crop&w=400&q=80';
                              }}
                              className="w-8 h-8 rounded-full object-cover shrink-0 mt-1"
                            />
                            <div className="flex-1">
                              <div className="p-3 rounded-2xl bg-white dark:bg-slate-800/90 border border-slate-200/80 dark:border-slate-700/80 text-xs">
                                <div className="flex items-center justify-between mb-0.5">
                                  <span className="font-bold text-slate-900 dark:text-white">
                                    {formatNameWithUpperLastName(comment.authorName)}
                                  </span>
                                  <span className="text-[10px] text-slate-400">
                                    {comment.timestamp}
                                  </span>
                                </div>
                                <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                                  {comment.content}
                                </p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </article>
              );
            })}
          </div>
        </div>

        {/* COLONNE DROITE : Événements, Tendances, Suggestions */}
        <aside className="lg:col-span-4 space-y-6">
          <div className="p-5 rounded-3xl bg-white/90 dark:bg-slate-900/85 backdrop-blur-2xl border border-blue-200/60 dark:border-white/10 shadow-[0_8px_30px_rgba(0,102,255,0.06)] space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-[#0066FF]" />
                <span>Événements Tech Bénin</span>
              </h2>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950 text-[#0066FF]">
                À VENIR
              </span>
            </div>

            <div className="space-y-3">
              {events.map((evt) => (
                <div
                  key={evt.id}
                  className="p-3.5 rounded-2xl bg-blue-50/50 dark:bg-slate-800/60 border border-blue-200/70 dark:border-slate-700/60 space-y-2 hover:border-[#0066FF]/50 transition-colors"
                >
                  <h3 className="font-bold text-xs text-slate-900 dark:text-white leading-snug">
                    {evt.title}
                  </h3>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 space-y-0.5">
                    <p className="flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-[#0066FF]" />
                      <span>{evt.date} à {evt.time}</span>
                    </p>
                    <p className="flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-red-500" />
                      <span>{evt.location}</span>
                    </p>
                  </div>
                  <div className="flex items-center justify-between pt-1">
                    <span className="text-[10px] text-slate-500">
                      {evt.attendeesCount} participants
                    </span>
                    <button
                      onClick={() => handleToggleEventAttendance(evt.id)}
                      className={`px-3 py-1 rounded-xl text-[11px] font-bold transition-all cursor-pointer ${
                        evt.isAttending
                          ? 'bg-emerald-500 text-white shadow-xs'
                          : 'bg-white dark:bg-slate-800 text-[#0066FF] border border-blue-200 dark:border-blue-800 hover:bg-blue-50'
                      }`}
                    >
                      {evt.isAttending ? 'Inscrit(e) ✓' : 'Participer'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="p-5 rounded-3xl bg-white/90 dark:bg-slate-900/85 backdrop-blur-2xl border border-blue-200/60 dark:border-white/10 shadow-[0_8px_30px_rgba(0,102,255,0.06)] space-y-3">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
              <TrendingUp className="w-4 h-4 text-[#0066FF]" />
              <span>Sujets Tendance au Bénin</span>
            </h2>
            <div className="space-y-2">
              {MOCK_TRENDING_TOPICS.map((topic) => (
                <div
                  key={topic.tag}
                  className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors cursor-pointer"
                  onClick={() => {
                    setNewPostTag(topic.tag);
                    showToast(`Sujet ${topic.tag} sélectionné pour votre prochaine publication.`);
                  }}
                >
                  <span className="text-xs font-bold text-[#0066FF] dark:text-cyan-400">
                    {topic.tag}
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">
                    {topic.postsCount}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* WIDGET : INVITATIONS ET SUGGESTIONS DE CONNEXION RÉSEAU */}
          <div className="p-5 rounded-3xl bg-white/85 dark:bg-slate-900/85 backdrop-blur-2xl border border-white/60 dark:border-white/10 shadow-[0_8px_30px_rgba(0,102,255,0.06)] space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                <Users className="w-4 h-4 text-[#0066FF]" />
                <span>Réseau & Relations</span>
              </h2>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-[#0066FF] dark:bg-blue-950/60 dark:text-cyan-400">
                {connectedDevIds.length} contact{connectedDevIds.length > 1 ? 's' : ''}
              </span>
            </div>

            {/* Invitations reçues en attente de réponse */}
            {pendingReceivedInvitations.length > 0 && (
              <div className="space-y-2 pb-3 border-b border-slate-200/80 dark:border-slate-800">
                <span className="text-[10px] font-black uppercase tracking-wider text-amber-600 dark:text-amber-400 flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  <span>Invitations reçues ({pendingReceivedInvitations.length})</span>
                </span>
                <div className="space-y-2">
                  {pendingReceivedInvitations.map((inv) => (
                    <div
                      key={inv.id}
                      className="p-2.5 rounded-2xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200/70 dark:border-amber-900/50 space-y-2"
                    >
                      <div className="flex items-center gap-2">
                        <img
                          src={inv.avatar}
                          alt=""
                          referrerPolicy="no-referrer"
                          className="w-8 h-8 rounded-full object-cover ring-1 ring-amber-400 shrink-0"
                        />
                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-black text-slate-900 dark:text-white truncate">
                            {formatNameWithUpperLastName(inv.name)}
                          </p>
                          <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate">
                            {inv.title} &middot; {inv.mutualCount} relations en commun
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5 pt-1">
                        <button
                          type="button"
                          onClick={() => acceptInvitation(inv.id)}
                          className="flex-1 py-1 px-2.5 rounded-xl text-[11px] font-bold bg-[#0066FF] hover:bg-blue-600 text-white flex items-center justify-center gap-1 transition-all cursor-pointer shadow-xs"
                        >
                          <Check className="w-3 h-3" />
                          <span>Accepter</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => rejectInvitation(inv.id)}
                          className="py-1 px-2.5 rounded-xl text-[11px] font-bold bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 transition-all cursor-pointer"
                        >
                          Ignorer
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Suggestions de profil à ajouter */}
            <div className="space-y-2.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 block">
                Développeurs suggérés
              </span>
              <div className="space-y-2.5">
                {MOCK_DEVELOPERS.slice(0, 4).map((dev) => {
                  const status = getConnectionStatus(dev.id);
                  return (
                    <div
                      key={dev.id}
                      className="flex items-center justify-between gap-2 p-2.5 rounded-2xl bg-slate-50/80 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/60"
                    >
                      <div
                        className="flex items-center gap-2.5 cursor-pointer min-w-0"
                        onClick={() => setInspectDeveloper(dev)}
                      >
                        <img
                          src={dev.avatar}
                          alt=""
                          referrerPolicy="no-referrer"
                          loading="lazy"
                          onError={(e) => {
                            (e.currentTarget as HTMLImageElement).src = 'https://images.unsplash.com/photo-1522529599102-193c0d76b5b6?auto=format&fit=crop&w=400&q=80';
                          }}
                          className="w-9 h-9 rounded-xl object-cover shrink-0"
                        />
                        <div className="min-w-0">
                          <p className="text-xs font-extrabold text-slate-900 dark:text-white truncate">
                            {formatNameWithUpperLastName(dev.name)}
                          </p>
                          <p className="text-[10px] text-slate-400 truncate">
                            {dev.title || dev.role}
                          </p>
                        </div>
                      </div>

                      <div className="shrink-0 flex items-center gap-1">
                        {status === 'connected' ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl text-[10px] font-bold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/60">
                            <UserCheck className="w-3 h-3" />
                            <span>Connecté</span>
                          </span>
                        ) : status === 'pending' ? (
                          <button
                            type="button"
                            onClick={() => cancelInvitation(dev.id)}
                            className="px-2.5 py-1 rounded-xl text-[10px] font-bold bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800/60 hover:bg-amber-100 transition-colors cursor-pointer"
                            title="Annuler l'invitation"
                          >
                            <span>En attente</span>
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() => sendInvitation(dev.id, dev.name)}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl text-[10px] font-bold bg-[#0066FF] hover:bg-blue-600 text-white transition-all shadow-xs cursor-pointer"
                          >
                            <UserPlus className="w-3 h-3" />
                            <span>Ajouter</span>
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
