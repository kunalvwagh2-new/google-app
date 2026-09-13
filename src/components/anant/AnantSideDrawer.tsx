import React from 'react';
import {
  X,
  Home,
  Film,
  Sparkles,
  Landmark,
  BookOpen,
  Calendar,
  Users,
  ShieldCheck,
  Languages,
  ChevronRight,
  ExternalLink,
  Flame,
  Radio,
  Building2,
  Server,
  Phone,
  KeyRound,
  Settings,
  Bookmark,
  Music,
  Share2,
  Lightbulb,
} from 'lucide-react';
import { User } from '../../types.ts';
import { SupportedLanguage } from '../../types/anant.ts';

interface AnantSideDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  activeTab: string;
  onSelectTab: (tab: string) => void;
  currentUser: User;
  language: SupportedLanguage;
  onLanguageChange: (lang: SupportedLanguage) => void;
  onOpenPanchang: () => void;
  onOpenAuth?: () => void;
  onOpenTrustRegister?: () => void;
  onOpenSuperAdminQueue?: () => void;
  onOpenDevOps?: () => void;
  onOpenShareModal?: () => void;
}

export function AnantSideDrawer({
  isOpen,
  onClose,
  activeTab,
  onSelectTab,
  currentUser,
  language,
  onLanguageChange,
  onOpenPanchang,
  onOpenAuth = () => {},
  onOpenTrustRegister = () => {},
  onOpenSuperAdminQueue = () => {},
  onOpenDevOps = () => {},
  onOpenShareModal,
}: AnantSideDrawerProps) {
  if (!isOpen) return null;

  const navItems = [
    {
      id: 'feed',
      labelEn: 'Home',
      labelMr: 'मुखपृष्ठ (होम)',
      labelHi: 'होम',
      icon: Home,
      desc: 'Posts from followed temples & devotee friends',
    },
    {
      id: 'blogs',
      labelEn: 'Spiritual Blogs & Darshan',
      labelMr: 'आध्यात्मिक ब्लॉग व दर्शन',
      labelHi: 'आध्यात्मिक ब्लॉग एवं दर्शन',
      icon: BookOpen,
      badge: 'New',
      desc: 'Articles, guru discourses, videos & daily deity darshan',
    },
    {
      id: 'friends',
      labelEn: 'Friends',
      labelMr: 'मित्रमंडळी व सत्संग',
      labelHi: 'मित्र एवं सत्संग',
      icon: Users,
      desc: 'Connect with fellow devotees separately from temples',
    },
    {
      id: 'temples',
      labelEn: 'Temples',
      labelMr: 'मंदिरे व तीर्थक्षेत्रे',
      labelHi: 'मंदिर निर्देशिका',
      icon: Landmark,
      desc: 'Explore, follow & book live sanctum darshan',
    },
    {
      id: 'trust_admin',
      labelEn: 'Temple admin',
      labelMr: 'मंदिर प्रशासन कक्ष',
      labelHi: 'मंदिर एडमिन पोर्टल',
      icon: ShieldCheck,
      badge: 'RBAC',
      desc: '5-Seat Team, Social Hub, Rituals, Donations & Trust Compliance',
    },
    {
      id: 'saved',
      labelEn: 'Saved posts',
      labelMr: 'जतन केलेल्या पोस्ट',
      labelHi: 'सहेजे गए पोस्ट',
      icon: Bookmark,
      desc: 'Bookmarked sacred shlokas, photos & updates',
    },
    {
      id: 'media',
      labelEn: 'Spiritual library',
      labelMr: 'आध्यात्मिक ग्रंथालय',
      labelHi: 'आध्यात्मिक पुस्तकालय',
      icon: BookOpen,
      badge: 'Library',
      desc: 'Chaturmas granth, sacred texts & scriptures',
    },
    {
      id: 'bhajans',
      labelEn: 'Bhajans & stotras',
      labelMr: 'भजने, आरत्या व स्तोत्रे',
      labelHi: 'भजन, आरती एवं स्तोत्र',
      icon: Music,
      desc: 'Sacred audio tracks, lyrics & chants',
    },
    {
      id: 'calendar',
      labelEn: 'Events calendar',
      labelMr: 'उत्सव दिनदर्शिका व पंचांग',
      labelHi: 'आयोजन कैलेंडर व पंचांग',
      icon: Calendar,
      desc: 'Vedic Panchang, tithis, muhurats & festivals',
    },
    {
      id: 'rosary',
      labelEn: 'Jaap Mala',
      labelMr: 'नामजप माळ व साधना',
      labelHi: 'नाम जप माला',
      icon: Flame,
      badge: '108',
      desc: 'Interactive 108-bead rosary counter with goals & reminders',
    },
    {
      id: 'feedback',
      labelEn: 'Feature Requirement & Feedback',
      labelMr: 'वैशिष्ट्य मागणी व अभिप्राय',
      labelHi: 'सुविधा मांग व फीडबैक',
      icon: Lightbulb,
      badge: 'Dev',
      desc: 'Submit your feature needs and feedback for development to benefit everyone',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* Dimmed Peaceful Backdrop */}
      <div
        className="fixed inset-0 bg-black/75 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Slide-out Drawer Panel */}
      <div className="relative w-full max-w-xs sm:max-w-sm bg-slate-950 border-r border-slate-800 h-full flex flex-col shadow-2xl z-10 overflow-y-auto">
        {/* Drawer Header */}
        <div className="p-5 border-b border-slate-800/80 bg-slate-900/60 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-600 via-orange-500 to-amber-400 flex items-center justify-center text-slate-950 font-black text-lg shadow-md shadow-amber-950/50">
              ॐ
            </div>
            <div>
              <h2 className="font-black text-slate-100 text-base flex items-center gap-1.5">
                Anant <span className="text-amber-400 font-serif text-sm">(अनंत)</span>
              </h2>
              <p className="text-[11px] text-slate-400">Sanctuary of Spiritual Devotion</p>
            </div>
          </div>

          <button
            onClick={onClose}
            aria-label="Close menu"
            className="p-1.5 rounded-xl bg-slate-800 text-slate-400 hover:text-white cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Current User Snapshot in Drawer */}
        <div className="p-4 bg-slate-900/40 border-b border-slate-800/60 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <img
              src={currentUser.profile.avatarUrl}
              alt={currentUser.profile.displayName}
              className="w-10 h-10 rounded-full object-cover border border-amber-500/30"
            />
            <div>
              <p className="font-bold text-xs text-slate-100">{currentUser.profile.displayName}</p>
              <p className="text-[10px] text-amber-400 font-medium">@{currentUser.username}</p>
            </div>
          </div>

          <button
            onClick={() => {
              onSelectTab('profile');
              onClose();
            }}
            className="text-[11px] font-bold text-slate-400 hover:text-amber-400 flex items-center gap-1 cursor-pointer"
          >
            Profile <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Panchang Quick Action Card */}
        <div className="p-4 border-b border-slate-800/60">
          <div
            onClick={() => {
              onOpenPanchang();
              onClose();
            }}
            className="p-3 bg-gradient-to-r from-amber-950/40 to-orange-950/20 border border-amber-800/40 rounded-2xl cursor-pointer hover:border-amber-600 transition-all flex items-center justify-between"
          >
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400">
                <Calendar className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[11px] font-bold text-amber-400 block">
                  दैनिक पंचांग व शुभ मुहूर्त
                </span>
                <span className="text-[10px] text-slate-400 block">
                  भाद्रपद शुक्ल दशमी • सिद्धि योग
                </span>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-amber-400" />
          </div>
        </div>

        {/* Main Navigation Links */}
        <div className="p-3 flex-1 space-y-1">
          <span className="px-3 text-[10px] uppercase tracking-wider font-bold text-slate-500">
            Spiritual Navigation
          </span>

          {navItems.map((item) => {
            const Icon = item.icon;
            const isSelected = activeTab === item.id;
            const label =
              language === 'MR'
                ? item.labelMr
                : language === 'HI'
                ? item.labelHi
                : item.labelEn;

            return (
              <button
                key={item.id}
                onClick={() => {
                  onSelectTab(item.id);
                  onClose();
                }}
                className={`w-full text-left p-2.5 rounded-2xl transition-all cursor-pointer flex items-start gap-3 ${
                  isSelected
                    ? 'bg-amber-500 text-slate-950 shadow-md font-bold'
                    : 'text-slate-300 hover:bg-slate-900 hover:text-white'
                }`}
              >
                <Icon
                  className={`w-5 h-5 mt-0.5 flex-shrink-0 ${
                    isSelected ? 'text-slate-950' : 'text-amber-400'
                  }`}
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold truncate">{label}</span>
                    {item.badge && (
                      <span
                        className={`text-[9px] px-1.5 py-0.5 rounded-md uppercase font-bold tracking-wider ${
                          isSelected
                            ? 'bg-slate-950 text-amber-400'
                            : 'bg-amber-950 text-amber-400 border border-amber-800/40'
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </div>
                  <p
                    className={`text-[10px] truncate ${
                      isSelected ? 'text-slate-900/80' : 'text-slate-500'
                    }`}
                  >
                    {item.desc}
                  </p>
                </div>
              </button>
            );
          })}

          {/* Section: Trust Governance, Admin & Infrastructure */}
          <div className="pt-3 pb-1 border-t border-slate-800/80">
            <span className="px-3 text-[10px] uppercase tracking-wider font-bold text-amber-500/80">
              Governance &amp; Infrastructure
            </span>
          </div>

          {/* Trust Onboarding Trigger */}
          <button
            onClick={() => {
              onOpenTrustRegister();
              onClose();
            }}
            className="w-full text-left p-2.5 rounded-2xl text-slate-300 hover:bg-slate-900 hover:text-white transition-all cursor-pointer flex items-start gap-3"
          >
            <Building2 className="w-5 h-5 mt-0.5 text-amber-400 shrink-0" />
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold truncate">Temple Trust Registration</span>
                <span className="text-[9px] px-1.5 py-0.5 rounded-md uppercase font-bold tracking-wider bg-amber-950 text-amber-400 border border-amber-800/40">
                  Tenant A
                </span>
              </div>
              <p className="text-[10px] text-slate-500 truncate">
                Gov Trust Reg No, 80G, Deed upload &amp; 5 Trustees
              </p>
            </div>
          </button>

          {/* Super Admin Verification Queue Trigger */}
          <button
            onClick={() => {
              onOpenSuperAdminQueue();
              onClose();
            }}
            className="w-full text-left p-2.5 rounded-2xl text-slate-300 hover:bg-slate-900 hover:text-white transition-all cursor-pointer flex items-start gap-3"
          >
            <ShieldCheck className="w-5 h-5 mt-0.5 text-emerald-400 shrink-0" />
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold truncate">Super Admin Review Queue</span>
                <span className="text-[9px] px-1.5 py-0.5 rounded-md uppercase font-bold tracking-wider bg-emerald-950 text-emerald-400 border border-emerald-800/40">
                  Compliance
                </span>
              </div>
              <p className="text-[10px] text-slate-500 truncate">
                Approve temple registrations &amp; issue golden seal
              </p>
            </div>
          </button>

          {/* DevOps Console & Peak Autoscaler Trigger */}
          <button
            onClick={() => {
              onOpenDevOps();
              onClose();
            }}
            className="w-full text-left p-2.5 rounded-2xl text-slate-300 hover:bg-slate-900 hover:text-white transition-all cursor-pointer flex items-start gap-3"
          >
            <Server className="w-5 h-5 mt-0.5 text-cyan-400 shrink-0" />
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold truncate">DevOps &amp; Peak Autoscaler</span>
                <span className="text-[9px] px-1.5 py-0.5 rounded-md uppercase font-bold tracking-wider bg-cyan-950 text-cyan-400 border border-cyan-800/40">
                  K8s HPA
                </span>
              </div>
              <p className="text-[10px] text-slate-500 truncate">
                Simulate festival surges, CI/CD &amp; PostGIS test
              </p>
            </div>
          </button>

          {/* Mobile OTP Login Trigger */}
          <button
            onClick={() => {
              onOpenAuth();
              onClose();
            }}
            className="w-full text-left p-2.5 rounded-2xl text-slate-300 hover:bg-slate-900 hover:text-white transition-all cursor-pointer flex items-start gap-3"
          >
            <Phone className="w-5 h-5 mt-0.5 text-orange-400 shrink-0" />
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold truncate">Mobile OTP Sign In</span>
                <span className="text-[9px] px-1.5 py-0.5 rounded-md uppercase font-bold tracking-wider bg-orange-950 text-orange-400 border border-orange-800/40">
                  6-Digit PIN
                </span>
              </div>
              <p className="text-[10px] text-slate-500 truncate">
                Instant SMS verification with rate-limiting
              </p>
            </div>
          </button>
        </div>

        {/* Settings & Language Selection Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-900/40 space-y-2.5">
          {/* Share App Button */}
          {onOpenShareModal && (
            <button
              id="drawer-share-app-btn"
              onClick={() => {
                onOpenShareModal();
                onClose();
              }}
              className="w-full flex items-center justify-between p-2.5 rounded-2xl text-xs font-bold bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/40 text-amber-300 transition-all cursor-pointer shadow-sm group"
            >
              <div className="flex items-center gap-2.5">
                <Share2 className="w-4 h-4 text-amber-400 group-hover:scale-110 transition-transform" />
                <span>
                  {language === 'HI'
                    ? 'मित्रों एवं परिवार को शेयर करें'
                    : language === 'MR'
                    ? 'मित्र व परिवारास शेअर करा'
                    : 'Share App with Family & Friends'}
                </span>
              </div>
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            </button>
          )}

          {/* Settings button */}
          <button
            onClick={() => {
              onSelectTab('settings');
              onClose();
            }}
            className={`w-full flex items-center justify-between p-2.5 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'settings'
                ? 'bg-amber-500 text-slate-950 shadow'
                : 'bg-slate-950 border border-slate-800 text-slate-300 hover:text-white hover:border-amber-500/40'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Settings className={`w-4 h-4 ${activeTab === 'settings' ? 'text-slate-950 stroke-[2.5]' : 'text-amber-400'}`} />
              <span>{language === 'HI' ? 'सेटिंग्स व गोपनीयता' : language === 'MR' ? 'सेटिंग्ज व गोपनीयता' : 'Settings & Privacy'}</span>
            </div>
            <ChevronRight className="w-4 h-4 opacity-70" />
          </button>

          <div className="flex items-center gap-1.5 text-xs text-slate-400">
            <Languages className="w-3.5 h-3.5 text-amber-400" />
            <span className="font-semibold text-[11px]">Select Language / भाषा निवडा</span>
          </div>

          <div className="grid grid-cols-3 gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
            <button
              onClick={() => onLanguageChange('EN')}
              className={`py-1 rounded-lg font-bold transition-all cursor-pointer ${
                language === 'EN'
                  ? 'bg-amber-500 text-slate-950 shadow'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              English
            </button>
            <button
              onClick={() => onLanguageChange('MR')}
              className={`py-1 rounded-lg font-bold transition-all cursor-pointer ${
                language === 'MR'
                  ? 'bg-amber-500 text-slate-950 shadow'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              मराठी
            </button>
            <button
              onClick={() => onLanguageChange('HI')}
              className={`py-1 rounded-lg font-bold transition-all cursor-pointer ${
                language === 'HI'
                  ? 'bg-amber-500 text-slate-950 shadow'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              हिन्दी
            </button>
          </div>

          <p className="text-[10px] text-slate-500 text-center pt-1">
            Anant v1.4.0 • Built with devotion for temples & devotees
          </p>
        </div>
      </div>
    </div>
  );
}
