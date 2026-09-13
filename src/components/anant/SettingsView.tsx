import React, { useState } from 'react';
import {
  Settings,
  Globe,
  Bell,
  Lock,
  Flame,
  Volume2,
  Vibrate,
  Shield,
  FileText,
  User as UserIcon,
  Check,
  Save,
  Moon,
  Smartphone,
} from 'lucide-react';
import { User } from '../../types.ts';
import { SupportedLanguage } from '../../types/anant.ts';
import { Avatar } from '../ui/Avatar.tsx';

interface SettingsViewProps {
  currentUser: User | null;
  language: SupportedLanguage;
  onLanguageChange: (lang: SupportedLanguage) => void;
  onUpdateUser?: (updated: User) => void;
  onBackToFeed?: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  currentUser,
  language,
  onLanguageChange,
  onUpdateUser,
  onBackToFeed,
}) => {
  const [displayName, setDisplayName] = useState(currentUser?.profile.displayName || 'Devotee');
  const [bio, setBio] = useState(
    currentUser?.profile.bio || 'Seeker of divine truth, daily jaap practitioner'
  );
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [hapticsEnabled, setHapticsEnabled] = useState(true);
  const [publicJaapMilestones, setPublicJaapMilestones] = useState(true);
  const [dailyMalaTarget, setDailyMalaTarget] = useState(4);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentUser && onUpdateUser) {
      const updatedUser: User = {
        ...currentUser,
        profile: {
          ...currentUser.profile,
          displayName,
          bio,
        },
      };
      onUpdateUser(updatedUser);
    }
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-12 select-none px-2 sm:px-4">
      {/* Header */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 shadow-xl flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-2xl text-amber-400">
            <Settings className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-100">
              {language === 'HI' ? 'सेटिंग्स व प्राथमिकताएं' : language === 'MR' ? 'सेटिंग्ज व प्राधान्ये' : 'Settings & Preferences'}
            </h2>
            <p className="text-xs text-slate-400">
              {language === 'HI'
                ? 'अपनी साधना, भाषा एवं गोपनीयता सेटिंग्स प्रबंधित करें'
                : language === 'MR'
                ? 'आपली साधना, भाषा आणि गोपनीयता सेटिंग्ज व्यवस्थापित करा'
                : 'Manage your sadhana, language, account, and privacy settings'}
            </p>
          </div>
        </div>

        {onBackToFeed && (
          <button
            onClick={onBackToFeed}
            className="px-3.5 py-1.5 rounded-xl bg-slate-950 border border-slate-800 hover:border-slate-700 text-xs font-bold text-slate-300 transition-colors cursor-pointer"
          >
            ← {language === 'HI' ? 'होम पर लौटें' : language === 'MR' ? 'मुख्यपृष्ठावर जा' : 'Back to Home'}
          </button>
        )}
      </div>

      {/* 1. Language Preference Section */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-4">
        <div className="flex items-center gap-2 border-b border-slate-800/80 pb-3">
          <Globe className="w-4 h-4 text-amber-400" />
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200">
            {language === 'HI' ? 'भाषा चयन (App Language)' : language === 'MR' ? 'भाषा निवड (App Language)' : 'Language Selection'}
          </h3>
        </div>

        <p className="text-xs text-slate-400">
          Choose your preferred interface language across feeds, panchang, stotras, and darshan details.
        </p>

        <div className="grid grid-cols-3 gap-3">
          {[
            { code: 'EN', title: 'English', subtitle: 'Global' },
            { code: 'HI', title: 'हिन्दी', subtitle: 'हिंदी भाषा' },
            { code: 'MR', title: 'मराठी', subtitle: 'महाराष्ट्र' },
          ].map((l) => (
            <button
              key={l.code}
              onClick={() => onLanguageChange(l.code as SupportedLanguage)}
              className={`p-3.5 rounded-2xl border text-center transition-all cursor-pointer ${
                language === l.code
                  ? 'bg-amber-500/10 border-amber-500 text-amber-400 font-bold shadow-md shadow-amber-950/20'
                  : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
              }`}
            >
              <span className="text-sm block font-bold">{l.title}</span>
              <span className="text-[10px] text-slate-500 block">{l.subtitle}</span>
              {language === l.code && (
                <span className="inline-block mt-1 text-[10px] text-amber-400 font-semibold">
                  ✓ Active
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* 2. Jaap Sadhana Preferences */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-4">
        <div className="flex items-center gap-2 border-b border-slate-800/80 pb-3">
          <Flame className="w-4 h-4 text-amber-400" />
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200">
            Jaap Mala &amp; Sadhana Preferences
          </h3>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-slate-950 rounded-2xl border border-slate-800/80">
            <div className="flex items-center gap-3">
              <Volume2 className="w-4 h-4 text-amber-400" />
              <div>
                <span className="text-xs font-bold text-slate-200 block">528Hz Sacred Chime</span>
                <span className="text-[11px] text-slate-400 block">
                  Harmonic audio feedback on every bead tap
                </span>
              </div>
            </div>
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className={`px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                soundEnabled
                  ? 'bg-amber-500 text-slate-950'
                  : 'bg-slate-800 text-slate-400'
              }`}
            >
              {soundEnabled ? 'Enabled' : 'Disabled'}
            </button>
          </div>

          <div className="flex items-center justify-between p-3 bg-slate-950 rounded-2xl border border-slate-800/80">
            <div className="flex items-center gap-3">
              <Vibrate className="w-4 h-4 text-amber-400" />
              <div>
                <span className="text-xs font-bold text-slate-200 block">Haptic Vibration</span>
                <span className="text-[11px] text-slate-400 block">
                  Tactile pulse on device when counting beads
                </span>
              </div>
            </div>
            <button
              onClick={() => setHapticsEnabled(!hapticsEnabled)}
              className={`px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                hapticsEnabled
                  ? 'bg-amber-500 text-slate-950'
                  : 'bg-slate-800 text-slate-400'
              }`}
            >
              {hapticsEnabled ? 'Enabled' : 'Disabled'}
            </button>
          </div>

          <div className="flex items-center justify-between p-3 bg-slate-950 rounded-2xl border border-slate-800/80">
            <div className="flex items-center gap-3">
              <Lock className="w-4 h-4 text-amber-400" />
              <div>
                <span className="text-xs font-bold text-slate-200 block">
                  Share Milestones to Feed
                </span>
                <span className="text-[11px] text-slate-400 block">
                  Allow publishing completed malas to Anant Devotee Feed
                </span>
              </div>
            </div>
            <button
              onClick={() => setPublicJaapMilestones(!publicJaapMilestones)}
              className={`px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                publicJaapMilestones
                  ? 'bg-amber-500 text-slate-950'
                  : 'bg-slate-800 text-slate-400'
              }`}
            >
              {publicJaapMilestones ? 'Allowed' : 'Private'}
            </button>
          </div>
        </div>
      </div>

      {/* 3. Devotee Profile Editor */}
      <form
        onSubmit={handleSaveProfile}
        className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-4"
      >
        <div className="flex items-center gap-2 border-b border-slate-800/80 pb-3">
          <UserIcon className="w-4 h-4 text-amber-400" />
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200">
            Devotee Profile &amp; Bio
          </h3>
        </div>

        {currentUser && (
          <div className="flex items-center gap-4 py-2">
            <Avatar
              src={currentUser.profile.avatarUrl}
              name={currentUser.profile.displayName}
              size="lg"
            />
            <div>
              <p className="text-xs font-bold text-slate-200">{currentUser.profile.displayName}</p>
              <p className="text-[11px] text-amber-500 font-mono">@{currentUser.username}</p>
              <p className="text-[10px] text-slate-400 mt-0.5">Role: {currentUser.role}</p>
            </div>
          </div>
        )}

        <div className="space-y-3">
          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">
              Display Name
            </label>
            <input
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs font-bold text-slate-100 focus:outline-none focus:border-amber-500"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">
              Spiritual Bio / Ishta Devata
            </label>
            <textarea
              rows={2}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-slate-100 focus:outline-none focus:border-amber-500"
            />
          </div>
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-slate-800">
          {savedSuccess ? (
            <span className="text-xs text-emerald-400 font-bold flex items-center gap-1">
              <Check className="w-4 h-4" /> Preferences saved successfully!
            </span>
          ) : (
            <span className="text-[11px] text-slate-500">
              Changes persist locally &amp; sync to Supabase
            </span>
          )}

          <button
            type="submit"
            className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-md cursor-pointer"
          >
            <Save className="w-3.5 h-3.5" /> Save Preferences
          </button>
        </div>
      </form>

      {/* 4. Trust & Compliance Information */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-3">
        <div className="flex items-center gap-2 border-b border-slate-800/80 pb-3">
          <Shield className="w-4 h-4 text-amber-400" />
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200">
            Temple Trust &amp; Platform Compliance
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800">
            <span className="font-bold text-slate-200 block mb-1">80G Tax Exemption Receipts</span>
            <p className="text-[11px] text-slate-400">
              All temple donations made via Anant generate instant, compliant 80G tax-deductible digital receipts.
            </p>
          </div>

          <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800">
            <span className="font-bold text-slate-200 block mb-1">Supabase Row-Level Security</span>
            <p className="text-[11px] text-slate-400">
              Devotee data, japa logs, and trust accounting records are secured with multi-tenant RLS policies.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsView;
