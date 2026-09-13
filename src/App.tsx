import React, { useState, useEffect } from 'react';
import { User, Post, Friendship, Notification, Comment, ReactionType, PostVisibility } from './types.ts';
import { mockUsers, mockPosts, mockFriendships, mockNotifications, mockComments } from './seedData.ts';
import { AnantTopNav } from './components/anant/AnantTopNav.tsx';
import { AnantBottomNav } from './components/anant/AnantBottomNav.tsx';
import { AnantSideDrawer } from './components/anant/AnantSideDrawer.tsx';
import { DesktopSidebar } from './components/navigation/sidebar.tsx';
import { PanchangModal } from './components/anant/PanchangModal.tsx';
import { CreatePostModal } from './components/anant/CreatePostModal.tsx';
import { DeityDirectoryView } from './components/anant/DeityDirectoryView.tsx';
import { MediaLibraryView } from './components/anant/MediaLibraryView.tsx';
import { TempleTrustAdminDashboard } from './components/anant/TempleTrustAdminDashboard.tsx';
import { ShortsReelsView } from './components/anant/ShortsReelsView.tsx';
import { TemplesDirectoryView } from './components/anant/TemplesDirectoryView.tsx';
import { JaapRosaryView } from './components/anant/JaapRosaryView.tsx';
import { SettingsView } from './components/anant/SettingsView.tsx';
import { SupabaseRbacView } from './components/anant/SupabaseRbacView.tsx';
import { MobileAuthModal } from './components/anant/MobileAuthModal.tsx';
import { TrustRegistrationModal } from './components/anant/TrustRegistrationModal.tsx';
import { SuperAdminVerificationQueueModal } from './components/anant/SuperAdminVerificationQueueModal.tsx';
import { DevOpsProductionModal } from './components/anant/DevOpsProductionModal.tsx';
import { BlogsView } from './components/anant/BlogsView.tsx';
import { ContinuousChantAudioPlayer } from './components/anant/ContinuousChantAudioPlayer.tsx';
import { ShareAppModal } from './components/anant/ShareAppModal.tsx';
import { FeatureFeedbackView } from './components/anant/FeatureFeedbackView.tsx';
import { PostCard } from './components/PostCard.tsx';
import { FriendsPanel } from './components/FriendsPanel.tsx';
import { ProfileView } from './components/ProfileView.tsx';
import { AdminPanel } from './components/AdminPanel.tsx';
import { Modal } from './components/ui/Modal.tsx';
import { Button } from './components/ui/Button.tsx';
import { Input } from './components/ui/Input.tsx';
import { Avatar } from './components/ui/Avatar.tsx';
import { SupportedLanguage, Deity, Temple, MediaItem, ChantTrack } from './types/anant.ts';
import { mockDeities, mockTemples, mockMediaLibrary, mockChantTracks } from './data/anantData.ts';
import {
  Sparkles,
  Search,
  CheckCheck,
  ShieldCheck,
  Radio,
  Flame,
  Plus,
  Landmark,
  Compass,
  Building2,
  Server,
  Phone,
  KeyRound,
  Bookmark,
  Music,
  Calendar as CalendarIcon,
  Globe,
  Settings,
  Clock,
  Sun,
  Moon,
} from 'lucide-react';

