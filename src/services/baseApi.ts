// src/services/baseApi.ts
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { BaseQueryFn, FetchArgs, FetchBaseQueryError } from '@reduxjs/toolkit/query';

// Resolve the API base URL
const resolveApiBaseUrl = (): string => {
  const raw = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1')
    .trim()
    .replace(/\/+$/, '');
  return raw.endsWith('/api/v1') ? raw : `${raw}/api/v1`;
};

const API_BASE_URL = resolveApiBaseUrl();

// ✅ Helper to get token from localStorage
const getToken = (): string | null => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('accessToken');
};

// ✅ Helper to clear auth data
const clearAuthData = () => {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('accessToken');
  localStorage.removeItem('user');
  document.cookie = 'accessToken=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
};

// Base query with authentication
const baseQuery = fetchBaseQuery({
  baseUrl: API_BASE_URL,
  credentials: 'include',
  prepareHeaders: (headers) => {
    const token = getToken();
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }
    headers.set('Accept', 'application/json');
    headers.set('Content-Type', 'application/json');
    return headers;
  },
});

// ✅ Custom base query with refresh token handling
const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  // ✅ Skip refresh for login and refresh endpoints
  const isAuthEndpoint = typeof args === 'object' && 
    (args.url?.includes('/auth/login') || 
     args.url?.includes('/auth/refresh') ||
     args.url?.includes('/auth/logout'));
  
  // ✅ Don't attempt refresh for auth endpoints
  if (isAuthEndpoint) {
    return await baseQuery(args, api, extraOptions);
  }

  // ✅ Check if we have a token before making the request
  const token = getToken();
  if (!token) {
    console.log('⏭️ No token found, skipping request');
    // Don't redirect here - let the component handle it
    return {
      error: {
        status: 401,
        data: { message: 'No authentication token found' }
      } as FetchBaseQueryError
    };
  }

  console.log('🔄 Making authenticated request:', args);
  let result = await baseQuery(args, api, extraOptions);

  // ✅ If 401, try to refresh
  if (result.error && result.error.status === 401) {
    console.log('🔄 Received 401, attempting to refresh token...');

    // ✅ Try to refresh the token using a fresh baseQuery
    const refreshBaseQuery = fetchBaseQuery({
      baseUrl: API_BASE_URL,
      credentials: 'include',
    });

    const refreshResult = await refreshBaseQuery(
      {
        url: '/auth/refresh',
        method: 'POST',
      },
      api,
      extraOptions
    );

    if (refreshResult.data) {
      console.log('✅ Token refreshed successfully');
      
      // Store new token
      const responseData = refreshResult.data as any;
      const newToken = responseData?.data?.accessToken;
      
      if (newToken && typeof window !== 'undefined') {
        localStorage.setItem('accessToken', newToken);
        document.cookie = `accessToken=${newToken}; path=/; max-age=86400; SameSite=Lax`;
        
        // ✅ Retry the original request with the new token
        const retryBaseQuery = fetchBaseQuery({
          baseUrl: API_BASE_URL,
          credentials: 'include',
          prepareHeaders: (headers) => {
            headers.set('Authorization', `Bearer ${newToken}`);
            headers.set('Accept', 'application/json');
            headers.set('Content-Type', 'application/json');
            return headers;
          },
        });
        
        result = await retryBaseQuery(args, api, extraOptions);
        console.log('🔄 Retry result:', result);
      }
    } else {
      console.log('❌ Refresh failed, clearing auth data');
      clearAuthData();
      
      // ✅ Redirect to login only on protected pages
      if (typeof window !== 'undefined') {
        const pathname = window.location.pathname;
        if (!pathname.startsWith('/login') && !pathname.startsWith('/register')) {
          window.location.href = '/login';
        }
      }
    }
  }

  return result;
};

// Create base API
export const baseApi = createApi({
  reducerPath: 'api',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['User', 'Session', 'Course', 'Profile', 'Job', 'Blog', 'BlogCategory', 'CourseCategory', 'File'],
  endpoints: () => ({}),
  keepUnusedDataFor: 60,
});

export default baseApi;