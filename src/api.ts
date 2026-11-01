// Mon client Axios configuré aux petits oignons pour Sanctum.
// Note pour l'équipe : withCredentials est obligatoire sinon les cookies de session et le XSRF-TOKEN
// se font tej par le navigateur à cause du cross-origin en dev.
import axios, { AxiosError } from 'axios';

// URL de l'API avec fallback local sur le port 8000 de Laragon/Artisan
export const API_BASE_URL = '';

export const api = axios.create({
  baseURL: `${API_BASE_URL}/api/v1`,
  withCredentials: true, // Si t'enlèves ça, Sanctum renvoie 401 en boucle
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Petit helper pour choper le cookie XSRF-TOKEN posé par Laravel
export function getCookie(name: string): string | null {
  if (typeof document === 'undefined') return null;
  const match = document.cookie.match(new RegExp('(^|;\\s*)(' + name + ')=([^;]*)'));
  return match ? match[3] : null;
}

// J'injecte le token CSRF dans les headers avant chaque requête mutante
api.interceptors.request.use((config) => {
  const token = getCookie('XSRF-TOKEN');
  if (token && config.headers) {
    config.headers['X-XSRF-TOKEN'] = decodeURIComponent(token);
  }
  return config;
});

// Initialisation de la protection CSRF de Sanctum
export async function fetchCsrfCookie() {
  try {
    return await axios.get(`${API_BASE_URL}/sanctum/csrf-cookie`, {
      withCredentials: true,
    });
  } catch (error) {
    console.warn('[Sanctum] Backend inaccessible ou cookie bloqué :', error);
    throw error;
  }
}

// Types calqués sur les models Eloquent de Vertueux
export interface BackendUser {
  id: number;
  name: string;
  username: string;
  email?: string;
  bio: string | null;
  language: 'fr' | 'en';
  country: string | null;
  skills: string[];
  avatar_url: string | null;
  created_at: string;
}

export interface RegisterPayload {
  name: string;
  username: string;
  email: string;
  password: string;
  password_confirmation: string;
  language: 'fr' | 'en';
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface BackendConversation {
  id: number;
  type: 'general' | 'group';
  name: string;
  created_by: number | null;
  members_count: number;
  last_message_at: string | null;
  created_at: string;
}

export interface CodeBlock {
  language: string;
  code: string;
}

export interface BackendMessage {
  id: number;
  conversation_id: number;
  user_id: number;
  user: {
    id: number;
    username: string;
    name: string;
  };
  content: string;
  code_blocks: CodeBlock[];
  original_language: string;
  created_at: string;
}

export interface PaginatedMessagesResponse {
  data: BackendMessage[];
  meta: {
    has_more: boolean;
    oldest_id: number | null;
  };
}

// Auth Sanctum : sessions cookies pures (pas de JWT à stocker dans le local storage)
export const authApi = {
  // Check silencieux au boot. Si 401, on reste en mode anonyme sans faire paniquer React
  async getMe(): Promise<BackendUser | null> {
    try {
      const response = await api.get<BackendUser>('/me');
      return response.data;
    } catch (error) {
      const err = error as AxiosError;
      if (err.response?.status === 401) {
        return null;
      }
      throw error;
    }
  },

  // On initialise d'abord le cookie CSRF sinon Laravel va nous rejeter avec un 419 Page Expired
  async register(payload: RegisterPayload): Promise<BackendUser> {
    await fetchCsrfCookie();
    const response = await api.post<BackendUser>('/register', payload);
    return response.data;
  },

  // Login classique - attention au throttle de Vertueux (5 tentatives / min max sinon 429)
  async login(payload: LoginPayload): Promise<BackendUser> {
    await fetchCsrfCookie();
    const response = await api.post<BackendUser>('/login', payload);
    return response.data;
  },

  // Kill de la session côté Laravel
  async logout(): Promise<void> {
    try {
      await api.post('/logout');
    } catch (error) {
      console.warn('[AuthApi] Déconnexion backend ignorée (session déjà clean) :', error);
    }
  },
};

// Endpoints du Chat branchés sur Laravel + Reverb
export const chatApi = {
  // Récupère les rooms de l'utilisateur (canaux généraux + sous-groupes privés)
  async getConversations(page = 1, perPage = 20) {
    const response = await api.get<{
      data: BackendConversation[];
      meta: { current_page: number; last_page: number; per_page: number; total: number };
    }>('/conversations', {
      params: { page, per_page: perPage },
    });
    return response.data;
  },

  // Création d'une room privée
  async createConversation(name: string): Promise<BackendConversation> {
    const response = await api.post<BackendConversation>('/conversations', { name });
    return response.data;
  },

  // Détails d'une room (membres, dernier message, etc.)
  async getConversation(id: number): Promise<BackendConversation> {
    const response = await api.get<BackendConversation>(`/conversations/${id}`);
    return response.data;
  },

  // Pagination par curseur avec ?before=<id> pour le scroll infini vers le haut
  async getMessages(conversationId: number, before?: number, perPage = 30): Promise<PaginatedMessagesResponse> {
    const params: Record<string, number | undefined> = { per_page: perPage };
    if (before) params.before = before;

    const response = await api.get<PaginatedMessagesResponse>(`/conversations/${conversationId}/messages`, {
      params,
    });
    return response.data;
  },

  // Le backend extrait lui-même les blocs de code en regex, c'est top pour le parsing
  async sendMessage(conversationId: number, content: string): Promise<BackendMessage> {
    const response = await api.post<BackendMessage>(`/conversations/${conversationId}/messages`, {
      content,
    });
    return response.data;
  },
};

export default api;
