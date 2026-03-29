import { config } from '../config.js';

const categoryKeywords = {
  Bug: ['bug', 'error', 'crash', 'broken', 'issue', 'problem', 'not working', 'failed'],
  'Feature Request': ['feature', 'add', 'new', 'want', 'wish', 'could', 'should have', 'enhancement'],
  Improvement: ['improve', 'better', 'enhance', 'optimize', 'update', 'upgrade', 'refine'],
};

const positiveWords = ['great', 'awesome', 'love', 'excellent', 'amazing', 'wonderful', 'perfect', 'good', 'nice', 'helpful'];
const negativeWords = ['terrible', 'awful', 'hate', 'horrible', 'bad', 'worst', 'poor', 'frustrating', 'annoying', 'useless', 'broken', 'crash'];

function extractTags(text) {
  const lower = text.toLowerCase();
  const tags = new Set();

  const technicalTerms = ['ui', 'ux', 'api', 'database', 'performance', 'security', 'login', 'authentication', 'mobile', 'desktop', 'dashboard', 'navigation', 'search', 'filter', 'export', 'import', 'theme', 'accessibility'];
  technicalTerms.forEach((term) => {
    if (lower.includes(term)) {
      tags.add(term);
    }
  });

  if (lower.includes('slow') || lower.includes('loading')) {
    tags.add('performance');
  }
  if (lower.includes('confus') || lower.includes('unclear')) {
    tags.add('usability');
  }
  if (lower.includes('design') || lower.includes('layout')) {
    tags.add('design');
  }
  if (lower.includes('crash') || lower.includes('bug') || lower.includes('error')) {
    tags.add('bug');
  }

  return Array.from(tags).slice(0, 6);
}

function calculateSentiment(text) {
  const lower = text.toLowerCase();
  let score = 0;

  positiveWords.forEach((word) => {
    if (lower.includes(word)) score += 1;
  });

  negativeWords.forEach((word) => {
    if (lower.includes(word)) score -= 1;
  });

  if (score > 0) return 'Positive';
  if (score < 0) return 'Negative';
  return 'Neutral';
}

function detectCategory(text) {
  const lower = text.toLowerCase();

  for (const [category, keywords] of Object.entries(categoryKeywords)) {
    if (keywords.some((keyword) => lower.includes(keyword))) {
      return category;
    }
  }

  return 'Other';
}

function calculatePriority(sentiment, category, text) {
  let priority = 5;

  if (sentiment === 'Negative') priority += 2;
  if (sentiment === 'Positive') priority += 1;
  if (category === 'Bug') priority += 3;
  if (category === 'Feature Request') priority += 1;

  const urgencyKeywords = ['urgent', 'critical', 'asap', 'immediately', 'broken', 'crash'];
  const lower = text.toLowerCase();
  urgencyKeywords.forEach((keyword) => {
    if (lower.includes(keyword)) priority += 1;
  });

  return Math.min(10, Math.max(1, priority));
}

function generateSummary(text) {
  const sentences = text.split(/[.!?]+/).map((s) => s.trim()).filter(Boolean);
  if (sentences.length === 0) {
    return text.slice(0, 150).trim();
  }

  const summary = sentences.slice(0, 2).join('. ');
  return summary.length > 150 ? `${summary.slice(0, 147)}...` : summary;
}

function parseJsonObject(text) {
  const start = text.indexOf('{');
  const end = text.lastIndexOf('}');

  if (start === -1 || end === -1 || end <= start) {
    return null;
  }

  const json = text.slice(start, end + 1);

  try {
    return JSON.parse(json);
  } catch {
    return null;
  }
}

function normalizeAnalysis(raw) {
  const category = ['Bug', 'Feature Request', 'Improvement', 'Other'].includes(raw.category) ? raw.category : 'Other';
  const sentiment = ['Positive', 'Neutral', 'Negative'].includes(raw.sentiment) ? raw.sentiment : 'Neutral';
  const priority = Number.isInteger(raw.priority_score) ? Math.min(10, Math.max(1, raw.priority_score)) : 5;
  const summary = typeof raw.summary === 'string' ? raw.summary.trim() : '';
  const tags = Array.isArray(raw.tags) ? raw.tags.filter((item) => typeof item === 'string').map((tag) => tag.trim().toLowerCase()).slice(0, 8) : [];

  return {
    category,
    sentiment,
    priority_score: priority,
    summary: summary || '',
    tags: tags.length > 0 ? tags : ['feedback'],
  };
}

function fallbackAnalysis(title, description) {
  const combined = `${title} ${description}`;
  const sentiment = calculateSentiment(combined);
  const category = detectCategory(combined);
  const tags = extractTags(combined);
  const priority_score = calculatePriority(sentiment, category, combined);
  const summary = generateSummary(description);

  return {
    category,
    sentiment,
    priority_score,
    summary,
    tags: tags.length > 0 ? tags : ['feedback'],
    ai_processed: false,
  };
}

export async function analyzeWithGemini(title, description) {
  if (!config.geminiApiKey) {
    return fallbackAnalysis(title, description);
  }

  const prompt = `Analyze the following product feedback and return only valid JSON with these fields: category, sentiment, priority_score, summary, tags.\n- category must be one of [Bug, Feature Request, Improvement, Other].\n- sentiment must be one of [Positive, Neutral, Negative].\n- priority_score must be an integer from 1 to 10.\n- summary must be one or two concise sentences.\n- tags must be an array of short lowercase words.\nFeedback:\nTitle: ${title}\nDescription: ${description}`;

  const url = `https://generativelanguage.googleapis.com/v1/models/${config.geminiModel}:generateText?key=${config.geminiApiKey}`;

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt: { text: prompt },
        temperature: 0.2,
        maxOutputTokens: 300,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Gemini API error: ${errorText}`);
    }

    const payload = await response.json();
    const output = payload?.candidates?.[0]?.output || payload?.content?.[0]?.text || '';
    const parsed = parseJsonObject(output);

    if (!parsed) {
      throw new Error('Gemini returned invalid JSON');
    }

    return { ...normalizeAnalysis(parsed), ai_processed: true };
  } catch (error) {
    console.warn('Gemini analysis failed:', error?.message || error);
    return fallbackAnalysis(title, description);
  }
}
