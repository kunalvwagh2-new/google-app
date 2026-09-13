import React from 'react';
import {
  Search,
  Bell,
  MessageCircle,
  Menu,
  ShieldCheck,
  Compass,
} from 'lucide-react';
import { User, Notification } from '../types.ts';
import { Avatar } from './ui/Avatar.tsx';
import { Button } from './ui/Button.tsx';

interface NavigationHeaderProps {
  currentUser: User | null;
  unreadCount: number;
  notifications: Notification[];
  onOpenNotifications: () => void;
  onOpenAuth: () => void;
  onSelectUser: (user: User) => void;
  availableUsers: User[];
  onSearchChange: (q: string) => void;
  onToggleSidebar?: () => void;
}

export const NavigationHeader: React.FC<NavigationHeaderProps> = ({
  currentUser,
  unreadCount,
  onOpenNotifications,
  onOpenAuth,
  onSelectUser,
  availableUsers,
  onSearchChange,
  onToggleSidebar,
}) => {
  const [searchVal, setSearchVal] = React.useState('');
  const [showUserSwitcher, setShowUserSwitcher] = React.useState(false);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchVal(e.target.value);
    onSearchChange(e.target.value);
  };

  return (
    <header className="sticky top-0 z-40 w-full h-16 bg-white/95 dark:bg-zinc-900/95 backdrop-blur-md border-b border-zinc-200/80 dark:border-zinc-800 transition-colors">
      <div className="max-w-7xl mx-auto h-full px-4 sm:px-6 flex items-center justify-between gap-4">
        {/* Left: Brand Identity & Mobile Menu Toggle */}
        <div className="flex items-center gap-3">
          <button
            onClick={onToggleSidebar}
            className="md:hidden p-2 rounded-xl text-zinc-600 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800"
            aria-label="Toggle navigation menu"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white font-bold shadow-xs">
              <Compass className="w-5 h-5" />
            </div>
            <div className="hidden sm:block leading-none">
              <span className="text-base font-bold tracking-tight text-zinc-900 dark:text-white">
                Social<span className="text-blue-600">Sync</span>
              </span>
              <span className="block text-[10px] font-medium text-zinc-400 dark:text-zinc-500">
                Modern Social Graph
              </span>
            </div>
          </div>
        </div>

        {/* Center: Global Search Input */}
        <div className="flex-1 max-w-md relative hidden sm:block">
          <div className="relative flex items-center">
            <Search className="w-4 h-4 absolute left-3.5 text-zinc-400 pointer-events-none" />
            <input
              type="search"
              value={searchVal}
              onChange={handleSearch}
              placeholder="Search posts, topics, or people..."
              className="w-full h-9 pl-9 pr-4 text-xs sm:text-sm bg-zinc-100 dark:bg-zinc-800 border-none rounded-full text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:ring-2 focus:ring-blue-600/30 transition-all outline-none"
            />
          </div>
        </div>

        {/* Right: Notification Hub & Switcher / User Profile */}
        <div className="flex items-center gap-2 sm:gap-3">
          {currentUser ? (
            <>
              <Button
                variant="ghost"
                size="icon"
                onClick={onOpenNotifications}
                className="relative text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full"
                aria-label="View notifications"
              >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 flex items-center justify-center w-4 h-4 text-[10px] font-bold text-white bg-rose-500 rounded-full ring-2 ring-white dark:ring-zinc-900">
                    {unreadCount}
                  </span>
                )}
              </Button>

              <Button
                variant="ghost"
                size="icon"
                className="hidden sm:flex text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full"
                aria-label="Direct Messages"
              >
                <MessageCircle className="w-5 h-5" />
              </Button>

              {/* User Selector Dropdown Simulation for Rapid Testing */}
              <div className="relative">
                <button
                  onClick={() => setShowUserSwitcher(!showUserSwitcher)}
                  className="flex items-center gap-2 p-1 rounded-full hover:ring-2 hover:ring-blue-600/20 transition-all"
                  aria-label="Switch profile session"
                >
                  <Avatar
                    src={currentUser.profile.avatarUrl}
                    name={currentUser.profile.displayName}
                    size="sm"
                    statusIndicator="online"
                  />
                  <div className="hidden lg:block text-left text-xs leading-tight">
                    <p className="font-semibold text-zinc-900 dark:text-zinc-100 flex items-center gap-1">
                      {currentUser.profile.displayName}
                      {currentUser.role === 'ADMIN' && (
                        <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
                      )}
                    </p>
                    <p className="text-zinc-400 text-[10px]">@{currentUser.username}</p>
                  </div>
                </button>

                {showUserSwitcher && (
                  <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-xl p-2 z-50 animate-in fade-in zoom-in-95">
                    <div className="px-3 py-1.5 border-b border-zinc-100 dark:border-zinc-800 mb-1">
                      <p className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400">
                        Switch Demo Persona
                      </p>
                    </div>
                    {availableUsers.map((user) => (
                      <button
                        key={user.id}
                        onClick={() => {
                          onSelectUser(user);
                          setShowUserSwitcher(false);
                        }}
                        className={`w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded-xl text-left text-xs transition-colors ${
                          user.id === currentUser.id
                            ? 'bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 font-semibold'
                            : 'hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300'
                        }`}
                      >
                        <Avatar src={user.profile.avatarUrl} name={user.profile.displayName} size="sm" />
                        <div className="truncate">
                          <p className="truncate">{user.profile.displayName}</p>
                          <p className="text-[10px] text-zinc-400">@{user.username}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </>
          ) : (
            <Button onClick={onOpenAuth} variant="primary" size="sm">
              Sign In
            </Button>
          )}
        </div>
      </div>
    </header>
  );
};
