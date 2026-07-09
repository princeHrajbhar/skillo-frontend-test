// src/services/baseApi.ts
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { BaseQueryFn, FetchArgs, FetchBaseQueryError } from '@reduxjs/toolkit/query';

// Resolve the API base URL
const resolveApiBaseUrl = (): string => {
  const raw = (process.env.NEXT_PUBLIC_API_URL || 'http://16.171.141.254:5000/api/v1')
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
let refreshPromise: Promise<any> | null = null;

// Subscribe to token refresh
const subscribeTokenRefresh = (cb: (token: string) => void) => {
  refreshSubscribers.push(cb);
};

// Notify subscribers when token is refreshed
const onRefreshed = (token: string) => {
  refreshSubscribers.forEach(cb => cb(token));
  refreshSubscribers = [];
};

// Helper to perform refresh
const performRefresh = async (): Promise<string | null> => {
  try {
    const refreshBaseQuery = fetchBaseQuery({
      baseUrl: API_BASE_URL,
      credentials: 'include',
    });

    const refreshResult = await refreshBaseQuery(
      {
        url: '/auth/refresh',
        method: 'POST',
      },
      {} as any,
      {} as any
    );

    if (refreshResult.data) {
      const responseData = refreshResult.data as any;
      const newToken = responseData?.data?.accessToken;
      
      if (newToken && typeof window !== 'undefined') {
        localStorage.setItem('accessToken', newToken);
        document.cookie = `accessToken=${newToken}; path=/; max-age=86400; SameSite=Lax`;
        return newToken;
      }
    }
    return null;
  } catch (error) {
    console.error('❌ Refresh error:', error);
    return null;
  }
};

// Helper to create a new fetch query with token
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
  
  return await authenticatedBaseQuery(args, {} as any, {} as any);
};

// Custom base query with refresh token handling
const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  // Check if we're on the client side
  if (typeof window === 'undefined') {
    return await baseQuery(args, api, extraOptions);
  }

  // Get token before making request
  let token = getToken();
  
  // Don't attempt refresh for auth endpoints
  const isAuthEndpoint = typeof args === 'object' && 
    (args.url?.includes('/auth/login') || 
     args.url?.includes('/auth/refresh') ||
     args.url?.includes('/auth/logout'));
  
  if (isAuthEndpoint) {
    return await baseQuery(args, api, extraOptions);
  }

  // If no token, return 401 immediately
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
            // Update the token in the request
            const argsWithToken = args;
            if (typeof argsWithToken === 'object' && argsWithToken !== null) {
              // We need to reconstruct the request with new token
              const retryResult = await createAuthenticatedQuery(newToken, argsWithToken);
              resolve(retryResult);
            } else {
              resolve({
                error: {
                  status: 401,
                  data: { message: 'Retry failed - invalid args' }
                } as FetchBaseQueryError
              });
            }
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
      // Perform refresh
      const newToken = await performRefresh();
      
      if (newToken) {
        console.log('✅ Token refreshed successfully');
        token = newToken;
        onRefreshed(newToken);
        
        // Retry the original request with the new token
        const retryResult = await createAuthenticatedQuery(newToken, args);
        return retryResult;
      } else {
        console.log('❌ Refresh failed - no token received');
        clearAuthData();
        // Redirect to login
        if (typeof window !== 'undefined' && !window.location.pathname.startsWith('/login')) {
          window.location.href = '/login';
        }
        return {
          error: {
            status: 401,
            data: { message: 'Session expired - please login again' }
          } as FetchBaseQueryError
        };
      }
    } catch (error) {
      console.error('❌ Refresh error:', error);
      clearAuthData();
      if (typeof window !== 'undefined' && !window.location.pathname.startsWith('/login')) {
        window.location.href = '/login';
      }
      return {
        error: {
          status: 401,
          data: { message: 'Authentication failed' }
        } as FetchBaseQueryError
      };
    } finally {
      isRefreshing = false;
      refreshPromise = null;
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