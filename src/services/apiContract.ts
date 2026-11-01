import {
  CURRENT_USER,
  MOCK_DEVELOPERS,
  MOCK_PROJECTS,
  MOCK_QUESTIONS,
  MOCK_CHANNELS,
  MOCK_MESSAGES,
  MOCK_FEED_POSTS,
} from './mockData';
import {
  CurrentUserProfile,
  Developer,
  Project,
  QAQuestion,
  ChatChannel,
  ChatMessage,
  Answer,
  GroupMember,
  FeedPost,
} from '../types';

export const apiService = {
  async getCurrentUser(): Promise<CurrentUserProfile> {
    return Promise.resolve({ ...CURRENT_USER });
  },

  async getFeedPosts(): Promise<FeedPost[]> {
    return Promise.resolve([...MOCK_FEED_POSTS]);
  },

  async getDevelopers(): Promise<Developer[]> {
    return Promise.resolve([...MOCK_DEVELOPERS]);
  },

  async getProjects(): Promise<Project[]> {
    return Promise.resolve([...MOCK_PROJECTS]);
  },

  async getQuestions(): Promise<QAQuestion[]> {
    return Promise.resolve([...MOCK_QUESTIONS]);
  },

  async getChannels(): Promise<ChatChannel[]> {
    return Promise.resolve([...MOCK_CHANNELS]);
  },

  async getMessages(channelId: string): Promise<ChatMessage[]> {
    return Promise.resolve(MOCK_MESSAGES[channelId] ? [...MOCK_MESSAGES[channelId]] : []);
  },

  async addProject(project: Omit<Project, 'id' | 'createdAt' | 'applicantsCount'>): Promise<Project> {
    const newProject: Project = {
      ...project,
      id: `proj-${Date.now()}`,
      createdAt: "À l'instant",
      applicantsCount: 0,
    };
    MOCK_PROJECTS.unshift(newProject);
    return Promise.resolve(newProject);
  },

  async addQuestion(question: Omit<QAQuestion, 'id' | 'createdAt' | 'votes' | 'views' | 'answersCount' | 'answers' | 'isResolved'>): Promise<QAQuestion> {
    const newQuestion: QAQuestion = {
      ...question,
      id: `qa-${Date.now()}`,
      votes: 1,
      views: 1,
      answersCount: 0,
      answers: [],
      createdAt: "À l'instant",
      isResolved: false,
    };
    MOCK_QUESTIONS.unshift(newQuestion);
    return Promise.resolve(newQuestion);
  },

  async addAnswer(questionId: string, answer: Omit<Answer, 'id' | 'createdAt' | 'votes' | 'isAccepted'>): Promise<Answer> {
    const targetQ = MOCK_QUESTIONS.find((q) => q.id === questionId);
    const newAnswer: Answer = {
      ...answer,
      id: `ans-${Date.now()}`,
      votes: 0,
      isAccepted: false,
      createdAt: "À l'instant",
    };
    if (targetQ) {
      targetQ.answers.push(newAnswer);
      targetQ.answersCount = targetQ.answers.length;
    }
    return Promise.resolve(newAnswer);
  },

  async sendMessage(message: Omit<ChatMessage, 'id' | 'timestamp' | 'createdAt'> & { createdAt?: number }): Promise<ChatMessage> {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const newMsg: ChatMessage = {
      ...message,
      id: `msg-${Date.now()}`,
      timestamp: `${hours}:${minutes}`,
      createdAt: message.createdAt || Date.now(),
      reactions: message.reactions || [],
    };
    if (!MOCK_MESSAGES[message.channelId]) {
      MOCK_MESSAGES[message.channelId] = [];
    }
    MOCK_MESSAGES[message.channelId].push(newMsg);
    return Promise.resolve(newMsg);
  },

  async updateMessage(channelId: string, messageId: string, newContent: string): Promise<ChatMessage | null> {
    const list = MOCK_MESSAGES[channelId];
    if (!list) return null;
    const msg = list.find((m) => m.id === messageId);
    if (!msg) return null;
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    msg.contentFr = newContent;
    msg.contentEn = newContent;
    msg.isEdited = true;
    msg.editedAt = `${hours}:${minutes}`;
    return Promise.resolve({ ...msg });
  },

  async deleteMessage(channelId: string, messageId: string): Promise<boolean> {
    const list = MOCK_MESSAGES[channelId];
    if (!list) return false;
    const idx = list.findIndex((m) => m.id === messageId);
    if (idx !== -1) {
      list.splice(idx, 1);
      return Promise.resolve(true);
    }
    return Promise.resolve(false);
  },

  async toggleReaction(channelId: string, messageId: string, emoji: string, userId: string): Promise<ChatMessage | null> {
    const list = MOCK_MESSAGES[channelId];
    if (!list) return null;
    const msg = list.find((m) => m.id === messageId);
    if (!msg) return null;
    if (!msg.reactions) msg.reactions = [];

    // Règle stricte : Une personne ne peut mettre qu'une et une seule réaction sur un message
    const alreadyHadThisEmoji = msg.reactions.find((r) => r.emoji === emoji && r.users.includes(userId));

    // Retirer l'utilisateur de TOUTES les réactions existantes sur ce message
    msg.reactions.forEach((r) => {
      r.users = r.users.filter((u) => u !== userId);
      r.count = r.users.length;
    });

    // Si l'utilisateur n'avait pas déjà cet émoticône exact, on lui applique ce nouvel émoji
    // (s'il l'avait déjà, l'action est un toggle off / désactivation)
    if (!alreadyHadThisEmoji) {
      const targetReaction = msg.reactions.find((r) => r.emoji === emoji);
      if (targetReaction) {
        targetReaction.users.push(userId);
        targetReaction.count = targetReaction.users.length;
      } else {
        msg.reactions.push({
          emoji,
          count: 1,
          users: [userId],
        });
      }
    }

    // Nettoyer les réactions sans aucun utilisateur
    msg.reactions = msg.reactions.filter((r) => r.count > 0);
    return Promise.resolve({ ...msg });
  },

  async createGroup(group: Partial<ChatChannel>): Promise<ChatChannel> {
    const newGroup: ChatChannel = {
      id: `group-${Date.now()}`,
      name: group.name || 'Nouveau Groupe',
      descriptionFr: group.descriptionFr || 'Discussion de groupe privée',
      descriptionEn: group.descriptionEn || 'Private group discussion',
      category: 'group',
      isGroup: true,
      isPrivate: group.isPrivate ?? true,
      avatar: group.avatar || 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=150&auto=format&fit=crop&q=80',
      unreadCount: 0,
      creatorId: group.creatorId,
      createdByName: group.createdByName,
      members: group.members || [],
      onlyAdminCanPost: group.onlyAdminCanPost ?? false,
      onlyAdminCanEditInfo: group.onlyAdminCanEditInfo ?? true,
      ephemeralDuration: group.ephemeralDuration ?? 'off',
      themeId: group.themeId ?? 'default',
    };
    MOCK_CHANNELS.unshift(newGroup);
    MOCK_MESSAGES[newGroup.id] = [];
    return Promise.resolve(newGroup);
  },

  async updateGroup(groupId: string, data: Partial<ChatChannel>): Promise<ChatChannel | null> {
    const group = MOCK_CHANNELS.find((c) => c.id === groupId);
    if (!group) return null;
    Object.assign(group, data);
    return Promise.resolve({ ...group });
  },

  async addGroupMember(groupId: string, member: GroupMember): Promise<ChatChannel | null> {
    const group = MOCK_CHANNELS.find((c) => c.id === groupId);
    if (!group) return null;
    if (!group.members) group.members = [];
    if (!group.members.some((m) => m.id === member.id)) {
      group.members.push(member);
    }
    return Promise.resolve({ ...group });
  },

  async removeGroupMember(groupId: string, memberId: string): Promise<ChatChannel | null> {
    const group = MOCK_CHANNELS.find((c) => c.id === groupId);
    if (!group || !group.members) return null;
    group.members = group.members.filter((m) => m.id !== memberId);
    return Promise.resolve({ ...group });
  },
};
