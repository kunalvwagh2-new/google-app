import React, { useState } from 'react';
import {
  Menu,
  Search,
  Calendar,
  Bell,
  User as UserIcon,
  LogOut,
  ChevronDown,
  Sparkles,
  BookOpen,
  Music,
  Users,
  Landmark,
  X,
  Building2,
  Server,
  ShieldCheck,
  Phone,
  Share2,
  Lightbulb,
} from 'lucide-react';
import { User } from '../../types.ts';
import { SupportedLanguage } from '../../types/anant.ts';
import { mockDeities, mockTemples, mockMediaLibrary, mockPanchang } from '../../data/anantData.ts';

interface AnantTopNavProps {
  currentUser: User;
  onOpenDrawer: () => void;
  onOpenPanchang: () => void;
  onOpenNotifications: () => void;
  onOpenAuth: () => void;
  onLogout?: () => void;
  onOpenTrustRegister?: () => void;
  onOpenSuperAdminQueue?: () => void;
  onOpenDevOps?: () => void;
  onOpenShareModal?: () => void;
  unreadCount: number;
  language: SupportedLanguage;
  onLanguageChange: (lang: SupportedLanguage) => void;
  onNavigate?: (tab: string, itemData?: any) => void;
  searchQuery?: string;
  onSearchChange?: (q: string) => void;
}

