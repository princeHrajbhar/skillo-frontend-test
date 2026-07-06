// src/services/baseApi.ts
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { BaseQueryFn, FetchArgs, FetchBaseQueryError } from '@reduxjs/toolkit/query';

// Resolve the API base URL and guarantee it ends with the /api/v1 prefix,
// so it works whether NEXT_PUBLIC_API_URL is set to the bare domain
// (https://api.example.com) or the full path (https://api.example.com/api/v1).
const resolveApiBaseUrl = (): string => {
  const raw = (process.env.NEXT_PUBLIC_API_URL || 'https://skillo-backend-test.onrender.com/api/v1')
    .trim()
    .replace(/\/+$/, ''); // drop trailing slashes
  return raw.endsWith('/api/v1') ? raw : `${raw}/api/v1`;
};

const API_BASE_URL = resolveApiBaseUrl();

if (typeof window !== 'undefined') {
  console.log('🌐 API base URL:', API_BASE_URL);
}

// Base query with authentication
const baseQuery = fetchBaseQuery({
  baseUrl: API_BASE_URL,
  credentials: 'include',
  prepareHeaders: (headers, { getState }) => {
    // ✅ Get token from localStorage only (not from Redux state)
    const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
    
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }
    headers.set('Accept', 'application/json');
    headers.set('Content-Type', 'application/json');
    return headers;
  },
});

// Custom base query with refresh token handling
const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  console.log('🔄 Making request:', args);
  let result = await baseQuery(args, api, extraOptions);

  // If 401, try to refresh
  if (result.error && result.error.status === 401) {
    console.log('🔄 Access token expired, attempting to refresh...');

    // Try to refresh the token
    const refreshResult = await baseQuery(
      {
        url: '/auth/refresh',
        method: 'POST',
        credentials: 'include',
      },
      api,
      extraOptions
    );

    console.log('🔄 Refresh result:', refreshResult);

    if (refreshResult.data) {
      console.log('✅ Token refreshed successfully');
      
      // Store new token
      const responseData = refreshResult.data as any;
      const newToken = responseData?.data?.accessToken;
      
      if (newToken && typeof window !== 'undefined') {
        localStorage.setItem('accessToken', newToken);
        document.cookie = `accessToken=${newToken}; path=/; max-age=86400; SameSite=Lax`;
      }
      
      // Retry the original request
      console.log('🔄 Retrying original request...');
      result = await baseQuery(args, api, extraOptions);
    } else {
      console.log('❌ Refresh failed');
      
      // Clear storage on refresh failure
      if (typeof window !== 'undefined') {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('user');
        document.cookie = 'accessToken=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
        // Redirect to login
        window.location.href = '/login';
      }
    }
  }

  return result;
};

// Create base API with all tag types
export const baseApi = createApi({
  reducerPath: 'api',
  baseQuery: baseQueryWithReauth,
  tagTypes: [
    'User', 
    'Session', 
    'Course', 
    'Profile', 
    'Job', 
    'Blog', 
    'BlogCategory',
    'CourseCategory',
    'File'
  ],
  endpoints: () => ({}),
  keepUnusedDataFor: 60,
});

export default baseApi;