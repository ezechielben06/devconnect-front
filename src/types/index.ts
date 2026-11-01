// Tous les contrats d'interfaces TypeScript du front-end.
// Je centralise tout ici pour garder une source de vérité unique et éviter les `any` sauvages.

export type Language = 'fr' | 'en';
export type Theme = 'dark' | 'light';
export type ActiveTab = 'feed' | 'matching' | 'projects' | 'qa' | 'chat' | 'profile';
export type MaritalStatus = 'Célibataire' | 'Marié(e)' | 'Divorcé(e)' | 'Autre';

export interface Developer {
  id: string;
  name: string;
  role: string;
  title: string;
  avatar: string;
  bioFr: string;
  bioEn: string;
  location: string;
  country: string;
  skills: string[];
  experienceYears: number;
  hourlyRate: number; // En FCFA/h
  availability: 'available' | 'busy' | 'open_to_offers';
  githubUrl?: string;
  portfolioUrl?: string;
  linkedinUrl?: string;
  facebookUrl?: string;
  whatsappUrl?: string;
  twitterUrl?: string;
  instagramUrl?: string;
  snapchatUrl?: string;
  tiktokUrl?: string;
  youtubeUrl?: string;
  telegramUrl?: string;
  rating: number;
  completedProjectsCount: number;
  reputation: number;
  verified: boolean;
  email?: string;
  phoneNumber?: string;
  isPhonePublic?: boolean;
  birthDate?: string;
  maritalStatus?: MaritalStatus;
  isBirthDatePublic?: boolean;
  isMaritalStatusPublic?: boolean;
  residenceCity?: string;
}

export interface CurrentUserProfile extends Developer {
  email: string;
}

export interface Project {
  id: string;
  titleFr: string;
  titleEn: string;
  descriptionFr: string;
  descriptionEn: string;
  category: 'frontend' | 'backend' | 'fullstack' | 'ai' | 'devops' | 'mobile';
  budgetMin: number; // En FCFA
  budgetMax: number; // En FCFA
  currency: string;  // Toujours 'FCFA'
  timeline: string;
  skillsRequired: string[];
  authorId: string;
  authorName: string;
  authorAvatar: string;
  status: 'open' | 'in_progress' | 'completed';
  applicantsCount: number;
  createdAt: string;
  difficulty: 'junior' | 'intermediate' | 'senior';
  featured?: boolean;
}

export interface Answer {
  id: string;
  questionId: string;
  authorId: string;
  authorName: string;
  authorAvatar: string;
  content: string;
  createdAt: string;
  votes: number;
  isAccepted: boolean;
}

export interface QAQuestion {
  id: string;
  title: string;
  description: string;
  tags: string[];
  authorId: string;
  authorName: string;
  authorAvatar: string;
  votes: number;
  views: number;
  answersCount: number;
  createdAt: string;
  isResolved: boolean;
  answers: Answer[];
}

export interface GroupMember {
  id: string;
  name: string;
  avatar: string;
  role: 'admin' | 'member';
  joinedAt: string;
  title?: string;
}

export type EphemeralDuration = 'off' | '15m' | '24h' | '7d';

export interface ChatChannel {
  id: string;
  name: string;
  descriptionFr: string;
  descriptionEn: string;
  category: 'general' | 'tech' | 'career' | 'group';
  unreadCount: number;
  isPrivate?: boolean;
  isGroup?: boolean;
  avatar?: string;
  creatorId?: string;
  createdByName?: string;
  members?: GroupMember[];
  onlyAdminCanPost?: boolean;
  onlyAdminCanEditInfo?: boolean;
  ephemeralDuration?: EphemeralDuration;
  themeId?: string;
}

export interface MessageReaction {
  emoji: string;
  count: number;
  users: string[]; // user IDs
}

export interface ChatMessage {
  id: string;
  channelId: string;
  senderId: string;
  senderName: string;
  senderAvatar: string;
  timestamp: string;
  createdAt: number; // millisecondes epoch pour vérification stricte des 15 minutes
  contentFr: string;
  contentEn: string;
  isEdited?: boolean;
  editedAt?: string;
  reactions?: MessageReaction[];
  expiresAt?: number; // millisecondes epoch si message éphémère
  codeSnippet?: {
    code: string;
    language: string;
    filename?: string;
  };
}

export type FeedReactionType = 'like' | 'love' | 'fire' | 'idea' | 'celebrate';

export interface FeedComment {
  id: string;
  authorId: string;
  authorName: string;
  authorAvatar: string;
  authorRole: string;
  timestamp: string;
  content: string;
  likes: number;
  isLiked?: boolean;
}

export interface FeedPost {
  id: string;
  authorId: string;
  authorName: string;
  authorRole: string;
  authorAvatar: string;
  authorCity: string;
  timestamp: string;
  content: string;
  tags: string[];
  audience: 'public' | 'community';
  reactions: {
    like: number;
    love: number;
    fire: number;
    idea: number;
    celebrate: number;
  };
  userReaction?: FeedReactionType;
  comments: FeedComment[];
  sharesCount: number;
  codeSnippet?: {
    code: string;
    language: string;
    filename?: string;
  };
  imageAttachment?: string;
  poll?: {
    question: string;
    options: { id: string; text: string; votes: number }[];
    totalVotes: number;
    userVotedOptionId?: string;
  };
  createdAt?: number;
  isEdited?: boolean;
  editedAt?: string;
  isPinned?: boolean;
  isBookmarked?: boolean;
}

export interface FeedStory {
  id: string;
  authorId: string;
  authorName: string;
  authorAvatar: string;
  timeAgo: string;
  seen: boolean;
  snippet: string;
  mediaUrl?: string;
  gradient?: string;
}

export interface TechEvent {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  organizer: string;
  attendeesCount: number;
  isAttending?: boolean;
  category: string;
}
