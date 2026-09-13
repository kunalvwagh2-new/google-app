import React, { useState, useEffect, useMemo } from 'react';
import {
  Lightbulb,
  Plus,
  ThumbsUp,
  MessageSquare,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  Rocket,
  Flame,
  Layers,
  ChevronDown,
  Sparkles,
  Send,
  User as UserIcon,
  Tag,
  Check,
  Compass,
  AlertCircle,
  Share2,
} from 'lucide-react';
import { User } from '../../types.ts';
import {
  SupportedLanguage,
  FeatureRequirementItem,
  FeatureCategory,
  FeaturePriority,
  FeatureStatus,
  FeatureComment,
} from '../../types/anant.ts';

interface FeatureFeedbackViewProps {
  currentUser: User;
  language: SupportedLanguage;
  onNavigate?: (tab: string, path?: string) => void;
}

// Default community feature requirements for Anant
const INITIAL_FEATURE_REQUESTS: FeatureRequirementItem[] = [
  {
    id: 'feat-1',
    title: 'Offline Audio Caching for Continuous Chanting & Jaap Mala',
    description:
      'Allow devotees to download sacred chanting tracks and stotras to their device storage so that background jaap and continuous audio loops work smoothly even with low connectivity during train travel or remote temple pilgrimages.',
    communityBenefit:
      'Devotees traveling to remote pilgrimage sites or commuting without internet can continue their daily sadhana, 108 malas, and stotra recitations uninterrupted.',
    category: 'JAAP_MALA',
    priority: 'HIGH',
    status: 'IN_DEVELOPMENT',
    upvotesCount: 248,
    upvotedByUser: true,
    submitterName: 'Pandurang Kulkarni',
    submitterAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150',
    submittedAt: '2026-09-02',
    progressPercentage: 75,
    targetSprint: 'Sprint 6 • Release Oct 2026',
    devTeamNote:
      'Development in progress: IndexedDB cache storage and Service Worker background sync are being tested for zero-buffering playback.',
    tags: ['Offline', 'Audio', 'Jaap Mala', 'Sadhana'],
    comments: [
      {
        id: 'c-1',
        authorName: 'Sanjay Deshmukh',
        authorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
        content: 'This will be immensely helpful for our weekly Pandharpur Wari group!',
        createdAt: '2026-09-04',
      },
      {
        id: 'c-2',
        authorName: 'Anant Dev Team',
        isDevTeam: true,
        content: 'We are targeting full offline support in the upcoming version update. Thank you for voting!',
        createdAt: '2026-09-06',
      },
    ],
  },
  {
    id: 'feat-2',
    title: 'Kakad Aarti Morning Alarm & Live Sanctum Push Notification',
    description:
      'A smart spiritual alarm that rings with a gentle temple bell / shankh tone 15 minutes before the morning Kakad Aarti of our followed temples, with a direct link to start live darshan.',
    communityBenefit:
      'Ensures no devotee misses the auspicious Brahma Muhurat morning aarti of their beloved deity regardless of timezone.',
    category: 'NOTIFICATIONS',
    priority: 'HIGH',
    status: 'PLANNED',
    upvotesCount: 195,
    upvotedByUser: false,
    submitterName: 'Sneha Joshi',
    submitterAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
    submittedAt: '2026-09-05',
    progressPercentage: 40,
    targetSprint: 'Sprint 7 • Q4 2026',
    devTeamNote:
      'Architecture planned: Integrating Web Push API and scheduled cron notifications linked to temple kakad aarti schedules.',
    tags: ['Aarti', 'Alarm', 'Darshan', 'Notifications'],
    comments: [
      {
        id: 'c-3',
        authorName: 'Aarti Patil',
        authorAvatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150',
        content: 'Would love having custom bell chimes for different temples!',
        createdAt: '2026-09-07',
      },
    ],
  },
  {
    id: 'feat-3',
    title: '360° Virtual Parikrama (Pradakshina) for Major Devasthans',
    description:
      'An interactive gyro-enabled 360-degree virtual walking tour around the temple sanctum (Garbhagriha) to experience authentic sacred pradakshina from anywhere in the world.',
    communityBenefit:
      'Elderly devotees, hospitalised patients, and devotees living abroad can partake in full sacred parikrama and feel virtually present at the sanctum.',
    category: 'TEMPLE_DARSHAN',
    priority: 'MEDIUM',
    status: 'UNDER_REVIEW',
    upvotesCount: 162,
    upvotedByUser: false,
    submitterName: 'Rameshwar Shinde',
    submitterAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
    submittedAt: '2026-09-08',
    devTeamNote:
      'Reviewing feasibility with temple trusts in Trimbakeshwar, Shirdi, and Tuljapur for high-resolution 360 camera scans.',
    tags: ['360 View', 'Parikrama', 'Virtual Darshan'],
    comments: [],
  },
  {
    id: 'feat-4',
    title: 'Sanskrit & Marathi Shloka Pronunciation Trainer with Audio Kara-oke',
    description:
      'Interactive line-by-line guide for difficult stotras (like Vishnu Sahasranama, Mahishasura Mardini, Ganpati Atharvashirsha) with word-by-word pronunciation highlights, syllable breaks, and speed controls.',
    communityBenefit:
      'Helps younger generation and devotees of all backgrounds chant sacred mantras with correct Vedic Vedic phonetics and swaras.',
    category: 'MEDIA_AUDIO',
    priority: 'HIGH',
    status: 'IN_DEVELOPMENT',
    upvotesCount: 218,
    upvotedByUser: true,
    submitterName: 'Dr. Vaidehi Kane',
    submitterAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150',
    submittedAt: '2026-09-01',
    progressPercentage: 60,
    targetSprint: 'Sprint 6 • Release Oct 2026',
    devTeamNote:
      'Vedic phonetic audio waveforms and synced timestamps are being mapped for the top 20 stotras in English and Devanagari.',
    tags: ['Shloka', 'Pronunciation', 'Sanskrit', 'Learning'],
    comments: [
      {
        id: 'c-4',
        authorName: 'Anant Dev Team',
        isDevTeam: true,
        content: 'First prototype will include Ganpati Atharvashirsha and Hanuman Chalisa with slow tempo mode.',
        createdAt: '2026-09-07',
      },
    ],
  },
  {
    id: 'feat-5',
    title: 'Daily Vedic Panchang & Tithi Lockscreen Widget for Mobile',
    description:
      'A compact home screen and lockscreen widget showing today’s Tithi, Nakshatra, Rahu Kaal, Shubh Muhurat, and upcoming Ekadashi / Pradosh fasts at a single glance.',
    communityBenefit:
      'Devotees do not have to open the app every morning to check the auspicious muhurat and daily vrat rules.',
    category: 'PANCHANG_CALENDAR',
    priority: 'CRITICAL',
    status: 'COMPLETED',
    upvotesCount: 312,
    upvotedByUser: true,
    submitterName: 'Kishore Mahajan',
    submitterAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
    submittedAt: '2026-08-15',
    progressPercentage: 100,
    targetSprint: 'Shipped in v2.4',
    devTeamNote:
      'Feature delivered: Live Panchang card, quick top-bar toggle, and calendar view are now fully active across all platforms.',
    tags: ['Panchang', 'Widget', 'Muhurat', 'Tithi'],
    comments: [],
  },
  {
    id: 'feat-6',
    title: 'Akhand Jaap Community Chanting Marathon with Live Counters',
    description:
      'Organize temple-wide or global community sankalps (e.g. 10 Lakh Om Namah Shivaya chants for Shravan) where devotees worldwide chant together in real-time and see the collective bead counter climb live.',
    communityBenefit:
      'Unites devotees globally in unified collective prayer, creating profound spiritual vibration and shared accomplishment.',
    category: 'COMMUNITY_SEVA',
    priority: 'MEDIUM',
    status: 'PLANNED',
    upvotesCount: 134,
    upvotedByUser: false,
    submitterName: 'Ganesh Sawant',
    submitterAvatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150',
    submittedAt: '2026-09-09',
    progressPercentage: 25,
    targetSprint: 'Sprint 8 • Q4 2026',
    devTeamNote:
      'Designing real-time WebSocket sync engine to handle 50,000+ simultaneous chanter counts without server latency.',
    tags: ['Community', 'Akhand Jaap', 'Global Sankalp'],
    comments: [],
  },
];

