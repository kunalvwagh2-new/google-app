import React from 'react';
import {
  Home,
  Users,
  Landmark,
  ShieldCheck,
  Bookmark,
  BookOpen,
  Music,
  Calendar,
  Flame,
  Settings,
  Globe,
  LogOut,
  Sparkles,
  Share2,
  Lightbulb,
} from 'lucide-react';
import { User } from '../../types.ts';
import { SupportedLanguage } from '../../types/anant.ts';
import { Avatar } from '../ui/Avatar.tsx';

export interface NavItemConfig {
  id: string;
  path: string;
  labelEn: string;
  labelHi: string;
  labelMr: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string | number;
  highlight?: boolean;
}

export const UNIFIED_NAV_ITEMS: NavItemConfig[] = [
  {
    id: 'feed',
    path: '/',
    labelEn: 'Home',
    labelHi: 'होम',
    labelMr: 'मुखपृष्ठ',
    icon: Home,
  },
  {
    id: 'blogs',
    path: '/blogs',
    labelEn: 'Spiritual Blogs',
    labelHi: 'आध्यात्मिक ब्लॉग',
    labelMr: 'आध्यात्मिक ब्लॉग व दर्शन',
    icon: BookOpen,
    badge: 'New',
  },
  {
    id: 'friends',
    path: '/friends',
    labelEn: 'Friends',
    labelHi: 'मित्र',
    labelMr: 'मित्रमंडळी',
    icon: Users,
  },
  {
    id: 'temples',
    path: '/temples',
    labelEn: 'Temples',
    labelHi: 'मंदिर',
    labelMr: 'मंदिरे',
    icon: Landmark,
  },
  {
    id: 'trust_admin',
    path: '/trust-admin',
    labelEn: 'Temple admin',
    labelHi: 'मंदिर एडमिन',
    labelMr: 'मंदिर प्रशासन',
    icon: ShieldCheck,
    badge: 'Trust',
  },
  {
    id: 'saved',
    path: '/saved',
    labelEn: 'Saved posts',
    labelHi: 'सहेजे गए पोस्ट',
    labelMr: 'जतन केलेल्या पोस्ट',
    icon: Bookmark,
  },
  {
    id: 'media',
    path: '/library',
    labelEn: 'Spiritual library',
    labelHi: 'आध्यात्मिक पुस्तकालय',
    labelMr: 'आध्यात्मिक ग्रंथालय',
    icon: BookOpen,
  },
  {
    id: 'bhajans',
    path: '/bhajans',
    labelEn: 'Bhajans & stotras',
    labelHi: 'भजन व स्तोत्र',
    labelMr: 'भजने व स्तोत्रे',
    icon: Music,
  },
  {
    id: 'calendar',
    path: '/calendar',
    labelEn: 'Events calendar',
    labelHi: 'आयोजन कैलेंडर',
    labelMr: 'उत्सव दिनदर्शिका',
    icon: Calendar,
  },
  {
    id: 'rosary',
    path: '/jaap',
    labelEn: 'Jaap Mala',
    labelHi: 'जाप माला',
    labelMr: 'नामजप माळ',
    icon: Flame,
    badge: '108',
    highlight: true,
  },
  {
    id: 'feedback',
    path: '/feedback',
    labelEn: 'Feature Requirement & Feedback',
    labelHi: 'सुविधा मांग व फीडबैक',
    labelMr: 'वैशिष्ट्य मागणी व अभिप्राय',
    icon: Lightbulb,
    badge: 'Dev',
    highlight: true,
  },
];

interface DesktopSidebarProps {
  currentUser: User | null;
  activeTab: string;
  onSelectTab: (tab: string, path?: string) => void;
  language: SupportedLanguage;
  onLanguageChange: (lang: SupportedLanguage) => void;
  pendingRequestsCount?: number;
  onLogout?: () => void;
  onOpenShareModal?: () => void;
  className?: string;
}

