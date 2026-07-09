// src/features/auth/api/authApi.ts
import { baseApi } from '../../../services/baseApi';

// Types
export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  data?: {
    user?: UserResponse;
    accessToken?: string;
  };
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface UserResponse {
  userId: string;
  email: string;
  role: 'user' | 'admin';
  isVerified: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface SessionResponse {
  id: string;
  userAgent?: string;
  ip?: string;
  lastUsedAt: string;
  createdAt: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data?: any;
}

export interface RefreshTokenResponse {
  success: boolean;
  message: string;
  data?: {
    accessToken: string;
  };
}

// Auth API
export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    refreshToken: builder.mutation<RefreshTokenResponse, void>({
      query: () => ({
        url: '/auth/refresh',
        method: 'POST',
        credentials: 'include', // ✅ Important: Send cookies
      }),
      transformResponse: (response: any) => {
        console.log('🔄 Refresh token response:', response);
        if (response?.data?.accessToken && typeof window !== 'undefined') {
          localStorage.setItem('accessToken', response.data.accessToken);
          document.cookie = `accessToken=${response.data.accessToken}; path=/; max-age=86400; SameSite=Lax`;
        }
        return response;
      },
    }),

    login: builder.mutation<LoginResponse, LoginRequest>({
      query: (data) => ({
        url: '/auth/login',
        method: 'POST',
        body: data,
        credentials: 'include',
      }),
      invalidatesTags: ['User', 'Session'],
      transformResponse: (response: any) => {
        if (response?.data?.accessToken && typeof window !== 'undefined') {
          localStorage.setItem('accessToken', response.data.accessToken);
          document.cookie = `accessToken=${response.data.accessToken}; path=/; max-age=86400; SameSite=Lax`;
        }
        return response;
      },
    }),

    changePassword: builder.mutation<AuthResponse, ChangePasswordRequest>({
      query: (data) => ({
        url: '/auth/change-password',
        method: 'POST',
        body: data,
        credentials: 'include',
      }),
    }),

    getMe: builder.query<UserResponse, void>({
      query: () => ({
        url: '/auth/me',
        method: 'GET',
        credentials: 'include',
      }),
      providesTags: ['User'],
      transformResponse: (response: any) => response?.data,
    }),

    getSessions: builder.query<SessionResponse[], void>({
      query: () => ({
        url: '/auth/sessions',
        method: 'GET',
        credentials: 'include',
      }),
      providesTags: ['Session'],
      transformResponse: (response: any) => response?.data?.sessions || [],
    }),

    logout: builder.mutation<AuthResponse, void>({
      query: () => ({
        url: '/auth/logout',
        method: 'POST',
        credentials: 'include',
      }),
      invalidatesTags: ['User', 'Session'],
    }),

    logoutAll: builder.mutation<AuthResponse, void>({
      query: () => ({
        url: '/auth/logout-all',
        method: 'POST',
        credentials: 'include',
      }),
      invalidatesTags: ['User', 'Session'],
    }),
  }),
});

// Export hooks
export const {
  useLoginMutation,
  useChangePasswordMutation,
  useGetMeQuery,
  useGetSessionsQuery,
  useLogoutMutation,
  useLogoutAllMutation,
  useRefreshTokenMutation,
} = authApi;

export default authApi;