const CATEGORY_DETAILS: Record<
  FeatureCategory,
  { labelEn: string; labelMr: string; labelHi: string; icon: string }
> = {
  JAAP_MALA: {
    labelEn: 'Jaap Mala & Sadhana',
    labelMr: 'नामजप माळ व साधना',
    labelHi: 'नाम जप माला व साधना',
    icon: '📿',
  },
  TEMPLE_DARSHAN: {
    labelEn: 'Daily Darshan & Temples',
    labelMr: 'दैनिक दर्शन व मंदिरे',
    labelHi: 'दैनिक दर्शन व मंदिर',
    icon: '🛕',
  },
  MEDIA_AUDIO: {
    labelEn: 'Sacred Audio & Bhajans',
    labelMr: 'भजने, आरत्या व संगीत',
    labelHi: 'भजन, आरती व संगीत',
    icon: '🎵',
  },
  BLOGS_DISCOURSE: {
    labelEn: 'Spiritual Blogs & Gurus',
    labelMr: 'आध्यात्मिक ब्लॉग व गुरु प्रवचने',
    labelHi: 'आध्यात्मिक ब्लॉग व प्रवचन',
    icon: '📖',
  },
  PANCHANG_CALENDAR: {
    labelEn: 'Panchang & Muhurats',
    labelMr: 'पंचांग व शुभ मुहूर्त',
    labelHi: 'पंचांग व शुभ मुहूर्त',
    icon: '📅',
  },
  NOTIFICATIONS: {
    labelEn: 'Alerts & WhatsApp',
    labelMr: 'सूचना व व्हॉट्सॲप मेसेज',
    labelHi: 'सूचना व व्हाट्सएप संदेश',
    icon: '🔔',
  },
  MOBILE_UX: {
    labelEn: 'Mobile App & Offline Mode',
    labelMr: 'ॲप अनुभव व ऑफलाइन मोड',
    labelHi: 'ऐप अनुभव व ऑफलाइन मोड',
    icon: '📱',
  },
  COMMUNITY_SEVA: {
    labelEn: 'Community & Collective Seva',
    labelMr: 'सामूहिक सेवा व सत्संग',
    labelHi: 'सामूहिक सेवा व सत्संग',
    icon: '🤝',
  },
};

