import articlesData from '../data/articles.json';

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
    // Connection error
  }

  return { data: [], source: 'CONTENT_SERVICE' };
}

/**
 * Single Question Data Provider: Exclusively queries the downstream Content DB service (no local fallback)
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

  return null;
}

/**
 * Article Data Provider: Tries downstream Content DB service first, falls back to src/data/articles.json
 */
export async function fetchArticles(category?: string) {
  const contentUrl = process.env.CONTENT_SERVICE_URL || 'http://localhost:5002';
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2500);

    const query = category ? `?category=${encodeURIComponent(category)}` : '';
    const response = await fetch(`${contentUrl}/articles${query}`, { signal: controller.signal });
    clearTimeout(timeoutId);

    if (response.ok) {
      const data = await response.json();
      return { data: data.data || data, source: 'CONTENT_SERVICE' };
    }
  } catch (error) {
    // Fall back to seed dataset
  }

  let result = articlesData;
  if (category) {
    result = result.filter(a => a.category.toLowerCase() === category.toLowerCase());
  }

  return { data: result, source: 'LOCAL_SEED_BANK' };
}

/**
 * Single Article Data Provider: Tries downstream Content DB service first, falls back to src/data/articles.json
 */
export async function fetchArticleById(idOrSlug: string | number) {
  const contentUrl = process.env.CONTENT_SERVICE_URL || 'http://localhost:5002';
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3000);
    const response = await fetch(`${contentUrl}/articles/${encodeURIComponent(String(idOrSlug))}`, { signal: controller.signal });
    clearTimeout(timeoutId);
    if (response.ok) {
      const data = await response.json();
      return { data: data.data || data, source: 'CONTENT_SERVICE' };
    }
  } catch (error) {
    // Fall back to seed dataset
  }

  const idStr = String(idOrSlug).toLowerCase();
  const article = articlesData.find(a => String(a.id).toLowerCase() === idStr || a.slug?.toLowerCase() === idStr);
  if (article) {
    return { data: article, source: 'LOCAL_SEED_BANK' };
  }
  return null;
}


/**
 * AI Assistant Microservice Chat Forwarder:
 * Connects to AI microservice on AI_SERVICE_URL (default: port 5003).
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
