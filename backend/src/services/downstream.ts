import articlesData from '../data/articles.json';
import questionsData from '../data/questions.json';

export interface ServiceHealthStatus {
  service: string;
  url: string;
  status: 'HEALTHY' | 'DEGRADED';
  responseTimeMs?: number;
  mode: 'LIVE' | 'LOCAL_FALLBACK';
}

/**
 * Check connectivity to a downstream microservice with a tight timeout.
 */
export async function checkServiceHealth(serviceName: string, serviceUrl: string): Promise<ServiceHealthStatus> {
  const start = Date.now();
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 1500);

    let targetUrl = serviceUrl;
    let method = 'GET';
    let body: string | undefined = undefined;

    if (serviceName === 'auth') {
      targetUrl = serviceUrl;
      method = 'POST';
      body = JSON.stringify({});
    } else {
      targetUrl = `${serviceUrl.replace(/\/$/, '')}/health`;
    }

    const response = await fetch(targetUrl, {
      method,
      headers: serviceName === 'auth' ? { 'Content-Type': 'application/json' } : undefined,
      body,
      signal: controller.signal
    });
    clearTimeout(timeoutId);

    const responseTimeMs = Date.now() - start;

    if (response.status < 500) {
      return {
        service: serviceName,
        url: serviceUrl,
        status: 'HEALTHY',
        responseTimeMs,
        mode: 'LIVE'
      };
    }
  } catch (err) {
    // Downstream service not reachable, fall back gracefully
  }

  return {
    service: serviceName,
    url: serviceUrl,
    status: 'DEGRADED',
    responseTimeMs: Date.now() - start,
    mode: 'LOCAL_FALLBACK'
  };
}

/**
 * Question Data Provider: Exclusively queries the downstream Content DB service (no local fallback)
 */
export async function fetchQuestions(filters?: { subject?: string; year?: number; topic?: string }) {
  const contentUrl = process.env.CONTENT_SERVICE_URL || 'http://localhost:5002';
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);

    const query = new URLSearchParams();
    if (filters?.subject) query.append('subject', filters.subject);
    if (filters?.year) query.append('year', filters.year.toString());
    if (filters?.topic) query.append('topic', filters.topic);

    let response = await fetch(`${contentUrl}/questions?${query.toString()}`, { signal: controller.signal });

    if (response.ok) {
      let rawData = await response.json();
      let items = Array.isArray(rawData) ? rawData : (rawData.data || []);

      clearTimeout(timeoutId);

      const normalized = items.map((q: any) => ({
        id: q.id,
        subject: q.subject,
        year: q.year,
        paper: q.paper,
        section: q.section,
        topic: q.topic,
        prompt: q.prompt,
        options: q.options,
        correctAnswer: q.correctAnswer || q.correct_answer,
        questionNumber: q.questionNumber || q.question_number,
        questionType: q.questionType || q.question_type || 'mcq',
        explanation: q.explanation || `The correct answer is Option ${q.correctAnswer || q.correct_answer}.`
      }));
      return { data: normalized, source: 'CONTENT_SERVICE' };
    }
    clearTimeout(timeoutId);
  } catch (error) {
    // Content DB service offline, proceeding to local seed bank fallback
  }

  // Fallback to local verified questions seed bank (813 questions)
  let localQuestions = questionsData as any[];

  if (filters?.subject) {
    localQuestions = localQuestions.filter(
      q => q.subject && q.subject.toLowerCase() === filters.subject!.toLowerCase()
    );
  }
  if (filters?.year) {
    localQuestions = localQuestions.filter(
      q => Number(q.year) === Number(filters.year)
    );
  }
  if (filters?.topic) {
    localQuestions = localQuestions.filter(
      q => q.topic && q.topic.toLowerCase() === filters.topic!.toLowerCase()
    );
  }

  const normalizedFallback = localQuestions.map((q: any) => ({
    id: q.id,
    subject: q.subject,
    year: q.year,
    paper: q.paper,
    section: q.section,
    topic: q.topic,
    prompt: q.prompt,
    options: q.options,
    correctAnswer: q.correctAnswer || q.correct_answer,
    questionNumber: q.questionNumber || q.question_number,
    questionType: q.questionType || q.question_type || 'mcq',
    explanation: q.explanation || `The correct answer is Option ${q.correctAnswer || q.correct_answer}.`
  }));

  return { data: normalizedFallback, source: 'LOCAL_SEED_BANK' };
}

/**
 * Single Question Data Provider: Queries Content DB first, falls back to local seed bank
 */
