import { getSessionApiHeaders } from './session';

const defaultApiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:3001/api';

export function getApiBaseUrl() {
  return defaultApiBaseUrl;
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
    throw new Error(`API request failed: ${response.status}`);
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
