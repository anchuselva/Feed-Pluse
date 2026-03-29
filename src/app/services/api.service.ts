import { Feedback, FeedbackCategory, FeedbackStatus, LoginCredentials, AuthResponse, FeedbackFilters } from '../types';

const STORAGE_KEYS = {
  AUTH_TOKEN: 'feedpulse_auth_token',
  USER: 'feedpulse_user',
};

const API_BASE = import.meta.env.VITE_API_BASE_URL || '';

function getAuthHeaders() {
  const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
  return token ? { Authorization: `Bearer ${token}` } : {};
}

function buildUrl(path: string, params?: Record<string, string | undefined>) {
  const url = new URL(`${API_BASE}${path}`, window.location.origin);

  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== '') {
        url.searchParams.set(key, value);
      }
    });
  }

  return url.toString();
}

async function handleResponse(response: Response) {
  const payload = await response.json().catch(() => null);

  if (!response.ok) {
    const message = payload?.message || response.statusText || 'Request failed';
    throw new Error(message);
  }

  return payload;
}

function normalizeFeedback(feedback: any): Feedback {
  return {
    ...feedback,
    id: feedback._id || feedback.id,
    createdAt: new Date(feedback.createdAt),
    updatedAt: new Date(feedback.updatedAt),
  };
}

export const apiService = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const response = await fetch(buildUrl('/api/auth/login'), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });

    const payload = await handleResponse(response);
    const { token, user } = payload.data;

    localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, token);
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));

    return { token, user };
  },

  logout: () => {
    localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.USER);
  },

  isAuthenticated: (): boolean => {
    return !!localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
  },

  getUser: () => {
    const userData = localStorage.getItem(STORAGE_KEYS.USER);
    return userData ? JSON.parse(userData) : null;
  },

  createFeedback: async (feedbackData: {
    title: string;
    description: string;
    category: FeedbackCategory;
    submitterName?: string;
    submitterEmail?: string;
  }): Promise<Feedback> => {
    const response = await fetch(buildUrl('/api/feedback'), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(feedbackData),
    });

    const payload = await handleResponse(response);
    return normalizeFeedback(payload.data);
  },

  getFeedback: async (filters?: FeedbackFilters): Promise<Feedback[]> => {
    const response = await fetch(buildUrl('/api/feedback', {
      category: filters?.category,
      status: filters?.status,
      search: filters?.search,
    }), {
      headers: {
        ...getAuthHeaders(),
      },
    });

    const payload = await handleResponse(response);
    return payload.data.map((item: any) => normalizeFeedback(item));
  },

  getFeedbackById: async (id: string): Promise<Feedback | null> => {
    const response = await fetch(buildUrl(`/api/feedback/${id}`), {
      headers: {
        ...getAuthHeaders(),
      },
    });

    const payload = await handleResponse(response);
    return normalizeFeedback(payload.data);
  },

  updateFeedbackStatus: async (id: string, status: FeedbackStatus): Promise<Feedback> => {
    const response = await fetch(buildUrl(`/api/feedback/${id}/status`), {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders(),
      },
      body: JSON.stringify({ status }),
    });

    const payload = await handleResponse(response);
    return normalizeFeedback(payload.data);
  },
};
