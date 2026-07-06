// admin-dashboard\src\app\(pages)\dashboard\components\Sidebar.tsx
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  Users, 
  BookOpen, 
  FileText, 
  Settings, 
  HelpCircle,
  LogOut,
  ChevronLeft,
  ChevronRight,
  ShoppingCart,
  Calendar,
  MessageSquare,
  FolderOpen,
  X,
  Files,
  BarChart3,
  Tag, // ✅ Changed from Tags to Tag (or keep Tags if you prefer)
  Hash // ✅ Alternative icon for categories
} from 'lucide-react';

interface SidebarProps {
  isCollapsed: boolean;
  setIsCollapsed: (value: boolean) => void;
  isMobileOpen: boolean;
  setIsMobileOpen: (value: boolean) => void;
}

const Sidebar = ({ 
  isCollapsed, 
  setIsCollapsed, 
  isMobileOpen, 
  setIsMobileOpen 
}: SidebarProps) => {
  const pathname = usePathname();

  // Close mobile sidebar on route change
  useEffect(() => {
    setIsMobileOpen(false);
  }, [pathname, setIsMobileOpen]);

  // Handle window resize for responsive behavior
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsMobileOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [setIsMobileOpen]);

  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', href: '/dashboard' },
    { icon: Users, label: 'Users', href: '/dashboard/users' },
    { icon: BookOpen, label: 'Courses', href: '/dashboard/courses' },
    { icon: FileText, label: 'Blogs', href: '/dashboard/blog' },
    { icon: Tag, label: 'Blog Category', href: '/dashboard/blog-category' }, // ✅ Changed to Tag
    { icon: Hash, label: 'Course Category', href: '/dashboard/course-categories' }, // ✅ Changed to Hash for variety
    // { icon: BarChart3, label: 'Analytics', href: '/dashboard/analytics' },
    { icon: Files, label: 'Manage File', href: '/dashboard/files' },
    // { icon: MessageSquare, label: 'Messages', href: '/dashboard/messages' },
    // { icon: FolderOpen, label: 'Projects', href: '/dashboard/projects' },
  ];

  const bottomItems = [
    { icon: Settings, label: 'Settings', href: '/dashboard/settings' },
    { icon: HelpCircle, label: 'Help', href: '/dashboard/help' },
  ];

  return (
    <>
      {/* Mobile overlay */}
      <div 
        className={`
          fixed inset-0 bg-black/50 z-40 transition-opacity duration-300 lg:hidden
          ${isMobileOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}
        `}
        onClick={() => setIsMobileOpen(false)}
      />

      <aside 
        className={`
          fixed lg:sticky top-0 h-screen bg-white border-r border-gray-200 
          transition-all duration-300 z-50 flex flex-col shadow-xl lg:shadow-none
          ${isCollapsed ? 'lg:w-20' : 'lg:w-64'}
          ${isMobileOpen 
            ? 'translate-x-0 w-72' 
            : '-translate-x-full lg:translate-x-0'
          }
        `}
      >
        {/* Mobile Close Button */}
        <button
          onClick={() => setIsMobileOpen(false)}
          className="lg:hidden absolute top-3 right-3 p-2 rounded-lg hover:bg-gray-100 transition-colors"
          aria-label="Close menu"
        >
          <X className="w-5 h-5 text-gray-500" />
        </button>

        {/* Logo */}
        <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200 flex-shrink-0">
          <Link href="/dashboard" className="flex items-center gap-2 min-w-0">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center flex-shrink-0">
              <span className="text-white font-bold text-sm">A</span>
            </div>
            {(!isCollapsed || isMobileOpen) && (
              <span className="text-lg font-bold text-gray-900 truncate">AdminPro</span>
            )}
          </Link>
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="hidden lg:flex p-1.5 rounded-lg hover:bg-gray-100 transition-colors flex-shrink-0"
            aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {isCollapsed ? (
              <ChevronRight className="w-4 h-4 text-gray-500" />
            ) : (
              <ChevronLeft className="w-4 h-4 text-gray-500" />
            )}
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-3 space-y-1">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`
                  flex items-center gap-3 px-3 py-3 rounded-lg transition-all
                  ${isActive 
                    ? 'bg-blue-50 text-blue-700 shadow-sm' 
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }
                  ${(isCollapsed && !isMobileOpen) ? 'justify-center' : ''}
                  active:scale-95
                `}
                title={isCollapsed && !isMobileOpen ? item.label : ''}
              >
                <item.icon className={`w-5 h-5 flex-shrink-0 ${isActive ? 'text-blue-700' : ''}`} />
                {(!isCollapsed || isMobileOpen) && (
                  <span className="text-sm font-medium truncate">{item.label}</span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Bottom Items */}
        <div className="border-t border-gray-200 p-3 space-y-1 flex-shrink-0">
          {bottomItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`
                flex items-center gap-3 px-3 py-3 rounded-lg transition-all
                text-gray-600 hover:bg-gray-50 hover:text-gray-900
                ${(isCollapsed && !isMobileOpen) ? 'justify-center' : ''}
                active:scale-95
              `}
              title={isCollapsed && !isMobileOpen ? item.label : ''}
            >
              <item.icon className="w-5 h-5 flex-shrink-0" />
              {(!isCollapsed || isMobileOpen) && (
                <span className="text-sm font-medium truncate">{item.label}</span>
              )}
            </Link>
          ))}
        </div>

        {/* Mobile Bottom Actions */}
        {isMobileOpen && (
          <div className="border-t border-gray-200 p-3 flex-shrink-0">
            <button className="w-full flex items-center gap-3 px-3 py-3 rounded-lg text-red-600 hover:bg-red-50 transition-all active:scale-95">
              <LogOut className="w-5 h-5 flex-shrink-0" />
              <span className="text-sm font-medium">Logout</span>
            </button>
          </div>
        )}
      </aside>
    </>
  );
};

export default Sidebar;