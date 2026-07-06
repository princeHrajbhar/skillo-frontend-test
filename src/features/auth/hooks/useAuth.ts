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
  hydrateUser 
} from '../slices/authSlice';

export const useAuth = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const pathname = usePathname();
  const { user, isAuthenticated, isLoading, isRefreshing, initialized } = useAppSelector((state) => state.auth);
  const [refreshAttempted, setRefreshAttempted] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  
  const [refreshToken, { isLoading: isRefreshingToken }] = useRefreshTokenMutation();
  const [logoutMutation] = useLogoutMutation();
  
  // Set mounted flag
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Check if we're on an auth page
  const isAuthPage = pathname?.startsWith('/login');

  // Check if we're on a protected page
  const isProtectedPage = pathname?.startsWith('/dashboard') || 
                          pathname?.startsWith('/profile') || 
                          pathname?.startsWith('/settings');

  // Hydrate user from localStorage on mount
  useEffect(() => {
    if (!initialized && isMounted) {
      dispatch(hydrateUser());
    }
  }, [dispatch, initialized, isMounted]);

  // Fetch user data - skip on auth pages or if already authenticated
  const { 
    data, 
    isLoading: queryLoading, 
    error, 
    refetch,
    isError,
    isFetching
  } = useGetMeQuery(undefined, {
    skip: !initialized || 
          !isMounted ||
          isAuthenticated || 
          isLoading || 
          isRefreshing || 
          isRefreshingToken ||
          isAuthPage, // Skip on auth pages
    refetchOnFocus: false,
    refetchOnReconnect: false,
    pollingInterval: 300000, // 5 minutes
  });

  // Handle refresh token - only on protected pages
  const handleRefresh = useCallback(async () => {
    // Don't try to refresh on auth pages
    if (isAuthPage) {
      console.log('⏭️ Skipping refresh on auth page');
      return false;
    }

    // Don't try to refresh if already attempted
    if (refreshAttempted) {
      console.log('⏭️ Refresh already attempted');
      return false;
    }

    try {
      dispatch(setRefreshing(true));
      setRefreshAttempted(true);
      
      console.log('🔄 Attempting to refresh token...');
      const result = await refreshToken().unwrap();
      
      console.log('✅ Refresh successful:', result);
      
      if (result?.data?.accessToken) {
        // Store new token
        if (typeof window !== 'undefined') {
          localStorage.setItem('accessToken', result.data.accessToken);
          document.cookie = `accessToken=${result.data.accessToken}; path=/; max-age=86400; SameSite=Lax`;
        }
        // Retry the getMe query
        console.log('🔄 Refetching user data...');
        await refetch();
        return true;
      }
      
      return false;
    } catch (error: any) {
      console.error('❌ Refresh failed:', error);
      
      // Clear everything on refresh failure
      if (typeof window !== 'undefined') {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('user');
        document.cookie = 'accessToken=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
      }
      dispatch(logout());
      
      // Redirect to login if on protected page
      if (isProtectedPage) {
        router.push('/login');
      }
      
      return false;
    } finally {
      dispatch(setRefreshing(false));
    }
  }, [dispatch, refreshToken, refetch, isAuthPage, isProtectedPage, router, refreshAttempted]);

  // Handle user data
  useEffect(() => {
    if (data && isMounted) {
      console.log('✅ User data fetched:', data);
      dispatch(setUser(data));
      setRefreshAttempted(false);
    }
  }, [data, dispatch, isMounted]);

  // Handle errors - only on protected pages
  useEffect(() => {
    if (isError && error && initialized && isMounted && !isAuthPage) {
      console.log('❌ GetMe error:', error);
      
      // Check if it's a 401 error
      if ('status' in error && error.status === 401) {
        // Try to refresh if not already attempted
        if (!refreshAttempted && !isRefreshing && !isRefreshingToken) {
          console.log('🔄 401 error, attempting to refresh...');
          handleRefresh();
        } else if (refreshAttempted) {
          console.log('❌ Refresh already attempted, logging out...');
          dispatch(logout());
          // Redirect to login
          router.push('/login');
        }
      } else {
        // For other errors, just set loading false
        console.error('❌ Other error:', error);
        dispatch(setLoading(false));
      }
    }
  }, [isError, error, dispatch, handleRefresh, refreshAttempted, isRefreshing, isRefreshingToken, initialized, isMounted, isAuthPage, router]);

  // Update loading state
  useEffect(() => {
    if (!queryLoading && !isRefreshing && initialized && isMounted) {
      dispatch(setLoading(false));
    }
  }, [queryLoading, isRefreshing, initialized, dispatch, isMounted]);

  // Handle logout
  const handleLogout = useCallback(async () => {
    try {
      console.log('🔄 Logging out...');
      await logoutMutation().unwrap();
      dispatch(logout());
      // Clear cookie
      if (typeof window !== 'undefined') {
        document.cookie = 'accessToken=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
        localStorage.removeItem('accessToken');
        localStorage.removeItem('user');
      }
      router.push('/login');
    } catch (error) {
      console.error('❌ Logout failed:', error);
      // Even if logout fails, clear local state
      dispatch(logout());
      router.push('/login');
    }
  }, [dispatch, logoutMutation, router]);

  // Determine if we should show loading
  const shouldShowLoading = (isLoading || isRefreshing || (!initialized && isMounted)) && isProtectedPage;

  return {
    user,
    isAuthenticated,
    isLoading: shouldShowLoading,
    isRefreshing,
    initialized: initialized && isMounted,
    logout: handleLogout,
    refetch,
    refreshToken: handleRefresh,
  };
};

export default useAuth;