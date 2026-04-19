/** Typed API client for AfriBayit backend */

const BASE_URL = process.env['NEXT_PUBLIC_API_URL'] ?? 'http://localhost:4000';

interface RequestOptions extends Omit<RequestInit, 'body'> {
  body?: unknown;
  token?: string;
}

interface ApiResponse<T> {
  data: T;
  status: number;
}

class ApiError extends Error {
  constructor(
    public readonly status: number,
    message: string,
    public readonly body?: unknown,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

async function request<T>(
  path: string,
  options: RequestOptions = {},
): Promise<ApiResponse<T>> {
  const { body, token, ...fetchOptions } = options;

  const headers = new Headers(fetchOptions.headers);
  headers.set('Content-Type', 'application/json');
  if (token) headers.set('Authorization', `Bearer ${token}`);

  const response = await fetch(`${BASE_URL}/api/v1${path}`, {
    ...fetchOptions,
    headers,
    body: body != null ? JSON.stringify(body) : undefined,
  });

  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({})) as unknown;
    const message = (errorBody as { message?: string })?.message ?? `API error ${response.status}`;
    throw new ApiError(response.status, message, errorBody);
  }

  const data = (await response.json()) as T;
  return { data, status: response.status };
}

/** AfriBayit API client — tree-shakeable methods */
export const api = {
  auth: {
    login: (body: { email: string; password: string; totpCode?: string }) =>
      request<{ accessToken: string; refreshToken: string; user: unknown }>('/auth/login', {
        method: 'POST',
        body,
      }),
    register: (body: {
      email: string;
      password: string;
      firstName: string;
      lastName: string;
      phone?: string;
      role?: string;
      country?: string;
    }) =>
      request<{ accessToken: string; refreshToken: string; user: unknown }>('/auth/register', {
        method: 'POST',
        body,
      }),
    me: (token: string) =>
      request<unknown>('/auth/me', { token }),
  },

  properties: {
    search: (params: URLSearchParams, token?: string) =>
      request<{ data: unknown[]; total: number }>(`/properties?${params.toString()}`, { token }),
    findBySlug: (slug: string) =>
      request<unknown>(`/properties/${slug}`),
    create: (body: unknown, token: string) =>
      request<unknown>('/properties', { method: 'POST', body, token }),
    update: (slug: string, body: unknown, token: string) =>
      request<unknown>(`/properties/${slug}`, { method: 'PATCH', body, token }),
    publish: (slug: string, token: string) =>
      request<unknown>(`/properties/${slug}/publish`, { method: 'POST', token }),
    presignUpload: (contentType: string, token: string) =>
      request<{ uploadUrl: string; fileKey: string; publicUrl: string }>(
        '/properties/upload/presign',
        { method: 'POST', body: { contentType }, token },
      ),
  },

  transactions: {
    create: (body: unknown, token: string) =>
      request<unknown>('/transactions', { method: 'POST', body, token }),
    findAll: (token: string) =>
      request<unknown[]>('/transactions', { token }),
    findOne: (id: string, token: string) =>
      request<unknown>(`/transactions/${id}`, { token }),
    release: (id: string, token: string) =>
      request<unknown>(`/transactions/${id}/release`, { method: 'POST', token }),
  },

  users: {
    me: (token: string) =>
      request<unknown>('/users/me', { token }),
    updateProfile: (body: unknown, token: string) =>
      request<unknown>('/users/me', { method: 'PATCH', body, token }),
    getFavorites: (token: string) =>
      request<unknown[]>('/users/me/favorites', { token }),
    toggleFavorite: (propertyId: string, token: string) =>
      request<{ favorited: boolean }>(`/users/me/favorites/${propertyId}`, {
        method: 'POST',
        token,
      }),
  },

  notifications: {
    getAll: (token: string) =>
      request<unknown[]>('/notifications', { token }),
    markRead: (id: string, token: string) =>
      request<void>(`/notifications/${id}/read`, { method: 'PATCH', token }),
    markAllRead: (token: string) =>
      request<void>('/notifications/read-all', { method: 'PATCH', token }),
  },

  search: {
    query: (params: URLSearchParams) =>
      request<{ hits: unknown[]; total: number }>(`/search?${params.toString()}`),
  },
} as const;

export { ApiError };
