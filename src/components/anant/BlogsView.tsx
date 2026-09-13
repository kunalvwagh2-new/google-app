import React, { useState, useMemo } from 'react';
import {
  BookOpen,
  Search,
  Video,
  Sparkles,
  Heart,
  Share2,
  Clock,
  User,
  Bell,
  CheckCircle2,
  PlusCircle,
  Eye,
  Calendar,
  Tag,
  Flame,
  ArrowRight,
  Play,
  X,
  Building,
  Image as ImageIcon,
  MessageCircle,
  Check,
} from 'lucide-react';
import {
  SpiritualBlog,
  BlogCategory,
  DailyDarshanUpload,
  SupportedLanguage,
} from '../../types/anant.ts';
import { mockSpiritualBlogs, mockDailyDarshanUploads, mockTemples } from '../../data/anantData.ts';

export interface BlogsViewProps {
  language: SupportedLanguage;
  onSelectTemple?: (templeId: string) => void;
  onOpenShareModal?: () => void;
  onStartChant?: (chant: any) => void;
  onOpenJaapMala?: () => void;
  onOpenDarshan?: (templeName: string) => void;
}

export function BlogsView({
  language,
  onSelectTemple,
  onOpenShareModal,
  onStartChant,
  onOpenJaapMala,
  onOpenDarshan,
}: BlogsViewProps) {
  // Navigation tabs within Blogs view
  const [activeSubTab, setActiveSubTab] = useState<'BLOGS' | 'DARSHAN'>('BLOGS');

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [onlyWithVideo, setOnlyWithVideo] = useState(false);

  // Selected blog modal reading view
  const [selectedBlog, setSelectedBlog] = useState<SpiritualBlog | null>(null);
  const [likedBlogIds, setLikedBlogIds] = useState<Set<string>>(new Set());

  // Temple following & notifications
  const [followedTempleIds, setFollowedTempleIds] = useState<Set<string>>(
    new Set(['temple_dagdusheth', 'temple_pandharpur'])
  );
  const [notificationAlert, setNotificationAlert] = useState<{
    templeName: string;
    darshanId: string;
    title: string;
  } | null>({
    templeName: 'Shreemant Dagdusheth Halwai Ganpati Mandir',
    darshanId: 'darshan_dagdusheth_today',
    title: 'Suprabhatam Shringar Darshan - Pure Gold Mukut & Modak Alankar (15 mins ago)',
  });

  // Selected darshan photo viewing modal
  const [selectedDarshan, setSelectedDarshan] = useState<DailyDarshanUpload | null>(null);
  const [darshanBlessings, setDarshanBlessings] = useState<Record<string, number>>({});

  // Temple Trust upload modal state
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [darshanUploads, setDarshanUploads] = useState<DailyDarshanUpload[]>(mockDailyDarshanUploads);
  const [newUploadData, setNewUploadData] = useState({
    templeId: 'temple_dagdusheth',
    deityName: 'Lord Ganesh',
    title: '',
    description: '',
    photoUrl: 'https://images.unsplash.com/photo-1567591370504-20a2d2188849?w=1000&auto=format&fit=crop&q=80',
    videoUrl: '',
    alankarType: 'MORNING_SHRINGAR' as DailyDarshanUpload['alankarType'],
  });

  // Filtered blogs list
  const filteredBlogs = useMemo(() => {
    return mockSpiritualBlogs.filter((blog) => {
      // Category filter
      if (selectedCategory !== 'ALL' && blog.category !== selectedCategory) {
        return false;
      }
      // Only with video filter
      if (onlyWithVideo && !blog.videoUrl) {
        return false;
      }
      // Search query filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesTitle =
          blog.titleEn.toLowerCase().includes(query) ||
          blog.titleMr.toLowerCase().includes(query) ||
          blog.titleHi.toLowerCase().includes(query);
        const matchesSummary = blog.summary.toLowerCase().includes(query);
        const matchesTags = blog.tags.some((tag) => tag.toLowerCase().includes(query));
        const matchesAuthor = blog.authorName.toLowerCase().includes(query);
        const matchesContent = blog.content.toLowerCase().includes(query);

        if (!matchesTitle && !matchesSummary && !matchesTags && !matchesAuthor && !matchesContent) {
          return false;
        }
      }
      return true;
    });
  }, [searchQuery, selectedCategory, onlyWithVideo]);

  // Handle blog like toggle
  const toggleLikeBlog = (blogId: string) => {
    setLikedBlogIds((prev) => {
      const next = new Set(prev);
      if (next.has(blogId)) {
        next.delete(blogId);
      } else {
        next.add(blogId);
      }
      return next;
    });
  };

  // Handle follow temple toggle
  const toggleFollowTemple = (templeId: string) => {
    setFollowedTempleIds((prev) => {
      const next = new Set(prev);
      if (next.has(templeId)) {
        next.delete(templeId);
      } else {
        next.add(templeId);
      }
      return next;
    });
  };

  // Handle blessing darshan click
  const handleBlessing = (darshanId: string) => {
    setDarshanBlessings((prev) => ({
      ...prev,
      [darshanId]: (prev[darshanId] || 0) + 1,
    }));
  };

  // Handle Temple Trust upload submission
  const handleDarshanSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUploadData.title.trim()) return;

    const templeObj = mockTemples.find((t) => t.id === newUploadData.templeId);
    const newEntry: DailyDarshanUpload = {
      id: `darshan_custom_${Date.now()}`,
      templeId: newUploadData.templeId,
      templeName: templeObj?.name || 'Shree Devasthan Mandir',
      deityName: newUploadData.deityName,
      date: new Date().toISOString().split('T')[0],
      timeSlot: 'Just now',
      title: newUploadData.title,
      description: newUploadData.description || 'Divine daily alankar darshan uploaded by temple trust.',
      photoUrl: newUploadData.photoUrl,
      videoUrl: newUploadData.videoUrl || undefined,
      alankarType: newUploadData.alankarType,
      uploadedBy: `${templeObj?.name || 'Temple'} Trust Administration`,
      uploadedAt: 'Just now',
      likesCount: 1,
      blessingsCount: 1,
    };

    setDarshanUploads([newEntry, ...darshanUploads]);
    setIsUploadModalOpen(false);

    // Trigger notification banner
    setNotificationAlert({
      templeName: newEntry.templeName,
      darshanId: newEntry.id,
      title: `${newEntry.title} (Just now)`,
    });
  };

  const categoriesList = [
    { id: 'ALL', labelEn: 'All Topics', labelMr: 'सर्व विषय', labelHi: 'सभी विषय' },
    { id: 'TEMPLES_PILGRIMAGE', labelEn: 'Temples & Holy Sites', labelMr: 'तीर्थक्षेत्र व मंदिरे', labelHi: 'तीर्थक्षेत्र एवं मंदिर' },
    { id: 'SPIRITUAL_GURUS', labelEn: 'Saints & Gurus', labelMr: 'संत व गुरु विचार', labelHi: 'संत एवं गुरु विचार' },
    { id: 'SACRED_SCRIPTURES', labelEn: 'Scriptures & Gita', labelMr: 'वेद, गीता व ग्रंथ', labelHi: 'वेद, गीता एवं ग्रंथ' },
    { id: 'FESTIVALS_UTSAV', labelEn: 'Festivals & Rituals', labelMr: 'सण व उत्सव', labelHi: 'पर्व एवं उत्सव' },
    { id: 'SADHANA_DHYAN', labelEn: 'Sadhana & Meditation', labelMr: 'साधना व ध्यान', labelHi: 'साधना एवं ध्यान' },
    { id: 'CONTENT_CREATORS', labelEn: 'Devotee Writers', labelMr: 'लेखक व रचनाकार', labelHi: 'लेखक एवं रचनाकार' },
  ];

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-28 text-slate-800 dark:text-slate-100">
      {/* Real-time Followed Temple Darshan Notification Toast Banner */}
      {notificationAlert && (
        <div
          id="darshan-notification-banner"
          className="mb-6 p-4 rounded-2xl bg-gradient-to-r from-amber-500/15 via-orange-500/15 to-amber-500/15 border-2 border-amber-500/40 backdrop-blur-md shadow-lg flex items-center justify-between gap-4 animate-in slide-in-from-top-4 duration-300"
        >
          <div className="flex items-center gap-3.5 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center flex-shrink-0 shadow-md">
              <Bell className="w-5 h-5 animate-bounce" />
            </div>
            <div className="min-w-0">
              <span className="text-[10px] font-black uppercase tracking-wider text-amber-600 dark:text-amber-400 bg-amber-100 dark:bg-amber-950/80 px-2 py-0.5 rounded-full border border-amber-300 dark:border-amber-700/50">
                🔔 {language === 'MR' ? 'नवीन दैनिक दर्शन सूचना' : 'New Darshan Notification from Followed Temple'}
              </span>
              <p className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white truncate mt-0.5">
                {notificationAlert.templeName}: {notificationAlert.title}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              onClick={() => {
                setActiveSubTab('DARSHAN');
                const target = darshanUploads.find((d) => d.id === notificationAlert.darshanId);
                if (target) setSelectedDarshan(target);
              }}
              className="px-3.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-bold transition-all shadow cursor-pointer flex items-center gap-1"
            >
              <Eye className="w-3.5 h-3.5" />
              {language === 'MR' ? 'दर्शन घ्या' : 'View Darshan'}
            </button>
            <button
              onClick={() => setNotificationAlert(null)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
              title="Dismiss"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Main Section Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse" />
            <span className="text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
              {language === 'MR' ? 'आध्यात्मिक ज्ञान व दैनिक दर्शन' : 'Spiritual Wisdom & Daily Darshan'}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold font-serif text-slate-900 dark:text-white mt-1">
            {language === 'MR'
              ? 'आध्यात्मिक ब्लॉग व मंदिर दर्शन'
              : language === 'HI'
              ? 'आध्यात्मिक ब्लॉग एवं मन्दिर दर्शन'
              : 'Spiritual Blogs & Daily Temple Darshan'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-2xl mt-1">
            {language === 'MR'
              ? 'प्रसिद्ध मंदिरे, पूज्य संत, वेद-शास्त्र अभ्यासक आणि आध्यात्मिक लेखकांनी सादर केलेले पवित्र लेख, व्हिडिओ व थेट दर्शन.'
              : 'Articles, discourses, and daily shringar darshan uploads directly from revered temples, spiritual gurus, and devotee scholars.'}
          </p>
        </div>

        {/* Action buttons: Sub-tab switcher + Upload Darshan button */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Sub Tab Switcher */}
          <div className="bg-slate-100 dark:bg-slate-900 p-1 rounded-2xl border border-slate-200 dark:border-slate-800 flex text-xs font-bold">
            <button
              id="blogs-subtab-articles"
              onClick={() => setActiveSubTab('BLOGS')}
              className={`px-4 py-2 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
                activeSubTab === 'BLOGS'
                  ? 'bg-amber-500 text-slate-950 shadow-md'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              {language === 'MR' ? 'आध्यात्मिक ब्लॉग' : 'Spiritual Blogs'} ({filteredBlogs.length})
            </button>
            <button
              id="blogs-subtab-darshan"
              onClick={() => setActiveSubTab('DARSHAN')}
              className={`px-4 py-2 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
                activeSubTab === 'DARSHAN'
                  ? 'bg-amber-500 text-slate-950 shadow-md'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <ImageIcon className="w-4 h-4" />
              {language === 'MR' ? 'दैनिक दर्शन' : 'Daily Darshan'} ({darshanUploads.length})
            </button>
          </div>

          {/* Temple Trust Upload Button */}
          <button
            id="trust-upload-darshan-btn"
            onClick={() => setIsUploadModalOpen(true)}
            className="px-3.5 py-2 rounded-2xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-700 dark:text-amber-300 border border-amber-500/40 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer shadow-sm"
          >
            <PlusCircle className="w-4 h-4" />
            {language === 'MR' ? 'मंदिर ट्रस्ट: दर्शन अपलोड' : 'Temple Trust: Upload Darshan'}
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: SPIRITUAL BLOGS (With Search & Embedded Videos)                     */}
      {/* ========================================================================= */}
      {activeSubTab === 'BLOGS' && (
        <div className="space-y-6">
          {/* Search bar & video filter bar */}
          <div className="flex flex-col sm:flex-row items-center gap-3">
            {/* Search Input */}
            <div className="relative flex-1 w-full">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                id="blog-search-input"
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={
                  language === 'MR'
                    ? 'विषय, संत, केदारनाथ, भगवद्गीता, जप विज्ञान शोधा...'
                    : 'Search topics, saints, Kedarnath, Gita, mantra science, temples...'
                }
                className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl text-xs sm:text-sm text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500/50 shadow-sm"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Video Only Filter Toggle */}
            <button
              onClick={() => setOnlyWithVideo(!onlyWithVideo)}
              className={`px-4 py-2.5 rounded-2xl border text-xs font-bold flex items-center gap-2 cursor-pointer transition-all flex-shrink-0 w-full sm:w-auto justify-center ${
                onlyWithVideo
                  ? 'bg-rose-500 text-white border-rose-600 shadow-sm'
                  : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              <Video className="w-4 h-4" />
              {language === 'MR' ? 'केवळ व्हिडिओ असलेले' : 'With Sacred Video'}
            </button>
          </div>

          {/* Topic Category Chips */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin">
            {categoriesList.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all cursor-pointer flex-shrink-0 ${
                  selectedCategory === cat.id
                    ? 'bg-amber-500 text-slate-950 shadow'
                    : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-amber-400'
                }`}
              >
                {language === 'MR'
                  ? cat.labelMr
                  : language === 'HI'
                  ? cat.labelHi
                  : cat.labelEn}
              </button>
            ))}
          </div>

          {/* Blogs Grid */}
          {filteredBlogs.length === 0 ? (
            <div className="text-center py-16 bg-white dark:bg-slate-900 rounded-3xl border border-dashed border-slate-300 dark:border-slate-800 p-8">
              <BookOpen className="w-12 h-12 text-slate-400 mx-auto mb-3 opacity-50" />
              <h3 className="font-bold text-base text-slate-700 dark:text-slate-300">
                {language === 'MR' ? 'कोणताही लेख सापडला नाही' : 'No blogs match your search'}
              </h3>
              <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                Try clearing your search query or selecting a different topic category.
              </p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('ALL');
                  setOnlyWithVideo(false);
                }}
                className="mt-4 px-4 py-2 bg-amber-500 text-slate-950 text-xs font-bold rounded-xl"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredBlogs.map((blog) => {
                const isLiked = likedBlogIds.has(blog.id);
                return (
                  <article
                    key={blog.id}
                    id={`blog-card-${blog.id}`}
                    className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col group"
                  >
                    {/* Banner Image with video badge & category tag */}
                    <div
                      className="relative h-48 w-full overflow-hidden cursor-pointer"
                      onClick={() => setSelectedBlog(blog)}
                    >
                      <img
                        src={blog.bannerImageUrl}
                        alt={blog.titleEn}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-black/20" />

                      {/* Video indicator badge */}
                      {blog.videoUrl && (
                        <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-rose-600/90 text-white text-[11px] font-bold flex items-center gap-1 shadow-lg backdrop-blur-sm">
                          <Play className="w-3 h-3 fill-current" />
                          <span>Video ({blog.videoDuration || '4m'})</span>
                        </div>
                      )}

                      {/* Category Pill */}
                      <span className="absolute bottom-3 left-3 px-2.5 py-1 rounded-full bg-amber-500/90 text-slate-950 text-[10px] font-black tracking-wider uppercase backdrop-blur-sm">
                        {language === 'MR'
                          ? blog.categoryLabel.mr
                          : language === 'HI'
                          ? blog.categoryLabel.hi
                          : blog.categoryLabel.en}
                      </span>
                    </div>

                    {/* Blog Content Info */}
                    <div className="p-5 flex-1 flex flex-col justify-between">
                      <div>
                        {/* Author metadata */}
                        <div className="flex items-center gap-2.5 mb-2.5">
                          <img
                            src={blog.authorAvatar}
                            alt={blog.authorName}
                            className="w-7 h-7 rounded-full object-cover border border-amber-400/50"
                            referrerPolicy="no-referrer"
                          />
                          <div className="min-w-0">
                            <p className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">
                              {blog.authorName}
                            </p>
                            <p className="text-[10px] text-slate-500 truncate">
                              {blog.authorRole.replace('_', ' ')}
                            </p>
                          </div>
                        </div>

                        {/* Title */}
                        <h3
                          onClick={() => setSelectedBlog(blog)}
                          className="font-bold font-serif text-base sm:text-lg text-slate-900 dark:text-white group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors cursor-pointer line-clamp-2 leading-snug mb-2"
                        >
                          {language === 'MR'
                            ? blog.titleMr
                            : language === 'HI'
                            ? blog.titleHi
                            : blog.titleEn}
                        </h3>

                        {/* Summary preview */}
                        <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-3 leading-relaxed mb-4">
                          {blog.summary}
                        </p>
                      </div>

                      {/* Card Footer: tags, read time, like & read more */}
                      <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs text-slate-500">
                        <div className="flex items-center gap-3">
                          <span className="flex items-center gap-1 text-[11px]">
                            <Clock className="w-3.5 h-3.5 text-amber-500" />
                            {blog.readTimeMinutes} min read
                          </span>
                          <button
                            onClick={() => toggleLikeBlog(blog.id)}
                            className={`flex items-center gap-1 text-[11px] transition-colors cursor-pointer ${
                              isLiked ? 'text-rose-500 font-bold' : 'hover:text-rose-400'
                            }`}
                          >
                            <Heart className={`w-3.5 h-3.5 ${isLiked ? 'fill-current' : ''}`} />
                            {blog.likesCount + (isLiked ? 1 : 0)}
                          </button>
                        </div>

                        <button
                          onClick={() => setSelectedBlog(blog)}
                          className="font-bold text-amber-600 dark:text-amber-400 flex items-center gap-1 hover:translate-x-0.5 transition-transform cursor-pointer"
                        >
                          {language === 'MR' ? 'वाचा' : 'Read'}
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: DAILY DARSHAN UPLOADS FROM TEMPLE TRUSTS                           */}
      {/* ========================================================================= */}
      {activeSubTab === 'DARSHAN' && (
        <div className="space-y-6">
          {/* Informational Hero Card for Temple Trusts & Following */}
          <div className="p-5 sm:p-6 rounded-3xl bg-gradient-to-br from-amber-500/10 via-orange-500/5 to-slate-900 border border-amber-300 dark:border-amber-800/50 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-amber-600 dark:text-amber-400 bg-amber-100 dark:bg-amber-950/80 px-2.5 py-1 rounded-full border border-amber-300 dark:border-amber-700/50">
                🪔 {language === 'MR' ? 'थेट मंदिर दर्शन' : 'Verified Temple Sanctum Darshan'}
              </span>
              <h2 className="text-xl sm:text-2xl font-bold font-serif text-slate-900 dark:text-white mt-1.5">
                {language === 'MR' ? 'आजचे दैनिक देवदर्शन व शृंगार' : 'Today’s Deity Darshan & Sacred Shringar'}
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1 max-w-2xl">
                Temple trusts upload fresh photos and videos daily after Kakad Aarti and Mahapooja. Follow temples to get instantaneous notification alerts on your device whenever new darshan is published!
              </p>
            </div>

            <button
              onClick={() => setIsUploadModalOpen(true)}
              className="px-4 py-2.5 rounded-2xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs flex items-center gap-2 transition-all shadow-md cursor-pointer flex-shrink-0"
            >
              <PlusCircle className="w-4 h-4" />
              {language === 'MR' ? 'नवीन दर्शन फोटो अपलोड करा' : 'Upload Darshan Photo/Video'}
            </button>
          </div>

          {/* Followed Temples Quick Ribbon */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2.5">
              {language === 'MR' ? 'मंदिरे फॉलो करा (सूचना मिळवण्यासाठी)' : 'Follow Temples for Darshan Alerts'}
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
              {mockTemples.map((temple) => {
                const isFollowing = followedTempleIds.has(temple.id);
                return (
                  <div
                    key={temple.id}
                    className="p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl flex flex-col justify-between gap-2 shadow-sm"
                  >
                    <div>
                      <p className="font-bold text-xs text-slate-900 dark:text-white truncate">
                        {temple.name}
                      </p>
                      <p className="text-[10px] text-slate-500 truncate">{temple.city}, {temple.state}</p>
                    </div>
                    <button
                      onClick={() => toggleFollowTemple(temple.id)}
                      className={`w-full py-1.5 rounded-xl text-[11px] font-bold transition-all cursor-pointer flex items-center justify-center gap-1 ${
                        isFollowing
                          ? 'bg-amber-500/15 text-amber-700 dark:text-amber-400 border border-amber-500/40'
                          : 'bg-slate-100 dark:bg-slate-800 hover:bg-amber-500 hover:text-slate-950 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      <Bell className={`w-3 h-3 ${isFollowing ? 'fill-current' : ''}`} />
                      {isFollowing ? (language === 'MR' ? 'फॉलो केले' : 'Following') : (language === 'MR' ? 'फॉलो करा' : 'Follow')}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Daily Darshan Gallery Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {darshanUploads.map((darshan) => {
              const blessings = (darshan.blessingsCount || 0) + (darshanBlessings[darshan.id] || 0);
              const isTempleFollowed = followedTempleIds.has(darshan.templeId);

              return (
                <div
                  key={darshan.id}
                  id={`darshan-card-${darshan.id}`}
                  className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm flex flex-col hover:border-amber-400/60 transition-all"
                >
                  {/* Photo with high-res aspect ratio */}
                  <div
                    className="relative aspect-[4/3] w-full overflow-hidden cursor-pointer group"
                    onClick={() => setSelectedDarshan(darshan)}
                  >
                    <img
                      src={darshan.photoUrl}
                      alt={darshan.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-black/20" />

                    {/* Time slot badge */}
                    <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-slate-950/80 text-white text-[11px] font-mono backdrop-blur-md flex items-center gap-1.5 border border-white/10">
                      <Clock className="w-3 h-3 text-amber-400" />
                      <span>{darshan.timeSlot} • {darshan.uploadedAt}</span>
                    </div>

                    {/* Alankar tag */}
                    <span className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-amber-500 text-slate-950 text-[10px] font-black uppercase tracking-wider">
                      {darshan.alankarType.replace('_', ' ')}
                    </span>

                    {/* Video play overlay if available */}
                    {darshan.videoUrl && (
                      <div className="absolute bottom-3 right-3 px-2.5 py-1 rounded-full bg-rose-600 text-white text-[10px] font-bold flex items-center gap-1 shadow">
                        <Play className="w-3 h-3 fill-current" />
                        Video Darshan
                      </div>
                    )}
                  </div>

                  {/* Details Card */}
                  <div className="p-4 flex-1 flex flex-col justify-between">
                    <div>
                      {/* Temple Name & Verification */}
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-bold text-amber-700 dark:text-amber-400 flex items-center gap-1">
                          <Building className="w-3.5 h-3.5" />
                          {darshan.templeName}
                        </span>
                        {isTempleFollowed && (
                          <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-950/60 px-2 py-0.5 rounded-full flex items-center gap-1">
                            <Check className="w-3 h-3" /> Following
                          </span>
                        )}
                      </div>

                      {/* Darshan Title */}
                      <h4
                        onClick={() => setSelectedDarshan(darshan)}
                        className="font-bold font-serif text-sm sm:text-base text-slate-900 dark:text-white cursor-pointer hover:text-amber-500 transition-colors line-clamp-2"
                      >
                        {darshan.title}
                      </h4>

                      {/* Description */}
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                        {darshan.description}
                      </p>
                    </div>

                    {/* Interaction Buttons: Take Blessings & Fullscreen */}
                    <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                      <button
                        onClick={() => handleBlessing(darshan.id)}
                        className="px-3 py-1.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 hover:bg-amber-100 text-amber-700 dark:text-amber-300 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer border border-amber-200 dark:border-amber-800/40"
                      >
                        <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                        {language === 'MR' ? 'आशीर्वाद घ्या' : 'Take Blessings'} ({blessings})
                      </button>

                      <button
                        onClick={() => setSelectedDarshan(darshan)}
                        className="p-1.5 rounded-xl text-slate-500 hover:text-amber-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer text-xs font-bold flex items-center gap-1"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        {language === 'MR' ? 'मोठा फोटो' : 'Full Darshan'}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 1: FULL SPIRITUAL BLOG READING MODAL WITH VIDEO SUPPORT             */}
      {/* ========================================================================= */}
      {selectedBlog && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200"
          onClick={() => setSelectedBlog(null)}
        >
          <div
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto text-slate-800 dark:text-slate-100 relative scrollbar-thin"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header banner */}
            <div className="relative h-64 sm:h-80 w-full">
              <img
                src={selectedBlog.bannerImageUrl}
                alt={selectedBlog.titleEn}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />

              {/* Close button */}
              <button
                onClick={() => setSelectedBlog(null)}
                className="absolute top-4 right-4 p-2 rounded-full bg-slate-950/60 text-white hover:bg-slate-950 backdrop-blur-md cursor-pointer transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Title & Author at bottom of banner */}
              <div className="absolute bottom-4 left-6 right-6 text-white">
                <span className="px-2.5 py-0.5 rounded-full bg-amber-500 text-slate-950 text-[10px] font-black uppercase tracking-wider">
                  {language === 'MR'
                    ? selectedBlog.categoryLabel.mr
                    : language === 'HI'
                    ? selectedBlog.categoryLabel.hi
                    : selectedBlog.categoryLabel.en}
                </span>
                <h2 className="text-xl sm:text-2xl font-bold font-serif text-white mt-1 leading-tight">
                  {language === 'MR'
                    ? selectedBlog.titleMr
                    : language === 'HI'
                    ? selectedBlog.titleHi
                    : selectedBlog.titleEn}
                </h2>
                <div className="flex items-center gap-3 mt-2 text-xs text-slate-300">
                  <span>{selectedBlog.authorName}</span>
                  <span>•</span>
                  <span>{selectedBlog.readTimeMinutes} min read</span>
                  <span>•</span>
                  <span>{selectedBlog.publishedAt}</span>
                </div>
              </div>
            </div>

            {/* Embedded Video Player if available */}
            {selectedBlog.videoUrl && (
              <div className="p-6 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950">
                <div className="flex items-center gap-2 mb-2">
                  <Video className="w-4 h-4 text-rose-500" />
                  <h4 className="font-bold text-xs uppercase tracking-wider text-slate-700 dark:text-slate-300">
                    Watch Spiritual Discourse / आरती व दर्शन व्हिडिओ: {selectedBlog.videoTitle}
                  </h4>
                </div>
                <div className="aspect-video w-full rounded-2xl overflow-hidden bg-black shadow-lg border border-slate-700">
                  <video
                    src={selectedBlog.videoUrl}
                    controls
                    className="w-full h-full object-cover"
                    poster={selectedBlog.bannerImageUrl}
                  >
                    Your browser does not support HTML video.
                  </video>
                </div>
              </div>
            )}

            {/* Main Article Content */}
            <div className="p-6 sm:p-8 space-y-6">
              {/* Summary Quote */}
              <blockquote className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border-l-4 border-amber-500 text-xs sm:text-sm italic font-serif text-amber-900 dark:text-amber-200">
                "{selectedBlog.summary}"
              </blockquote>

              {/* Formatted Text Body */}
              <div className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-serif whitespace-pre-line space-y-4">
                {selectedBlog.content}
              </div>

              {/* Tags */}
              <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex flex-wrap gap-2">
                {selectedBlog.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-xs font-mono"
                  >
                    #{tag}
                  </span>
                ))}
              </div>

              {/* Footer Share & Like */}
              <div className="flex items-center justify-between pt-4 border-t border-slate-200 dark:border-slate-800">
                <button
                  onClick={() => toggleLikeBlog(selectedBlog.id)}
                  className="px-4 py-2 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 text-xs font-bold flex items-center gap-2 cursor-pointer"
                >
                  <Heart className="w-4 h-4 fill-current" />
                  {selectedBlog.likesCount + (likedBlogIds.has(selectedBlog.id) ? 1 : 0)} Devotees Found Useful
                </button>

                {onOpenShareModal && (
                  <button
                    onClick={onOpenShareModal}
                    className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow"
                  >
                    <Share2 className="w-4 h-4" />
                    Share with Friends & Family
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 2: FULLSCREEN HIGH-RES DARSHAN PHOTO/VIDEO VIEW                      */}
      {/* ========================================================================= */}
      {selectedDarshan && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/90 backdrop-blur-md animate-in fade-in"
          onClick={() => setSelectedDarshan(null)}
        >
          <div
            className="bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl max-w-2xl w-full overflow-hidden text-slate-100 relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedDarshan(null)}
              className="absolute top-4 right-4 z-10 p-2 rounded-full bg-slate-950/70 text-white hover:bg-slate-950 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Deity Photo / Video */}
            <div className="relative aspect-[4/3] w-full bg-black">
              {selectedDarshan.videoUrl ? (
                <video
                  src={selectedDarshan.videoUrl}
                  controls
                  autoPlay
                  className="w-full h-full object-contain"
                  poster={selectedDarshan.photoUrl}
                />
              ) : (
                <img
                  src={selectedDarshan.photoUrl}
                  alt={selectedDarshan.title}
                  className="w-full h-full object-contain"
                  referrerPolicy="no-referrer"
                />
              )}
            </div>

            {/* Darshan Info bar */}
            <div className="p-6 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-amber-400">
                  {selectedDarshan.templeName}
                </span>
                <span className="text-xs font-mono text-slate-400">
                  {selectedDarshan.date} • {selectedDarshan.timeSlot}
                </span>
              </div>
              <h3 className="text-lg font-bold font-serif text-white">
                {selectedDarshan.title}
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed font-serif">
                {selectedDarshan.description}
              </p>
              <p className="text-[11px] text-slate-500">
                Uploaded by: {selectedDarshan.uploadedBy}
              </p>

              <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
                <button
                  onClick={() => handleBlessing(selectedDarshan.id)}
                  className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-bold flex items-center gap-2 cursor-pointer shadow"
                >
                  <Sparkles className="w-4 h-4" />
                  Take Blessings ({(selectedDarshan.blessingsCount || 0) + (darshanBlessings[selectedDarshan.id] || 0)})
                </button>

                {onOpenShareModal && (
                  <button
                    onClick={onOpenShareModal}
                    className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                  >
                    <Share2 className="w-4 h-4" />
                    Share Darshan
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 3: TEMPLE TRUST DAILY DARSHAN UPLOAD MODAL                           */}
      {/* ========================================================================= */}
      {isUploadModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in"
          onClick={() => setIsUploadModalOpen(false)}
        >
          <div
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl max-w-lg w-full p-6 text-slate-800 dark:text-slate-100 relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setIsUploadModalOpen(false)}
              className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-slate-200"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-2xl bg-amber-100 dark:bg-amber-950 text-amber-600 flex items-center justify-center font-bold">
                <Building className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold font-serif">
                  {language === 'MR' ? 'मंदिर ट्रस्ट: दैनिक दर्शन फोटो अपलोड' : 'Temple Trust: Upload Daily Darshan'}
                </h3>
                <p className="text-xs text-slate-500">
                  Followers will receive instant notifications when this photo is published.
                </p>
              </div>
            </div>

            <form onSubmit={handleDarshanSubmit} className="space-y-4">
              {/* Select Temple */}
              <div>
                <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1">
                  Select Temple / मंदिर निवडा
                </label>
                <select
                  value={newUploadData.templeId}
                  onChange={(e) => setNewUploadData({ ...newUploadData, templeId: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs"
                >
                  {mockTemples.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Title */}
              <div>
                <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1">
                  Darshan Title / दर्शनाचे नाव
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Suprabhatam Shringar Darshan - Golden Alankar"
                  value={newUploadData.title}
                  onChange={(e) => setNewUploadData({ ...newUploadData, title: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs"
                />
              </div>

              {/* Alankar Type */}
              <div>
                <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1">
                  Alankar Type / पूजा व शृंगार प्रकार
                </label>
                <select
                  value={newUploadData.alankarType}
                  onChange={(e) =>
                    setNewUploadData({
                      ...newUploadData,
                      alankarType: e.target.value as DailyDarshanUpload['alankarType'],
                    })
                  }
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs"
                >
                  <option value="MORNING_SHRINGAR">Morning Shringar (प्रभात शृंगार)</option>
                  <option value="SANDHYA_AARTI">Sandhya Aarti (संध्या आरती)</option>
                  <option value="MAHAPOOJA">Mahapooja & Abhishek (महापूजा)</option>
                  <option value="SPECIAL_UTSAV">Special Utsav / Chhabina (विशेष उत्सव)</option>
                </select>
              </div>

              {/* Photo Image URL */}
              <div>
                <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1">
                  Deity Photo URL (or Cloud Asset)
                </label>
                <input
                  type="url"
                  value={newUploadData.photoUrl}
                  onChange={(e) => setNewUploadData({ ...newUploadData, photoUrl: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs font-mono"
                />
              </div>

              {/* Optional Video URL */}
              <div>
                <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1">
                  Optional Video Stream URL (Live or recorded clip)
                </label>
                <input
                  type="url"
                  placeholder="https://... (mp4 or live stream)"
                  value={newUploadData.videoUrl}
                  onChange={(e) => setNewUploadData({ ...newUploadData, videoUrl: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs font-mono"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1">
                  Description / भाविक सूचना
                </label>
                <textarea
                  rows={2}
                  placeholder="Describe the ornaments, garlands, and special blessings..."
                  value={newUploadData.description}
                  onChange={(e) => setNewUploadData({ ...newUploadData, description: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs"
                />
              </div>

              <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsUploadModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-500 hover:text-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs shadow-md cursor-pointer flex items-center gap-1.5"
                >
                  <Bell className="w-3.5 h-3.5" />
                  Publish & Notify Followers
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
