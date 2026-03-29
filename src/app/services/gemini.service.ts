import { Sentiment, FeedbackCategory } from '../types';

// Mock Gemini AI Service
// In production, this would call the Google Gemini API
// API Key would be stored in environment variables

interface GeminiAnalysisResult {
  category: string;
  sentiment: Sentiment;
  priority_score: number;
  summary: string;
  tags: string[];
}

const categoryKeywords: Record<string, string[]> = {
  'Bug': ['bug', 'error', 'crash', 'broken', 'issue', 'problem', 'not working', 'failed'],
  'Feature Request': ['feature', 'add', 'new', 'want', 'wish', 'could', 'should have', 'enhancement'],
  'Improvement': ['improve', 'better', 'enhance', 'optimize', 'update', 'upgrade', 'refine'],
  'Other': []
};

const positiveWords = ['great', 'awesome', 'love', 'excellent', 'amazing', 'wonderful', 'perfect', 'good', 'nice', 'helpful'];
const negativeWords = ['terrible', 'awful', 'hate', 'horrible', 'bad', 'worst', 'poor', 'frustrating', 'annoying', 'useless'];

function extractTags(text: string): string[] {
  const words = text.toLowerCase().split(/\s+/);
  const tags: Set<string> = new Set();

  // Technical tags
  const technicalTerms = ['ui', 'ux', 'api', 'database', 'performance', 'security', 'login', 'authentication', 'mobile', 'desktop', 'dashboard', 'navigation', 'search', 'filter', 'export', 'import'];
  technicalTerms.forEach(term => {
    if (text.toLowerCase().includes(term)) {
      tags.add(term);
    }
  });

  // Common feedback tags
  if (text.toLowerCase().includes('slow') || text.toLowerCase().includes('loading')) {
    tags.add('performance');
  }
  if (text.toLowerCase().includes('confus') || text.toLowerCase().includes('unclear')) {
    tags.add('usability');
  }
  if (text.toLowerCase().includes('design') || text.toLowerCase().includes('layout')) {
    tags.add('design');
  }

  return Array.from(tags).slice(0, 5);
}

function calculateSentiment(text: string): Sentiment {
  const lowerText = text.toLowerCase();
  let score = 0;

  positiveWords.forEach(word => {
    if (lowerText.includes(word)) score += 1;
  });

  negativeWords.forEach(word => {
    if (lowerText.includes(word)) score -= 1;
  });

  if (score > 0) return 'Positive';
  if (score < 0) return 'Negative';
  return 'Neutral';
}

function detectCategory(title: string, description: string): string {
  const text = `${title} ${description}`.toLowerCase();

  for (const [category, keywords] of Object.entries(categoryKeywords)) {
    if (category === 'Other') continue;
    for (const keyword of keywords) {
      if (text.includes(keyword)) {
        return category;
      }
    }
  }

  return 'Other';
}

function calculatePriority(sentiment: Sentiment, category: string, text: string): number {
  let priority = 5; // Base priority

  // Adjust based on sentiment
  if (sentiment === 'Negative') priority += 2;
  if (sentiment === 'Positive') priority += 1;

  // Adjust based on category
  if (category === 'Bug') priority += 3;
  if (category === 'Feature Request') priority += 1;

  // Adjust based on urgency keywords
  const urgencyKeywords = ['urgent', 'critical', 'asap', 'immediately', 'broken', 'crash'];
  const lowerText = text.toLowerCase();
  urgencyKeywords.forEach(keyword => {
    if (lowerText.includes(keyword)) priority += 1;
  });

  return Math.min(10, Math.max(1, priority));
}

function generateSummary(description: string): string {
  const sentences = description.split(/[.!?]+/).filter(s => s.trim().length > 0);
  if (sentences.length === 0) return description.substring(0, 100) + '...';

  // Take first two sentences or first 150 characters
  const summary = sentences.slice(0, 2).join('. ');
  if (summary.length > 150) {
    return summary.substring(0, 150) + '...';
  }
  return summary + '.';
}

export async function analyzeWithGemini(
  title: string,
  description: string
): Promise<GeminiAnalysisResult> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1500));

  // Mock AI analysis
  // In production, this would be:
  // const response = await fetch('https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent', {
  //   method: 'POST',
  //   headers: {
  //     'Content-Type': 'application/json',
  //     'x-goog-api-key': process.env.GEMINI_API_KEY
  //   },
  //   body: JSON.stringify({
  //     contents: [{
  //       parts: [{
  //         text: `Analyze this feedback and return JSON with category, sentiment, priority_score (1-10), summary, and tags: Title: ${title}, Description: ${description}`
  //       }]
  //     }]
  //   })
  // });

  const combinedText = `${title} ${description}`;
  const sentiment = calculateSentiment(combinedText);
  const category = detectCategory(title, description);
  const tags = extractTags(combinedText);
  const priority_score = calculatePriority(sentiment, category, combinedText);
  const summary = generateSummary(description);

  return {
    category,
    sentiment,
    priority_score,
    summary,
    tags: tags.length > 0 ? tags : ['feedback']
  };
}
