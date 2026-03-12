import { getSessionApiHeaders } from './session';

/* Server-side fetch uses API_BASE_URL (Docker internal network, e.g. http://backend:3001/api).
   Client-side fetch uses NEXT_PUBLIC_API_BASE_URL which must resolve from the browser
   (e.g. http://localhost:7001/api). */
const serverApiBaseUrl = process.env.API_BASE_URL ?? process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:3001/api';
const clientApiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:3001/api';

export function getApiBaseUrl() {
  return typeof window === 'undefined' ? serverApiBaseUrl : clientApiBaseUrl;
}

/** Structured API error with status code and response body */
export class ApiError extends Error {
  constructor(
    public readonly status: number,
    public readonly statusText: string,
    public readonly body?: unknown,
  ) {
    super(`API error ${status}: ${statusText}`);
    this.name = 'ApiError';
  }

  get isUnauthorized() {
    return this.status === 401;
  }

  get isForbidden() {
    return this.status === 403;
  }

  get isNotFound() {
    return this.status === 404;
  }
}

export async function fetchJson<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${getApiBaseUrl()}${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...(init?.headers ?? {}),
    },
    cache: 'no-store',
  });

  if (!response.ok) {
    let body: unknown;
    try {
      body = await response.json();
    } catch {
      body = undefined;
    }
    throw new ApiError(response.status, response.statusText, body);
  }

  return (await response.json()) as T;
}

export async function fetchSessionJson<T>(path: string, init?: RequestInit): Promise<T> {
  const sessionHeaders = await getSessionApiHeaders();
  return fetchJson<T>(path, {
    ...init,
    headers: {
      ...sessionHeaders,
      ...(init?.headers ?? {}),
    },
  });
}

export async function postSessionJson<T>(path: string, body?: Record<string, unknown>): Promise<T> {
  return fetchSessionJson<T>(path, {
    method: 'POST',
    body: body ? JSON.stringify(body) : undefined,
  });
}
