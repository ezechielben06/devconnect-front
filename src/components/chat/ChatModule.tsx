// Module de chat temps réel branché sur le backend Laravel + Reverb.

import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { chatApi, BackendMessage, BackendConversation } from '../../api';
import { subscribeToConversation, unsubscribeFromConversation } from '../../echo';
import { ChatChannel, ChatMessage, GroupMember, EphemeralDuration } from '../../types';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { Avatar } from '../ui/Avatar';
import { Skeleton } from '../ui/Skeleton';
import { EmptyState } from '../ui/EmptyState';
import { CodeBlock } from '../common/CodeBlock';
import { VSCodeEditor } from '../common/VSCodeEditor';
import { formatNameWithUpperLastName } from '../../utils/formatters';
import { isCodeContent, detectLanguageFromCode, SUPPORTED_LANGUAGES } from '../../utils/codeHighlighter';
import {
  MessageSquare,
  Send,
  Code,
  Languages,
  Hash,
  ChevronLeft,
  Search,
  Palette,
  Image as ImageIcon,
  Check,
  X,
  Sparkles,
  Users,
  Plus,
  Shield,
  Clock,
  Lock,
  Edit2,
  Trash2,
  Copy,
  Smile,
  UserPlus,
  UserMinus,
  CheckCircle2,
} from 'lucide-react';

export interface ChatWallpaper {
  id: string;
  name: string;
  subtitle: string;
  bgClass: string;
  style?: React.CSSProperties;
  patternType?: 'grid' | 'dots' | 'matrix' | 'sunset' | 'midnight' | 'wax' | 'none';
}

const PRESET_WALLPAPERS: ChatWallpaper[] = [
  {
    id: 'default',
    name: 'Classique Glassmorphism',
    subtitle: 'Épuré et lumineux iOS 26',
    bgClass: 'bg-white dark:bg-[#090D1A]',
    patternType: 'none',
  },
  {
    id: 'blueprint',
    name: 'Blueprint Ingénieur Architecte',
    subtitle: 'Grille technique architecturale',
    bgClass: 'bg-[#0A192F] text-slate-100',
    patternType: 'grid',
    style: {
      backgroundImage: `
        linear-gradient(rgba(0, 102, 255, 0.15) 1px, transparent 1px),
        linear-gradient(90deg, rgba(0, 102, 255, 0.15) 1px, transparent 1px)
      `,
      backgroundSize: '24px 24px',
    },
  },
  {
    id: 'matrix',
    name: 'Matrice Cyber Cotonou',
    subtitle: 'Ambiance hacker & néon vert émeraude',
    bgClass: 'bg-[#030B07] text-emerald-100',
    patternType: 'matrix',
    style: {
      backgroundImage: `
        radial-gradient(circle at 50% 50%, rgba(16, 185, 129, 0.12) 0%, transparent 80%),
        linear-gradient(rgba(16, 185, 129, 0.08) 1px, transparent 1px),
        linear-gradient(90deg, rgba(16, 185, 129, 0.08) 1px, transparent 1px)
      `,
      backgroundSize: '100% 100%, 28px 28px, 28px 28px',
    },
  },
  {
    id: 'sunset',
    name: 'Coucher de Soleil Haie Vive',
    subtitle: 'Dégradé chaleureux crépuscule béninois',
    bgClass: 'bg-[#150A21] text-amber-50',
    patternType: 'sunset',
    style: {
      backgroundImage: `
        radial-gradient(circle at 10% 20%, rgba(249, 115, 22, 0.22) 0%, transparent 50%),
        radial-gradient(circle at 90% 80%, rgba(168, 85, 247, 0.25) 0%, transparent 50%),
        linear-gradient(135deg, #10061e 0%, #1e092b 100%)
      `,
    },
  },
  {
    id: 'midnight',
    name: 'Nuit Étoilée Porto-Novo',
    subtitle: 'Bleu nuit profond & indigo stellaire',
    bgClass: 'bg-[#050B1E] text-blue-100',
    patternType: 'midnight',
    style: {
      backgroundImage: `
        radial-gradient(circle at 50% 0%, rgba(59, 130, 246, 0.25) 0%, transparent 60%),
        radial-gradient(circle at 80% 90%, rgba(99, 102, 241, 0.2) 0%, transparent 60%),
        linear-gradient(180deg, #040816 0%, #0a1128 100%)
      `,
    },
  },
  {
    id: 'wax',
    name: 'Motif Géométrique Wax',
    subtitle: 'Inspiration textile moderne ouest-africaine',
    bgClass: 'bg-[#0E1322] text-slate-100',
    patternType: 'wax',
    style: {
      backgroundImage: `
        radial-gradient(rgba(245, 158, 11, 0.12) 1.5px, transparent 1.5px),
        radial-gradient(rgba(0, 102, 255, 0.12) 1.5px, #0b0f1d 1.5px)
      `,
      backgroundSize: '28px 28px',
      backgroundPosition: '0 0, 14px 14px',
    },
  },
];