export const DesktopSidebar: React.FC<DesktopSidebarProps> = ({
  currentUser,
  activeTab,
  onSelectTab,
  language,
  onLanguageChange,
  pendingRequestsCount = 0,
  onLogout,
  onOpenShareModal,
  className = '',
}) => {
  const getLocalizedLabel = (item: NavItemConfig) => {
    if (language === 'HI') return item.labelHi;
    if (language === 'MR') return item.labelMr;
    return item.labelEn;
  };

  return (
    <aside
      id="desktop-main-navigation-sidebar"
      className={`w-64 flex-shrink-0 flex flex-col h-[calc(100vh-4.25rem)] sticky top-16 bg-slate-950/80 backdrop-blur-md border-r border-slate-800/80 select-none ${className}`}
    >
      {/* 1. Header: Devotee Profile Capsule */}
      {currentUser && (
        <div className="p-3 shrink-0 border-b border-slate-800/60">
          <button
            onClick={() => onSelectTab('profile', '/profile')}
            className="w-full flex items-center gap-3 p-2.5 bg-slate-900/90 hover:bg-slate-900 border border-slate-800 hover:border-amber-500/40 rounded-2xl text-left transition-all group cursor-pointer"
          >
            <Avatar
              src={currentUser.profile.avatarUrl}
              name={currentUser.profile.displayName}
              size="md"
              statusIndicator="online"
            />
            <div className="overflow-hidden flex-1 min-w-0">
              <p className="font-bold text-xs text-slate-100 group-hover:text-amber-400 transition-colors truncate">
                {currentUser.profile.displayName}
              </p>
              <p className="text-[11px] text-amber-500/80 truncate">@{currentUser.username}</p>
            </div>
            <Sparkles className="w-3.5 h-3.5 text-amber-400 opacity-60 group-hover:opacity-100 transition-opacity" />
          </button>
        </div>
      )}

      {/* 2. Scrollable Middle Section: All Navigation Items Down to Jaap Mala */}
      <nav
        id="desktop-sidebar-nav-links"
        className="flex-1 overflow-y-auto min-h-0 py-3 px-3 space-y-1.5 scrollbar-thin scrollbar-thumb-slate-800 scrollbar-track-transparent"
      >
        <span className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
          {language === 'HI' ? 'नेविगेशन' : language === 'MR' ? 'नेव्हिगेशन' : 'Navigation'}
        </span>

        {UNIFIED_NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive =
            activeTab === item.id ||
            (item.id === 'rosary' && activeTab === 'jaap') ||
            (item.id === 'media' && activeTab === 'library');

          return (
            <button
              key={item.id}
              id={`nav-item-${item.id}`}
              onClick={() => onSelectTab(item.id, item.path)}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                isActive
                  ? 'bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-950/40'
                  : 'text-slate-300 hover:bg-slate-900 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-2.5 truncate">
                <Icon
                  className={`w-4 h-4 flex-shrink-0 ${
                    isActive ? 'text-slate-950 stroke-[2.5]' : item.highlight ? 'text-amber-400' : 'text-slate-400'
                  }`}
                />
                <span className="truncate">{getLocalizedLabel(item)}</span>
              </div>

              {item.id === 'friends' && pendingRequestsCount > 0 ? (
                <span className="px-1.5 py-0.5 text-[10px] font-bold text-slate-950 bg-amber-400 rounded-full">
                  {pendingRequestsCount}
                </span>
              ) : item.badge ? (
                <span
                  className={`px-1.5 py-0.5 text-[9px] font-bold rounded-md uppercase tracking-wider ${
                    isActive
                      ? 'bg-slate-950 text-amber-400'
                      : 'bg-slate-900 text-amber-400 border border-amber-500/20'
                  }`}
                >
                  {item.badge}
                </span>
              ) : null}
            </button>
          );
        })}
      </nav>

      {/* 3. Pinned Bottom Footer Section: Settings & Language Selector */}
      <div
        id="desktop-sidebar-pinned-footer"
        className="shrink-0 p-3 border-t border-slate-800/80 bg-slate-950/95 space-y-2 mt-auto"
      >
        {/* Settings item navigating to /settings */}
        <button
          id="desktop-nav-settings-btn"
          onClick={() => onSelectTab('settings', '/settings')}
          className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
            activeTab === 'settings'
              ? 'bg-amber-500 text-slate-950 font-bold shadow-md'
              : 'text-slate-300 hover:bg-slate-900 hover:text-white'
          }`}
        >
          <div className="flex items-center gap-2.5">
            <Settings
              className={`w-4 h-4 ${
                activeTab === 'settings' ? 'text-slate-950 stroke-[2.5]' : 'text-slate-400'
              }`}
            />
            <span>
              {language === 'HI' ? 'सेटिंग्स' : language === 'MR' ? 'सेटिंग्ज' : 'Settings'}
            </span>
          </div>
          <span className="text-[10px] text-slate-400 font-mono">/settings</span>
        </button>

        {/* Share Website / App Button */}
        {onOpenShareModal && (
          <button
            id="sidebar-share-app-btn"
            onClick={onOpenShareModal}
            className="w-full flex items-center justify-between px-3 py-2 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30 text-xs font-bold transition-all cursor-pointer shadow-sm group"
          >
            <div className="flex items-center gap-2">
              <Share2 className="w-4 h-4 text-amber-400 group-hover:scale-110 transition-transform" />
              <span>
                {language === 'HI'
                  ? 'मित्रों को शेयर करें'
                  : language === 'MR'
                  ? 'मित्र व परिवारास शेअर करा'
                  : 'Share App with Friends'}
              </span>
            </div>
            <Sparkles className="w-3 h-3 text-amber-400" />
          </button>
        )}

        {/* Language selector toggle (English · हिंदी · मराठी) */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-1.5 space-y-1">
          <div className="flex items-center gap-1.5 px-1.5 text-[10px] text-slate-400 font-semibold">
            <Globe className="w-3 h-3 text-amber-400" />
            <span>Language / भाषा</span>
          </div>

          <div className="grid grid-cols-3 gap-1 text-[11px]">
            <button
              id="lang-btn-en"
              onClick={() => onLanguageChange('EN')}
              className={`py-1 rounded-lg font-bold transition-all cursor-pointer text-center ${
                language === 'EN'
                  ? 'bg-amber-500 text-slate-950 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              English
            </button>
            <button
              id="lang-btn-hi"
              onClick={() => onLanguageChange('HI')}
              className={`py-1 rounded-lg font-bold transition-all cursor-pointer text-center ${
                language === 'HI'
                  ? 'bg-amber-500 text-slate-950 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              हिंदी
            </button>
            <button
              id="lang-btn-mr"
              onClick={() => onLanguageChange('MR')}
              className={`py-1 rounded-lg font-bold transition-all cursor-pointer text-center ${
                language === 'MR'
                  ? 'bg-amber-500 text-slate-950 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              मराठी
            </button>
          </div>
        </div>

        {/* Optional Sign Out Button */}
        {onLogout && (
          <button
            onClick={onLogout}
            className="w-full flex items-center justify-center gap-2 px-3 py-1.5 rounded-xl text-[11px] text-rose-400 hover:bg-rose-950/30 hover:text-rose-300 transition-colors cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>
              {language === 'HI' ? 'साइन आउट' : language === 'MR' ? 'बाहेर पडा' : 'Sign Out'}
            </span>
          </button>
        )}
      </div>
    </aside>
  );
};

export default DesktopSidebar;
