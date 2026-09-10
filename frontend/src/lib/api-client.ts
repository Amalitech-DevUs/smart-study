const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000';

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: unknown;
  };
  meta?: {
    count?: number;
    source?: string;
    timestamp?: string;
  };
}

/**
 * Universal fetch wrapper for Backend API calls (port 5000)
 */
export async function apiFetch<T = Record<string, unknown>>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  const url = `${API_BASE_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string> || {})
  };

  try {
    const res = await fetch(url, {
      ...options,
      headers
    });

    const data = await res.json();
    return data;
  } catch {
    return {
      success: false,
      error: {
        code: 'NETWORK_ERROR',
        message: 'Could not connect to Backend API service on ' + API_BASE_URL
      }
    };
  }
}

// ==========================================
// API Endpoint Helpers
// ==========================================

export async function fetchQuestionsApi(params?: { subject?: string; year?: number; topic?: string }) {
  const query = new URLSearchParams();
  if (params?.subject) query.append('subject', params.subject);
  if (params?.year) query.append('year', params.year.toString());
  if (params?.topic) query.append('topic', params.topic);

  const queryString = query.toString();
  return apiFetch(`/questions${queryString ? `?${queryString}` : ''}`);
}

export async function fetchQuestionByIdApi(id: string) {
  return apiFetch(`/questions/${id}`);
}

export async function fetchArticlesApi(category?: string) {
  const query = category ? `?category=${encodeURIComponent(category)}` : '';
  return apiFetch(`/articles${query}`);
}

export async function sendChatMessageApi(
  message: string,
  conversationHistory?: Array<{ role: string; content: string }>
) {
  return apiFetch('/chat', {
    method: 'POST',
    body: JSON.stringify({ message, conversationHistory })
  });
}

export async function checkBackendHealth(service: 'auth' | 'content' | 'ai') {
  return apiFetch(`/health/${service}`);
}