const PRESET_GROUP_AVATARS = [
  'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1551434678-e076c223a692?w=150&auto=format&fit=crop&q=80',
];

const EMOJI_REACTIONS = ['👍', '❤️', '🔥', '🚀', '🎯', '💡', '🎉'];

export function ChatModule() {
  const { language, currentUser } = useApp();
  const [channels, setChannels] = useState<ChatChannel[]>([]);
  const [activeChannelId, setActiveChannelId] = useState<string>('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loadingChannels, setLoadingChannels] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [mobileChannelListOpen, setMobileChannelListOpen] = useState(false);
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<'all' | 'channels' | 'groups'>('all');

  const [selectedWallpaperId, setSelectedWallpaperId] = useState<string>(() => {
    return localStorage.getItem('devconnect_chat_wallpaper_id') || 'default';
  });
  const [customImageUrl, setCustomImageUrl] = useState<string>(() => {
    return localStorage.getItem('devconnect_chat_wallpaper_custom') || '';
  });
  const [wallpaperModalOpen, setWallpaperModalOpen] = useState(false);

  const [textInput, setTextInput] = useState('');
  const [showCodeInput, setShowCodeInput] = useState(false);
  const [codeInput, setCodeInput] = useState('');
  const [codeLang, setCodeLang] = useState('typescript');
  const [codeDetectedPrompt, setCodeDetectedPrompt] = useState(false);
  const [displayLanguage, setDisplayLanguage] = useState<'fr' | 'en'>(language);

  const [createGroupModalOpen, setCreateGroupModalOpen] = useState(false);
  const [groupDetailsModalOpen, setGroupDetailsModalOpen] = useState(false);

  const [newGroupName, setNewGroupName] = useState('');
  const [newGroupDesc, setNewGroupDesc] = useState('');
  const [newGroupAvatar, setNewGroupAvatar] = useState(PRESET_GROUP_AVATARS[0]);

  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev));
    }, 2500);
  };

  const [channelSearch, setChannelSearch] = useState('');
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setDisplayLanguage(language);
  }, [language]);

  const handleSelectWallpaper = (id: string) => {
    setSelectedWallpaperId(id);
    localStorage.setItem('devconnect_chat_wallpaper_id', id);
    showToast("Fond d'écran mis à jour et mémorisé !");
  };

  const handleSaveCustomImage = (url: string) => {
    setCustomImageUrl(url);
    localStorage.setItem('devconnect_chat_wallpaper_custom', url);
    showToast('Image personnalisée appliquée !');
  };

  // 1. Charger les conversations depuis le backend
  useEffect(() => {
    let isMounted = true;
    setLoadingChannels(true);

    chatApi.getConversations().then((res) => {
      if (isMounted) {
        const mappedChannels: ChatChannel[] = res.data.map((c: BackendConversation) => ({
          id: String(c.id),
          name: c.name,
          descriptionFr: c.type === 'general' ? 'Canal général de discussion' : 'Groupe privé',
          descriptionEn: c.type === 'general' ? 'General discussion channel' : 'Private group',
          category: c.type as any,
          unreadCount: 0,
          isGroup: c.type === 'group',
          creatorId: String(c.created_by || ''),
          members: [],
        }));
        setChannels(mappedChannels);
        if (mappedChannels.length > 0) {
          setActiveChannelId(mappedChannels[0].id);
        }
        setLoadingChannels(false);
      }
    }).catch(() => {
      if (isMounted) setLoadingChannels(false);
    });

    return () => { isMounted = false; };
  }, []);

  // 2. Charger les messages quand on change de canal
  useEffect(() => {
    if (!activeChannelId) return;

    let isMounted = true;
    setLoadingMessages(true);

    chatApi.getMessages(Number(activeChannelId)).then((res) => {
      if (isMounted) {
        const mappedMessages: ChatMessage[] = res.data.map((m: BackendMessage) => ({
          id: String(m.id),
          channelId: String(m.conversation_id),
          senderId: String(m.user_id),
          senderName: m.user.name,
          senderAvatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(m.user.name)}&background=0066FF&color=fff`,
          timestamp: new Date(m.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          createdAt: new Date(m.created_at).getTime(),
          contentFr: m.content,
          contentEn: m.content,
          codeSnippet: m.code_blocks && m.code_blocks.length > 0
            ? { code: m.code_blocks[0].code, language: m.code_blocks[0].language, filename: `snippet.${m.code_blocks[0].language}` }
            : undefined,
        }));
        setMessages(mappedMessages);
        setLoadingMessages(false);
      }
    }).catch(() => {
      if (isMounted) setLoadingMessages(false);
    });

    return () => { isMounted = false; };
  }, [activeChannelId]);

  // 3. Écouter le WebSocket Reverb
  useEffect(() => {
    if (!activeChannelId) return;

    const channel = subscribeToConversation(Number(activeChannelId), (newEvent: any) => {
      const newMsg: ChatMessage = {
        id: String(newEvent.id),
        channelId: String(newEvent.conversation_id),
        senderId: String(newEvent.user_id),
        senderName: newEvent.user.name,
        senderAvatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(newEvent.user.name)}&background=0066FF&color=fff`,
        timestamp: new Date(newEvent.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        createdAt: new Date(newEvent.created_at).getTime(),
        contentFr: newEvent.content,
        contentEn: newEvent.content,
        codeSnippet: newEvent.code_blocks && newEvent.code_blocks.length > 0
          ? { code: newEvent.code_blocks[0].code, language: newEvent.code_blocks[0].language }
          : undefined,
      };

      setMessages((prev) => {
        if (prev.some(m => m.id === newMsg.id)) return prev;
        return [...prev, newMsg];
      });
    });

    return () => {
      unsubscribeFromConversation(Number(activeChannelId));
    };
  }, [activeChannelId]);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }, [messages, loadingMessages]);

  const activeChannel = channels.find((c) => c.id === activeChannelId);

  const canPostInActiveChannel = () => true;

  const handleTextInputChange = (val: string) => {
    setTextInput(val);
    if (!showCodeInput && isCodeContent(val)) {
      const detected = detectLanguageFromCode(val);
      setCodeLang(detected);
      setCodeDetectedPrompt(true);
    } else if (codeDetectedPrompt && !isCodeContent(val)) {
      setCodeDetectedPrompt(false);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!textInput.trim() && !codeInput.trim()) return;

    let finalContent = textInput.trim();
    if (codeInput.trim()) {
      finalContent += `\n\`\`\`${codeLang}\n${codeInput.trim()}\n\`\`\``;
    }

    try {
      const newMsgBackend = await chatApi.sendMessage(Number(activeChannelId), finalContent);

      const newMsg: ChatMessage = {
        id: String(newMsgBackend.id),
        channelId: String(newMsgBackend.conversation_id),
        senderId: String(newMsgBackend.user_id),
        senderName: newMsgBackend.user.name,
        senderAvatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(newMsgBackend.user.name)}&background=0066FF&color=fff`,
        timestamp: new Date(newMsgBackend.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        createdAt: new Date(newMsgBackend.created_at).getTime(),
        contentFr: newMsgBackend.content,
        contentEn: newMsgBackend.content,
        codeSnippet: newMsgBackend.code_blocks && newMsgBackend.code_blocks.length > 0
          ? { code: newMsgBackend.code_blocks[0].code, language: newMsgBackend.code_blocks[0].language }
          : undefined,
      };

      setMessages((prev) => {
        if (prev.some(m => m.id === newMsg.id)) return prev;
        return [...prev, newMsg];
      });
      setTextInput('');
      setCodeInput('');
      setShowCodeInput(false);
      setCodeDetectedPrompt(false);
    } catch (err) {
      showToast("Erreur lors de l'envoi du message. Vérifiez votre connexion.");
      console.error(err);
    }
  };

  const handleCopyMessage = (msg: ChatMessage) => {
    const textToCopy = msg.codeSnippet
      ? `${displayLanguage === 'fr' ? msg.contentFr : msg.contentEn}\n\n\`\`\`${msg.codeSnippet.language}\n${msg.codeSnippet.code}\n\`\`\``
      : displayLanguage === 'fr' ? msg.contentFr : msg.contentEn;
    navigator.clipboard.writeText(textToCopy);
    showToast('Texte du message copié dans le presse-papier !');
  };

  const handleCreateGroup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGroupName.trim()) return;

    try {
      const newConv = await chatApi.createConversation(newGroupName.trim());
      const mapped: ChatChannel = {
        id: String(newConv.id),
        name: newConv.name,
        descriptionFr: 'Groupe privé',
        descriptionEn: 'Private group',
        category: 'group',
        unreadCount: 0,
        isGroup: true,
        creatorId: String(newConv.created_by || ''),
        members: [],
      };
      setChannels((prev) => [mapped, ...prev]);
      setActiveChannelId(mapped.id);
      setCreateGroupModalOpen(false);
      setNewGroupName('');
      setNewGroupDesc('');
      showToast(`Groupe « ${newConv.name} » créé avec succès !`);
    } catch (err) {
      showToast('Erreur lors de la création du groupe.');
      console.error(err);
    }
  };

  const filteredChannels = channels
    .filter((c) => {
      if (activeCategoryFilter === 'groups') return c.isGroup;
      if (activeCategoryFilter === 'channels') return !c.isGroup;
      return true;
    })
    .filter((c) => c.name.toLowerCase().includes(channelSearch.toLowerCase()));

  const currentWallpaper =
    PRESET_WALLPAPERS.find((w) => w.id === selectedWallpaperId) || PRESET_WALLPAPERS[0];

  const wallpaperStyle: React.CSSProperties = {
    ...(currentWallpaper.style || {}),
    ...(customImageUrl && selectedWallpaperId === 'custom'
      ? {
          backgroundImage: `linear-gradient(rgba(10, 16, 33, 0.85), rgba(10, 16, 33, 0.85)), url("${customImageUrl}")`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }
      : {}),
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-2 sm:px-4 lg:px-6 py-3 sm:py-4 relative">
      {toastMessage && (
        <div className="fixed top-20 right-4 z-50 px-4 py-2.5 rounded-2xl bg-slate-900/95 text-white text-xs font-bold shadow-xl border border-blue-500/30 flex items-center gap-2 backdrop-blur-xl animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      <div className="h-[calc(100dvh-8.5rem)] min-h-[520px] bg-white text-slate-900 border-blue-200/80 dark:bg-[#090D1A] dark:text-slate-100 dark:border-slate-800/80 border rounded-2xl sm:rounded-3xl overflow-hidden flex flex-col md:flex-row shadow-[0_15px_45px_-10px_rgba(0,102,255,0.1)]">

        {/* Colonne 1 : Liste des Canaux & Groupes */}
        <aside
          className={`${
            mobileChannelListOpen ? 'flex' : 'hidden'
          } md:flex flex-col w-full md:w-64 lg:w-72 border-r border-blue-100 dark:border-slate-800/80 bg-blue-50/50 dark:bg-[#070B16] shrink-0 z-20`}
        >
          <div className="p-3 border-b border-slate-200 dark:border-slate-800/80 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-[#0066FF] dark:text-cyan-400" aria-hidden="true" />
              <h2 className="text-xs font-bold text-[#0A1128] dark:text-slate-200 uppercase tracking-wider">
                {language === 'fr' ? 'Messagerie & Groupes' : 'Chats & Groups'}
              </h2>
            </div>
            <button
              type="button"
              onClick={() => setCreateGroupModalOpen(true)}
              title="Créer un nouveau groupe de discussion"
              className="flex items-center gap-1 px-2 py-1 rounded-xl bg-[#0066FF] hover:bg-blue-600 text-white text-[11px] font-bold shadow-xs cursor-pointer transition-all"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Groupe</span>
            </button>
          </div>

          <div className="px-2.5 pt-2 pb-1 flex items-center gap-1 shrink-0 border-b border-slate-200/60 dark:border-slate-800/60">
            <button
              type="button"
              onClick={() => setActiveCategoryFilter('all')}
              className={`px-2 py-1 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${
                activeCategoryFilter === 'all'
                  ? 'bg-blue-100 text-[#0066FF] dark:bg-blue-950 dark:text-cyan-400'
                  : 'text-slate-500 hover:text-slate-800 dark:text-slate-400'
              }`}
            >
              Tous ({channels.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveCategoryFilter('channels')}
              className={`px-2 py-1 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${
                activeCategoryFilter === 'channels'
                  ? 'bg-blue-100 text-[#0066FF] dark:bg-blue-950 dark:text-cyan-400'
                  : 'text-slate-500 hover:text-slate-800 dark:text-slate-400'
              }`}
            >
              Salons Tech
            </button>
            <button
              type="button"
              onClick={() => setActiveCategoryFilter('groups')}
              className={`px-2 py-1 rounded-lg text-[10px] font-bold transition-all cursor-pointer flex items-center gap-1 ${
                activeCategoryFilter === 'groups'
                  ? 'bg-blue-100 text-[#0066FF] dark:bg-blue-950 dark:text-cyan-400'
                  : 'text-slate-500 hover:text-slate-800 dark:text-slate-400'
              }`}
            >
              <Users className="w-3 h-3" />
              <span>Groupes ({channels.filter((c) => c.isGroup).length})</span>
            </button>
          </div>

          <div className="p-2.5 border-b border-slate-200 dark:border-slate-800/80 shrink-0">
            <div className="relative">
              <input
                type="text"
                placeholder={language === 'fr' ? 'Rechercher salon ou groupe...' : 'Search chat or group...'}
                value={channelSearch}
                onChange={(e) => setChannelSearch(e.target.value)}
                className="w-full h-8 pl-8 pr-3 rounded-xl text-xs bg-white text-slate-900 placeholder:text-slate-400 border border-slate-300 dark:bg-[#090D1A] dark:text-slate-200 dark:placeholder:text-slate-500 dark:border-slate-800 focus:outline-none focus:ring-1 focus:ring-[#0066FF]"
              />
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" aria-hidden="true" />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto no-scrollbar p-2 space-y-1">
            {loadingChannels ? (
              <div className="space-y-2 p-2">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="flex items-center gap-2">
                    <Skeleton width={20} height={20} />
                    <Skeleton width={120} height={16} />
                  </div>
                ))}
              </div>
            ) : filteredChannels.length === 0 ? (
              <p className="text-xs text-slate-500 p-3 italic">
                {language === 'fr' ? 'Aucune discussion trouvée.' : 'No discussions found.'}
              </p>
            ) : (
              filteredChannels.map((c) => {
                const isActive = c.id === activeChannelId;
                const desc = language === 'fr' ? c.descriptionFr : c.descriptionEn;
                return (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => {
                      setActiveChannelId(c.id);
                      setMobileChannelListOpen(false);
                    }}
                    className={`w-full text-left p-2.5 rounded-xl text-xs transition-all cursor-pointer flex items-start gap-2.5 ${
                      isActive
                        ? 'bg-blue-50 text-[#0066FF] border border-blue-200 font-bold dark:bg-slate-800/90 dark:text-cyan-400 dark:border-slate-700/60 shadow-sm'
                        : 'text-slate-700 hover:bg-slate-200/60 dark:text-slate-400 dark:hover:bg-slate-800/40 hover:text-slate-900 dark:hover:text-slate-200'
                    }`}
                  >
                    {c.isGroup ? (
                      <div className="relative shrink-0 mt-0.5">
                        <img
                          src={c.avatar || PRESET_GROUP_AVATARS[0]}
                          alt=""
                          referrerPolicy="no-referrer"
                          loading="lazy"
                          onError={(e) => {
                            (e.currentTarget as HTMLImageElement).src = PRESET_GROUP_AVATARS[0];
                          }}
                          className="w-5 h-5 rounded-lg object-cover ring-1 ring-slate-300 dark:ring-slate-700"
                        />
                        <span className="absolute -bottom-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-500 border border-white dark:border-slate-900" />
                      </div>
                    ) : (
                      <Hash className="w-4 h-4 shrink-0 mt-0.5 opacity-70 text-[#0066FF] dark:text-cyan-400" aria-hidden="true" />
                    )}
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-1">
                        <span className="text-xs font-semibold truncate text-[#0A1128] dark:text-slate-200 flex items-center gap-1">
                          <span className="truncate">{c.name}</span>
                          {c.isGroup && (
                            <span className="text-[9px] font-mono px-1 py-0.2 rounded bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400 shrink-0">
                              Grp
                            </span>
                          )}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate mt-0.5">
                        {desc}
                      </p>
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </aside>

        {/* Colonne 2 : Panneau de conversation principal */}
        <main
          className={`${
            mobileChannelListOpen ? 'hidden md:flex' : 'flex'
          } flex-1 flex-col h-full bg-white dark:bg-[#090D1A] min-w-0 relative`}
        >
          <div className="h-14 px-3 sm:px-4 border-b border-slate-200 dark:border-slate-800/80 flex items-center justify-between gap-2 shrink-0 bg-white/90 dark:bg-[#090D1A]/90 backdrop-blur-md z-10">
            <div className="flex items-center gap-2 min-w-0 flex-1">
              <button
                type="button"
                onClick={() => setMobileChannelListOpen(true)}
                aria-label="Ouvrir la liste des canaux"
                className="md:hidden p-1.5 -ml-1 text-slate-500 hover:text-slate-900 rounded-lg cursor-pointer shrink-0"
              >
                <ChevronLeft className="w-5 h-5" aria-hidden="true" />
              </button>

              <div className="flex items-center gap-2 min-w-0 flex-1">
                <Hash className="w-4 h-4 text-[#0066FF] dark:text-cyan-400 shrink-0 hidden sm:inline" aria-hidden="true" />
                <div className="min-w-0 flex-1">
                  <h1 className="text-sm font-bold text-[#0A1128] dark:text-slate-100 truncate">
                    {activeChannel ? `#${activeChannel.name}` : 'Discussion'}
                  </h1>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                    {activeChannel
                      ? language === 'fr'
                        ? activeChannel.descriptionFr
                        : activeChannel.descriptionEn
                      : ''}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1.5 shrink-0">
              <button
                type="button"
                onClick={() => setWallpaperModalOpen(true)}
                title="Personnaliser le thème et le fond d'écran de discussion"
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-bold border border-blue-200/80 dark:border-slate-700/80 bg-blue-50/90 hover:bg-blue-100 dark:bg-slate-800/90 dark:hover:bg-slate-700 text-[#0066FF] dark:text-cyan-400 transition-all cursor-pointer shadow-xs"
              >
                <Palette className="w-3.5 h-3.5 shrink-0" />
                <span className="hidden sm:inline">Thème</span>
              </button>

              <button
                type="button"
                onClick={() => setDisplayLanguage(displayLanguage === 'fr' ? 'en' : 'fr')}
                className="flex items-center gap-1 px-2 py-1 rounded-xl text-xs font-mono font-medium border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer text-slate-700 dark:text-slate-300"
                title="Bascule traduction instantanée des messages"
              >
                <Languages className="w-3.5 h-3.5 text-[#0066FF] dark:text-cyan-400 shrink-0" aria-hidden="true" />
                <span className="uppercase">{displayLanguage}</span>
              </button>
            </div>
          </div>

          <div
            className={`flex-1 overflow-y-auto no-scrollbar p-3 sm:p-5 space-y-4 max-w-full transition-all duration-300 ${currentWallpaper.bgClass}`}
            style={wallpaperStyle}
          >
            {loadingMessages ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-start gap-3">
                    <Skeleton variant="circular" width={36} height={36} />
                    <div className="flex-1 space-y-2">
                      <Skeleton width={120} height={14} />
                      <Skeleton width="80%" height={24} />
                    </div>
                  </div>
                ))}
              </div>
            ) : messages.length === 0 ? (
              <EmptyState
                icon={<MessageSquare className="w-6 h-6" />}
                title={language === 'fr' ? 'Aucun message dans cette discussion' : 'No messages in this chat'}
                description={
                  language === 'fr'
                    ? 'Soyez le premier à envoyer un message ou à partager du code.'
                    : 'Be the first to send a message or share code.'
                }
              />
            ) : (
              messages.map((m) => {
                const isMe = m.senderId === currentUser.id;
                const content = displayLanguage === 'fr' ? m.contentFr : m.contentEn;
                const formattedSender = formatNameWithUpperLastName(m.senderName);
                const isWallpaperDark = selectedWallpaperId !== 'default';

                return (
                  <div
                    key={m.id}
                    className={`group flex items-start gap-3 max-w-full ${isMe ? 'flex-row-reverse' : 'flex-row'}`}
                  >
                    <Avatar src={m.senderAvatar} name={formattedSender} size="sm" />
                    <div
                      className={`flex flex-col min-w-0 max-w-[88%] sm:max-w-[75%] ${
                        isMe ? 'items-end' : 'items-start'
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-1 text-xs">
                        <span
                          className={`font-bold truncate ${
                            isWallpaperDark
                              ? 'text-white font-extrabold drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]'
                              : 'text-slate-900 dark:text-slate-100'
                          }`}
                        >
                          {formattedSender}
                        </span>
                        <span
                          className={`text-[11px] tabular-nums font-mono ${
                            isWallpaperDark ? 'text-slate-200 font-semibold' : 'text-slate-500 dark:text-slate-400 opacity-90'
                          }`}
                        >
                          {m.timestamp}
                        </span>
                      </div>

                      <div className="relative group/bubble">
                        <div
                          className={`rounded-2xl p-3 sm:p-3.5 text-xs sm:text-sm leading-relaxed break-words max-w-full backdrop-blur-md shadow-sm transition-all ${
                            isMe
                              ? 'bg-[#0066FF] text-white shadow-blue-500/20'
                              : isWallpaperDark
                              ? 'bg-[#0E1528]/95 text-white border border-slate-700/80 shadow-lg'
                              : 'bg-white/95 text-slate-900 dark:bg-slate-900/95 dark:text-slate-100 border border-slate-200/80 dark:border-slate-800/80 shadow-black/5'
                          }`}
                        >
                          <p>{content}</p>
                          {m.codeSnippet && (
                            <div className="mt-2.5 max-w-full">
                              <CodeBlock
                                code={m.codeSnippet.code}
                                language={m.codeSnippet.language}
                                filename={m.codeSnippet.filename}
                              />
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center gap-1 mt-1">
                        <button
                          type="button"
                          onClick={() => handleCopyMessage(m)}
                          className="opacity-40 hover:opacity-100 p-1 rounded-full text-slate-400 hover:text-[#0066FF] dark:hover:text-cyan-400 transition-opacity cursor-pointer"
                          title="Copier le message"
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
            <div ref={messagesEndRef} />
          </div>

          <form
            onSubmit={handleSendMessage}
            className="p-3 sm:p-4 border-t border-slate-200 dark:border-slate-800/80 bg-slate-50/90 dark:bg-[#070B16]/95 backdrop-blur-md shrink-0 space-y-2.5"
          >
            {codeDetectedPrompt && !showCodeInput && (
              <div className="flex items-center justify-between p-2.5 rounded-2xl bg-gradient-to-r from-blue-500/10 via-indigo-500/10 to-blue-500/5 dark:bg-blue-950/60 border border-blue-400/30 text-xs animate-fadeIn">
                <div className="flex items-center gap-2 text-slate-800 dark:text-slate-200">
                  <Sparkles className="w-4 h-4 text-[#0066FF] dark:text-cyan-400 shrink-0" />
                  <span>Code <strong>{codeLang.toUpperCase()}</strong> détecté !</span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setCodeInput(textInput);
                    setTextInput('');
                    setShowCodeInput(true);
                    setCodeDetectedPrompt(false);
                  }}
                  className="px-3 py-1 rounded-xl bg-[#0066FF] hover:bg-blue-600 text-white font-bold text-[11px] flex items-center gap-1.5 shadow-sm transition-all cursor-pointer whitespace-nowrap shrink-0"
                >
                  <Code className="w-3.5 h-3.5" />
                  <span>Activer la coloration VS Code</span>
                </button>
              </div>
            )}

            {showCodeInput && (
              <div className="space-y-1.5 animate-fadeIn">
                <div className="flex items-center justify-between text-xs font-mono text-slate-500 dark:text-slate-400 px-1">
                  <span className="font-bold text-[#0066FF] dark:text-cyan-400 flex items-center gap-1.5">
                    <Code className="w-4 h-4 shrink-0" />
                    <span>
                      Éditeur VS Code
                      <span className="hidden sm:inline">
                        {' '}• {language === 'fr' ? 'Coloration en temps réel' : 'Live Syntax Highlight'}
                      </span>
                    </span>
                  </span>
                  <span className="hidden sm:inline text-[10px] text-slate-400">
                    HTML, CSS, TypeScript, Java, Go, Python, PHP, SQL...
                  </span>
                </div>
                <VSCodeEditor
                  value={codeInput}
                  onChange={setCodeInput}
                  language={codeLang}
                  onLanguageChange={setCodeLang}
                  placeholder="// Tapez ou collez votre code avec coloration VS Code en temps réel..."
                  minHeight="140px"
                />
              </div>
            )}

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setShowCodeInput(!showCodeInput)}
                aria-label={
                  showCodeInput
                    ? 'Masquer la boîte de code'
                    : 'Insérer un extrait de code technique'
                }
                title="Éditeur de code VS Code avec coloration en temps réel"
                className={`px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer border shrink-0 whitespace-nowrap ${
                  showCodeInput
                    ? 'bg-blue-100 text-[#0066FF] border-blue-300 dark:bg-cyan-950/60 dark:text-cyan-400 dark:border-cyan-800 shadow-sm'
                    : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-[#0066FF]'
                }`}
              >
                <Code className="w-4 h-4 text-[#0066FF] dark:text-cyan-400 shrink-0" aria-hidden="true" />
                <span className="hidden sm:inline font-mono font-bold">VS Code</span>
              </button>
              <input
                type="text"
                value={textInput}
                onChange={(e) => handleTextInputChange(e.target.value)}
                placeholder={
                  activeChannel
                    ? language === 'fr'
                      ? `Échanger sur ${activeChannel.name}...`
                      : `Message ${activeChannel.name}...`
                    : 'Écrivez votre message...'
                }
                className="flex-1 h-10 px-3.5 rounded-xl sm:rounded-2xl text-xs sm:text-sm bg-white text-slate-900 placeholder:text-slate-400 border border-slate-300 focus:border-[#0066FF] dark:bg-[#090D1A] dark:text-slate-100 dark:placeholder:text-slate-500 dark:border-slate-800 dark:focus:border-cyan-500 outline-none"
              />
              <Button
                type="submit"
                variant="primary"
                size="md"
                aria-label="Envoyer le message"
                className="!rounded-xl sm:!rounded-2xl shrink-0 whitespace-nowrap"
                iconRight={<Send className="w-4 h-4" />}
              >
                <span className="hidden sm:inline">
                  {language === 'fr' ? 'Envoyer' : 'Send'}
                </span>
              </Button>
            </div>
          </form>
        </main>
      </div>

      {/* MODALE 1 : Créer un groupe */}
      {createGroupModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/75 backdrop-blur-md animate-fadeIn"
          onClick={() => setCreateGroupModalOpen(false)}
        >
          <div
            className="relative w-full max-w-lg bg-white dark:bg-[#0B1021] rounded-3xl border border-slate-200 dark:border-slate-800 p-5 sm:p-6 shadow-[0_25px_70px_-15px_rgba(0,102,255,0.3)] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-[#0066FF] text-white flex items-center justify-center shadow-md shadow-blue-500/20">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                    Créer un groupe de discussion
                  </h3>
                </div>
              </div>
              <button
                onClick={() => setCreateGroupModalOpen(false)}
                className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateGroup} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Nom du groupe *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Squad CADEV 2026, Core Team React..."
                  value={newGroupName}
                  onChange={(e) => setNewGroupName(e.target.value)}
                  className="w-full h-10 px-3.5 rounded-xl text-xs bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 focus:outline-none focus:ring-1 focus:ring-[#0066FF]"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  size="md"
                  onClick={() => setCreateGroupModalOpen(false)}
                  className="!rounded-xl font-bold"
                >
                  Annuler
                </Button>
                <Button type="submit" variant="primary" size="md" className="!rounded-xl font-bold">
                  Créer le groupe
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODALE 3 : Thèmes et Fonds d'écran */}
      {wallpaperModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/75 backdrop-blur-md animate-fadeIn"
          onClick={() => setWallpaperModalOpen(false)}
        >
          <div
            className="relative w-full max-w-xl bg-white dark:bg-[#0B1021] rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-[0_25px_70px_-15px_rgba(0,102,255,0.3)] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-[#0066FF] text-white flex items-center justify-center shadow-md shadow-blue-500/20">
                  <Palette className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                    Fonds d'écran des Discussions
                  </h3>
                </div>
              </div>
              <button
                onClick={() => setWallpaperModalOpen(false)}
                className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-5 max-h-[50vh] overflow-y-auto no-scrollbar pr-1">
              {PRESET_WALLPAPERS.map((wp) => {
                const isSelected = selectedWallpaperId === wp.id;
                return (
                  <button
                    key={wp.id}
                    onClick={() => handleSelectWallpaper(wp.id)}
                    className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer relative overflow-hidden group ${
                      isSelected
                        ? 'border-[#0066FF] ring-2 ring-[#0066FF]/30 shadow-md'
                        : 'border-slate-200 dark:border-slate-800 hover:border-blue-300 dark:hover:border-slate-700'
                    }`}
                  >
                    <div
                      className={`h-16 rounded-xl mb-2.5 flex items-center justify-center border border-black/10 dark:border-white/10 ${wp.bgClass}`}
                      style={wp.style}
                    >
                      <div className="px-3 py-1 rounded-lg bg-black/80 text-white backdrop-blur-md text-[10px] font-mono font-extrabold shadow-sm border border-white/20">
                        Aperçu salon
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-extrabold text-xs text-slate-900 dark:text-white group-hover:text-[#0066FF] dark:group-hover:text-cyan-400 transition-colors">
                          {wp.name}
                        </div>
                      </div>
                      {isSelected && (
                        <div className="w-5 h-5 rounded-full bg-[#0066FF] text-white flex items-center justify-center shrink-0 shadow-xs">
                          <Check className="w-3 h-3" />
                        </div>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="flex justify-end">
              <Button
                variant="primary"
                size="md"
                onClick={() => setWallpaperModalOpen(false)}
                className="!rounded-2xl font-bold"
              >
                Terminer la personnalisation
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}