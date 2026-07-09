// src/features/auth/hooks/useAuth.ts
import { useEffect, useCallback, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '../../../redux/hooks';
import { useGetMeQuery, useLogoutMutation, useRefreshTokenMutation } from '../api/authApi';
import { 
  setUser, 
  setLoading, 
  logout, 
  setRefreshing,
  setInitialized,
  setError
} from '../slices/authSlice';

// Helper functions with SSR safety
const getToken = (): string | null => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('accessToken');
};

const getStoredUser = (): any | null => {
  if (typeof window === 'undefined') return null;
  try {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  } catch {
    return null;
  }
};

const clearAuthData = () => {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('accessToken');
  localStorage.removeItem('user');
  document.cookie = 'accessToken=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
};

export const useAuth = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const pathname = usePathname();
  const { user, isAuthenticated, isLoading, isRefreshing, initialized, error } = useAppSelector((state) => state.auth);
  const [refreshAttempted, setRefreshAttempted] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);
  const [refreshFailed, setRefreshFailed] = useState(false);
  
  const [refreshToken] = useRefreshTokenMutation();
  const [logoutMutation] = useLogoutMutation();
  
  // Set mounted flag - this runs only on client
  useEffect(() => {
    setIsMounted(true);
    console.log('🔍 useAuth: Component mounted on client');
    return () => setIsMounted(false);
  }, []);

  // Check if we're on an auth page
  const isAuthPage = pathname?.startsWith('/login') || pathname?.startsWith('/register');
  const isProtectedPage = pathname?.startsWith('/dashboard') || 
                          pathname?.startsWith('/profile') || 
                          pathname?.startsWith('/settings');

  // Hydrate user from localStorage on mount - client only
  useEffect(() => {
    if (!isMounted) return;
    
    console.log('🔄 Hydrating auth state...');
    const token = getToken();
    const storedUser = getStoredUser();
    
    console.log('🔍 Stored data:', { token: !!token, storedUser: !!storedUser });
    
    if (token && storedUser) {
      console.log('✅ Found stored auth data');
      try {
        dispatch(setUser(storedUser));
        setAuthChecked(true);
        console.log('✅ User set from storage:', storedUser);
      } catch (error) {
        console.error('❌ Failed to parse stored user:', error);
        clearAuthData();
        setAuthChecked(true);
      }
    } else {
      console.log('⏭️ No stored auth data found');
      setAuthChecked(true);
    }
  }, [dispatch, isMounted]);

  // Only fetch user data if we have a token and are on a protected page
  const { 
    data, 
    isLoading: queryLoading, 
    error: queryError, 
    refetch,
    isError,
    isSuccess,
  } = useGetMeQuery(undefined, {
    // Skip on server, on auth pages, or if no token
    skip: typeof window === 'undefined' ||
          !isMounted || 
          !authChecked ||
          isAuthPage || 
          !isProtectedPage ||
          isRefreshing ||
          !getToken() ||
          refreshFailed,
    refetchOnFocus: true,
    refetchOnReconnect: true,
    pollingInterval: 300000,
  });

  // Handle user data
  useEffect(() => {
    if (isSuccess && data && isMounted) {
      console.log('✅ User data fetched from API:', data);
      dispatch(setUser(data));
      setRefreshAttempted(false);
      setRefreshFailed(false);
      setAuthChecked(true);
    }
  }, [data, isSuccess, dispatch, isMounted]);

  // Handle errors
  useEffect(() => {
    if (!isMounted || !authChecked || isAuthPage) return;
    
    if (isError && queryError && isProtectedPage) {
      console.log('❌ GetMe error:', queryError);
      
      // Check if it's a 401 error
      const is401Error = typeof queryError === 'object' && 
        queryError !== null && 
        'status' in queryError && 
        queryError.status === 401;
      
      if (is401Error) {
        const token = getToken();
        console.log('🔍 401 error - Token exists?', !!token, 'Refresh attempted?', refreshAttempted);
        
        if (token && !refreshAttempted && !isRefreshing) {
          console.log('🔄 401 error, attempting to refresh...');
          handleRefreshToken();
        } else if (refreshAttempted || !token) {
          console.log('❌ No token or refresh failed, redirecting to login...');
          clearAuthData();
          dispatch(logout());
          if (typeof window !== 'undefined') {
            window.location.href = '/login';
          }
        }
      } else {
        dispatch(setLoading(false));
      }
    }
  }, [isError, queryError, dispatch, refreshAttempted, isRefreshing, isMounted, authChecked, isAuthPage, isProtectedPage]);

  // Set initialized when auth check is complete
  useEffect(() => {
    if (authChecked && isMounted) {
      console.log('✅ Auth check complete, setting initialized');
      dispatch(setInitialized(true));
      dispatch(setLoading(false));
    }
  }, [authChecked, isMounted, dispatch]);

  // Handle refresh token
  const handleRefreshToken = useCallback(async () => {
    if (typeof window === 'undefined') return false;
    
    if (isAuthPage) {
      console.log('⏭️ Skipping refresh on auth page');
      return false;
    }

    if (refreshAttempted) {
      console.log('⏭️ Refresh already attempted');
      return false;
    }

    const token = getToken();
    if (!token) {
      console.log('⏭️ No token to refresh');
      return false;
    }

    try {
      dispatch(setRefreshing(true));
      setRefreshAttempted(true);
      
      console.log('🔄 Attempting to refresh token...');
      const result = await refreshToken().unwrap();
      console.log('✅ Refresh result:', result);
      
      if (result?.data?.accessToken) {
        console.log('✅ Refresh successful, new token obtained');
        localStorage.setItem('accessToken', result.data.accessToken);
        document.cookie = `accessToken=${result.data.accessToken}; path=/; max-age=86400; SameSite=Lax`;
        
        // Refetch user data with new token
        await refetch();
        setRefreshFailed(false);
        return true;
      } else {
        console.log('❌ No token in refresh response');
        setRefreshFailed(true);
        clearAuthData();
        dispatch(logout());
        return false;
      }
    } catch (error: any) {
      console.error('❌ Refresh failed:', error);
      setRefreshFailed(true);
      clearAuthData();
      dispatch(logout());
      
      if (isProtectedPage && typeof window !== 'undefined') {
        window.location.href = '/login';
      }
      return false;
    } finally {
      dispatch(setRefreshing(false));
    }
  }, [dispatch, refreshToken, refetch, isAuthPage, isProtectedPage, refreshAttempted]);

  // Handle logout
  const handleLogout = useCallback(async () => {
    if (typeof window === 'undefined') return;
    
    try {
      await logoutMutation().unwrap();
    } catch (error) {
      console.error('❌ Logout failed:', error);
    } finally {
      clearAuthData();
      dispatch(logout());
      router.push('/login');
    }
  }, [dispatch, logoutMutation, router]);

  // Determine if we should show loading
  const shouldShowLoading = (isLoading || isRefreshing || !authChecked) && isProtectedPage && !refreshFailed;

  const finalState = {
    user,
    isAuthenticated: isMounted ? isAuthenticated && !!getToken() && !refreshFailed : false,
    isLoading: shouldShowLoading,
    isRefreshing,
    initialized: initialized && authChecked,
    error,
    logout: handleLogout,
    refetch,
    refreshToken: handleRefreshToken,
  };

  return finalState;
};

export default useAuth;