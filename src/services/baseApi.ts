// src/services/baseApi.ts
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { BaseQueryFn, FetchArgs, FetchBaseQueryError } from '@reduxjs/toolkit/query';

// Resolve the API base URL
const resolveApiBaseUrl = (): string => {
  const raw = (process.env.NEXT_PUBLIC_API_URL || 'https://skillo-backend-test.onrender.com/api/v1')
    .trim()
    .replace(/\/+$/, '');
  return raw.endsWith('/api/v1') ? raw : `${raw}/api/v1`;
};

const API_BASE_URL = resolveApiBaseUrl();

// Helper to get token from localStorage
const getToken = (): string | null => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('accessToken');
};

// Helper to clear auth data
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

// Track refresh state globally
let isRefreshing = false;
let refreshSubscribers: ((token: string) => void)[] = [];

// Subscribe to token refresh
const subscribeTokenRefresh = (cb: (token: string) => void) => {
  refreshSubscribers.push(cb);
};

// Notify subscribers when token is refreshed
const onRefreshed = (token: string) => {
  refreshSubscribers.forEach(cb => cb(token));
  refreshSubscribers = [];
};

// Helper to create a new fetch query with token and return a proper Promise
const createAuthenticatedQuery = async (token: string, args: string | FetchArgs): Promise<any> => {
  const authenticatedBaseQuery = fetchBaseQuery({
    baseUrl: API_BASE_URL,
    credentials: 'include',
    prepareHeaders: (headers) => {
      headers.set('Authorization', `Bearer ${token}`);
      headers.set('Accept', 'application/json');
      headers.set('Content-Type', 'application/json');
      return headers;
    },
  });
  
  // Await the result to ensure we get a proper Promise
  return await authenticatedBaseQuery(args, {} as any, {} as any);
};

// Custom base query with refresh token handling
const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  // Skip refresh for login and refresh endpoints
  const isAuthEndpoint = typeof args === 'object' && 
    (args.url?.includes('/auth/login') || 
     args.url?.includes('/auth/refresh') ||
     args.url?.includes('/auth/logout'));
  
  // Don't attempt refresh for auth endpoints
  if (isAuthEndpoint) {
    return await baseQuery(args, api, extraOptions);
  }

  // Check if we have a token before making the request
  const token = getToken();
  if (!token) {
    console.log('⏭️ No token found, skipping request');
    return {
      error: {
        status: 401,
        data: { message: 'No authentication token found' }
      } as FetchBaseQueryError
    };
  }

  console.log('🔄 Making authenticated request:', args);
  let result = await baseQuery(args, api, extraOptions);

  // If 401, try to refresh
  if (result.error && result.error.status === 401) {
    console.log('🔄 Received 401, attempting to refresh token...');

    // If already refreshing, wait for the refresh to complete
    if (isRefreshing) {
      console.log('⏳ Refresh already in progress, waiting...');
      return new Promise((resolve) => {
        subscribeTokenRefresh(async (newToken) => {
          console.log('🔄 Retrying with new token after refresh');
          try {
            const retryResult = await createAuthenticatedQuery(newToken, args);
            resolve(retryResult);
          } catch (err) {
            resolve({
              error: {
                status: 401,
                data: { message: 'Retry failed' }
              } as FetchBaseQueryError
            });
          }
        });
      });
    }

    // Start refresh process
    isRefreshing = true;

    try {
      // Try to refresh the token
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
        
        const responseData = refreshResult.data as any;
        const newToken = responseData?.data?.accessToken;
        
        if (newToken && typeof window !== 'undefined') {
          // Store new token
          localStorage.setItem('accessToken', newToken);
          document.cookie = `accessToken=${newToken}; path=/; max-age=86400; SameSite=Lax`;
          
          // Notify subscribers
          onRefreshed(newToken);
          
          // Retry the original request with the new token
          result = await createAuthenticatedQuery(newToken, args);
          console.log('🔄 Retry result:', result);
        } else {
          console.log('❌ No new token in refresh response');
          clearAuthData();
          isRefreshing = false;
          redirectToLogin();
          return {
            error: {
              status: 401,
              data: { message: 'No new token received' }
            } as FetchBaseQueryError
          };
        }
      } else {
        console.log('❌ Refresh failed');
        clearAuthData();
        isRefreshing = false;
        redirectToLogin();
        return {
          error: {
            status: 401,
            data: { message: 'Refresh failed' }
          } as FetchBaseQueryError
        };
      }
    } catch (error) {
      console.error('❌ Refresh error:', error);
      clearAuthData();
      isRefreshing = false;
      redirectToLogin();
      return {
        error: {
          status: 401,
          data: { message: 'Refresh error' }
        } as FetchBaseQueryError
      };
    } finally {
      isRefreshing = false;
    }
  }

  return result;
};

// Helper to redirect to login
const redirectToLogin = () => {
  if (typeof window !== 'undefined') {
    const pathname = window.location.pathname;
    if (!pathname.startsWith('/login') && !pathname.startsWith('/register')) {
      console.log('🔀 Redirecting to login page');
      window.location.href = '/login';
    }
  }
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