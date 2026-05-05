/** Typed API client for AfriBayit backend (Mobile) */

const BASE_URL = 'http://localhost:4000'; // In production, use real URL

interface RequestOptions extends Omit<RequestInit, 'body'> {
  body?: unknown;
  token?: string;
}

interface ApiResponse<T> {
  data: T;
  status: number;
}

async function request<T>(path: string, options: RequestOptions = {}): Promise<ApiResponse<T>> {
  const { body, token, ...fetchOptions } = options;

  const headers = new Headers(fetchOptions.headers);
  headers.set('Content-Type', 'application/json');
  if (token) headers.set('Authorization', `Bearer ${token}`);

  const response = await fetch(`${BASE_URL}/api/v1${path}`, {
    ...fetchOptions,
    headers,
    body: body != null ? JSON.stringify(body) : null,
  });

  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({}));
    throw { status: response.status, body: errorBody };
  }

  const data = (await response.json()) as T;
  return { data, status: response.status };
}

export const api = {
  auth: {
    login: (body: any) => request<any>('/auth/login', { method: 'POST', body }),
    register: (body: any) => request<any>('/auth/register', { method: 'POST', body }),
  },
  properties: {
    search: (params: string) => request<{ data: any[]; total: number }>(`/properties?${params}`),
    findBySlug: (slug: string) => request<any>(`/properties/${slug}`),
  },
  users: {
    me: (token: string) => request<any>('/users/me', { token }),
  },
};