export function AnantTopNav({
  currentUser,
  onOpenDrawer,
  onOpenPanchang,
  onOpenNotifications,
  onOpenAuth,
  onLogout = () => {},
  onOpenTrustRegister = () => {},
  onOpenSuperAdminQueue = () => {},
  onOpenDevOps = () => {},
  onOpenShareModal,
  unreadCount,
  language,
  onLanguageChange,
  onNavigate = () => {},
  searchQuery: externalSearchQuery,
  onSearchChange: externalOnSearchChange,
}: AnantTopNavProps) {
  const [internalSearchQuery, setInternalSearchQuery] = useState('');
  const searchQuery = externalSearchQuery !== undefined ? externalSearchQuery : internalSearchQuery;
  const setSearchQuery = externalOnSearchChange || setInternalSearchQuery;
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

  // Global search filtering across Gods, Temples, Books, Songs, Friends
  const searchResults = React.useMemo(() => {
    if (!searchQuery.trim()) return null;
    const q = searchQuery.toLowerCase();

    const deities = mockDeities.filter(
      (d) =>
        d.nameEn.toLowerCase().includes(q) ||
        d.nameMr.toLowerCase().includes(q) ||
        d.nameHi.toLowerCase().includes(q)
    );

    const temples = mockTemples.filter(
      (t) =>
        t.name.toLowerCase().includes(q) ||
        t.city.toLowerCase().includes(q) ||
        t.deityName.toLowerCase().includes(q)
    );

    const media = mockMediaLibrary.filter(
      (m) =>
        m.titleEn.toLowerCase().includes(q) ||
        m.titleMr.toLowerCase().includes(q) ||
        m.titleHi.toLowerCase().includes(q) ||
        m.category.toLowerCase().includes(q)
    );

    return { deities, temples, media };
  }, [searchQuery]);

  const hasResults =
    searchResults &&
    (searchResults.deities.length > 0 ||
      searchResults.temples.length > 0 ||
      searchResults.media.length > 0);

  return (
    <header className="sticky top-0 z-40 w-full bg-slate-950/95 backdrop-blur-md border-b border-slate-800/80 px-3 sm:px-6 py-2.5 transition-colors">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-2 sm:gap-4">
        {/* ========================================================= */}
        {/* LEFT TOP: Side Drawer Menu Icon & App Brand */}
        {/* ========================================================= */}
        <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
          <button
            id="anant-drawer-menu-btn"
            onClick={onOpenDrawer}
            aria-label="Open Side Drawer Navigation"
            className="p-2 rounded-2xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-amber-400 hover:border-amber-500/50 transition-all cursor-pointer group"
          >
            <Menu className="w-5 h-5 group-hover:scale-110 transition-transform" />
          </button>

          <button
            onClick={() => onNavigate('feed')}
            className="flex items-center gap-2 cursor-pointer text-left"
          >
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-amber-600 via-orange-500 to-amber-400 flex items-center justify-center shadow-lg shadow-amber-950/40 text-slate-950 font-black text-sm">
              ॐ
            </div>
            <div className="hidden sm:block">
              <span className="text-base font-black tracking-tight text-slate-100 flex items-center gap-1.5">
                Anant <span className="text-amber-400 font-serif text-sm">(अनंत)</span>
              </span>
              <p className="text-[10px] text-slate-400 tracking-wider font-medium">
                Spiritual Social Platform
              </p>
            </div>
          </button>
        </div>

        {/* ========================================================= */}
        {/* CENTER TOP: Global Search Bar (Gods, Temples, Books, Songs, Friends) */}
        {/* ========================================================= */}
        <div className="relative flex-1 max-w-xl mx-1 sm:mx-4">
          <div className="relative flex items-center">
            <Search className="w-4 h-4 absolute left-3.5 text-slate-400 pointer-events-none" />
            <input
              id="anant-global-search-input"
              type="text"
              placeholder={
                language === 'MR'
                  ? 'देव, मंदिरे, ग्रंथ, आरत्या, भजने शोधा...'
                  : language === 'HI'
                  ? 'भगवान, मंदिर, पुस्तकें, आरती, भजन खोजें...'
                  : 'Search Gods, Temples, Books, Songs, Friends...'
              }
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setIsSearchFocused(true)}
              className="w-full h-10 pl-9 sm:pl-10 pr-8 bg-slate-900/90 border border-slate-800 rounded-2xl text-xs sm:text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500/80 focus:border-amber-500/80 transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 text-slate-500 hover:text-slate-300 p-0.5"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Live Search Results Dropdown */}
          {isSearchFocused && searchQuery.trim().length > 0 && (
            <div className="absolute top-12 left-0 right-0 z-50 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden p-2 text-xs divide-y divide-slate-800/80">
              {hasResults ? (
                <>
                  {searchResults!.deities.length > 0 && (
                    <div className="py-2">
                      <span className="text-[10px] uppercase tracking-wider text-amber-400 font-bold px-3 flex items-center gap-1.5 mb-1">
                        <Sparkles className="w-3 h-3" /> Gods & Deities
                      </span>
                      {searchResults!.deities.map((d) => (
                        <div
                          key={d.id}
                          onClick={() => {
                            setIsSearchFocused(false);
                            setSearchQuery('');
                            onNavigate('deities', d);
                          }}
                          className="px-3 py-2 rounded-xl hover:bg-slate-800/60 cursor-pointer flex items-center justify-between text-slate-200"
                        >
                          <div className="flex items-center gap-2">
                            <img
                              src={d.iconUrl}
                              alt={d.nameEn}
                              className="w-7 h-7 rounded-lg object-cover"
                            />
                            <span className="font-semibold">{d.nameEn}</span>
                          </div>
                          <span className="text-[10px] text-slate-500">{d.associatedTemplesCount} Temples</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {searchResults!.temples.length > 0 && (
                    <div className="py-2">
                      <span className="text-[10px] uppercase tracking-wider text-orange-400 font-bold px-3 flex items-center gap-1.5 mb-1">
                        <Landmark className="w-3 h-3" /> Sacred Temples
                      </span>
                      {searchResults!.temples.map((t) => (
                        <div
                          key={t.id}
                          onClick={() => {
                            setIsSearchFocused(false);
                            setSearchQuery('');
                            onNavigate('temples', t);
                          }}
                          className="px-3 py-2 rounded-xl hover:bg-slate-800/60 cursor-pointer flex items-center justify-between text-slate-200"
                        >
                          <div>
                            <p className="font-semibold text-slate-100">{t.name}</p>
                            <p className="text-[10px] text-slate-400">
                              {t.city}, {t.state} • {t.deityName}
                            </p>
                          </div>
                          <span className="text-[10px] text-amber-400 bg-amber-950/60 px-2 py-0.5 rounded-md border border-amber-900/40">
                            Verified
                          </span>
                        </div>
                      ))}
                    </div>
                  )}

                  {searchResults!.media.length > 0 && (
                    <div className="py-2">
                      <span className="text-[10px] uppercase tracking-wider text-sky-400 font-bold px-3 flex items-center gap-1.5 mb-1">
                        <Music className="w-3 h-3" /> Sacred Media & Chaturmas Books
                      </span>
                      {searchResults!.media.map((m) => (
                        <div
                          key={m.id}
                          onClick={() => {
                            setIsSearchFocused(false);
                            setSearchQuery('');
                            onNavigate('media', m);
                          }}
                          className="px-3 py-2 rounded-xl hover:bg-slate-800/60 cursor-pointer flex items-center justify-between text-slate-200"
                        >
                          <div className="flex items-center gap-2">
                            {m.category === 'CHATURMAS_BOOK' ? (
                              <BookOpen className="w-4 h-4 text-amber-400" />
                            ) : (
                              <Music className="w-4 h-4 text-sky-400" />
                            )}
                            <div>
                              <p className="font-semibold text-slate-100">{m.titleEn}</p>
                              <p className="text-[10px] text-slate-400">{m.category} • {m.deityName}</p>
                            </div>
                          </div>
                          <span className="text-[10px] text-slate-500">{m.viewsCount.toLocaleString()} views</span>
                        </div>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <div className="p-4 text-center text-slate-500">
                  No matching spiritual records found for &ldquo;{searchQuery}&rdquo;.
                </div>
              )}
            </div>
          )}
        </div>

        {/* ========================================================= */}
        {/* RIGHT TOP: Date Panchang / Calendar Toggle, Notifications, Login/Logout */}
        {/* ========================================================= */}
        <div className="flex items-center gap-1.5 sm:gap-2.5 flex-shrink-0">
          {/* Language Selector Pill */}
          <div className="hidden md:flex items-center bg-slate-900 border border-slate-800 rounded-xl p-0.5 text-[11px] font-bold">
            <button
              onClick={() => onLanguageChange('EN')}
              className={`px-2 py-1 rounded-lg transition-colors cursor-pointer ${
                language === 'EN' ? 'bg-amber-500 text-slate-950' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              EN
            </button>
            <button
              onClick={() => onLanguageChange('MR')}
              className={`px-2 py-1 rounded-lg transition-colors cursor-pointer ${
                language === 'MR' ? 'bg-amber-500 text-slate-950' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              मराठी
            </button>
            <button
              onClick={() => onLanguageChange('HI')}
              className={`px-2 py-1 rounded-lg transition-colors cursor-pointer ${
                language === 'HI' ? 'bg-amber-500 text-slate-950' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              हिन्दी
            </button>
          </div>

          {/* Date Panchang / Small Calendar Toggle Button */}
          <button
            id="anant-panchang-toggle-btn"
            onClick={onOpenPanchang}
            title="View Daily Panchang & Shubh Muhurat"
            className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-2xl bg-slate-900 border border-slate-800 text-slate-200 hover:border-amber-500/50 hover:bg-slate-850 transition-all cursor-pointer group"
          >
            <Calendar className="w-4 h-4 text-amber-400 group-hover:scale-110 transition-transform" />
            <div className="hidden lg:block text-left">
              <span className="text-[11px] font-bold text-amber-400 block leading-tight">
                11 Sep • दशमी
              </span>
              <span className="text-[9px] text-slate-400 block leading-tight">
                सिद्धि योग
              </span>
            </div>
          </button>

          {/* Notifications Icon with Badge */}
          <button
            id="anant-notifications-btn"
            onClick={onOpenNotifications}
            aria-label="Notifications"
            className="relative p-2 rounded-2xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-amber-400 hover:border-amber-500/50 transition-all cursor-pointer"
          >
            <Bell className="w-4 h-4 sm:w-5 sm:h-5" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 min-w-4 h-4 px-1 rounded-full bg-orange-600 text-white text-[10px] font-bold flex items-center justify-center border-2 border-slate-950 animate-pulse">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Dedicated Jaap Mala Quick Access Button (Top Right Header) */}
          <button
            id="top-right-jaap-mala-btn"
            onClick={() => onNavigate('rosary')}
            title="Open 108 Jaap Mala Counter"
            className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-2xl bg-gradient-to-r from-amber-500/20 to-orange-500/20 hover:from-amber-500/30 hover:to-orange-500/30 border border-amber-500/40 text-amber-300 font-bold text-xs shadow-md transition-all cursor-pointer group"
          >
            <Sparkles className="w-4 h-4 text-amber-400 group-hover:rotate-12 transition-transform" />
            <span className="hidden sm:inline">१०८ Jaap Mala</span>
            <span className="sm:hidden font-mono text-[11px]">१०८</span>
          </button>

          {/* Login / Logout Profile Trigger */}
          <div className="relative">
            <button
              id="anant-profile-trigger-btn"
              onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
              className="flex items-center gap-1.5 p-1 sm:p-1.5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-colors cursor-pointer"
            >
              <img
                src={currentUser.profile.avatarUrl}
                alt={currentUser.profile.displayName}
                className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl object-cover border border-slate-700"
              />
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden sm:block" />
            </button>

            {/* Profile Dropdown */}
            {isProfileMenuOpen && (
              <div className="absolute right-0 top-12 z-50 w-60 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-2 text-xs divide-y divide-slate-800">
                <div className="px-3 py-2">
                  <p className="font-bold text-slate-100">{currentUser.profile.displayName}</p>
                  <p className="text-[10px] text-slate-400">@{currentUser.username}</p>
                  <span className="inline-block mt-1 text-[9px] font-bold uppercase tracking-wider bg-amber-950/60 text-amber-400 border border-amber-800/40 px-2 py-0.5 rounded-md">
                    Verified Devotee
                  </span>
                </div>

                <div className="py-1.5">
                  {/* Highlighted Jaap Mala Option in Profile Menu */}
                  <button
                    onClick={() => {
                      setIsProfileMenuOpen(false);
                      onNavigate('rosary');
                    }}
                    className="w-full text-left px-3 py-2.5 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/40 flex items-center justify-between text-amber-300 font-bold cursor-pointer transition-colors mb-1"
                  >
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-amber-400" />
                      <span>१०८ Jaap Mala Counter</span>
                    </div>
                    <span className="text-[9px] bg-amber-500 text-slate-950 font-black px-1.5 py-0.5 rounded-md">
                      Chant
                    </span>
                  </button>

                  {/* Feature Requirement and Feedback Option in Menu */}
                  <button
                    id="profile-feedback-btn"
                    onClick={() => {
                      setIsProfileMenuOpen(false);
                      onNavigate('feedback');
                    }}
                    className="w-full text-left px-3 py-2.5 rounded-xl bg-gradient-to-r from-amber-500/15 to-orange-500/15 hover:from-amber-500/25 hover:to-orange-500/25 border border-amber-500/40 flex items-center justify-between text-amber-300 font-bold cursor-pointer transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <Lightbulb className="w-4 h-4 text-amber-400" />
                      <span>Feature Requirement &amp; Feedback</span>
                    </div>
                    <span className="text-[9px] bg-amber-500 text-slate-950 font-black px-1.5 py-0.5 rounded-md">
                      Suggest
                    </span>
                  </button>

                  <button
                    onClick={() => {
                      setIsProfileMenuOpen(false);
                      onNavigate('profile');
                    }}
                    className="w-full text-left px-3 py-2 rounded-xl hover:bg-slate-800 flex items-center gap-2 text-slate-300 hover:text-slate-100 cursor-pointer"
                  >
                    <UserIcon className="w-3.5 h-3.5" /> View My Profile
                  </button>
                  <button
                    onClick={() => {
                      setIsProfileMenuOpen(false);
                      onNavigate('trust_admin');
                    }}
                    className="w-full text-left px-3 py-2 rounded-xl hover:bg-slate-800 flex items-center gap-2 text-amber-400 hover:text-amber-300 font-semibold cursor-pointer"
                  >
                    <Landmark className="w-3.5 h-3.5" /> Temple Trust Admin
                  </button>
                  <button
                    onClick={() => {
                      setIsProfileMenuOpen(false);
                      onOpenTrustRegister();
                    }}
                    className="w-full text-left px-3 py-2 rounded-xl hover:bg-slate-800 flex items-center gap-2 text-amber-300 hover:text-amber-200 cursor-pointer"
                  >
                    <Building2 className="w-3.5 h-3.5" /> Register Temple Trust (Tenant A)
                  </button>
                  <button
                    onClick={() => {
                      setIsProfileMenuOpen(false);
                      onOpenSuperAdminQueue();
                    }}
                    className="w-full text-left px-3 py-2 rounded-xl hover:bg-slate-800 flex items-center gap-2 text-emerald-400 hover:text-emerald-300 font-semibold cursor-pointer"
                  >
                    <ShieldCheck className="w-3.5 h-3.5" /> Super Admin Queue
                  </button>
                  <button
                    onClick={() => {
                      setIsProfileMenuOpen(false);
                      onOpenDevOps();
                    }}
                    className="w-full text-left px-3 py-2 rounded-xl hover:bg-slate-800 flex items-center gap-2 text-cyan-400 hover:text-cyan-300 cursor-pointer"
                  >
                    <Server className="w-3.5 h-3.5" /> DevOps &amp; Peak Autoscaler
                  </button>
                  <button
                    onClick={() => {
                      setIsProfileMenuOpen(false);
                      onOpenAuth();
                    }}
                    className="w-full text-left px-3 py-2 rounded-xl hover:bg-slate-800 flex items-center gap-2 text-orange-400 hover:text-orange-300 cursor-pointer"
                  >
                    <Phone className="w-3.5 h-3.5" /> Mobile OTP Sign In
                  </button>
                </div>

                {/* Below Login and Logout option */}
                <div className="pt-1.5 space-y-1">
                  <button
                    onClick={() => {
                      setIsProfileMenuOpen(false);
                      onLogout();
                    }}
                    className="w-full text-left px-3 py-2 rounded-xl hover:bg-rose-950/40 text-rose-400 hover:text-rose-300 flex items-center gap-2 cursor-pointer font-semibold"
                  >
                    <LogOut className="w-3.5 h-3.5" /> Logout / Switch Account
                  </button>

                  {/* Explicit Quick Jaap Mala below Logout */}
                  <button
                    onClick={() => {
                      setIsProfileMenuOpen(false);
                      onNavigate('rosary');
                    }}
                    className="w-full text-left px-3 py-2 rounded-xl bg-slate-950 hover:bg-amber-950/40 border border-slate-800 hover:border-amber-500/30 text-amber-400 flex items-center gap-2 cursor-pointer font-semibold"
                  >
                    <Sparkles className="w-3.5 h-3.5" /> Quick Jaap Mala Chanting
                  </button>

                  {/* Share Website / App option */}
                  {onOpenShareModal && (
                    <button
                      onClick={() => {
                        setIsProfileMenuOpen(false);
                        onOpenShareModal();
                      }}
                      className="w-full text-left px-3 py-2 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-300 flex items-center gap-2 cursor-pointer font-semibold"
                    >
                      <Share2 className="w-3.5 h-3.5 text-amber-400" /> Share App with Friends
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
