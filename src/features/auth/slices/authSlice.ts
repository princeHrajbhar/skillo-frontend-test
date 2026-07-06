// src/features/auth/slices/authSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { UserResponse } from '../api/authApi';
import { authApi } from '../api/authApi';

interface AuthState {
  user: UserResponse | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isRefreshing: boolean;
  error: string | null;
  initialized: boolean;
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: true,
  isRefreshing: false,
  error: null,
  initialized: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<UserResponse | null>) => {
      state.user = action.payload;
      state.isAuthenticated = !!action.payload;
      state.initialized = true;
      if (action.payload) {
        state.error = null;
        // Store user in localStorage
        if (typeof window !== 'undefined') {
          localStorage.setItem('user', JSON.stringify(action.payload));
        }
      }
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setRefreshing: (state, action: PayloadAction<boolean>) => {
      state.isRefreshing = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    setInitialized: (state, action: PayloadAction<boolean>) => {
      state.initialized = action.payload;
    },
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.isLoading = false;
      state.isRefreshing = false;
      state.error = null;
      state.initialized = true;
      if (typeof window !== 'undefined') {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('user');
        document.cookie = 'accessToken=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
      }
    },
    // For hydration
    hydrateUser: (state) => {
      if (typeof window !== 'undefined') {
        const storedUser = localStorage.getItem('user');
        const storedToken = localStorage.getItem('accessToken');
        
        // ✅ Check for both user AND token
        if (storedUser && storedToken) {
          try {
            const user = JSON.parse(storedUser);
            state.user = user;
            state.isAuthenticated = true;
            state.initialized = true;
          } catch (error) {
            console.error('Failed to parse stored user:', error);
            state.initialized = true;
          }
        } else {
          state.initialized = true;
        }
      } else {
        state.initialized = true;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addMatcher(
        authApi.endpoints.login.matchFulfilled,
        (state, action) => {
          state.isAuthenticated = true;
          state.isLoading = false;
          state.error = null;
          state.initialized = true;
          if (action.payload?.data?.user) {
            state.user = action.payload.data.user;
            if (typeof window !== 'undefined') {
              localStorage.setItem('user', JSON.stringify(action.payload.data.user));
            }
          }
        }
      )
      .addMatcher(
        authApi.endpoints.login.matchRejected,
        (state, action: any) => {
          state.isLoading = false;
          state.initialized = true;
          state.error = action.error?.data?.message || 'Login failed';
        }
      )
      // Logout
      .addMatcher(
        authApi.endpoints.logout.matchFulfilled,
        (state) => {
          state.user = null;
          state.isAuthenticated = false;
          state.isLoading = false;
          state.isRefreshing = false;
          state.initialized = true;
          if (typeof window !== 'undefined') {
            localStorage.removeItem('accessToken');
            localStorage.removeItem('user');
            document.cookie = 'accessToken=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
          }
        }
      )
      // Get Me
      .addMatcher(
        authApi.endpoints.getMe.matchFulfilled,
        (state, action: PayloadAction<UserResponse>) => {
          state.user = action.payload;
          state.isAuthenticated = true;
          state.isLoading = false;
          state.isRefreshing = false;
          state.error = null;
          state.initialized = true;
          if (typeof window !== 'undefined') {
            localStorage.setItem('user', JSON.stringify(action.payload));
          }
        }
      )
      .addMatcher(
        authApi.endpoints.getMe.matchRejected,
        (state, action: any) => {
          // Only set loading false if it's not a 401
          if (action.error?.status !== 401) {
            state.isLoading = false;
          }
          state.isRefreshing = false;
          state.initialized = true;
          state.error = action.error?.data?.message || 'Failed to fetch user';
        }
      )
      // Refresh Token
      .addMatcher(
        authApi.endpoints.refreshToken.matchFulfilled,
        (state, action) => {
          state.isRefreshing = false;
          state.error = null;
          // Store new token if returned
          if (action.payload?.data?.accessToken && typeof window !== 'undefined') {
            localStorage.setItem('accessToken', action.payload.data.accessToken);
            document.cookie = `accessToken=${action.payload.data.accessToken}; path=/; max-age=86400; SameSite=Lax`;
          }
        }
      )
      .addMatcher(
        authApi.endpoints.refreshToken.matchPending,
        (state) => {
          state.isRefreshing = true;
        }
      )
      .addMatcher(
        authApi.endpoints.refreshToken.matchRejected,
        (state, action: any) => {
          state.isRefreshing = false;
          state.isAuthenticated = false;
          state.user = null;
          state.initialized = true;
          state.error = action.error?.data?.message || 'Session expired';
          if (typeof window !== 'undefined') {
            localStorage.removeItem('accessToken');
            localStorage.removeItem('user');
            document.cookie = 'accessToken=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
          }
        }
      );
  },
});

export const { 
  setUser, 
  setLoading, 
  setRefreshing, 
  setError, 
  logout, 
  setInitialized,
  hydrateUser 
} = authSlice.actions;

export default authSlice.reducer;