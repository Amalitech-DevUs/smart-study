import questionsData from '../data/questions.json';
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
    const timeoutId = setTimeout(() => controller.abort(), 2000);

    const response = await fetch(`${serviceUrl}/health`, {
      method: 'GET',
      signal: controller.signal
    });
    clearTimeout(timeoutId);

    const responseTimeMs = Date.now() - start;

    if (response.ok) {
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
 * Question Data Provider: Tries downstream Content DB service first, falls back to src/data/questions.json
 */
export async function fetchQuestions(filters?: { subject?: string; year?: number; topic?: string }) {
  const contentUrl = process.env.CONTENT_SERVICE_URL || 'http://localhost:5002';
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2500);

    const query = new URLSearchParams();
    if (filters?.subject) query.append('subject', filters.subject);
    if (filters?.year) query.append('year', filters.year.toString());
    if (filters?.topic) query.append('topic', filters.topic);

    const response = await fetch(`${contentUrl}/questions?${query.toString()}`, { signal: controller.signal });
    clearTimeout(timeoutId);

    if (response.ok) {
      const data = await response.json();
      return { data: data.data || data, source: 'CONTENT_SERVICE' };
    }
  } catch (error) {
    // Fall back to seed dataset
  }

  // Fallback filtering on local JSON seed bank
  let result = questionsData;
  if (filters?.subject) {
    result = result.filter(q => q.subject.toLowerCase() === filters.subject!.toLowerCase());
  }
  if (filters?.year) {
    result = result.filter(q => q.year === filters.year);
  }
  if (filters?.topic) {
    result = result.filter(q => q.topic.toLowerCase().includes(filters.topic!.toLowerCase()));
  }

  return { data: result, source: 'LOCAL_SEED_BANK' };
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
