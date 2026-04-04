import AsyncStorage from '@react-native-async-storage/async-storage';
import { DailyArticle, DAILY_ARTICLES } from '../store/appStore';

// ─── Config ───────────────────────────────────────────────────────────────────
// Put your Anthropic API key here for local/demo use.
// For production, proxy this through a backend so the key isn't in the client.
const ANTHROPIC_API_KEY = 'YOUR_API_KEY_HERE';

const CACHE_PREFIX = 'soundr_article_';

function getTodayKey() {
  return new Date().toISOString().slice(0, 10);
}

// Topics rotate so each day covers a different angle
const TOPIC_ROTATION = [
  'noise-induced hearing loss in young people and earbud use',
  'earwax biology, function, and safe cleaning practices',
  'bacterial contamination of personal audio devices and ear infections',
  'tinnitus — causes, prevalence, and current research',
  'the vestibular system and how ear health affects balance',
  'acoustic physics of earbud sound quality and mesh hygiene',
  'sleep and hearing — nocturnal auditory processing and ear health during rest',
];

// ─── Prompt ───────────────────────────────────────────────────────────────────

function buildPrompt(topic: string): string {
  return `You are a science journalist writing for a publication like The Guardian or The Atlantic. 
Search the web for a recent study, research paper, or credible finding related to: "${topic}".

Based on what you find, write a well-structured, engaging health article AND a short quiz to test comprehension.

Return ONLY a valid JSON object with this exact structure (no markdown, no backticks, no preamble):

{
  "id": 99,
  "tag": "RESEARCH",
  "readTime": "3 min read",
  "title": "Article title here",
  "subtitle": "One sentence that hooks the reader and summarises the finding",
  "body": [
    "First paragraph...",
    "Second paragraph...",
    "Third paragraph...",
    "Fourth paragraph...",
    "Fifth paragraph..."
  ],
  "source": "Journal Name, Year · Institution or Author if known",
  "quiz": [
    {
      "question": "Question text?",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correctIndex": 0,
      "explanation": "Why this answer is correct, in one or two sentences."
    },
    {
      "question": "Second question?",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correctIndex": 2,
      "explanation": "Explanation."
    },
    {
      "question": "Third question?",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correctIndex": 1,
      "explanation": "Explanation."
    },
    {
      "question": "Fourth question?",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correctIndex": 3,
      "explanation": "Explanation."
    }
  ]
}

Rules:
- tag must be one of: "RESEARCH", "STUDY", "FUN FACT"
- body must have 4–6 paragraphs, each 2–4 sentences, written in an engaging journalistic style
- quiz must have exactly 4 questions
- correctIndex is 0-based (0 = first option)
- Each question must be answerable from the article body
- Do not include markdown, code fences, or any text outside the JSON object`;
}

// ─── API call ─────────────────────────────────────────────────────────────────

async function fetchArticleFromAPI(topic: string): Promise<DailyArticle> {
  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': ANTHROPIC_API_KEY,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 2000,
      tools: [
        {
          type: 'web_search_20250305',
          name: 'web_search',
        },
      ],
      messages: [
        {
          role: 'user',
          content: buildPrompt(topic),
        },
      ],
    }),
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`API error ${response.status}: ${err}`);
  }

  const data = await response.json();

  // Extract text from content blocks (may include tool_use blocks from web search)
  const textBlocks = (data.content as any[])
    .filter((block: any) => block.type === 'text')
    .map((block: any) => block.text as string)
    .join('');

  if (!textBlocks) {
    throw new Error('No text content in API response');
  }

  // Strip any accidental markdown fences
  const cleaned = textBlocks
    .replace(/```json\s*/gi, '')
    .replace(/```\s*/gi, '')
    .trim();

  // Find the JSON object
  const jsonStart = cleaned.indexOf('{');
  const jsonEnd = cleaned.lastIndexOf('}');
  if (jsonStart === -1 || jsonEnd === -1) {
    throw new Error('Could not locate JSON in response');
  }

  const parsed = JSON.parse(cleaned.slice(jsonStart, jsonEnd + 1)) as DailyArticle;

  // Basic validation
  if (
    !parsed.title ||
    !Array.isArray(parsed.body) ||
    !Array.isArray(parsed.quiz) ||
    parsed.quiz.length === 0
  ) {
    throw new Error('Parsed article missing required fields');
  }

  return parsed;
}

// ─── Public API ───────────────────────────────────────────────────────────────

/**
 * Returns today's article — generated fresh via API on first call,
 * then served from AsyncStorage cache for the rest of the day.
 * Falls back to a hardcoded article if the API call fails.
 */
export async function getDailyArticle(): Promise<{
  article: DailyArticle;
  source: 'generated' | 'cached' | 'fallback';
}> {
  const today = getTodayKey();
  const cacheKey = `${CACHE_PREFIX}${today}`;

  // 1. Try cache first
  try {
    const cached = await AsyncStorage.getItem(cacheKey);
    if (cached) {
      const article = JSON.parse(cached) as DailyArticle;
      return { article, source: 'cached' };
    }
  } catch {
    // Cache read failed — proceed to generate
  }

  // 2. Try API generation
  if (ANTHROPIC_API_KEY && ANTHROPIC_API_KEY !== 'YOUR_API_KEY_HERE') {
    try {
      const dayOfWeek = new Date().getDay();
      const topic = TOPIC_ROTATION[dayOfWeek % TOPIC_ROTATION.length];
      const article = await fetchArticleFromAPI(topic);

      // Cache it for today
      try {
        await AsyncStorage.setItem(cacheKey, JSON.stringify(article));
      } catch {
        // Cache write failed — still return the article
      }

      return { article, source: 'generated' };
    } catch (e) {
      console.warn('[generateArticle] API call failed, using fallback:', e);
    }
  }

  // 3. Fallback to hardcoded articles
  const dayOfWeek = new Date().getDay();
  const article = DAILY_ARTICLES[dayOfWeek % DAILY_ARTICLES.length];
  return { article, source: 'fallback' };
}

/**
 * Force regenerate today's article (clears cache first).
 * Useful for a "refresh" button.
 */
export async function regenerateDailyArticle(): Promise<{
  article: DailyArticle;
  source: 'generated' | 'fallback';
}> {
  const today = getTodayKey();
  const cacheKey = `${CACHE_PREFIX}${today}`;

  try {
    await AsyncStorage.removeItem(cacheKey);
  } catch {
    // ignore
  }

  const result = await getDailyArticle();
  return {
    article: result.article,
    source: result.source === 'generated' ? 'generated' : 'fallback',
  };
}