export const FeatureFeedbackView: React.FC<FeatureFeedbackViewProps> = ({
  currentUser,
  language,
  onNavigate,
}) => {
  // 1. Persistent state for Feature Requests
  const [featureItems, setFeatureItems] = useState<FeatureRequirementItem[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('anant_feature_requests');
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) return parsed;
        }
      } catch {}
    }
    return INITIAL_FEATURE_REQUESTS;
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('anant_feature_requests', JSON.stringify(featureItems));
    }
  }, [featureItems]);

  // Filters and UI states
  const [selectedStatusTab, setSelectedStatusTab] = useState<'ALL' | FeatureStatus>('ALL');
  const [selectedCategory, setSelectedCategory] = useState<'ALL' | FeatureCategory>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'VOTES' | 'RECENT' | 'PROGRESS'>('VOTES');

  // New Request Form Modal / Drawer State
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState<FeatureCategory>('JAAP_MALA');
  const [newPriority, setNewPriority] = useState<FeaturePriority>('HIGH');
  const [newDescription, setNewDescription] = useState('');
  const [newBenefit, setNewBenefit] = useState('');
  const [newContact, setNewContact] = useState('');
  const [newTagsInput, setNewTagsInput] = useState('');
  const [formSubmittedSuccess, setFormSubmittedSuccess] = useState(false);

  // Active commenting item
  const [expandedCommentItemId, setExpandedCommentItemId] = useState<string | null>(null);
  const [commentInput, setCommentInput] = useState('');

  // Upvoting handler
  const handleToggleUpvote = (id: string) => {
    setFeatureItems((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const wasUpvoted = item.upvotedByUser;
          return {
            ...item,
            upvotedByUser: !wasUpvoted,
            upvotesCount: wasUpvoted ? item.upvotesCount - 1 : item.upvotesCount + 1,
          };
        }
        return item;
      })
    );
  };

  // Submit new feature requirement
  const handleSubmitNewFeature = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newDescription.trim() || !newBenefit.trim()) return;

    const tags = newTagsInput
      .split(',')
      .map((t) => t.trim())
      .filter((t) => t.length > 0);

    const newItem: FeatureRequirementItem = {
      id: `feat-${Date.now()}`,
      title: newTitle.trim(),
      description: newDescription.trim(),
      communityBenefit: newBenefit.trim(),
      category: newCategory,
      priority: newPriority,
      status: 'UNDER_REVIEW',
      upvotesCount: 1,
      upvotedByUser: true,
      submitterName: currentUser.profile.displayName || currentUser.username,
      submitterAvatar: currentUser.profile.avatarUrl,
      submitterContact: newContact.trim() || undefined,
      submittedAt: new Date().toISOString().split('T')[0],
      progressPercentage: 5,
      targetSprint: 'Under Assessment by Product Team',
      devTeamNote: 'Requirement received. Product and engineering team are reviewing this feature proposal.',
      tags: tags.length > 0 ? tags : ['Community Request', newCategory],
      comments: [
        {
          id: `c-${Date.now()}`,
          authorName: 'Anant Dev Team',
          isDevTeam: true,
          content: 'Thank you for this valuable suggestion! Devotees can now upvote this requirement so our development team can prioritize it.',
          createdAt: new Date().toISOString().split('T')[0],
        },
      ],
    };

    setFeatureItems((prev) => [newItem, ...prev]);
    setFormSubmittedSuccess(true);
    setTimeout(() => {
      setFormSubmittedSuccess(false);
      setIsSubmitModalOpen(false);
      // Reset form
      setNewTitle('');
      setNewDescription('');
      setNewBenefit('');
      setNewContact('');
      setNewTagsInput('');
    }, 1500);
  };

  // Add comment to an item
  const handleAddComment = (itemId: string) => {
    if (!commentInput.trim()) return;
    const newComment: FeatureComment = {
      id: `comm-${Date.now()}`,
      authorName: currentUser.profile.displayName || currentUser.username,
      authorAvatar: currentUser.profile.avatarUrl,
      content: commentInput.trim(),
      createdAt: new Date().toISOString().split('T')[0],
    };

    setFeatureItems((prev) =>
      prev.map((item) => {
        if (item.id === itemId) {
          return {
            ...item,
            comments: [...(item.comments || []), newComment],
          };
        }
        return item;
      })
    );
    setCommentInput('');
  };

  // Filtered & Sorted items
  const filteredItems = useMemo(() => {
    return featureItems
      .filter((item) => {
        // Status filter
        if (selectedStatusTab !== 'ALL' && item.status !== selectedStatusTab) {
          return false;
        }
        // Category filter
        if (selectedCategory !== 'ALL' && item.category !== selectedCategory) {
          return false;
        }
        // Search query
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchTitle = item.title.toLowerCase().includes(q);
          const matchDesc = item.description.toLowerCase().includes(q);
          const matchBenefit = item.communityBenefit.toLowerCase().includes(q);
          const matchTags = item.tags?.some((t) => t.toLowerCase().includes(q));
          if (!matchTitle && !matchDesc && !matchBenefit && !matchTags) {
            return false;
          }
        }
        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'VOTES') {
          return b.upvotesCount - a.upvotesCount;
        } else if (sortBy === 'RECENT') {
          return new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime();
        } else {
          return (b.progressPercentage || 0) - (a.progressPercentage || 0);
        }
      });
  }, [featureItems, selectedStatusTab, selectedCategory, searchQuery, sortBy]);

  // Status Metrics
  const metrics = useMemo(() => {
    const total = featureItems.length;
    const inDev = featureItems.filter((i) => i.status === 'IN_DEVELOPMENT').length;
    const planned = featureItems.filter((i) => i.status === 'PLANNED').length;
    const completed = featureItems.filter((i) => i.status === 'COMPLETED').length;
    const totalVotes = featureItems.reduce((acc, i) => acc + i.upvotesCount, 0);
    return { total, inDev, planned, completed, totalVotes };
  }, [featureItems]);

  const getStatusBadge = (status: FeatureStatus) => {
    switch (status) {
      case 'UNDER_REVIEW':
        return {
          labelEn: 'Under Review',
          labelMr: 'पुनरावलोकन चालू',
          labelHi: 'समीक्षाधीन',
          className: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
          icon: Clock,
        };
      case 'PLANNED':
        return {
          labelEn: 'Planned for Dev',
          labelMr: 'नियोजनाधीन',
          labelHi: 'नियोजित',
          className: 'bg-sky-500/15 text-sky-400 border-sky-500/30',
          icon: Compass,
        };
      case 'IN_DEVELOPMENT':
        return {
          labelEn: 'In Development',
          labelMr: 'विकासात चालू',
          labelHi: 'निर्माणाधीन',
          className: 'bg-purple-500/20 text-purple-300 border-purple-500/40 animate-pulse',
          icon: Rocket,
        };
      case 'COMPLETED':
        return {
          labelEn: 'Completed & Live',
          labelMr: 'पूर्ण झाले',
          labelHi: 'पूर्ण व उपलब्ध',
          className: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
          icon: CheckCircle2,
        };
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-20">
      {/* ========================================================= */}
      {/* 1. HERO HEADER WITH COMMUNITY ROADMAP STATS */}
      {/* ========================================================= */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-amber-950/70 via-slate-900 to-slate-950 border border-amber-500/40 p-6 sm:p-8 shadow-2xl">
        <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2.5 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-bold">
              <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
              <span>
                {language === 'MR'
                  ? 'भक्तांसाठी थेट विकास मंच'
                  : language === 'HI'
                  ? 'भक्तों के लिए सीधा विकास मंच'
                  : 'Direct Devotee Feature Engine'}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-slate-100 tracking-tight">
              {language === 'MR' ? (
                <>
                  वैशिष्ट्य मागणी व अभिप्राय{' '}
                  <span className="text-amber-400 font-serif font-normal">(Development)</span>
                </>
              ) : language === 'HI' ? (
                <>
                  सुविधा मांग एवं फीडबैक{' '}
                  <span className="text-amber-400 font-serif font-normal">(विकास कार्य)</span>
                </>
              ) : (
                <>
                  Feature Requirement &amp; Feedback{' '}
                  <span className="text-amber-400 font-serif font-normal">(Roadmap)</span>
                </>
              )}
            </h1>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              {language === 'MR'
                ? 'येथे आपल्या आवश्यक नवीन सुविधा व अभिप्राय नोंदवा. आमची विकास टीम हे तपासून सर्वांसाठी उपयुक्त ठरेल अशा पद्धतीने ॲपमध्ये विकसित करेल. इतर भक्तांच्या मागण्यांवर मत (Vote) नोंदवा!'
                : language === 'HI'
                ? 'यहाँ अपनी आवश्यक नई सुविधाएं और फीडबैक दर्ज करें। हमारी डेवलपर टीम इसे समीक्षा कर सभी भक्तों के कल्याण हेतु विकसित करेगी। अन्य भक्तों के सुझावों पर भी वोट करें!'
                : 'Suggest new features, report requirements, and upvote community ideas. Our developer team directly prioritizes and builds the highest-voted spiritual features so it benefits everyone!'}
            </p>
          </div>

          {/* Quick Submit CTA Button */}
          <div className="flex-shrink-0">
            <button
              id="open-submit-feedback-modal-btn"
              onClick={() => setIsSubmitModalOpen(true)}
              className="w-full sm:w-auto px-5 py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black text-sm shadow-xl shadow-amber-950/50 flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
            >
              <Plus className="w-5 h-5 stroke-[2.5]" />
              <span>
                {language === 'MR'
                  ? 'नवीन मागणी / अभिप्राय नोंदवा'
                  : language === 'HI'
                  ? 'नया सुझाव / मांग दर्ज करें'
                  : 'Submit Feature Requirement'}
              </span>
            </button>
          </div>
        </div>

        {/* Live Metrics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-slate-800/80">
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-3 text-center">
            <p className="text-xl sm:text-2xl font-black text-slate-100">{metrics.total}</p>
            <p className="text-[11px] text-slate-400 font-medium">Total Requirements</p>
          </div>
          <div className="bg-purple-950/30 border border-purple-800/40 rounded-2xl p-3 text-center">
            <p className="text-xl sm:text-2xl font-black text-purple-300">{metrics.inDev}</p>
            <p className="text-[11px] text-purple-300/80 font-medium">In Development ⚙️</p>
          </div>
          <div className="bg-sky-950/30 border border-sky-800/40 rounded-2xl p-3 text-center">
            <p className="text-xl sm:text-2xl font-black text-sky-300">{metrics.planned}</p>
            <p className="text-[11px] text-sky-300/80 font-medium">Planned in Sprint 📌</p>
          </div>
          <div className="bg-emerald-950/30 border border-emerald-800/40 rounded-2xl p-3 text-center">
            <p className="text-xl sm:text-2xl font-black text-emerald-300">{metrics.completed}</p>
            <p className="text-[11px] text-emerald-300/80 font-medium">Delivered &amp; Live ✅</p>
          </div>
        </div>
      </div>

      {/* ========================================================= */}
      {/* 2. SEARCH, CATEGORY PILLS & STATUS FILTER BAR */}
      {/* ========================================================= */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-4 sm:p-5 space-y-4">
        {/* Status Stage Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {(
            [
              { id: 'ALL', labelEn: 'All Requests', labelMr: 'सर्व मागण्या', labelHi: 'सभी मांग' },
              {
                id: 'IN_DEVELOPMENT',
                labelEn: 'In Development',
                labelMr: 'विकासात चालू ⚙️',
                labelHi: 'निर्माणाधीन ⚙️',
              },
              {
                id: 'PLANNED',
                labelEn: 'Planned in Sprint',
                labelMr: 'नियोजित 📌',
                labelHi: 'नियोजित 📌',
              },
              {
                id: 'UNDER_REVIEW',
                labelEn: 'Under Review',
                labelMr: 'पुनरावलोकन 🔍',
                labelHi: 'समीक्षाधीन 🔍',
              },
              {
                id: 'COMPLETED',
                labelEn: 'Completed / Live',
                labelMr: 'पूर्ण झाले ✅',
                labelHi: 'पूर्ण ✅',
              },
            ] as const
          ).map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedStatusTab(tab.id)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                selectedStatusTab === tab.id
                  ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                  : 'bg-slate-800/70 text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              {language === 'MR' ? tab.labelMr : language === 'HI' ? tab.labelHi : tab.labelEn}
            </button>
          ))}
        </div>

        {/* Search & Sort Row */}
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder={
                language === 'MR'
                  ? 'मागणी, वैशिष्ट्य किंवा विषय शोधा...'
                  : language === 'HI'
                  ? 'सुविधा, मांग या विषय खोजें...'
                  : 'Search feature requirements, keywords, or benefits...'
              }
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            {/* Category Dropdown */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value as any)}
              className="flex-1 sm:flex-none px-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500/50 cursor-pointer"
            >
              <option value="ALL">All Categories / सर्व विभाग</option>
              {Object.entries(CATEGORY_DETAILS).map(([key, val]) => (
                <option key={key} value={key}>
                  {val.icon} {language === 'MR' ? val.labelMr : language === 'HI' ? val.labelHi : val.labelEn}
                </option>
              ))}
            </select>

            {/* Sort By Dropdown */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="flex-1 sm:flex-none px-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500/50 cursor-pointer"
            >
              <option value="VOTES">Most Upvoted / सर्वाधिक मते</option>
              <option value="RECENT">Newest First / नवीन</option>
              <option value="PROGRESS">Dev Progress / प्रगती</option>
            </select>
          </div>
        </div>
      </div>

      {/* ========================================================= */}
      {/* 3. LIST OF COMMUNITY FEATURE REQUIREMENTS */}
      {/* ========================================================= */}
      {filteredItems.length === 0 ? (
        <div className="text-center py-16 bg-slate-900/50 border border-slate-800 rounded-3xl p-8 space-y-4">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <Lightbulb className="w-7 h-7" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-200">
              {language === 'MR'
                ? 'कोणतीही मागणी आढळली नाही'
                : language === 'HI'
                ? 'कोई मांग नहीं मिली'
                : 'No requirements match your filter'}
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              {language === 'MR'
                ? 'आपण स्वतः नवीन वैशिष्ट्याची मागणी नोंदवून विकास सुरू करू शकता!'
                : language === 'HI'
                ? 'आप स्वयं नई सुविधा की मांग दर्ज कर विकास शुरू करा सकते हैं!'
                : 'Be the first to submit this feature requirement for our developer team!'}
            </p>
          </div>
          <button
            onClick={() => setIsSubmitModalOpen(true)}
            className="px-4 py-2 bg-amber-500 text-slate-950 font-bold text-xs rounded-xl shadow cursor-pointer hover:bg-amber-400"
          >
            + Submit This Feature
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredItems.map((item) => {
            const statusInfo = getStatusBadge(item.status);
            const StatusIcon = statusInfo.icon;
            const cat = CATEGORY_DETAILS[item.category] || CATEGORY_DETAILS.JAAP_MALA;

            return (
              <div
                key={item.id}
                className="bg-slate-900/90 border border-slate-800 hover:border-slate-700/80 rounded-3xl p-5 sm:p-6 shadow-xl transition-all space-y-4"
              >
                {/* Header Row: Upvote & Title & Status */}
                <div className="flex items-start gap-4">
                  {/* Upvote Pill Button */}
                  <button
                    onClick={() => handleToggleUpvote(item.id)}
                    title="Vote for this feature to be developed"
                    className={`flex flex-col items-center justify-center min-w-[54px] p-2.5 rounded-2xl border transition-all cursor-pointer ${
                      item.upvotedByUser
                        ? 'bg-amber-500/20 border-amber-500 text-amber-300 shadow-md shadow-amber-500/20'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                    }`}
                  >
                    <ThumbsUp
                      className={`w-5 h-5 mb-1 transition-transform ${
                        item.upvotedByUser ? 'scale-110 fill-amber-400 text-amber-400' : ''
                      }`}
                    />
                    <span className="text-xs font-black">{item.upvotesCount}</span>
                    <span className="text-[9px] uppercase font-bold tracking-wider">
                      {item.upvotedByUser ? 'Voted' : 'Vote'}
                    </span>
                  </button>

                  {/* Main Info */}
                  <div className="flex-1 space-y-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-lg bg-slate-800 text-slate-300 border border-slate-700 flex items-center gap-1">
                        <span>{cat.icon}</span>
                        <span>
                          {language === 'MR' ? cat.labelMr : language === 'HI' ? cat.labelHi : cat.labelEn}
                        </span>
                      </span>

                      <span
                        className={`text-[11px] font-bold px-2.5 py-0.5 rounded-lg border flex items-center gap-1 ${statusInfo.className}`}
                      >
                        <StatusIcon className="w-3 h-3" />
                        <span>
                          {language === 'MR'
                            ? statusInfo.labelMr
                            : language === 'HI'
                            ? statusInfo.labelHi
                            : statusInfo.labelEn}
                        </span>
                      </span>

                      {item.targetSprint && (
                        <span className="text-[10px] font-mono text-slate-400 px-2 py-0.5 bg-slate-950 rounded-md border border-slate-800">
                          {item.targetSprint}
                        </span>
                      )}
                    </div>

                    <h2 className="text-base sm:text-lg font-bold text-slate-100 leading-snug">
                      {item.title}
                    </h2>

                    <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>

                {/* "Useful for Everyone" Community Benefit Highlight Box */}
                <div className="bg-amber-950/20 border border-amber-500/30 rounded-2xl p-3.5 space-y-1">
                  <div className="flex items-center gap-1.5 text-amber-400 text-xs font-bold">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>
                      {language === 'MR'
                        ? 'सर्वांसाठी उपयुक्तता (Community Benefit):'
                        : language === 'HI'
                        ? 'सभी भक्तों के लिए लाभ (Community Benefit):'
                        : 'How this will be useful for everyone:'}
                    </span>
                  </div>
                  <p className="text-xs text-amber-200/90 leading-relaxed pl-5">
                    {item.communityBenefit}
                  </p>
                </div>

                {/* Development Progress Bar (if in dev or planned) */}
                {typeof item.progressPercentage === 'number' && (
                  <div className="space-y-1.5 pt-1">
                    <div className="flex items-center justify-between text-[11px] text-slate-400">
                      <span className="flex items-center gap-1">
                        <Rocket className="w-3 h-3 text-purple-400" />
                        <span>Development Progress</span>
                      </span>
                      <span className="font-mono font-bold text-purple-300">
                        {item.progressPercentage}%
                      </span>
                    </div>
                    <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                      <div
                        className="h-full bg-gradient-to-r from-amber-500 via-orange-500 to-purple-500 transition-all duration-500 rounded-full"
                        style={{ width: `${item.progressPercentage}%` }}
                      />
                    </div>
                  </div>
                )}

                {/* Developer Team Official Note */}
                {item.devTeamNote && (
                  <div className="bg-slate-950/80 border border-purple-500/30 rounded-xl p-3 flex items-start gap-2 text-xs">
                    <div className="w-5 h-5 rounded-lg bg-purple-500/20 text-purple-400 flex items-center justify-center flex-shrink-0 mt-0.5">
                      ⚙️
                    </div>
                    <div className="space-y-0.5">
                      <span className="font-bold text-purple-300 text-[11px] uppercase tracking-wider">
                        Anant Developer Update
                      </span>
                      <p className="text-slate-300 text-[11px] leading-relaxed">
                        {item.devTeamNote}
                      </p>
                    </div>
                  </div>
                )}

                {/* Footer: Submitter info, tags & Comments Toggle */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-800/80 text-xs text-slate-400">
                  <div className="flex items-center gap-2">
                    {item.submitterAvatar ? (
                      <img
                        src={item.submitterAvatar}
                        alt={item.submitterName}
                        className="w-5 h-5 rounded-full object-cover border border-slate-700"
                      />
                    ) : (
                      <UserIcon className="w-4 h-4 text-slate-400" />
                    )}
                    <span>
                      Suggested by <strong className="text-slate-200">{item.submitterName}</strong> •{' '}
                      {item.submittedAt}
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      onClick={() =>
                        setExpandedCommentItemId(
                          expandedCommentItemId === item.id ? null : item.id
                        )
                      }
                      className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-300 hover:text-white cursor-pointer transition-colors"
                    >
                      <MessageSquare className="w-3.5 h-3.5 text-amber-400" />
                      <span>
                        {item.comments?.length || 0}{' '}
                        {item.comments?.length === 1 ? 'Discussion' : 'Discussions'}
                      </span>
                    </button>
                  </div>
                </div>

                {/* Comments & Discussion Thread */}
                {expandedCommentItemId === item.id && (
                  <div className="pt-3 border-t border-slate-800 space-y-3">
                    <h4 className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                      <MessageSquare className="w-3.5 h-3.5 text-amber-400" />
                      <span>Community Devotee Discussion &amp; Feedback</span>
                    </h4>

                    {item.comments && item.comments.length > 0 ? (
                      <div className="space-y-2">
                        {item.comments.map((c) => (
                          <div
                            key={c.id}
                            className={`p-3 rounded-2xl text-xs space-y-1 border ${
                              c.isDevTeam
                                ? 'bg-purple-950/25 border-purple-800/40 text-purple-200'
                                : 'bg-slate-950 border-slate-800 text-slate-300'
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <span className="font-bold flex items-center gap-1.5">
                                {c.authorAvatar && (
                                  <img
                                    src={c.authorAvatar}
                                    alt={c.authorName}
                                    className="w-4 h-4 rounded-full object-cover"
                                  />
                                )}
                                <span className={c.isDevTeam ? 'text-purple-300' : 'text-slate-200'}>
                                  {c.authorName}
                                </span>
                                {c.isDevTeam && (
                                  <span className="text-[9px] bg-purple-500 text-slate-950 font-black px-1.5 py-0.2 rounded">
                                    Dev Team
                                  </span>
                                )}
                              </span>
                              <span className="text-[10px] text-slate-500">{c.createdAt}</span>
                            </div>
                            <p className="text-slate-300 text-[11px] leading-relaxed">{c.content}</p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-[11px] text-slate-500 italic">
                        No thoughts shared yet. Be the first to share your input on this feature!
                      </p>
                    )}

                    {/* Add comment input */}
                    <div className="flex items-center gap-2 pt-1">
                      <input
                        type="text"
                        placeholder="Add your thought or use-case for this feature..."
                        value={commentInput}
                        onChange={(e) => setCommentInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') handleAddComment(item.id);
                        }}
                        className="flex-1 px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-amber-500/50"
                      />
                      <button
                        onClick={() => handleAddComment(item.id)}
                        className="p-2 rounded-xl bg-amber-500 text-slate-950 font-bold hover:bg-amber-400 transition-colors cursor-pointer"
                      >
                        <Send className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* ========================================================= */}
      {/* 4. MODAL: SUBMIT FEATURE REQUIREMENT & FEEDBACK */}
      {/* ========================================================= */}
      {isSubmitModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
          <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl p-6 sm:p-8 space-y-5 my-8">
            {formSubmittedSuccess ? (
              <div className="text-center py-10 space-y-3">
                <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500 text-emerald-400 flex items-center justify-center mx-auto animate-bounce">
                  <Check className="w-8 h-8 stroke-[3]" />
                </div>
                <h3 className="text-xl font-black text-slate-100">
                  {language === 'MR'
                    ? 'आपली मागणी यशस्वीरित्या नोंदवली गेली!'
                    : language === 'HI'
                    ? 'आपकी मांग सफलतापूर्वक दर्ज की गई!'
                    : 'Feature Requirement Submitted!'}
                </h3>
                <p className="text-xs text-slate-400 max-w-md mx-auto">
                  {language === 'MR'
                    ? 'आमची विकास टीम यावर अभ्यास करून आवश्यकतेनुसार विकासात आणेल. इतर भक्तही आता यावर मतदान करू शकतात.'
                    : language === 'HI'
                    ? 'हमारी डेवलपर टीम इस पर अध्ययन कर इसे विकास में लाएगी ताकि यह सभी के लिए उपयोगी बन सके।'
                    : 'Your feature request has been added to our development backlog. The community can now upvote it, and our team will prioritize its release!'}
                </p>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center">
                      <Lightbulb className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-lg font-black text-slate-100">
                        {language === 'MR'
                          ? 'नवीन वैशिष्ट्य मागणी व अभिप्राय'
                          : language === 'HI'
                          ? 'नई सुविधा मांग एवं फीडबैक'
                          : 'Feature Requirement & Feedback'}
                      </h3>
                      <p className="text-[11px] text-slate-400">
                        Put it for development so it will be useful for everyone
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => setIsSubmitModalOpen(false)}
                    className="text-slate-400 hover:text-white p-2 rounded-xl hover:bg-slate-800 cursor-pointer"
                  >
                    ✕
                  </button>
                </div>

                <form onSubmit={handleSubmitNewFeature} className="space-y-4 text-xs">
                  {/* Title */}
                  <div>
                    <label className="block text-slate-300 font-bold mb-1">
                      Feature Title / वैशिष्ट्याचे नाव <span className="text-rose-400">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Offline Audio download for Daily Chants, or Temple Aarti Live Alarm"
                      value={newTitle}
                      onChange={(e) => setNewTitle(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                    />
                  </div>

                  {/* Category & Priority Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-300 font-bold mb-1">
                        Category / विभाग <span className="text-rose-400">*</span>
                      </label>
                      <select
                        value={newCategory}
                        onChange={(e) => setNewCategory(e.target.value as any)}
                        className="w-full px-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500/50 cursor-pointer"
                      >
                        {Object.entries(CATEGORY_DETAILS).map(([key, val]) => (
                          <option key={key} value={key}>
                            {val.icon} {val.labelEn}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-slate-300 font-bold mb-1">
                        Priority Level / निकड <span className="text-rose-400">*</span>
                      </label>
                      <select
                        value={newPriority}
                        onChange={(e) => setNewPriority(e.target.value as any)}
                        className="w-full px-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500/50 cursor-pointer"
                      >
                        <option value="CRITICAL">Critical / अत्यंत आवश्यक</option>
                        <option value="HIGH">High Impact / महत्त्वपूर्ण</option>
                        <option value="MEDIUM">Medium / मध्यम</option>
                        <option value="NICE_TO_HAVE">Nice to have / चांगली भर</option>
                      </select>
                    </div>
                  </div>

                  {/* Specific "How it will be useful for everyone" */}
                  <div className="bg-amber-950/20 border border-amber-500/40 rounded-2xl p-3.5 space-y-1.5">
                    <label className="block text-amber-300 font-bold flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                      <span>
                        How will this feature be useful for everyone? (कसे सर्वांसाठी उपयुक्त ठरेल?){' '}
                        <span className="text-rose-400">*</span>
                      </span>
                    </label>
                    <textarea
                      required
                      rows={2}
                      placeholder="Explain the wider benefit for all devotees, temple trusts, or the community..."
                      value={newBenefit}
                      onChange={(e) => setNewBenefit(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-950/90 border border-slate-800 rounded-xl text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                    />
                  </div>

                  {/* Detailed Description */}
                  <div>
                    <label className="block text-slate-300 font-bold mb-1">
                      Detailed Requirement / सविस्तर माहिती <span className="text-rose-400">*</span>
                    </label>
                    <textarea
                      required
                      rows={3}
                      placeholder="Describe how the feature should work, what screens it should appear on, or what problem it solves..."
                      value={newDescription}
                      onChange={(e) => setNewDescription(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                    />
                  </div>

                  {/* Contact / WhatsApp (Optional) */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-300 font-bold mb-1">
                        Your WhatsApp / Email (Optional, for Dev Follow-up)
                      </label>
                      <input
                        type="text"
                        placeholder="+91 9876543210 or email@domain.com"
                        value={newContact}
                        onChange={(e) => setNewContact(e.target.value)}
                        className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-300 font-bold mb-1">
                        Keywords / Tags (Comma separated)
                      </label>
                      <input
                        type="text"
                        placeholder="audio, offline, darshan, pass"
                        value={newTagsInput}
                        onChange={(e) => setNewTagsInput(e.target.value)}
                        className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                      />
                    </div>
                  </div>

                  {/* Submit Actions */}
                  <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                    <button
                      type="button"
                      onClick={() => setIsSubmitModalOpen(false)}
                      className="px-4 py-2.5 rounded-xl text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-750 font-bold cursor-pointer"
                    >
                      Cancel
                    </button>

                    <button
                      type="submit"
                      className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black shadow-lg shadow-amber-950/50 cursor-pointer flex items-center gap-2"
                    >
                      <Send className="w-4 h-4" />
                      <span>Submit for Development</span>
                    </button>
                  </div>
                </form>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default FeatureFeedbackView;
