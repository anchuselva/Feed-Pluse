import React, { useState } from 'react';
import {
  LayoutDashboard,
  MessageSquare,
  BarChart3,
  Menu,
  X,
  Moon,
  Sun,
  Sparkles
} from 'lucide-react';
import { Button } from './ui/Button';
import { useTheme } from './ThemeProvider';
import { cn } from '../lib/utils';

interface SidebarProps {
  activeTab: 'dashboard' | 'feedback' | 'analytics';
  onTabChange: (tab: 'dashboard' | 'feedback' | 'analytics') => void;
}

export function Sidebar({ activeTab, onTabChange }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false);
  const { theme, toggleTheme } = useTheme();

  const menuItems = [
    { id: 'dashboard' as const, label: 'Dashboard', icon: LayoutDashboard },
    { id: 'feedback' as const, label: 'Feedback', icon: MessageSquare },
    { id: 'analytics' as const, label: 'Analytics', icon: BarChart3 },
  ];

  return (
    <>
      {/* Mobile Overlay */}
      {!collapsed && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setCollapsed(true)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed left-0 top-0 z-50 h-full bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-r border-gray-200 dark:border-gray-800 transition-all duration-300",
          collapsed ? "-translate-x-full lg:translate-x-0 lg:w-20" : "w-64"
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-800">
          {!collapsed && (
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-lg shadow-indigo-500/50">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h1 className="font-bold text-gray-900 dark:text-white">FeedPulse</h1>
                <p className="text-xs text-gray-500 dark:text-gray-400">AI-Powered</p>
              </div>
            </div>
          )}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            {collapsed ? <Menu className="w-5 h-5" /> : <X className="w-5 h-5" />}
          </button>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className={cn(
                  "w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group",
                  isActive
                    ? "bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg shadow-indigo-500/50"
                    : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
                )}
              >
                <Icon
                  className={cn(
                    "w-5 h-5 transition-transform group-hover:scale-110",
                    isActive && "drop-shadow-lg"
                  )}
                />
                {!collapsed && (
                  <span className="font-medium">{item.label}</span>
                )}
                {isActive && !collapsed && (
                  <div className="ml-auto w-2 h-2 rounded-full bg-white" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Theme Toggle */}
        <div className="absolute bottom-6 left-0 right-0 px-4">
          <button
            onClick={toggleTheme}
            className={cn(
              "w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 group"
            )}
          >
            {theme === 'dark' ? (
              <Sun className="w-5 h-5 transition-transform group-hover:rotate-180 duration-500" />
            ) : (
              <Moon className="w-5 h-5 transition-transform group-hover:-rotate-12 duration-500" />
            )}
            {!collapsed && (
              <span className="font-medium">
                {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
              </span>
            )}
          </button>
        </div>
      </aside>

      {/* Mobile Menu Button */}
      <button
        onClick={() => setCollapsed(false)}
        className="fixed bottom-6 right-6 z-30 lg:hidden flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg shadow-indigo-500/50"
      >
        <Menu className="w-6 h-6" />
      </button>
    </>
  );
}