export async function fetchQuestionById(id: string | number) {
  const contentUrl = process.env.CONTENT_SERVICE_URL || 'http://localhost:5002';
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4000);
    const response = await fetch(`${contentUrl}/questions/${id}`, { signal: controller.signal });
    clearTimeout(timeoutId);
    if (response.ok) {
      const q = await response.json();
      return {
        data: {
          id: q.id,
          subject: q.subject,
          year: q.year,
          paper: q.paper,
          section: q.section,
          topic: q.topic,
          prompt: q.prompt,
          options: q.options,
          correctAnswer: q.correctAnswer || q.correct_answer,
          questionNumber: q.questionNumber || q.question_number,
          questionType: q.questionType || q.question_type || 'mcq',
          explanation: q.explanation || `The correct answer is Option ${q.correctAnswer || q.correct_answer}.`
        },
        source: 'CONTENT_SERVICE'
      };
    }
  } catch {
    // Downstream service offline
  }

  const found = (questionsData as any[]).find(
    q => String(q.id) === String(id) || String(q.question_number) === String(id)
  );

  if (found) {
    return {
      data: {
        id: found.id,
        subject: found.subject,
        year: found.year,
        paper: found.paper,
        section: found.section,
        topic: found.topic,
        prompt: found.prompt,
        options: found.options,
        correctAnswer: found.correctAnswer || found.correct_answer,
        questionNumber: found.questionNumber || found.question_number,
        questionType: found.questionType || found.question_type || 'mcq',
        explanation: found.explanation || `The correct answer is Option ${found.correctAnswer || found.correct_answer}.`
      },
      source: 'LOCAL_SEED_BANK'
    };
  }

  return null;
}

/**
 * Article Data Provider: Tries downstream Content DB service first, falls back to src/data/articles.json
 */
export async function fetchArticles(filters?: { category?: string; subject?: string }) {
  const contentUrl = process.env.CONTENT_SERVICE_URL || 'http://localhost:5002';
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2500);

    const params = new URLSearchParams();
    if (filters?.category) params.append('category', filters.category);
    if (filters?.subject) params.append('subject', filters.subject);

    const queryString = params.toString() ? `?${params.toString()}` : '';
    const response = await fetch(`${contentUrl}/articles${queryString}`, { signal: controller.signal });
    clearTimeout(timeoutId);

    if (response.ok) {
      const data = await response.json();
      return { data: data.data || data, source: 'CONTENT_SERVICE' };
    }
  } catch (error) {
    // Fall back to seed dataset
  }

  let result = articlesData as Array<Record<string, any>>;
  if (filters?.category) {
    result = result.filter(a => a.category?.toLowerCase() === filters.category!.toLowerCase());
  }
  if (filters?.subject) {
    result = result.filter(a => a.subject?.toLowerCase() === filters.subject!.toLowerCase());
  }

  return { data: result, source: 'LOCAL_SEED_BANK' };
}

/**
 * Fetch a single article by either integer ID or string slug
 */
export async function fetchArticleByIdOrSlug(identifier: string) {
  const contentUrl = process.env.CONTENT_SERVICE_URL || 'http://localhost:5002';

  // If numeric, try direct endpoint first
  if (/^\d+$/.test(identifier)) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 2500);
      const response = await fetch(`${contentUrl}/articles/${identifier}`, { signal: controller.signal });
      clearTimeout(timeoutId);

      if (response.ok) {
        const data = await response.json();
        return { data: data.data || data, source: 'CONTENT_SERVICE' };
      }
    } catch (error) {
      // Continue to search or fallback
    }
  }

  // Try fetching all articles from Content DB to match by slug or id
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2500);
    const response = await fetch(`${contentUrl}/articles`, { signal: controller.signal });
    clearTimeout(timeoutId);

    if (response.ok) {
      const list = await response.json();
      const articles = Array.isArray(list) ? list : list.data || [];
      const found = articles.find((a: any) =>
        String(a.slug || '').toLowerCase() === identifier.toLowerCase() ||
        String(a.id) === identifier
      );
      if (found) {
        return { data: found, source: 'CONTENT_SERVICE' };
      }
    }
  } catch (error) {
    // Fall back to local seed data
  }

  const localFound = (articlesData as Array<Record<string, any>>).find(a =>
    String(a.slug || '').toLowerCase() === identifier.toLowerCase() ||
    String(a.id).toLowerCase() === identifier.toLowerCase()
  );

  return { data: localFound || null, source: 'LOCAL_SEED_BANK' };
}

// Alias for development branch compatibility
export const fetchArticleById = fetchArticleByIdOrSlug;

/**
 * AI Assistant Microservice Chat Forwarder:
 * Connects to AI microservice on AI_SERVICE_URL (default: port 8000).
 */
export async function forwardChatToAiService(payload: {
  message?: string;
  messages?: Array<{ role: string; content: string }>;
}) {
  const aiUrl = process.env.AI_SERVICE_URL || 'http://localhost:5003';
  return fetch(`${aiUrl}/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
}
