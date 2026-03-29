export type FeedbackCategory = 'Bug' | 'Feature Request' | 'Improvement' | 'Other';
export type FeedbackStatus = 'New' | 'In Review' | 'Resolved';
export type Sentiment = 'Positive' | 'Neutral' | 'Negative';

export interface Feedback {
  id: string;
  title: string;
  description: string;
  category: FeedbackCategory;
  status: FeedbackStatus;
  submitterName?: string;
  submitterEmail?: string;
  ai_category?: string;
  ai_sentiment: Sentiment;
  ai_priority: number;
  ai_summary: string;
  ai_tags: string[];
  ai_processed: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: {
    email: string;
    name: string;
  };
}

export interface FeedbackFilters {
  category?: FeedbackCategory;
  status?: FeedbackStatus;
  search?: string;
}

export interface DashboardStats {
  totalFeedback: number;
  openItems: number;
  averagePriority: number;
  mostCommonTag: string;
}
