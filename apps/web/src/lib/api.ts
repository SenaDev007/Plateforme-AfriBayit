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
    const errorBody = (await response.json().catch(() => ({}))) as unknown;
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
    me: (token: string) => request<unknown>('/auth/me', { token }),
    refresh: (refreshToken: string) =>
      request<{ accessToken: string; refreshToken: string; user: unknown }>('/auth/refresh', {
        method: 'POST',
        body: { refreshToken },
      }),
    logout: (token: string) =>
      request<{ message: string }>('/auth/logout', { method: 'POST', token }),
    forgotPassword: (email: string) =>
      request<{ message: string }>('/auth/forgot-password', {
        method: 'POST',
        body: { email },
      }),
    resetPassword: (token: string, newPassword: string) =>
      request<{ message: string }>('/auth/reset-password', {
        method: 'POST',
        body: { token, newPassword },
      }),
    verifyEmail: (token: string) =>
      request<{ message: string }>('/auth/verify-email', {
        method: 'POST',
        body: { token },
      }),
    changePassword: (oldPassword: string, newPassword: string, token: string) =>
      request<{ message: string }>('/auth/change-password', {
        method: 'PATCH',
        body: { oldPassword, newPassword },
        token,
      }),
    sendMagicLink: (email: string) =>
      request<{ message: string }>('/auth/magic-link/send', {
        method: 'POST',
        body: { email },
      }),
    verifyMagicLink: (token: string) =>
      request<{ accessToken: string; refreshToken: string; user: unknown }>(
        '/auth/magic-link/verify',
        { method: 'POST', body: { token } },
      ),
  },

  properties: {
    search: (params: URLSearchParams, token?: string) =>
      request<{ data: unknown[]; total: number }>(`/properties?${params.toString()}`, {
        ...(token !== undefined ? { token } : {}),
      }),
    findBySlug: (slug: string) => request<unknown>(`/properties/${slug}`),
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
    findMine: (token: string) => request<unknown[]>('/properties/mine', { token }),
    remove: (slug: string, token: string) =>
      request<void>(`/properties/${slug}`, { method: 'DELETE', token }),
    addImage: (
      slug: string,
      body: { url: string; fileKey: string; alt?: string; isPrimary?: boolean },
      token: string,
    ) => request<void>(`/properties/${slug}/images`, { method: 'POST', body, token }),
  },

  transactions: {
    create: (body: unknown, token: string) =>
      request<unknown>('/transactions', { method: 'POST', body, token }),
    findAll: (token: string) => request<unknown[]>('/transactions', { token }),
    findOne: (id: string, token: string) => request<unknown>(`/transactions/${id}`, { token }),
    release: (id: string, token: string, totpCode?: string) =>
      request<unknown>(`/transactions/${id}/release`, {
        method: 'POST',
        body: totpCode ? { totpCode } : {},
        token,
      }),
    releaseRequirements: (id: string, token: string) =>
      request<{ requires2FA: boolean; isLargeAmount: boolean; threshold: number }>(
        `/transactions/${id}/release-requirements`,
        { token },
      ),
    getPaymentIntent: (id: string, token: string) =>
      request<{ clientSecret: string }>(`/transactions/${id}/payment-intent`, { token }),
  },

  payouts: {
    findAll: (token: string) => request<unknown[]>('/payouts', { token }),
    findMine: (token: string) => request<unknown[]>('/payouts/me', { token }),
    retry: (id: string, body: { phone?: string; operator?: string }, token: string) =>
      request<unknown>(`/payouts/${id}/retry`, { method: 'POST', body, token }),
  },

  disputes: {
    open: (transactionId: string, body: { reason: string; description?: string }, token: string) =>
      request<unknown>(`/disputes/transactions/${transactionId}`, { method: 'POST', body, token }),
    findForTransaction: (transactionId: string, token: string) =>
      request<unknown>(`/disputes/transactions/${transactionId}`, { token }),
    findAll: (token: string) => request<unknown[]>('/disputes', { token }),
    markUnderReview: (id: string, token: string) =>
      request<unknown>(`/disputes/${id}/review`, { method: 'PATCH', token }),
    resolve: (
      id: string,
      body: { resolution: string; action: 'RESOLVED' | 'REFUNDED' },
      token: string,
    ) => request<unknown>(`/disputes/${id}/resolve`, { method: 'PATCH', body, token }),
  },

  users: {
    me: (token: string) => request<unknown>('/users/me', { token }),
    updateProfile: (body: unknown, token: string) =>
      request<unknown>('/users/me', { method: 'PATCH', body, token }),
    getFavorites: (token: string) => request<unknown[]>('/users/me/favorites', { token }),
    toggleFavorite: (propertyId: string, token: string) =>
      request<{ favorited: boolean }>(`/users/me/favorites/${propertyId}`, {
        method: 'POST',
        token,
      }),
    submitKyc: (
      body: { type: string; fileUrl: string; fileKey: string; level: string },
      token: string,
    ) => request<void>('/users/me/kyc', { method: 'POST', body, token }),
    getPendingKyc: (token: string) => request<unknown[]>('/users/admin/kyc/pending', { token }),
    reviewKyc: (id: string, body: { status: string; note: string }, token: string) =>
      request<unknown>(`/users/admin/kyc/review/${id}`, { method: 'PATCH', body, token }),
    getAdminUsers: (params: Record<string, string>, token: string) =>
      request<unknown[]>(`/users/admin?${new URLSearchParams(params).toString()}`, { token }),
    updateUserRole: (id: string, body: { role: string }, token: string) =>
      request<unknown>(`/users/admin/${id}/role`, { method: 'PATCH', body, token }),
    updateUserStatus: (id: string, body: { status: string }, token: string) =>
      request<unknown>(`/users/admin/${id}/status`, { method: 'PATCH', body, token }),
  },

  notifications: {
    getAll: (token: string) => request<unknown[]>('/notifications', { token }),
    markRead: (id: string, token: string) =>
      request<void>(`/notifications/${id}/read`, { method: 'PATCH', token }),
    markAllRead: (token: string) =>
      request<void>('/notifications/read-all', { method: 'PATCH', token }),
  },

  search: {
    query: (params: URLSearchParams) =>
      request<{ hits: unknown[]; total: number }>(`/search?${params.toString()}`),
  },

  hotels: {
    search: (params: URLSearchParams) =>
      request<{ data: unknown[]; total: number }>(`/hotels?${params.toString()}`),
    findBySlug: (slug: string) => request<unknown>(`/hotels/${slug}`),
    checkAvailability: (id: string, checkIn: string, checkOut: string) =>
      request<unknown[]>(`/hotels/${id}/availability?checkIn=${checkIn}&checkOut=${checkOut}`),
    book: (
      id: string,
      body: { roomId: string; checkIn: string; checkOut: string; guests: number; notes?: string },
      token: string,
    ) => request<unknown>(`/hotels/${id}/book`, { method: 'POST', body, token }),
    create: (body: unknown, token: string) =>
      request<unknown>('/hotels', { method: 'POST', body, token }),
    getMyBookings: (token: string) => request<unknown[]>('/hotels/my-bookings', { token }),
  },

  artisans: {
    search: (params: URLSearchParams) =>
      request<{ data: unknown[]; total: number }>(`/artisans?${params.toString()}`),
    findBySlug: (slug: string) => request<unknown>(`/artisans/${slug}`),
    createProfile: (body: unknown, token: string) =>
      request<unknown>('/artisans', { method: 'POST', body, token }),
    addReview: (body: { artisanId: string; rating: number; comment: string }, token: string) =>
      request<unknown>('/artisans/reviews', { method: 'POST', body, token }),
    toggleAvailability: (id: string, token: string) =>
      request<unknown>(`/artisans/${id}/availability`, { method: 'PATCH', token }),
  },

  courses: {
    findAll: (params?: URLSearchParams) =>
      request<{ data: unknown[]; total: number }>(
        `/courses${params ? `?${params.toString()}` : ''}`,
      ),
    findBySlug: (slug: string) => request<unknown>(`/courses/${slug}`),
    enroll: (id: string, token: string) =>
      request<unknown>(`/courses/${id}/enroll`, { method: 'POST', token }),
    getMyEnrollments: (token: string) => request<unknown[]>('/courses/me/enrollments', { token }),
    updateProgress: (enrollmentId: string, progress: number, token: string) =>
      request<unknown>(`/courses/enrollments/${enrollmentId}/progress`, {
        method: 'PATCH',
        body: { progress },
        token,
      }),
    create: (body: unknown, token: string) =>
      request<unknown>('/courses', { method: 'POST', body, token }),
    getQuiz: (courseId: string, token: string) =>
      request<unknown>(`/courses/${courseId}/quiz`, { token }),
    submitQuizAttempt: (courseId: string, answers: number[], token: string) =>
      request<{
        score: number;
        passed: boolean;
        correct: number;
        total: number;
        passingScore: number;
        certificateId: string | null;
      }>(`/courses/${courseId}/quiz/attempt`, { method: 'POST', body: { answers }, token }),
    getMyCertificates: (token: string) => request<unknown[]>('/courses/certificates/me', { token }),
    getCertificate: (id: string) => request<unknown>(`/courses/certificates/${id}`),
  },

  messages: {
    getConversations: (token: string) => request<unknown[]>('/messages/conversations', { token }),
    getMessages: (id: string, token: string) =>
      request<{ data: unknown[]; total: number }>(`/messages/conversations/${id}`, { token }),
    getUnreadCount: (token: string) =>
      request<{ count: number }>('/messages/unread-count', { token }),
  },

  community: {
    getPosts: (params?: URLSearchParams) =>
      request<{ data: unknown[]; total: number }>(
        `/community/posts${params ? `?${params.toString()}` : ''}`,
      ),
    getPost: (slug: string) => request<unknown>(`/community/posts/${slug}`),
    createPost: (
      body: { title: string; content: string; category: string; tags?: string[] },
      token: string,
    ) => request<unknown>('/community/posts', { method: 'POST', body, token }),
    toggleLike: (id: string, token: string) =>
      request<{ liked: boolean }>(`/community/posts/${id}/like`, { method: 'POST', token }),
    addComment: (id: string, content: string, token: string) =>
      request<unknown>(`/community/posts/${id}/comments`, {
        method: 'POST',
        body: { content },
        token,
      }),
    getGroups: (category?: string) =>
      request<unknown[]>(`/community/groups${category ? `?category=${category}` : ''}`),
    createGroup: (body: { name: string; description: string; category: string }, token: string) =>
      request<unknown>('/community/groups', { method: 'POST', body, token }),
    joinGroup: (id: string, token: string) =>
      request<unknown>(`/community/groups/${id}/join`, { method: 'POST', token }),
    leaveGroup: (id: string, token: string) =>
      request<unknown>(`/community/groups/${id}/leave`, { method: 'DELETE', token }),
  },
} as const;

export { ApiError };