export function App() {
  // 1. Language State with LocalStorage Persistence
  const [language, setLanguage] = useState<SupportedLanguage>(() => {
    if (typeof window !== 'undefined') {
      try {
        const savedLang = localStorage.getItem('anant_language') as SupportedLanguage;
        if (savedLang && ['EN', 'MR', 'HI'].includes(savedLang)) return savedLang;
      } catch {}
    }
    return 'EN';
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('anant_language', language);
    }
  }, [language]);

  // 2. Application Core State with User Session Persistence
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [currentUser, setCurrentUser] = useState<User>(() => {
    if (typeof window !== 'undefined') {
      try {
        const savedUser = localStorage.getItem('anant_current_user');
        if (savedUser) {
          const parsed = JSON.parse(savedUser);
          const found = mockUsers.find((u) => u.id === parsed.id);
          return found || parsed;
        }
      } catch {}
    }
    return mockUsers[0];
  });

  useEffect(() => {
    if (typeof window !== 'undefined' && currentUser) {
      localStorage.setItem('anant_current_user', JSON.stringify(currentUser));
    }
  }, [currentUser]);

  const [posts, setPosts] = useState<Post[]>(mockPosts);
  const [comments, setComments] = useState<Record<string, Comment[]>>(mockComments);
  const [friendships, setFriendships] = useState<Friendship[]>(mockFriendships);
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);
  const [savedPostIds, setSavedPostIds] = useState<string[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('anant_saved_post_ids');
        if (saved) return JSON.parse(saved);
      } catch {}
    }
    return [mockPosts[0]?.id || ''];
  });

  const toggleSavePost = (postId: string) => {
    setSavedPostIds((prev) => {
      const next = prev.includes(postId) ? prev.filter((id) => id !== postId) : [...prev, postId];
      if (typeof window !== 'undefined') {
        localStorage.setItem('anant_saved_post_ids', JSON.stringify(next));
      }
      return next;
    });
  };

  // 3. Navigation State: 'feed' | 'shorts' | 'deities' | 'media' | 'temples' | 'rosary' | 'trust_admin' | 'friends' | 'profile' | 'admin' | 'settings' | 'saved' | 'bhajans' | 'calendar'
  const [activeTab, setActiveTab] = useState<string>('feed');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedProfileUser, setSelectedProfileUser] = useState<User | null>(null);

  // Selected item contexts for smooth drilldown
  const [selectedDeity, setSelectedDeity] = useState<Deity | undefined>(undefined);
  const [selectedMedia, setSelectedMedia] = useState<MediaItem | undefined>(undefined);

  // 4. Modals State
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isPanchangOpen, setIsPanchangOpen] = useState(false);
  const [isCreatePostOpen, setIsCreatePostOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isNotifModalOpen, setIsNotifModalOpen] = useState(false);
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [isTrustRegisterOpen, setIsTrustRegisterOpen] = useState(false);
  const [isSuperAdminQueueOpen, setIsSuperAdminQueueOpen] = useState(false);
  const [isDevOpsOpen, setIsDevOpsOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [activeBackgroundChant, setActiveBackgroundChant] = useState<MediaItem | null>(null);
  const [isBackgroundChantPlaying, setIsBackgroundChantPlaying] = useState(true);

  // Profile Edit State
  const [editBio, setEditBio] = useState(currentUser.profile.bio || '');
  const [editLocation, setEditLocation] = useState(currentUser.profile.location || '');
  const [editWebsite, setEditWebsite] = useState(currentUser.profile.websiteUrl || '');

  // URL Path Synchronization & Deep Linking
  const navigateTab = (tab: string, path?: string) => {
    setActiveTab(tab);
    if (tab === 'profile') setSelectedProfileUser(currentUser);
    if (typeof window !== 'undefined') {
      const pathMap: Record<string, string> = {
        feed: '/',
        blogs: '/blogs',
        rosary: '/jaap',
        settings: '/settings',
        friends: '/friends',
        temples: '/temples',
        trust_admin: '/trust-admin',
        saved: '/saved',
        media: '/library',
        bhajans: '/bhajans',
        calendar: '/calendar',
        shorts: '/shorts',
        deities: '/deities',
        rbac: '/rbac',
        admin: '/admin',
        profile: '/profile',
        feedback: '/feedback',
      };
      const targetPath = path || pathMap[tab] || `/${tab}`;
      if (window.location.pathname !== targetPath) {
        window.history.pushState(null, '', targetPath);
      }
    }
  };

  useEffect(() => {
    const handlePopState = () => {
      if (typeof window === 'undefined') return;
      const path = window.location.pathname.toLowerCase();
      if (path === '/settings') setActiveTab('settings');
      else if (path === '/blogs') setActiveTab('blogs');
      else if (path === '/jaap' || path === '/rosary') setActiveTab('rosary');
      else if (path === '/feedback') setActiveTab('feedback');
      else if (path === '/friends') setActiveTab('friends');
      else if (path === '/temples') setActiveTab('temples');
      else if (path === '/trust-admin' || path === '/trust_admin') setActiveTab('trust_admin');
      else if (path === '/saved') setActiveTab('saved');
      else if (path === '/library' || path === '/media') setActiveTab('media');
      else if (path === '/bhajans') setActiveTab('bhajans');
      else if (path === '/calendar') setActiveTab('calendar');
      else if (path === '/shorts') setActiveTab('shorts');
      else if (path === '/deities') setActiveTab('deities');
      else if (path === '/rbac') setActiveTab('rbac');
      else if (path === '/admin') setActiveTab('admin');
      else if (path === '/profile') setActiveTab('profile');
      else if (path === '/' || path === '/feed') setActiveTab('feed');
    };

    handlePopState();
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Computed Values
  const unreadCount = notifications.filter((n) => !n.isRead && n.recipientId === currentUser.id).length;

  const currentFriendships = friendships.filter(
    (f) =>
      (f.requesterId === currentUser.id || f.addresseeId === currentUser.id) &&
      f.status === 'ACCEPTED'
  );
  const currentFriendIds = currentFriendships.map((f) =>
    f.requesterId === currentUser.id ? f.addresseeId : f.requesterId
  );
  const connectedFriends = users.filter((u) => currentFriendIds.includes(u.id));

  const pendingRequests = friendships
    .filter((f) => f.addresseeId === currentUser.id && f.status === 'PENDING')
    .map((f) => ({
      ...f,
      requester: users.find((u) => u.id === f.requesterId),
    }));

  const suggestedUsers = users.filter(
    (u) => u.id !== currentUser.id && !currentFriendIds.includes(u.id) && u.status === 'ACTIVE'
  );

  // Filter Posts by Global Search or Tab
  const filteredPosts = posts.filter((post) => {
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        post.content.toLowerCase().includes(q) ||
        post.author.displayName.toLowerCase().includes(q) ||
        post.author.username.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const savedPostsList = posts.filter((p) => savedPostIds.includes(p.id));

  // Post Actions
  const handleCreatePost = (postData: {
    content: string;
    mediaUrls: string[];
    visibility: PostVisibility;
    templeTag?: string;
    deityTag?: string;
  }) => {
    const newPost: Post = {
      id: `post_${Date.now().toString(36)}`,
      authorId: currentUser.id,
      content: postData.content,
      mediaUrls: postData.mediaUrls,
      visibility: postData.visibility,
      reactionsCount: 0,
      commentsCount: 0,
      sharesCount: 0,
      isPinned: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      author: {
        id: currentUser.id,
        username: currentUser.username,
        displayName: currentUser.profile.displayName,
        avatarUrl: currentUser.profile.avatarUrl,
        role: currentUser.role,
      },
    };

    setPosts([newPost, ...posts]);
    setUsers((prev) =>
      prev.map((u) =>
        u.id === currentUser.id
          ? {
              ...u,
              profile: { ...u.profile, postsCount: u.profile.postsCount + 1 },
            }
          : u
      )
    );
  };

  const handleReact = (postId: string, reactionType: ReactionType) => {
    setPosts((prev) =>
      prev.map((p) => {
        if (p.id !== postId) return p;
        const currentReaction = p.userReaction;
        if (currentReaction === reactionType) {
          return {
            ...p,
            userReaction: undefined,
            reactionsCount: Math.max(0, p.reactionsCount - 1),
          };
        }
        return {
          ...p,
          userReaction: reactionType,
          reactionsCount: currentReaction ? p.reactionsCount : p.reactionsCount + 1,
        };
      })
    );
  };

  const handleAddComment = (postId: string, content: string) => {
    const newComment: Comment = {
      id: `comment_${Date.now().toString(36)}`,
      postId,
      authorId: currentUser.id,
      content,
      reactionsCount: 0,
      createdAt: new Date().toISOString(),
      author: {
        id: currentUser.id,
        username: currentUser.username,
        displayName: currentUser.profile.displayName,
        avatarUrl: currentUser.profile.avatarUrl,
      },
    };

    setComments((prev) => ({
      ...prev,
      [postId]: [...(prev[postId] || []), newComment],
    }));

    setPosts((prev) =>
      prev.map((p) => (p.id === postId ? { ...p, commentsCount: p.commentsCount + 1 } : p))
    );
  };

  const handleDeletePost = (postId: string) => {
    setPosts((prev) => prev.filter((p) => p.id !== postId));
  };

  const handleSendFriendRequest = (targetUserId: string) => {
    const newFriendship: Friendship = {
      id: `fr_${Date.now().toString(36)}`,
      requesterId: currentUser.id,
      addresseeId: targetUserId,
      status: 'PENDING',
      createdAt: new Date().toISOString(),
    };
    setFriendships((prev) => [...prev, newFriendship]);
  };

  const handleAcceptRequest = (friendshipId: string) => {
    setFriendships((prev) =>
      prev.map((f) => (f.id === friendshipId ? { ...f, status: 'ACCEPTED' as const } : f))
    );
  };

  const handleDeclineRequest = (friendshipId: string) => {
    setFriendships((prev) => prev.filter((f) => f.id !== friendshipId));
  };

  const handleMarkNotificationsRead = () => {
    setNotifications((prev) =>
      prev.map((n) => (n.recipientId === currentUser.id ? { ...n, isRead: true } : n))
    );
  };

  const handleSaveProfile = () => {
    setCurrentUser((prev) => ({
      ...prev,
      profile: {
        ...prev.profile,
        bio: editBio,
        location: editLocation,
        websiteUrl: editWebsite,
      },
    }));
    setIsEditProfileOpen(false);
  };

  // Switch to specific deity darshan
  const handleSelectDeity = (deity: Deity) => {
    setSelectedDeity(deity);
    navigateTab('rosary', '/jaap');
  };

  // Switch to media
  const handleSelectMedia = (item: MediaItem) => {
    setSelectedMedia(item);
    navigateTab('media', '/library');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-amber-500/30 selection:text-amber-200">
      {/* 1. TOP NAVIGATION BAR */}
      <AnantTopNav
        currentUser={currentUser}
        unreadCount={unreadCount}
        onOpenDrawer={() => setIsDrawerOpen(true)}
        onOpenPanchang={() => setIsPanchangOpen(true)}
        onOpenNotifications={() => {
          setIsNotifModalOpen(true);
          handleMarkNotificationsRead();
        }}
        onOpenAuth={() => setIsAuthModalOpen(true)}
        onOpenTrustRegister={() => setIsTrustRegisterOpen(true)}
        onOpenSuperAdminQueue={() => setIsSuperAdminQueueOpen(true)}
        onOpenDevOps={() => setIsDevOpsOpen(true)}
        onOpenShareModal={() => setIsShareModalOpen(true)}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        language={language}
        onLanguageChange={setLanguage}
        onNavigate={(tab) => navigateTab(tab)}
        onLogout={() => setIsAuthModalOpen(true)}
      />

      {/* 2. MOBILE SIDE DRAWER NAVIGATION */}
      <AnantSideDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        activeTab={activeTab}
        onSelectTab={(tab) => navigateTab(tab)}
        currentUser={currentUser}
        language={language}
        onLanguageChange={setLanguage}
        onOpenPanchang={() => setIsPanchangOpen(true)}
        onOpenAuth={() => setIsAuthModalOpen(true)}
        onOpenTrustRegister={() => setIsTrustRegisterOpen(true)}
        onOpenSuperAdminQueue={() => setIsSuperAdminQueueOpen(true)}
        onOpenDevOps={() => setIsDevOpsOpen(true)}
        onOpenShareModal={() => setIsShareModalOpen(true)}
      />

      {/* 3. MAIN APPLICATION CONTAINER WITH DESKTOP SIDEBAR */}
      <div className="w-full flex-1 flex justify-center">
        <div className="w-full max-w-7xl flex">
          {/* DESKTOP NAVIGATION SIDEBAR (Pinned on desktop viewports) */}
          <div className="hidden lg:block shrink-0">
            <DesktopSidebar
              currentUser={currentUser}
              activeTab={activeTab}
              onSelectTab={(tab, path) => navigateTab(tab, path)}
              language={language}
              onLanguageChange={setLanguage}
              pendingRequestsCount={pendingRequests.length}
              onLogout={() => setIsAuthModalOpen(true)}
              onOpenShareModal={() => setIsShareModalOpen(true)}
            />
          </div>

          {/* MAIN CONTENT WORKSPACE */}
          <main className="flex-1 min-w-0 px-3 sm:px-6 py-6 pb-24 md:pb-12">
            {/* Tab 1: Community Newsfeed */}
            {activeTab === 'feed' && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                <div className="lg:col-span-8 space-y-5">
                  {/* Devotee Quick Post Box Trigger */}
                  <div
                    onClick={() => setIsCreatePostOpen(true)}
                    className="bg-slate-900/90 border border-slate-800 hover:border-slate-700 rounded-3xl p-4 shadow-xl flex items-center gap-3 cursor-pointer transition-all"
                  >
                    <img
                      src={currentUser.profile.avatarUrl}
                      alt={currentUser.profile.displayName}
                      className="w-10 h-10 rounded-full object-cover border border-amber-500/40"
                    />
                    <div className="flex-1 bg-slate-950 border border-slate-800/80 rounded-2xl px-4 py-2.5 text-xs text-slate-400">
                      Share a sacred darshan photo, shloka, or temple announcement...
                    </div>
                    <button className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-md">
                      <Plus className="w-4 h-4" /> Post
                    </button>
                  </div>

                  {/* Active Search Notice */}
                  {searchQuery && (
                    <div className="flex items-center justify-between p-3.5 bg-amber-950/40 rounded-2xl border border-amber-800/60 text-xs text-amber-300">
                      <span className="flex items-center gap-1.5">
                        <Search className="w-3.5 h-3.5" />
                        Searching for: <strong>"{searchQuery}"</strong>
                      </span>
                      <button
                        onClick={() => setSearchQuery('')}
                        className="hover:underline font-bold cursor-pointer"
                      >
                        Clear Filter
                      </button>
                    </div>
                  )}

                  {/* Devotee & Temple Posts Feed */}
                  {filteredPosts.length === 0 ? (
                    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-10 text-center space-y-2">
                      <p className="font-bold text-slate-300">No spiritual posts found</p>
                      <p className="text-xs text-slate-500">
                        Be the first to share an auspicious moment or darshan.
                      </p>
                    </div>
                  ) : (
                    filteredPosts.map((post) => (
                      <div key={post.id} className="relative">
                        <PostCard
                          post={post}
                          currentUser={currentUser}
                          comments={comments[post.id] || []}
                          onReact={handleReact}
                          onAddComment={handleAddComment}
                          onDeletePost={handleDeletePost}
                        />
                        <button
                          onClick={() => toggleSavePost(post.id)}
                          title={savedPostIds.includes(post.id) ? 'Saved' : 'Save post'}
                          className={`absolute top-4 right-4 p-1.5 rounded-lg border transition-all cursor-pointer ${
                            savedPostIds.includes(post.id)
                              ? 'bg-amber-500/20 border-amber-500 text-amber-400'
                              : 'bg-slate-950/60 border-slate-800 text-slate-500 hover:text-slate-300'
                          }`}
                        >
                          <Bookmark className="w-3.5 h-3.5 fill-current" />
                        </button>
                      </div>
                    ))
                  )}
                </div>

                {/* Right Quick Hub Sidebar */}
                <div className="lg:col-span-4 space-y-5 hidden lg:block">
                  {/* Daily Panchang Quick Widget */}
                  <div
                    onClick={() => setIsPanchangOpen(true)}
                    className="bg-gradient-to-br from-amber-950/40 to-slate-900 border border-amber-800/50 rounded-3xl p-5 shadow-xl space-y-3 cursor-pointer hover:border-amber-500/60 transition-all"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold tracking-wider uppercase text-amber-400">
                        Daily Vedic Panchang
                      </span>
                      <span className="text-[10px] bg-amber-500 text-slate-950 font-bold px-2 py-0.5 rounded-full">
                        Auspicious Tithi
                      </span>
                    </div>
                    <div>
                      <p className="text-base font-bold text-slate-100">भाद्रपद शुक्ल दशमी</p>
                      <p className="text-xs text-slate-400">सिद्धि योग • विशाखा नक्षत्र</p>
                    </div>
                    <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
                      <span>Shubh Muhurat: 11:42 AM</span>
                      <span className="text-amber-400 font-bold">Open Calendar →</span>
                    </div>
                  </div>

                  {/* Jaap Mala Quick Widget in Right Sidebar */}
                  <div
                    id="right-sidebar-jaap-mala-widget"
                    onClick={() => navigateTab('rosary', '/jaap')}
                    className="bg-gradient-to-br from-amber-950/50 via-slate-900 to-slate-950 border border-amber-600/50 rounded-3xl p-5 shadow-xl space-y-3 cursor-pointer hover:border-amber-400 transition-all group"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="p-1.5 bg-amber-500/20 text-amber-400 rounded-xl">
                          <Sparkles className="w-4 h-4" />
                        </span>
                        <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
                          १०८ Jaap Mala Counter
                        </span>
                      </div>
                      <span className="text-[10px] font-mono font-black bg-amber-500 text-slate-950 px-2 py-0.5 rounded-full">
                        Active Sadhana
                      </span>
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-100 font-serif">
                        हरे कृष्ण • ॐ नमः शिवाय • गायत्री
                      </p>
                      <p className="text-xs text-slate-400">
                        Chant with temple bell sound, multi-malas, custom shlokas &amp; God photos
                      </p>
                    </div>
                    <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs text-amber-400 font-bold">
                      <span>Open Jaap Rosary</span>
                      <span className="group-hover:translate-x-1 transition-transform">→</span>
                    </div>
                  </div>

                  {/* Persona Switcher for Verification & Testing */}
                  <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-300">Switch Devotee Persona</span>
                      <span className="text-[10px] text-amber-500 font-mono">Live Demo</span>
                    </div>
                    <p className="text-xs text-slate-400">
                      Currently viewing as <strong>{currentUser.profile.displayName}</strong>:
                    </p>
                    <div className="grid grid-cols-2 gap-2">
                      {users.map((u) => (
                        <button
                          key={u.id}
                          onClick={() => {
                            setCurrentUser(u);
                            if (activeTab === 'profile') setSelectedProfileUser(u);
                          }}
                          className={`px-3 py-2 rounded-xl text-xs font-semibold text-left transition-all cursor-pointer truncate ${
                            u.id === currentUser.id
                              ? 'bg-amber-500 text-slate-950 font-bold'
                              : 'bg-slate-950 text-slate-300 border border-slate-800 hover:border-slate-700'
                          }`}
                        >
                          {u.profile.displayName.split(' ')[0]} ({u.role.slice(0, 3)})
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Quick Shortcuts */}
                  <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-2">
                    <span className="text-xs font-bold text-slate-300 block mb-2">Sacred Portals &amp; Operations</span>
                    <button
                      onClick={() => navigateTab('rosary', '/jaap')}
                      className="w-full text-left p-3 rounded-2xl bg-slate-950 border border-slate-800 hover:border-amber-500/40 text-xs text-amber-300 font-bold flex items-center justify-between cursor-pointer"
                    >
                      <span className="flex items-center gap-2">
                        <Flame className="w-4 h-4 text-amber-500" /> 108 Jaap Mala Rosary
                      </span>
                      <span className="text-[10px] text-slate-500">Sadhana Counter</span>
                    </button>
                    <button
                      onClick={() => navigateTab('trust_admin', '/trust-admin')}
                      className="w-full text-left p-3 rounded-2xl bg-slate-950 border border-slate-800 hover:border-amber-500/40 text-xs text-amber-300 font-bold flex items-center justify-between cursor-pointer"
                    >
                      <span className="flex items-center gap-2">
                        <ShieldCheck className="w-4 h-4 text-emerald-400" /> Temple Trust Admin
                      </span>
                      <span className="text-[10px] text-slate-500">5 Seats RBAC</span>
                    </button>
                    <button
                      onClick={() => navigateTab('settings', '/settings')}
                      className="w-full text-left p-3 rounded-2xl bg-slate-950 border border-slate-800 hover:border-amber-500/40 text-xs text-slate-200 font-bold flex items-center justify-between cursor-pointer"
                    >
                      <span className="flex items-center gap-2">
                        <Settings className="w-4 h-4 text-amber-400" /> Settings &amp; Preferences
                      </span>
                      <span className="text-[10px] text-slate-500">/settings</span>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Tab: Spiritual Blogs, Gurus & Daily Deity Darshan Feeds */}
            {activeTab === 'blogs' && (
              <BlogsView
                language={language}
                onStartChant={(chant) => {
                  setActiveBackgroundChant(chant);
                  setIsBackgroundChantPlaying(true);
                }}
                onOpenJaapMala={() => navigateTab('rosary', '/jaap')}
                onOpenDarshan={() => navigateTab('temples', '/temples')}
                onOpenShareModal={() => setIsShareModalOpen(true)}
              />
            )}

            {/* Tab 2: Shorts / Reels */}
            {activeTab === 'shorts' && <ShortsReelsView language={language} />}

            {/* Tab 3: Deity-Centric Directory */}
            {activeTab === 'deities' && (
              <DeityDirectoryView
                language={language}
                onSelectDeity={handleSelectDeity}
                onSelectMedia={handleSelectMedia}
              />
            )}

            {/* Tab 4: Devotional Media & Chaturmas Library */}
            {activeTab === 'media' && (
              <MediaLibraryView
                initialItem={selectedMedia}
                language={language}
                onStartBackgroundChant={(media) => {
                  setActiveBackgroundChant(media);
                  setIsBackgroundChantPlaying(true);
                }}
              />
            )}

            {/* Tab 5: Temples Directory & Following List */}
            {activeTab === 'temples' && (
              <TemplesDirectoryView
                language={language}
                onSelectTemple={(t) => {
                  navigateTab('feed', '/');
                  setSearchQuery(t.name);
                }}
                onOpenLiveDarshan={() => {
                  navigateTab('media', '/library');
                }}
              />
            )}

            {/* Tab 6: 108 Beads Jaap Mala Rosary (Upgraded with Goals & Reminders) */}
            {(activeTab === 'rosary' || activeTab === 'jaap') && (
              <JaapRosaryView
                initialDeity={selectedDeity}
                currentUserId={currentUser.id}
                currentUserName={currentUser.profile.displayName}
                onPublishToFeed={(content) => {
                  handleCreatePost({
                    content,
                    mediaUrls: [],
                    visibility: 'PUBLIC' as PostVisibility,
                  });
                  navigateTab('feed', '/');
                }}
                onBackToHome={() => navigateTab('feed', '/')}
              />
            )}

            {/* Tab 7: Temple Trust Admin Dashboard */}
            {activeTab === 'trust_admin' && <TempleTrustAdminDashboard />}

            {/* Tab 8: Friends & Devotees */}
            {activeTab === 'friends' && (
              <div className="max-w-2xl mx-auto">
                <FriendsPanel
                  currentUser={currentUser}
                  friends={connectedFriends}
                  pendingRequests={pendingRequests}
                  suggestedUsers={suggestedUsers}
                  onAcceptRequest={handleAcceptRequest}
                  onDeclineRequest={handleDeclineRequest}
                  onSendRequest={handleSendFriendRequest}
                />
              </div>
            )}

            {/* Tab 9: Devotee Profile */}
            {activeTab === 'profile' && (
              <div className="max-w-3xl mx-auto">
                <ProfileView
                  user={selectedProfileUser || currentUser}
                  currentUser={currentUser}
                  posts={posts}
                  comments={comments}
                  onReact={handleReact}
                  onAddComment={handleAddComment}
                  onDeletePost={handleDeletePost}
                  onEditProfile={() => {
                    setEditBio(currentUser.profile.bio || '');
                    setEditLocation(currentUser.profile.location || '');
                    setEditWebsite(currentUser.profile.websiteUrl || '');
                    setIsEditProfileOpen(true);
                  }}
                />
              </div>
            )}

            {/* Tab 10: Super Admin Console */}
            {activeTab === 'admin' && (
              <div className="max-w-4xl mx-auto">
                <AdminPanel
                  users={users}
                  posts={posts}
                  onDeletePost={handleDeletePost}
                  onToggleUserStatus={(uId) =>
                    setUsers((prev) =>
                      prev.map((u) =>
                        u.id === uId
                          ? { ...u, status: u.status === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE' }
                          : u
                      )
                    )
                  }
                />
              </div>
            )}

            {/* Tab 11: Supabase & Next.js RBAC Console */}
            {activeTab === 'rbac' && (
              <div className="max-w-5xl mx-auto">
                <SupabaseRbacView
                  onOpenMobileAuth={() => setIsAuthModalOpen(true)}
                  onOpenTrustRegister={() => setIsTrustRegisterOpen(true)}
                  onOpenSuperAdminQueue={() => setIsSuperAdminQueueOpen(true)}
                />
              </div>
            )}

            {/* Tab 12: Settings & Preferences View */}
            {activeTab === 'settings' && (
              <SettingsView
                currentUser={currentUser}
                language={language}
                onLanguageChange={setLanguage}
                onUpdateUser={setCurrentUser}
                onBackToFeed={() => navigateTab('feed', '/')}
              />
            )}

            {/* Tab 13: Saved Posts View */}
            {activeTab === 'saved' && (
              <div className="max-w-3xl mx-auto space-y-5">
                <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 shadow-xl flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-2xl text-amber-400">
                      <Bookmark className="w-6 h-6" />
                    </div>
                    <div>
                      <h2 className="text-base font-bold text-slate-100">
                        {language === 'HI' ? 'सहेजे गए पोस्ट व श्लोक' : language === 'MR' ? 'जतन केलेल्या पोस्ट व स्तोत्रे' : 'Saved Posts & Shlokas'}
                      </h2>
                      <p className="text-xs text-slate-400">
                        Bookmarked sacred shlokas, temple darshans, and prayers for offline sadhana.
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => navigateTab('feed', '/')}
                    className="px-3.5 py-1.5 rounded-xl bg-slate-950 border border-slate-800 hover:border-slate-700 text-xs font-bold text-slate-300 cursor-pointer"
                  >
                    ← Back to Feed
                  </button>
                </div>

                {savedPostsList.length === 0 ? (
                  <div className="bg-slate-900 border border-slate-800 rounded-3xl p-10 text-center space-y-3">
                    <Bookmark className="w-8 h-8 text-slate-600 mx-auto" />
                    <p className="font-bold text-slate-300">No saved posts yet</p>
                    <p className="text-xs text-slate-500 max-w-sm mx-auto">
                      Click the bookmark icon on any post in the community newsfeed to save it here for peaceful reflection.
                    </p>
                    <button
                      onClick={() => navigateTab('feed', '/')}
                      className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs cursor-pointer"
                    >
                      Browse Community Feed
                    </button>
                  </div>
                ) : (
                  savedPostsList.map((post) => (
                    <div key={post.id} className="relative">
                      <PostCard
                        post={post}
                        currentUser={currentUser}
                        comments={comments[post.id] || []}
                        onReact={handleReact}
                        onAddComment={handleAddComment}
                        onDeletePost={handleDeletePost}
                      />
                      <button
                        onClick={() => toggleSavePost(post.id)}
                        className="absolute top-4 right-4 p-1.5 rounded-lg border bg-amber-500/20 border-amber-500 text-amber-400 cursor-pointer"
                        title="Remove from saved"
                      >
                        <Bookmark className="w-3.5 h-3.5 fill-current" />
                      </button>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* Tab 14: Bhajans & Stotras dedicated view */}
            {activeTab === 'bhajans' && (
              <div className="space-y-4">
                <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-4 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <Music className="w-5 h-5 text-amber-400" />
                    <div>
                      <h2 className="text-sm font-bold text-slate-100">
                        {language === 'HI' ? 'भजन, आरती एवं स्तोत्र' : language === 'MR' ? 'भजने, आरत्या व स्तोत्रे' : 'Bhajans, Artis & Stotras'}
                      </h2>
                      <p className="text-[11px] text-slate-400">Sacred audio player with synced lyrics</p>
                    </div>
                  </div>
                </div>
                <MediaLibraryView
                  initialItem={mockMediaLibrary[0]}
                  language={language}
                  onStartBackgroundChant={(media) => {
                    setActiveBackgroundChant(media);
                    setIsBackgroundChantPlaying(true);
                  }}
                />
              </div>
            )}

            {/* Tab 15: Events Calendar & Vedic Panchang */}
            {activeTab === 'calendar' && (
              <div className="max-w-3xl mx-auto space-y-5">
                <div className="bg-gradient-to-br from-amber-950/60 via-slate-900 to-slate-950 border border-amber-700/60 rounded-3xl p-6 shadow-2xl space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
                    <div className="flex items-center gap-2.5">
                      <CalendarIcon className="w-6 h-6 text-amber-400" />
                      <div>
                        <h2 className="text-base font-bold text-slate-100">
                          {language === 'HI' ? 'वैदिक पंचांग एवं उत्सव कैलेंडर' : language === 'MR' ? 'वैदिक पंचांग आणि उत्सव दिनदर्शिका' : 'Vedic Panchang & Festival Calendar'}
                        </h2>
                        <p className="text-xs text-slate-400">Tithi, Nakshatra, Muhurat &amp; Upcoming Temple Utsavs</p>
                      </div>
                    </div>
                    <button
                      onClick={() => setIsPanchangOpen(true)}
                      className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs cursor-pointer shadow-md"
                    >
                      Open Full Panchang Dial →
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="p-3.5 bg-slate-950 rounded-2xl border border-slate-800">
                      <span className="text-[10px] font-bold uppercase text-slate-400 block">Today's Tithi</span>
                      <span className="text-sm font-bold text-amber-400 block mt-0.5">भाद्रपद शुक्ल दशमी</span>
                      <span className="text-[10px] text-slate-500 block">Ends at 04:22 PM</span>
                    </div>

                    <div className="p-3.5 bg-slate-950 rounded-2xl border border-slate-800">
                      <span className="text-[10px] font-bold uppercase text-slate-400 block">Abhijit Muhurat</span>
                      <span className="text-sm font-bold text-emerald-400 block mt-0.5">11:45 AM - 12:35 PM</span>
                      <span className="text-[10px] text-slate-500 block">Most auspicious window</span>
                    </div>

                    <div className="p-3.5 bg-slate-950 rounded-2xl border border-slate-800">
                      <span className="text-[10px] font-bold uppercase text-slate-400 block">Rahu Kaal</span>
                      <span className="text-sm font-bold text-rose-400 block mt-0.5">04:30 PM - 06:00 PM</span>
                      <span className="text-[10px] text-slate-500 block">Avoid initiating new tasks</span>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-800/80 space-y-2">
                    <span className="text-xs font-bold text-slate-200 block">Upcoming Auspicious Festivals</span>
                    <div className="space-y-2">
                      <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between text-xs">
                        <div>
                          <span className="font-bold text-slate-200 block">अनंत चतुर्दशी (Anant Chaturdashi)</span>
                          <span className="text-[10px] text-slate-400">Grand Ganeshotsav Visarjan &amp; Ananta Vrat</span>
                        </div>
                        <span className="text-amber-400 font-bold font-mono">In 4 Days</span>
                      </div>
                      <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between text-xs">
                        <div>
                          <span className="font-bold text-slate-200 block">सर्वपित्री अमावस्या (Sarvapitri Amavasya)</span>
                          <span className="text-[10px] text-slate-400">Mahalaya Pitru Paksha Tarpan</span>
                        </div>
                        <span className="text-slate-400 font-bold font-mono">In 18 Days</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Tab 16: Feature Requirement and Feedback Engine */}
            {activeTab === 'feedback' && (
              <FeatureFeedbackView
                currentUser={currentUser}
                language={language}
                onNavigate={(tab, path) => navigateTab(tab, path)}
              />
            )}
          </main>
        </div>
      </div>

      {/* 4. BOTTOM NAVIGATION BAR */}
      <AnantBottomNav
        activeTab={activeTab}
        language={language}
        onSelectTab={(tab) => navigateTab(tab)}
        onOpenCreatePost={() => setIsCreatePostOpen(true)}
      />

      {/* 5. VEDIC PANCHANG MODAL */}
      <PanchangModal
        isOpen={isPanchangOpen}
        onClose={() => setIsPanchangOpen(false)}
        language={language}
      />

      {/* 6. CREATE POST & MEDIA UPLOADER MODAL */}
      <CreatePostModal
        isOpen={isCreatePostOpen}
        onClose={() => setIsCreatePostOpen(false)}
        currentUser={currentUser}
        onCreatePost={handleCreatePost}
      />

      {/* 7. MOBILE AUTH & OTP MODAL */}
      <MobileAuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onLoginSuccess={(user) => {
          setCurrentUser(user);
          if (!users.some((u) => u.id === user.id)) {
            setUsers((prev) => [user, ...prev]);
          }
        }}
        onOpenTrustRegister={() => {
          setIsAuthModalOpen(false);
          setIsTrustRegisterOpen(true);
        }}
      />

      {/* 8. TEMPLE TRUST ONBOARDING & COMPLIANCE MODAL */}
      <TrustRegistrationModal
        isOpen={isTrustRegisterOpen}
        onClose={() => setIsTrustRegisterOpen(false)}
        onSuccess={() => {
          setIsTrustRegisterOpen(false);
          setIsSuperAdminQueueOpen(true);
        }}
      />

      {/* 9. SUPER ADMIN VERIFICATION & COMPLIANCE QUEUE MODAL */}
      <SuperAdminVerificationQueueModal
        isOpen={isSuperAdminQueueOpen}
        onClose={() => setIsSuperAdminQueueOpen(false)}
      />

      {/* 10. DEVOPS, SECURITY & PEAK AUTOSCALER MODAL */}
      <DevOpsProductionModal
        isOpen={isDevOpsOpen}
        onClose={() => setIsDevOpsOpen(false)}
      />

      {/* 11. PROFILE EDIT MODAL */}
      <Modal
        isOpen={isEditProfileOpen}
        onClose={() => setIsEditProfileOpen(false)}
        title="Edit Spiritual Profile"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Sadhana &amp; Bio Summary
            </label>
            <textarea
              rows={3}
              value={editBio}
              onChange={(e) => setEditBio(e.target.value)}
              className="w-full text-xs p-3 bg-slate-950 border border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 text-slate-100"
            />
          </div>

          <Input
            label="Home City / State"
            value={editLocation}
            onChange={(e) => setEditLocation(e.target.value)}
            placeholder="Pune, Maharashtra"
          />

          <Input
            label="Sacred Links / Portfolio"
            value={editWebsite}
            onChange={(e) => setEditWebsite(e.target.value)}
            placeholder="https://anant.org/@user"
          />

          <div className="flex justify-end gap-2 pt-2">
            <Button variant="secondary" onClick={() => setIsEditProfileOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleSaveProfile}
              className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold"
            >
              Save Profile
            </Button>
          </div>
        </div>
      </Modal>

      {/* 12. NOTIFICATIONS MODAL */}
      <Modal
        isOpen={isNotifModalOpen}
        onClose={() => setIsNotifModalOpen(false)}
        title="Temple &amp; Devotee Notifications"
      >
        <div className="space-y-3 divide-y divide-slate-800 max-h-96 overflow-y-auto">
          {notifications.map((notif) => (
            <div key={notif.id} className="pt-2.5 flex items-start justify-between gap-3 text-xs">
              <div>
                <p className="text-slate-200">{notif.message}</p>
                <span className="text-[10px] text-slate-500">{notif.createdAt}</span>
              </div>
              {!notif.isRead && (
                <span className="w-2 h-2 rounded-full bg-amber-500 flex-shrink-0 mt-1" />
              )}
            </div>
          ))}
        </div>
      </Modal>

      {/* 13. CONTINUOUS BACKGROUND CHANT AUDIO PLAYER */}
      <ContinuousChantAudioPlayer
        activeChant={activeBackgroundChant}
        isPlaying={isBackgroundChantPlaying}
        onTogglePlay={() => setIsBackgroundChantPlaying(!isBackgroundChantPlaying)}
        onStop={() => {
          setActiveBackgroundChant(null);
          setIsBackgroundChantPlaying(false);
        }}
        language={language}
      />

      {/* 14. SHARE APP & WEBSITE WITH FRIENDS/FAMILY MODAL */}
      <ShareAppModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        language={language}
      />
    </div>
  );
}

export default App;
