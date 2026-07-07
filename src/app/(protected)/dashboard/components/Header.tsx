// admin-dashboard\src\app\(protected)\dashboard\components\Header.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Menu, 
  User, 
  ChevronDown,
  LogOut,
  Settings,
  HelpCircle,
  Shield,
  UserCircle,
  Loader2
} from 'lucide-react';
import { useAppSelector, useAppDispatch } from '../../../../redux/hooks';
import { useAuth } from '../../../../features/auth/hooks/useAuth';
import { setUser } from '../../../../features/auth/slices/authSlice';

interface HeaderProps {
  setIsMobileSidebarOpen: (value: boolean) => void;
}

const Header = ({ 
  setIsMobileSidebarOpen 
}: HeaderProps) => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { user, isLoading: authLoading } = useAppSelector((state) => state.auth);
  const { logout: logoutUser, isAuthenticated } = useAuth();
  
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  // Handle logout
  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await logoutUser();
      // Clear cookies
      document.cookie = 'accessToken=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
      localStorage.removeItem('accessToken');
      localStorage.removeItem('user');
      dispatch(setUser(null));
      router.push('/login');
      router.refresh();
    } catch (error) {
      console.error('Logout error:', error);
      // Even if logout fails, clear local state
      document.cookie = 'accessToken=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
      localStorage.removeItem('accessToken');
      localStorage.removeItem('user');
      dispatch(setUser(null));
      router.push('/login');
    } finally {
      setIsLoggingOut(false);
    }
  };

  const getUserInitials = () => {
    if (!user) return 'U';
    if (user.email) {
      return user.email.charAt(0).toUpperCase();
    }
    return 'U';
  };

  const getDisplayName = () => {
    if (!user) return 'User';
    if (user.email) {
      return user.email.split('@')[0];
    }
    return 'User';
  };

  // Close dropdown on ESC key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsDropdownOpen(false);
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, []);

  // Loading state
  if (authLoading) {
    return (
      <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-3 sm:px-4 md:px-6 flex-shrink-0">
        <div className="flex items-center gap-2 sm:gap-3 md:gap-4">
          <div className="hidden sm:block w-32 md:w-48 h-8 bg-gray-200 rounded-lg animate-pulse"></div>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse"></div>
          <div className="hidden sm:block w-20 h-4 bg-gray-200 rounded animate-pulse"></div>
        </div>
      </header>
    );
  }

  // If not authenticated, don't render full header
  if (!isAuthenticated) {
    return null;
  }

  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-3 sm:px-4 md:px-6 flex-shrink-0">
      {/* Left Section */}
      <div className="flex items-center gap-2 sm:gap-3 md:gap-4 min-w-0">
        {/* Hamburger Menu Button - Only visible on mobile */}
        <button
          onClick={() => setIsMobileSidebarOpen(true)}
          className="p-2 rounded-lg hover:bg-gray-100 transition-colors lg:hidden flex-shrink-0 active:scale-95"
          aria-label="Open sidebar menu"
        >
          <Menu className="w-5 h-5 text-gray-600" />
        </button>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-1 sm:gap-2 md:gap-3 flex-shrink-0">
        {/* User Profile */}
        <div className="relative">
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center gap-1 sm:gap-2 p-1.5 rounded-lg hover:bg-gray-100 transition-colors active:scale-95"
            aria-label="User menu"
          >
            <div className="w-7 h-7 sm:w-8 sm:h-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-center text-white font-medium text-xs sm:text-sm flex-shrink-0">
              {getUserInitials()}
            </div>
            <div className="hidden sm:block text-left min-w-0">
              <p className="text-xs sm:text-sm font-medium text-gray-700 truncate max-w-[60px] md:max-w-[100px]">
                {getDisplayName()}
              </p>
              <p className="text-[10px] sm:text-xs text-gray-400 capitalize flex items-center gap-1">
                <Shield className="w-2.5 h-2.5 sm:w-3 sm:h-3 flex-shrink-0" />
                <span className="truncate">{user?.role || 'User'}</span>
              </p>
            </div>
            <ChevronDown className={`w-3 h-3 sm:w-4 sm:h-4 text-gray-400 hidden sm:block flex-shrink-0 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} />
          </button>

          {/* Dropdown Menu */}
          {isDropdownOpen && (
            <>
              {/* Backdrop */}
              <div 
                className="fixed inset-0 z-40"
                onClick={() => setIsDropdownOpen(false)}
              />
              {/* Dropdown */}
              <div className="absolute right-0 mt-2 w-56 sm:w-64 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50 max-h-[90vh] overflow-y-auto animate-scaleIn">
                {/* User Info */}
                <div className="px-3 sm:px-4 py-3 border-b border-gray-100">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-9 h-9 sm:w-10 sm:h-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-center text-white font-medium text-xs sm:text-sm flex-shrink-0">
                      {getUserInitials()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs sm:text-sm font-medium text-gray-900 truncate">
                        {user?.email || 'user@example.com'}
                      </p>
                      <p className="text-[10px] sm:text-xs text-gray-500 truncate">
                        @{getDisplayName()}
                      </p>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-[10px] sm:text-xs text-gray-500">
                      <Shield className="w-2.5 h-2.5 sm:w-3 sm:h-3 flex-shrink-0" />
                      <span>Role: <span className="font-medium capitalize">{user?.role || 'User'}</span></span>
                    </div>
                    <div className="flex items-center gap-2 text-[10px] sm:text-xs text-gray-500">
                      <UserCircle className="w-2.5 h-2.5 sm:w-3 sm:h-3 flex-shrink-0" />
                      <span>ID: <span className="font-mono text-[10px] sm:text-xs truncate">{user?.userId || 'N/A'}</span></span>
                    </div>
                  </div>
                </div>
                
                {/* Menu Items */}
                <button className="w-full flex items-center gap-3 px-3 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm text-gray-700 hover:bg-gray-50 transition-colors active:bg-gray-100">
                  <User className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" />
                  Profile
                </button>
                <button className="w-full flex items-center gap-3 px-3 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm text-gray-700 hover:bg-gray-50 transition-colors active:bg-gray-100">
                  <Settings className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" />
                  Settings
                </button>
                <button className="w-full flex items-center gap-3 px-3 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm text-gray-700 hover:bg-gray-50 transition-colors active:bg-gray-100">
                  <HelpCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" />
                  Help & Support
                </button>
                
                {/* Logout */}
                <div className="border-t border-gray-100 mt-1 pt-1">
                  <button 
                    onClick={handleLogout}
                    disabled={isLoggingOut}
                    className="w-full flex items-center gap-3 px-3 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm text-red-600 hover:bg-red-50 transition-colors active:bg-red-100 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoggingOut ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 animate-spin flex-shrink-0" />
                        Logging out...
                      </>
                    ) : (
                      <>
                        <LogOut className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" />
                        Logout
                      </>
                    )}
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;