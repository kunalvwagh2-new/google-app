'use client';

export const dynamic = 'force-dynamic';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  Flame,
  Volume2,
  VolumeX,
  RotateCcw,
  Play,
  Pause,
  CheckCircle2,
  Sparkles,
  Share2,
  Bell,
  Target,
  Calendar,
  Clock,
  Award,
  TrendingUp,
  ChevronRight,
  Plus,
  Trash2,
  Copy,
  Send,
  X,
  Vibrate,
  VibrateOff,
  Image as ImageIcon,
  Edit3,
  ClipboardPaste,
  BookOpen,
  ArrowRight,
  Check,
  Music,
  Download,
} from 'lucide-react';
import {
  JaapGoal,
  JaapReminder,
  getLocalJaapGoals,
  saveLocalJaapGoals,
  getLocalJaapReminders,
  saveLocalJaapReminders,
  logJaapSession,
  DEITY_TYPES_PRESEED,
  PRESEED_DEITIES,
  PRESEED_TEMPLES_CATALOG,
  getLocalDeityTypes,
  getLocalDeities,
  saveLocalDeity,
  getLocalTemplesCatalog,
  saveLocalTempleCatalog,
} from '../../lib/supabase-jaap.ts';
import { MalaProfile, TargetInputMode, TargetPeriod, DeityType, Deity, TempleCatalogEntry } from '../../types/jaap.ts';
import { computeSmartTargets } from '../../lib/jaap-calculator.ts';
import { templeAudio } from '../../components/anant/TempleBellAudio.ts';

export interface JaapPageProps {
  initialDeityName?: string;
  initialMantraName?: string;
  currentUserId?: string;
  currentUserName?: string;
  onPublishToFeed?: (content: string, milestoneData: any) => void;
  onBackToHome?: () => void;
}

export const SACRED_DEITY_PRESETS = [
  {
    id: 'lord_shiva',
    deityName: 'Lord Shiva (Mahadev)',
    photoUrl: 'https://images.unsplash.com/photo-1544816155-12df9643f363?w=600&auto=format&fit=crop&q=80',
    defaultMantra: 'ॐ नमः शिवाय (Om Namah Shivaya)',
  },
  {
    id: 'lord_krishna',
    deityName: 'Lord Krishna & Radha',
    photoUrl: 'https://images.unsplash.com/photo-1567591414240-e9a1175ebfae?w=600&auto=format&fit=crop&q=80',
    defaultMantra: 'हरे कृष्ण हरे कृष्ण कृष्ण कृष्ण हरे हरे । हरे राम हरे राम राम राम हरे हरे ॥',
  },
  {
    id: 'lord_ganesh',
    deityName: 'Lord Ganesha (Vighnaharta)',
    photoUrl: 'https://images.unsplash.com/photo-1567591414240-e9a1175ebfae?w=600&auto=format&fit=crop&q=80',
    defaultMantra: 'ॐ गं गणपतये नमः (Om Gam Ganapataye Namaha)',
  },
  {
    id: 'lord_hanuman',
    deityName: 'Lord Hanuman (Sankatmochan)',
    photoUrl: 'https://images.unsplash.com/photo-1618245318763-a15156d6b23c?w=600&auto=format&fit=crop&q=80',
    defaultMantra: 'ॐ हनुमते नमः (Om Hanumate Namaha)',
  },
  {
    id: 'goddess_durga',
    deityName: 'Maa Durga (Adishakti)',
    photoUrl: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=600&auto=format&fit=crop&q=80',
    defaultMantra: 'ॐ दुं दुर्गायै नमः (Om Dum Durgaye Namaha)',
  },
  {
    id: 'lord_rama',
    deityName: 'Lord Rama & Sita',
    photoUrl: 'https://images.unsplash.com/photo-1598387993441-a364f854c3e1?w=600&auto=format&fit=crop&q=80',
    defaultMantra: 'श्री राम जय राम जय जय राम (Shree Rama Jaya Rama Jaya Jaya Rama)',
  },
  {
    id: 'lord_vitthal',
    deityName: 'Lord Vitthala & Rakhumai',
    photoUrl: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=600&auto=format&fit=crop&q=80',
    defaultMantra: 'जय जय रामकृष्ण हरि • ॐ नमो भगवते वासुदेवाय',
  },
  {
    id: 'gayatri_mata',
    deityName: 'Maa Gayatri / Surya Dev',
    photoUrl: 'https://images.unsplash.com/photo-1507692049790-de58290a4334?w=600&auto=format&fit=crop&q=80',
    defaultMantra: 'ॐ भूर्भुवः स्वः तत्सवितुर्वरेण्यं भर्गो देवस्य धीमहि धियो यो नः प्रचोदयात् ॥',
  },
];

const DEFAULT_INITIAL_MALAS: MalaProfile[] = [
  {
    id: 'mala_krishna',
    name: 'Radha Krishna Mahamantra',
    mantraText: 'हरे कृष्ण हरे कृष्ण कृष्ण कृष्ण हरे हरे । हरे राम हरे राम राम राम हरे हरे ॥',
    deityName: 'Lord Krishna & Radha',
    deityPhotoUrl: 'https://images.unsplash.com/photo-1567591414240-e9a1175ebfae?w=600&auto=format&fit=crop&q=80',
    currentBead: 0,
    completedMalas: 0,
    totalBeadsAllTime: 0,
    createdAt: new Date().toISOString(),
    lastChantedAt: new Date().toISOString(),
    isCustomMantra: false,
  },
  {
    id: 'mala_shiva',
    name: 'Om Namah Shivaya 108',
    mantraText: 'ॐ नमः शिवाय (Om Namah Shivaya)',
    deityName: 'Lord Shiva (Mahadev)',
    deityPhotoUrl: 'https://images.unsplash.com/photo-1544816155-12df9643f363?w=600&auto=format&fit=crop&q=80',
    currentBead: 0,
    completedMalas: 0,
    totalBeadsAllTime: 0,
    createdAt: new Date().toISOString(),
    lastChantedAt: new Date().toISOString(),
    isCustomMantra: false,
  },
  {
    id: 'mala_gayatri',
    name: 'Vedic Gayatri Shloka',
    mantraText: 'ॐ भूर्भुवः स्वः तत्सवितुर्वरेण्यं भर्गो देवस्य धीमहि धियो यो नः प्रचोदयात् ॥',
    deityName: 'Maa Gayatri / Surya Dev',
    deityPhotoUrl: 'https://images.unsplash.com/photo-1507692049790-de58290a4334?w=600&auto=format&fit=crop&q=80',
    currentBead: 0,
    completedMalas: 0,
    totalBeadsAllTime: 0,
    createdAt: new Date().toISOString(),
    lastChantedAt: new Date().toISOString(),
    isCustomMantra: false,
  },
];

export default function JaapMalaPage({
  initialDeityName,
  initialMantraName,
  currentUserId = 'user_devotee_1',
  currentUserName = 'Devotee',
  onPublishToFeed,
  onBackToHome,
}: JaapPageProps) {
  // 1. Multiple Malas Management
  const [malas, setMalas] = useState<MalaProfile[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('anant_user_malas_v2');
        if (saved) return JSON.parse(saved);
      } catch {}
    }
    return DEFAULT_INITIAL_MALAS;
  });

  const [activeMalaId, setActiveMalaId] = useState<string>(() => {
    return malas[0]?.id || DEFAULT_INITIAL_MALAS[0].id;
  });

  const activeMala = malas.find((m) => m.id === activeMalaId) || malas[0] || DEFAULT_INITIAL_MALAS[0];

  // Auto-Save Indicator & Streak State
  const [lastSavedTime, setLastSavedTime] = useState<string>(() =>
    new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  );

  const [dailyTargetBeads, setDailyTargetBeads] = useState<number>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('anant_jaap_daily_target_v2');
      if (saved) return parseInt(saved, 10);
    }
    return 1080; // Default 10 Malas (1,080 beads)
  });

  const [streakDays, setStreakDays] = useState<number>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('anant_jaap_streak_days_v2');
      if (saved) return parseInt(saved, 10);
    }
    return 7; // Default 7-day sadhana streak
  });

  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [exportToast, setExportToast] = useState<string | null>(null);

  // Auto-save malas, streak, and target to localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('anant_user_malas_v2', JSON.stringify(malas));
      localStorage.setItem('anant_jaap_daily_target_v2', dailyTargetBeads.toString());
      localStorage.setItem('anant_jaap_streak_days_v2', streakDays.toString());
      setLastSavedTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    }
  }, [malas, dailyTargetBeads, streakDays]);

  // Active Mala State references
  const currentBead = activeMala.currentBead;
  const completedMalas = activeMala.completedMalas;

  // Session stats for currently running chanting block
  const [sessionBeads, setSessionBeads] = useState(0);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [hapticEnabled, setHapticEnabled] = useState(true);

  // Total Beads Chanted Today across session and active malas
  const totalBeadsAllMalas = React.useMemo(() => {
    return malas.reduce((acc, m) => acc + m.totalBeadsAllTime, 0);
  }, [malas]);

  const todayCompletedBeads = sessionBeads + (completedMalas * 108) + currentBead;
  const dailyProgressPercent = Math.min(100, Math.round((todayCompletedBeads / dailyTargetBeads) * 100));

  // Export Sadhana Data Handlers
  const handleExportJSON = () => {
    const exportData = {
      appName: 'Anant Jaap Mala Sadhana (अनंत)',
      exportedAt: new Date().toISOString(),
      devoteeName: currentUserName,
      streakDays,
      dailyTargetBeads,
      todayCompletedBeads,
      totalBeadsAllTime: totalBeadsAllMalas,
      malas,
      reminders,
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `anant_jaap_sadhana_export_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    setExportToast('JSON Sadhana backup downloaded successfully!');
    setTimeout(() => setExportToast(null), 3000);
  };

  const handleExportCSV = () => {
    let csv = 'Mala ID,Mala Name,Deity,Current Bead,Completed Malas,Total Beads,Created At,Last Chanted\n';
    malas.forEach((m) => {
      csv += `"${m.id}","${m.name.replace(/"/g, '""')}","${m.deityName.replace(/"/g, '""')}",${m.currentBead},${m.completedMalas},${m.totalBeadsAllTime},"${m.createdAt}","${m.lastChantedAt}"\n`;
    });

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `anant_jaap_malas_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    setExportToast('CSV Mala log exported successfully!');
    setTimeout(() => setExportToast(null), 3000);
  };

  const handleCopyReport = async () => {
    const report = `🌸 *श्री अनंत जप साधना रिपोर्ट (Anant Sadhana Report)* 🌸\n\n• साधक नाव: *${currentUserName}*\n• दैनिक लक्ष्य: *${todayCompletedBeads} / ${dailyTargetBeads} मणी* (${dailyProgressPercent}% पूर्ण!)\n• नित्य साधना स्ट्रिक: *🔥 ${streakDays} दिवस*\n• एकूण जप संख्या: *${totalBeadsAllMalas.toLocaleString()} मणी*\n\n📿 *सध्याच्या माळा list:*\n${malas.map((m) => ` - ${m.name} (${m.deityName}): ${m.completedMalas} माळा (${m.totalBeadsAllTime} मणी)`).join('\n')}\n\nॐ शांति शांति शांतिः 🙏`;

    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      await navigator.clipboard.writeText(report);
      setExportToast('Formatted Sadhana report copied to clipboard!');
      setTimeout(() => setExportToast(null), 3000);
    }
  };

  // Grand Celebration Overlay
  const [showCelebration, setShowCelebration] = useState(false);
  const [celebrationMalaNumber, setCelebrationMalaNumber] = useState(1);

  // 2. Custom Mantra & Deity Modal
  const [isEditMalaModalOpen, setIsEditMalaModalOpen] = useState(false);
  const [isCreateMalaModalOpen, setIsCreateMalaModalOpen] = useState(false);
  const [editMalaName, setEditMalaName] = useState(activeMala.name);
  const [editMantraText, setEditMantraText] = useState(activeMala.mantraText);
  const [editDeityName, setEditDeityName] = useState(activeMala.deityName);
  const [editDeityPhotoUrl, setEditDeityPhotoUrl] = useState(activeMala.deityPhotoUrl);

  // Deity Types & Temples Catalog State
  const [deityTypes] = useState<DeityType[]>(() => getLocalDeityTypes());
  const [deitiesCatalog] = useState<Deity[]>(() => getLocalDeities());
  const [templesCatalog] = useState<TempleCatalogEntry[]>(() => getLocalTemplesCatalog());
  const [selectedDeityTypeId, setSelectedDeityTypeId] = useState<string>('dt_shaiva');
  const [selectedTempleCatalogId, setSelectedTempleCatalogId] = useState<string>('');

  // 3. Smart Target Calculator Modal
  const [isCalculatorModalOpen, setIsCalculatorModalOpen] = useState(false);
  const [calcInputMode, setCalcInputMode] = useState<TargetInputMode>('MALAS');
  const [calcPeriod, setCalcPeriod] = useState<TargetPeriod>('YEARLY');
  const [calcInputValue, setCalcInputValue] = useState<number>(365);
  const [calcSankalpGoal, setCalcSankalpGoal] = useState<number>(365);

  const smartCalc = React.useMemo(() => {
    return computeSmartTargets(calcInputValue, calcPeriod, calcInputMode, calcSankalpGoal);
  }, [calcInputValue, calcPeriod, calcInputMode, calcSankalpGoal]);

  // 4. Reminders State
  const [reminders, setReminders] = useState<JaapReminder[]>(() => getLocalJaapReminders());
  const [isRemindersModalOpen, setIsRemindersModalOpen] = useState(false);
  const [newReminderTime, setNewReminderTime] = useState('05:30');
  const [newReminderLabel, setNewReminderLabel] = useState('Brahma Muhurta Sadhana');

  // 5. Social Sharing & Feed Journey Modal
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [copiedToast, setCopiedToast] = useState(false);
  const [publishedSuccess, setPublishedSuccess] = useState(false);

  // Timer Tick
  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;
    if (isTimerRunning) {
      timer = setInterval(() => {
        setElapsedSeconds((s) => s + 1);
      }, 1000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isTimerRunning]);

  // Paste from clipboard helper
  const handlePasteMantra = async () => {
    try {
      if (typeof navigator !== 'undefined' && navigator.clipboard) {
        const text = await navigator.clipboard.readText();
        if (text) {
          setEditMantraText(text);
        }
      }
    } catch {
      // In case permissions are blocked
    }
  };

  // Bead Tap Increment
  const handleIncrementBead = () => {
    if (!isTimerRunning) setIsTimerRunning(true);

    // Haptic feedback (Silent tap)
    if (hapticEnabled && typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate(25);
    }

    setSessionBeads((b) => b + 1);

    setMalas((prevMalas) =>
      prevMalas.map((m) => {
        if (m.id !== activeMalaId) return m;

        const nextBead = m.currentBead + 1;

        // Completing 108 beads (1 full mala)
        if (nextBead >= 108) {
          const nextCompletedMalas = m.completedMalas + 1;

          // Play Authentic Bronze Temple Bell & Sacred Conch Call!
          templeAudio.playTempleBell(soundEnabled);
          setTimeout(() => templeAudio.playConchCall(soundEnabled), 400);

          // Grand Haptic Vibration Sequence
          if (hapticEnabled && typeof navigator !== 'undefined' && navigator.vibrate) {
            navigator.vibrate([80, 50, 150, 50, 300]);
          }

          // Trigger Grand Celebration Overlay
          setCelebrationMalaNumber(nextCompletedMalas);
          setShowCelebration(true);
          setTimeout(() => setShowCelebration(false), 5000);

          return {
            ...m,
            currentBead: 0,
            completedMalas: nextCompletedMalas,
            totalBeadsAllTime: m.totalBeadsAllTime + 1,
            lastChantedAt: new Date().toISOString(),
          };
        }

        return {
          ...m,
          currentBead: nextBead,
          totalBeadsAllTime: m.totalBeadsAllTime + 1,
          lastChantedAt: new Date().toISOString(),
        };
      })
    );
  };

  // Reset Session
  const handleResetSession = () => {
    if (confirm('Reset active bead count back to 0 for this mala?')) {
      setMalas((prev) =>
        prev.map((m) => (m.id === activeMalaId ? { ...m, currentBead: 0 } : m))
      );
      setSessionBeads(0);
      setElapsedSeconds(0);
      setIsTimerRunning(false);
    }
  };

  // Save Session & Open Share
  const handleSaveAndShare = async () => {
    if (sessionBeads === 0) return;

    await logJaapSession(currentUserId, {
      mantraName: activeMala.mantraText,
      deityName: activeMala.deityName,
      beadsCount: sessionBeads,
      malasCompleted: activeMala.completedMalas,
      durationSeconds: elapsedSeconds,
    });

    setIsTimerRunning(false);
    setIsShareModalOpen(true);
  };

  // Create New Mala
  const handleCreateNewMala = (e: React.FormEvent) => {
    e.preventDefault();
    const newMala: MalaProfile = {
      id: `mala_${Date.now()}`,
      name: editMalaName.trim() || 'Custom Sacred Japa',
      mantraText: editMantraText.trim() || 'ॐ (AUM)',
      deityName: editDeityName.trim() || 'Supreme Divine',
      deityPhotoUrl: editDeityPhotoUrl.trim() || SACRED_DEITY_PRESETS[0].photoUrl,
      currentBead: 0,
      completedMalas: 0,
      totalBeadsAllTime: 0,
      createdAt: new Date().toISOString(),
      lastChantedAt: new Date().toISOString(),
      isCustomMantra: true,
    };

    setMalas((prev) => [newMala, ...prev]);
    setActiveMalaId(newMala.id);
    setIsCreateMalaModalOpen(false);
  };

  // Update Existing Mala
  const handleUpdateActiveMala = (e: React.FormEvent) => {
    e.preventDefault();
    setMalas((prev) =>
      prev.map((m) =>
        m.id === activeMalaId
          ? {
              ...m,
              name: editMalaName,
              mantraText: editMantraText,
              deityName: editDeityName,
              deityPhotoUrl: editDeityPhotoUrl,
            }
          : m
      )
    );
    setIsEditMalaModalOpen(false);
  };

  // Delete Mala
  const handleDeleteMala = (id: string) => {
    if (malas.length <= 1) {
      alert('You must keep at least one Mala in your sacred collection.');
      return;
    }
    if (confirm('Are you sure you want to remove this Jaap Mala?')) {
      const remaining = malas.filter((m) => m.id !== id);
      setMalas(remaining);
      setActiveMalaId(remaining[0].id);
    }
  };

  // Reminders Actions
  const handleAddReminder = () => {
    if (!newReminderTime) return;
    const newRem: JaapReminder = {
      id: `rem_${Date.now()}`,
      timeOfDay: newReminderTime,
      label: newReminderLabel || 'Daily Japa Sadhana',
      daysOfWeek: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      isEnabled: true,
      mantra: activeMala.mantraText,
    };
    const updated = [...reminders, newRem];
    setReminders(updated);
    saveLocalJaapReminders(updated);
    setNewReminderLabel('');

    // Request notification permission if available
    if (typeof window !== 'undefined' && 'Notification' in window) {
      if (Notification.permission === 'default') {
        Notification.requestPermission();
      }
    }
  };

  const handleToggleReminder = (id: string) => {
    const updated = reminders.map((r) => (r.id === id ? { ...r, isEnabled: !r.isEnabled } : r));
    setReminders(updated);
    saveLocalJaapReminders(updated);
  };

  const handleDeleteReminder = (id: string) => {
    const updated = reminders.filter((r) => r.id !== id);
    setReminders(updated);
    saveLocalJaapReminders(updated);
  };

  // Sharing text generator
  const getShareText = () => {
    return `🌸 *श्री अनंत १०८ जप साधना महासंकल्प* 🙏\n\n• देवता: *${activeMala.deityName}*\n• मंत्र / श्लोक: *${activeMala.mantraText}*\n• आज जप संख्या: *${sessionBeads} मणी* (${activeMala.completedMalas} माळा पूर्ण!)\n• एकूण साधना: *${activeMala.totalBeadsAllTime} मणी*\n\n"जपयज्ञोऽस्मि यज्ञानां — Of sacrifices I am the chanting of holy names." (Gita 10.25)\n\nअनंत साधना अॅपवर आपल्या नामाची माळ आजच अर्पण करा: https://anant.org/jaap`;
  };

  const handleNativeShare = async () => {
    const text = getShareText();
    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({
          title: 'Anant Jaap Mala Sadhana',
          text,
          url: window.location.href,
        });
        return;
      } catch {
        // User cancelled or unsupported
      }
    }

    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      await navigator.clipboard.writeText(text);
      setCopiedToast(true);
      setTimeout(() => setCopiedToast(false), 3000);
    }
  };

  const handleWhatsAppShare = () => {
    const text = getShareText();
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, '_blank');
  };

  const handlePublishFeed = () => {
    const postContent = `📿 **Sacred Jaap Mala Milestone Achieved!**\n\nCompleted **${activeMala.completedMalas} Malas** (${sessionBeads} sacred beads chanted) dedicated to **${activeMala.deityName}**.\n\n✨ *"${activeMala.mantraText}"*\n\nMay divine blessings enrich all devotees with inner peace & bhakti! 🙏🕉️ #AnantJaap #Sadhana108`;

    if (onPublishToFeed) {
      onPublishToFeed(postContent, {
        mantraName: activeMala.mantraText,
        deityName: activeMala.deityName,
        beadsCount: sessionBeads,
        malasCompleted: activeMala.completedMalas,
      });
    }

    setPublishedSuccess(true);
    setTimeout(() => {
      setPublishedSuccess(false);
      setIsShareModalOpen(false);
    }, 2000);
  };

  const formatSeconds = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6 select-none px-2 sm:px-4 py-2 relative">
      {/* ========================================================================= */}
      {/* GRAND CELEBRATION OVERLAY UPON COMPLETING 108 BEADS */}
      {/* ========================================================================= */}
      {showCelebration && (
        <div className="fixed inset-0 z-50 pointer-events-none flex flex-col items-center justify-center bg-black/60 backdrop-blur-xs animate-in fade-in duration-300">
          {/* Falling Marigold and Lotus Flower Petals */}
          <div className="absolute inset-0 overflow-hidden">
            {Array.from({ length: 28 }).map((_, idx) => (
              <div
                key={idx}
                className="absolute text-2xl animate-bounce"
                style={{
                  top: `${(idx * 7) % 100}%`,
                  left: `${(idx * 13) % 100}%`,
                  animationDuration: `${1.2 + (idx % 4) * 0.4}s`,
                  opacity: 0.85,
                }}
              >
                {idx % 3 === 0 ? '🌸' : idx % 3 === 1 ? '🌼' : '✨'}
              </div>
            ))}
          </div>

          <div className="relative px-8 py-6 rounded-3xl bg-gradient-to-br from-amber-500 via-orange-500 to-amber-600 text-slate-950 text-center shadow-2xl border-2 border-amber-200 animate-in zoom-in-90 duration-300 max-w-md mx-4">
            <div className="w-16 h-16 mx-auto rounded-full bg-slate-950/20 flex items-center justify-center text-3xl font-black mb-3">
              🔔
            </div>
            <span className="text-xs font-black uppercase tracking-widest bg-slate-950/20 px-3 py-1 rounded-full">
              महा अनुष्ठान संपन्न
            </span>
            <h2 className="text-2xl sm:text-3xl font-black mt-2 font-serif">
              Mala #{celebrationMalaNumber} Completed!
            </h2>
            <p className="text-sm font-bold text-slate-900 mt-1">
              १०८ मणी जप पूर्ण • Temple Bell Chimes
            </p>
            <p className="text-xs text-slate-950/90 font-medium italic mt-2">
              "{activeMala.mantraText}"
            </p>
            <div className="mt-4 inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-slate-950 text-amber-300 text-xs font-bold shadow-lg">
              <Sparkles className="w-3.5 h-3.5" /> Divine Grace Received • ॐ शांति
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 1. TOP MALA CAROUSEL TABS & + CREATE NEW MALA BUTTON */}
      {/* ========================================================================= */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-4 sm:p-5 shadow-2xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800/80 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-amber-500/10 border border-amber-500/30 rounded-2xl text-amber-400">
              <Flame className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-slate-100">१०८ मणी जप साधना (Jaap Mala)</h2>
                <span className="text-[10px] font-bold bg-amber-500 text-slate-950 px-2 py-0.5 rounded-full">
                  Multi-Mala Engine
                </span>
                <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/60 border border-emerald-800/60 px-2 py-0.5 rounded-full flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  Auto-Saved ({lastSavedTime})
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Chant mantras, shlokas, or God's name with temple bell resonance &amp; smart goals
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
            <button
              onClick={() => setIsExportModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-950 border border-amber-500/40 hover:border-amber-400 text-amber-300 font-bold text-xs shadow-md transition-all cursor-pointer"
            >
              <Download className="w-4 h-4 text-amber-400" />
              <span>Export Mala Data</span>
            </button>

            <button
              onClick={() => {
                setEditMalaName('Shri Hanuman Chalisa Chaupai');
                setEditMantraText('नासै रोग हरै सब पीरा । जपत निरंतर हनुमत बीरा ॥');
                setEditDeityName('Lord Hanuman (Sankatmochan)');
                setEditDeityPhotoUrl(SACRED_DEITY_PRESETS[3].photoUrl);
                setIsCreateMalaModalOpen(true);
              }}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs shadow-md transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>+ Create New Mala</span>
            </button>

            {onBackToHome && (
              <button
                onClick={onBackToHome}
                className="px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 hover:border-slate-700 text-xs font-bold text-slate-300 cursor-pointer"
              >
                Back to Feed
              </button>
            )}
          </div>
        </div>

        {/* Mala Switcher Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {malas.map((m) => {
            const isActive = m.id === activeMalaId;
            return (
              <button
                key={m.id}
                onClick={() => setActiveMalaId(m.id)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-2xl border text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                  isActive
                    ? 'bg-amber-500/20 border-amber-500 text-amber-300 shadow-md shadow-amber-950/40'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                }`}
              >
                <img
                  src={m.deityPhotoUrl}
                  alt={m.deityName}
                  className="w-5 h-5 rounded-full object-cover border border-amber-400/40"
                />
                <span>{m.name}</span>
                <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-full bg-slate-900 border border-slate-800">
                  {m.completedMalas} Malas
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* DAILY VIRTUAL PROGRESS BAR & DAILY JAAP STREAK HUD CARD */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Daily Virtual Progress Bar */}
        <div className="md:col-span-2 bg-slate-900/90 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Target className="w-4 h-4 text-amber-400" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200">
                Daily Sadhana Virtual Progress Bar (दैनिक जप प्रगती)
              </h3>
            </div>
            <span className="text-xs font-mono font-bold text-amber-400 bg-amber-950/60 border border-amber-800/40 px-2.5 py-1 rounded-full">
              {todayCompletedBeads} / {dailyTargetBeads} Beads ({dailyProgressPercent}%)
            </span>
          </div>

          {/* Animated Progress Bar */}
          <div className="w-full bg-slate-950 rounded-full h-4 border border-slate-800/80 p-0.5 overflow-hidden shadow-inner">
            <div
              className="bg-gradient-to-r from-amber-500 via-orange-500 to-amber-400 h-full rounded-full transition-all duration-500 ease-out shadow-lg shadow-amber-500/30"
              style={{ width: `${dailyProgressPercent}%` }}
            />
          </div>

          <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
            <span>Target Goal: {(dailyTargetBeads / 108).toFixed(0)} Malas ({dailyTargetBeads} Beads)</span>
            {dailyProgressPercent >= 100 ? (
              <span className="text-emerald-400 font-bold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> 🎉 Daily Goal Achieved!
              </span>
            ) : (
              <span className="text-amber-300 font-mono">
                {dailyTargetBeads - todayCompletedBeads} Beads remaining today
              </span>
            )}
          </div>
        </div>

        {/* Daily Jaap Streak Card */}
        <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-amber-950/40 border border-slate-800 rounded-3xl p-5 shadow-xl flex flex-col justify-between space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Flame className="w-4 h-4 text-orange-500 animate-pulse" /> Daily Jaap Streak
            </span>
            <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded-full border border-emerald-800/40">
              Active Sadhak
            </span>
          </div>

          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-black text-amber-400 font-mono">{streakDays}</span>
            <span className="text-sm font-bold text-slate-300">Consecutive Days</span>
          </div>

          <p className="text-[11px] text-slate-400 leading-tight">
            🔥 {streakDays >= 21 ? 'Tapasvi Sadhak' : streakDays >= 7 ? 'Nitya Sadhak' : 'Prarambhik Sadhak'} • Chant daily to preserve your spiritual streak.
          </p>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. ACTIVE MALA BANNER: Custom Mantra / Shloka Display & Edit Trigger */}
      {/* ========================================================================= */}
      <div className="bg-gradient-to-r from-slate-900 via-amber-950/30 to-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start gap-4">
          <div className="relative group shrink-0">
            <img
              src={activeMala.deityPhotoUrl}
              alt={activeMala.deityName}
              className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover border-2 border-amber-500/60 shadow-lg shadow-amber-950/50"
            />
            <button
              onClick={() => {
                setEditMalaName(activeMala.name);
                setEditMantraText(activeMala.mantraText);
                setEditDeityName(activeMala.deityName);
                setEditDeityPhotoUrl(activeMala.deityPhotoUrl);
                setIsEditMalaModalOpen(true);
              }}
              title="Change God Photo or Shloka"
              className="absolute -bottom-2 -right-2 p-1.5 rounded-xl bg-amber-500 text-slate-950 hover:bg-amber-400 shadow-md cursor-pointer"
            >
              <Edit3 className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-1.5 min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-amber-400">{activeMala.deityName}</span>
              <span className="text-[10px] text-slate-500">•</span>
              <span className="text-[10px] text-slate-400 font-mono">
                Lifetime: {activeMala.totalBeadsAllTime} Beads
              </span>
            </div>

            <h3 className="text-base sm:text-lg font-serif font-bold text-slate-100 leading-snug line-clamp-2">
              {activeMala.mantraText}
            </h3>

            <p className="text-xs text-slate-400 italic">{activeMala.name}</p>
          </div>
        </div>

        {/* Quick Utility Actions */}
        <div className="flex items-center gap-2 self-end md:self-center">
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            title={soundEnabled ? 'Temple Bell & Chimes ON' : 'Audio Muted'}
            className={`p-2.5 rounded-xl border transition-all cursor-pointer ${
              soundEnabled
                ? 'bg-amber-500/10 border-amber-500/40 text-amber-400'
                : 'bg-slate-950 border-slate-800 text-slate-500'
            }`}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>

          <button
            onClick={() => setHapticEnabled(!hapticEnabled)}
            title={hapticEnabled ? 'Haptic feedback on' : 'Haptic feedback off'}
            className={`p-2.5 rounded-xl border transition-all cursor-pointer ${
              hapticEnabled
                ? 'bg-amber-500/10 border-amber-500/40 text-amber-400'
                : 'bg-slate-950 border-slate-800 text-slate-500'
            }`}
          >
            {hapticEnabled ? <Vibrate className="w-4 h-4" /> : <VibrateOff className="w-4 h-4" />}
          </button>

          <button
            onClick={() => setIsCalculatorModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 hover:border-amber-500/40 text-xs font-bold text-slate-200 transition-all cursor-pointer"
          >
            <Target className="w-4 h-4 text-amber-400" />
            <span>Target Calculator</span>
          </button>

          <button
            onClick={() => setIsRemindersModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 hover:border-amber-500/40 text-xs font-bold text-slate-200 transition-all cursor-pointer"
          >
            <Bell className="w-4 h-4 text-amber-400" />
            <span>Reminders</span>
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 3. INTERACTIVE 108 BEADS ROSARY DIAL WITH GOD PHOTO INSIDE CENTER */}
      {/* ========================================================================= */}
      <div className="relative py-6 flex flex-col items-center justify-center">
        <div className="relative w-80 h-80 sm:w-96 sm:h-96 flex items-center justify-center">
          {/* Circular 108 Beads SVG Ring */}
          <svg className="absolute inset-0 w-full h-full -rotate-90 pointer-events-none" viewBox="0 0 200 200">
            {/* Background Ring Track */}
            <circle
              cx="100"
              cy="100"
              r="80"
              className="stroke-slate-800"
              strokeWidth="12"
              fill="transparent"
            />
            {/* Active Progress Gold Arc */}
            <circle
              cx="100"
              cy="100"
              r="80"
              className="stroke-amber-500 transition-all duration-150 ease-out"
              strokeWidth="12"
              strokeDasharray={2 * Math.PI * 80}
              strokeDashoffset={(2 * Math.PI * 80) - (currentBead / 108) * (2 * Math.PI * 80)}
              strokeLinecap="round"
              fill="transparent"
            />
          </svg>

          {/* Sumeru Guru Bead at 12 o'clock */}
          <div className="absolute top-2 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center">
            <div className="w-5 h-5 rounded-full bg-gradient-to-t from-amber-600 to-amber-300 border-2 border-amber-200 shadow-md shadow-amber-500/50 flex items-center justify-center text-[8px] font-black text-slate-950">
              ॐ
            </div>
            <div className="w-1.5 h-3 bg-amber-400 rounded-b-md" />
          </div>

          {/* Center God Photo Frame & Tap Trigger Button */}
          <button
            id="jaap-mala-central-tap-button"
            onClick={handleIncrementBead}
            className="w-56 h-56 sm:w-64 sm:h-64 rounded-full relative overflow-hidden border-4 border-amber-500/60 shadow-2xl shadow-amber-950/70 cursor-pointer active:scale-95 transition-transform group flex flex-col items-center justify-center"
          >
            {/* Background God Photo with subtle dark overlay */}
            <img
              src={activeMala.deityPhotoUrl}
              alt={activeMala.deityName}
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 filter brightness-60"
            />

            {/* Glowing Golden Aura Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />

            {/* Tap Bead Counter Text */}
            <div className="relative z-10 text-center flex flex-col items-center">
              <span className="text-[10px] font-bold uppercase tracking-widest text-amber-400 mb-0.5">
                Bead Count
              </span>
              <span className="text-6xl sm:text-7xl font-black text-slate-100 font-mono drop-shadow-md group-hover:text-amber-300 transition-colors">
                {currentBead}
              </span>
              <span className="text-xs font-semibold text-slate-300 drop-shadow">
                of 108 beads
              </span>

              <span className="text-[10px] font-bold text-amber-300 mt-2 bg-slate-950/80 px-3 py-1 rounded-full border border-amber-500/40 backdrop-blur-xs flex items-center gap-1">
                <Flame className="w-3 h-3 text-amber-400" /> Tap to chant bead
              </span>
            </div>
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 4. CHANTING CONTROLS & SESSION HUD */}
      {/* ========================================================================= */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-4">
        <div className="grid grid-cols-3 gap-2 text-center divide-x divide-slate-800">
          <div>
            <span className="text-[11px] text-slate-400 flex items-center justify-center gap-1">
              <Clock className="w-3.5 h-3.5 text-slate-500" /> Sadhana Time
            </span>
            <p className="text-base font-bold text-slate-100 font-mono mt-0.5">
              {formatSeconds(elapsedSeconds)}
            </p>
          </div>
          <div>
            <span className="text-[11px] text-slate-400 flex items-center justify-center gap-1">
              <Flame className="w-3.5 h-3.5 text-amber-500" /> Session Beads
            </span>
            <p className="text-base font-bold text-slate-100 font-mono mt-0.5">
              {sessionBeads}
            </p>
          </div>
          <div>
            <span className="text-[11px] text-slate-400 flex items-center justify-center gap-1">
              <Award className="w-3.5 h-3.5 text-amber-400" /> Malas Done
            </span>
            <p className="text-base font-bold text-amber-400 font-mono mt-0.5">
              {completedMalas} Malas
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 pt-2 border-t border-slate-800">
          <button
            onClick={handleResetSession}
            className="h-11 px-3 rounded-xl bg-slate-950 border border-slate-800 hover:border-slate-700 text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
            title="Reset active bead counter"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          {isTimerRunning ? (
            <button
              onClick={() => setIsTimerRunning(false)}
              className="flex-1 h-11 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs flex items-center justify-center gap-2 cursor-pointer transition-all"
            >
              <Pause className="w-4 h-4" /> Pause Sadhana
            </button>
          ) : (
            <button
              onClick={() => setIsTimerRunning(true)}
              className="flex-1 h-11 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 cursor-pointer transition-all shadow-md shadow-amber-950/40"
            >
              <Play className="w-4 h-4 fill-current" />{' '}
              {sessionBeads > 0 ? 'Resume Sadhana' : 'Start Sadhana'}
            </button>
          )}

          <button
            onClick={handleSaveAndShare}
            disabled={sessionBeads === 0}
            className="h-11 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 disabled:pointer-events-none text-white font-bold text-xs flex items-center gap-2 transition-all cursor-pointer shadow-md shadow-emerald-950/40"
          >
            <CheckCircle2 className="w-4 h-4" /> Save &amp; Share
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 5. SMART TARGET GOAL CALCULATOR CARD (Daily, Weekly, Monthly, Yearly) */}
      {/* ========================================================================= */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Target className="w-4 h-4 text-amber-400" />
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">
              Smart Sadhana Calculator (दैनिक, साप्ताहिक, मासिक व वार्षिक लक्ष्य)
            </h4>
          </div>

          <button
            onClick={() => setIsCalculatorModalOpen(true)}
            className="text-[11px] font-bold text-amber-400 hover:underline flex items-center gap-1 cursor-pointer"
          >
            Open Calculator <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* 4 Cards Showing Real-time Equivalent Calculation */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="bg-slate-950 border border-slate-800/80 rounded-2xl p-3.5 space-y-1">
            <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">
              Daily Target
            </span>
            <p className="text-sm font-bold font-mono text-amber-400">
              {smartCalc.dailyMalas} Malas
            </p>
            <span className="text-[10px] text-slate-500 font-mono">
              = {smartCalc.dailyBeads.toLocaleString()} beads / day
            </span>
          </div>

          <div className="bg-slate-950 border border-slate-800/80 rounded-2xl p-3.5 space-y-1">
            <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">
              Weekly Target
            </span>
            <p className="text-sm font-bold font-mono text-amber-400">
              {smartCalc.weeklyMalas} Malas
            </p>
            <span className="text-[10px] text-slate-500 font-mono">
              = {smartCalc.weeklyBeads.toLocaleString()} beads / week
            </span>
          </div>

          <div className="bg-slate-950 border border-slate-800/80 rounded-2xl p-3.5 space-y-1">
            <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">
              Monthly Target
            </span>
            <p className="text-sm font-bold font-mono text-amber-400">
              {smartCalc.monthlyMalas} Malas
            </p>
            <span className="text-[10px] text-slate-500 font-mono">
              = {smartCalc.monthlyBeads.toLocaleString()} beads / month
            </span>
          </div>

          <div className="bg-slate-950 border border-slate-800/80 rounded-2xl p-3.5 space-y-1">
            <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">
              Yearly Target
            </span>
            <p className="text-sm font-bold font-mono text-amber-400">
              {smartCalc.yearlyMalas} Malas
            </p>
            <span className="text-[10px] text-slate-500 font-mono">
              = {smartCalc.yearlyBeads.toLocaleString()} beads / year
            </span>
          </div>
        </div>

        {/* Target Completion Date Projections Banner */}
        <div className="p-3.5 bg-gradient-to-r from-amber-950/40 to-slate-950 rounded-2xl border border-amber-800/40 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-amber-400 shrink-0" />
            <div>
              <span className="text-slate-300 font-semibold">Target Completion Date &amp; Day: </span>
              <strong className="text-amber-300 font-mono">{smartCalc.targetDateFormatted}</strong>
            </div>
          </div>
          <span className="text-[11px] text-slate-400 font-mono">
            {smartCalc.daysRemaining} days remaining for Sankalp
          </span>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* MODAL 1: SMART TARGET CALCULATOR MODAL */}
      {/* ========================================================================= */}
      {isCalculatorModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-lg bg-slate-950 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Target className="w-5 h-5 text-amber-400" />
                <h3 className="font-bold text-sm text-slate-100">
                  Smart Sadhana Target Calculator (लक्ष्य गणक)
                </h3>
              </div>
              <button
                onClick={() => setIsCalculatorModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              {/* Step 1: Input Mode Toggle (Malas vs Counts) */}
              <div>
                <label className="font-semibold text-slate-300 block mb-1">
                  1. Target Unit Type:
                </label>
                <div className="grid grid-cols-2 gap-2 bg-slate-900 p-1 rounded-xl border border-slate-800 font-bold">
                  <button
                    onClick={() => setCalcInputMode('MALAS')}
                    className={`py-2 rounded-lg transition-all cursor-pointer ${
                      calcInputMode === 'MALAS'
                        ? 'bg-amber-500 text-slate-950 shadow'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    📿 By Malas (1 Mala = 108 beads)
                  </button>
                  <button
                    onClick={() => setCalcInputMode('BEADS')}
                    className={`py-2 rounded-lg transition-all cursor-pointer ${
                      calcInputMode === 'BEADS'
                        ? 'bg-amber-500 text-slate-950 shadow'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    🔢 By Counts / Beads (e.g. 1000)
                  </button>
                </div>
              </div>

              {/* Step 2: Timeframe Selection */}
              <div>
                <label className="font-semibold text-slate-300 block mb-1">
                  2. Select Time Period:
                </label>
                <div className="grid grid-cols-4 gap-1.5 bg-slate-900 p-1 rounded-xl border border-slate-800 font-bold">
                  {(['DAILY', 'WEEKLY', 'MONTHLY', 'YEARLY'] as const).map((p) => (
                    <button
                      key={p}
                      onClick={() => setCalcPeriod(p)}
                      className={`py-1.5 rounded-lg capitalize transition-all cursor-pointer ${
                        calcPeriod === p
                          ? 'bg-amber-500 text-slate-950 shadow'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      {p.toLowerCase()}
                    </button>
                  ))}
                </div>
              </div>

              {/* Step 3: Input Target Value */}
              <div>
                <label className="font-semibold text-slate-300 block mb-1">
                  3. Enter Target {calcInputMode === 'MALAS' ? 'Malas' : 'Counts'} per {calcPeriod.toLowerCase()}:
                </label>
                <input
                  type="number"
                  min="1"
                  max="1000000"
                  value={calcInputValue}
                  onChange={(e) => setCalcInputValue(Math.max(1, Number(e.target.value) || 1))}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm font-mono font-bold text-slate-100 focus:outline-none focus:border-amber-500"
                />
              </div>

              {/* Step 4: Total Sankalp Target Malas (For Date Calculation) */}
              <div>
                <label className="font-semibold text-slate-300 block mb-1">
                  4. Total Sankalp Goal (Total Malas to Complete):
                </label>
                <input
                  type="number"
                  min="1"
                  max="1000000"
                  value={calcSankalpGoal}
                  onChange={(e) => setCalcSankalpGoal(Math.max(1, Number(e.target.value) || 1))}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm font-mono font-bold text-slate-100 focus:outline-none focus:border-amber-500"
                />
              </div>

              {/* Live Automated Calculation Results Box */}
              <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 space-y-3">
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 block">
                  Automatic Calculations &amp; Date Projections
                </span>
                <div className="grid grid-cols-2 gap-2 text-[11px] font-mono">
                  <div className="p-2 bg-slate-950 rounded-xl border border-slate-800">
                    <span className="text-slate-400 block">Daily</span>
                    <strong className="text-slate-100">{smartCalc.dailyMalas} Malas</strong> ({smartCalc.dailyBeads} counts)
                  </div>
                  <div className="p-2 bg-slate-950 rounded-xl border border-slate-800">
                    <span className="text-slate-400 block">Weekly</span>
                    <strong className="text-slate-100">{smartCalc.weeklyMalas} Malas</strong> ({smartCalc.weeklyBeads} counts)
                  </div>
                  <div className="p-2 bg-slate-950 rounded-xl border border-slate-800">
                    <span className="text-slate-400 block">Monthly</span>
                    <strong className="text-slate-100">{smartCalc.monthlyMalas} Malas</strong> ({smartCalc.monthlyBeads} counts)
                  </div>
                  <div className="p-2 bg-slate-950 rounded-xl border border-slate-800">
                    <span className="text-slate-400 block">Yearly</span>
                    <strong className="text-slate-100">{smartCalc.yearlyMalas} Malas</strong> ({smartCalc.yearlyBeads} counts)
                  </div>
                </div>

                <div className="p-3 bg-amber-950/40 rounded-xl border border-amber-800/40 text-xs text-amber-300">
                  <p>
                    📅 <strong>Target Date &amp; Day:</strong> {smartCalc.targetDateFormatted}
                  </p>
                  <p className="text-[10px] text-amber-400/80 mt-0.5">
                    Will be completed in approximately {smartCalc.daysRemaining} days at your chosen pace.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
              <button
                onClick={() => setIsCalculatorModalOpen(false)}
                className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs shadow-md"
              >
                Apply Target to Sadhana
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 2: CREATE / EDIT MALA MODAL (Custom Mantra, Shloka, God Photo) */}
      {/* ========================================================================= */}
      {(isCreateMalaModalOpen || isEditMalaModalOpen) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-lg bg-slate-950 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-400" />
                <h3 className="font-bold text-sm text-slate-100">
                  {isCreateMalaModalOpen ? 'Create New Jaap Mala' : 'Customize Mala & God Photo'}
                </h3>
              </div>
              <button
                onClick={() => {
                  setIsCreateMalaModalOpen(false);
                  setIsEditMalaModalOpen(false);
                }}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form
              onSubmit={isCreateMalaModalOpen ? handleCreateNewMala : handleUpdateActiveMala}
              className="space-y-4 text-xs"
            >
              {/* Mala Title */}
              <div>
                <label className="font-semibold text-slate-300 block mb-1">Mala Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Mahamrityunjaya Mantra 108"
                  value={editMalaName}
                  onChange={(e) => setEditMalaName(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-amber-500"
                />
              </div>

              {/* Deity Category Type (deity_types schema) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-300 block mb-1">
                    Deity Type / Category
                  </label>
                  <select
                    value={selectedDeityTypeId}
                    onChange={(e) => {
                      const dtId = e.target.value;
                      setSelectedDeityTypeId(dtId);
                      const matchingDeity = deitiesCatalog.find((d) => d.deityTypeId === dtId);
                      if (matchingDeity) {
                        setEditDeityName(matchingDeity.name);
                      }
                    }}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-amber-300 font-bold focus:outline-none focus:border-amber-500"
                  >
                    {deityTypes.map((dt) => (
                      <option key={dt.id} value={dt.id}>
                        {dt.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-slate-300 block mb-1">
                    Verified Deity Catalog
                  </label>
                  <select
                    value={editDeityName}
                    onChange={(e) => setEditDeityName(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-amber-500"
                  >
                    {deitiesCatalog
                      .filter((d) => !selectedDeityTypeId || d.deityTypeId === selectedDeityTypeId)
                      .map((d) => (
                        <option key={d.id} value={d.name}>
                          {d.name} {d.isVerified ? '✓' : ''}
                        </option>
                      ))}
                    <option value={editDeityName}>Custom Deity ({editDeityName || 'Enter custom'})</option>
                  </select>
                </div>
              </div>

              {/* Dedicated God / Deity Custom Input & Temple Catalog Link */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-300 block mb-1">Dedicated Deity Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Lord Vitthal / Kalbhairav"
                    value={editDeityName}
                    onChange={(e) => setEditDeityName(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-300 block mb-1">
                    Link Temple Catalog (Optional)
                  </label>
                  <select
                    value={selectedTempleCatalogId}
                    onChange={(e) => setSelectedTempleCatalogId(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-300 focus:outline-none focus:border-amber-500"
                  >
                    <option value="">-- No Specific Temple --</option>
                    {templesCatalog.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.name} ({t.city}, {t.state})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Shloka / Mantra with Paste from clipboard button */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="font-semibold text-slate-300">
                    Mantra, Shloka, or Divine Name
                  </label>
                  <button
                    type="button"
                    onClick={handlePasteMantra}
                    className="flex items-center gap-1 text-[10px] font-bold text-amber-400 hover:underline cursor-pointer"
                  >
                    <ClipboardPaste className="w-3 h-3" /> Paste from Clipboard
                  </button>
                </div>
                <textarea
                  rows={3}
                  required
                  placeholder="Write or paste any sacred mantra, shloka, or divine name here..."
                  value={editMantraText}
                  onChange={(e) => setEditMantraText(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-xs font-serif text-slate-100 focus:outline-none focus:border-amber-500"
                />
              </div>

              {/* God Photo: Gallery Presets & Custom URL */}
              <div>
                <label className="font-semibold text-slate-300 block mb-1.5">
                  Select Deity Photo (Will be featured on the center of the Mala):
                </label>
                <div className="grid grid-cols-4 gap-2 mb-2">
                  {SACRED_DEITY_PRESETS.map((preset) => (
                    <button
                      key={preset.id}
                      type="button"
                      onClick={() => {
                        setEditDeityPhotoUrl(preset.photoUrl);
                        setEditDeityName(preset.deityName);
                        if (!editMantraText || editMantraText.includes('ॐ')) {
                          setEditMantraText(preset.defaultMantra);
                        }
                      }}
                      className={`relative rounded-xl overflow-hidden border p-0.5 group cursor-pointer ${
                        editDeityPhotoUrl === preset.photoUrl
                          ? 'border-amber-500 ring-2 ring-amber-500/40'
                          : 'border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      <img
                        src={preset.photoUrl}
                        alt={preset.deityName}
                        className="w-full h-12 rounded-lg object-cover"
                      />
                      <span className="text-[8px] font-bold text-slate-300 block truncate mt-1 text-center">
                        {preset.deityName.split(' ')[0]}
                      </span>
                    </button>
                  ))}
                </div>

                {/* Custom Photo URL Input */}
                <input
                  type="url"
                  placeholder="Or paste any custom God photo image URL here..."
                  value={editDeityPhotoUrl}
                  onChange={(e) => setEditDeityPhotoUrl(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 font-mono focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-slate-800">
                {!isCreateMalaModalOpen && (
                  <button
                    type="button"
                    onClick={() => handleDeleteMala(activeMalaId)}
                    className="text-rose-400 hover:text-rose-300 text-xs font-semibold flex items-center gap-1 cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" /> Delete Mala
                  </button>
                )}

                <div className="flex items-center gap-2 ml-auto">
                  <button
                    type="button"
                    onClick={() => {
                      setIsCreateMalaModalOpen(false);
                      setIsEditMalaModalOpen(false);
                    }}
                    className="px-4 py-2 rounded-xl text-xs font-bold text-slate-400 hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs shadow-md"
                  >
                    {isCreateMalaModalOpen ? 'Create Mala' : 'Save Changes'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 3: SCHEDULED REMINDERS MODAL */}
      {/* ========================================================================= */}
      {isRemindersModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-md bg-slate-950 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Bell className="w-5 h-5 text-amber-400" />
                <h3 className="font-bold text-sm text-slate-100">Scheduled Japa Reminders</h3>
              </div>
              <button
                onClick={() => setIsRemindersModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2 max-h-56 overflow-y-auto">
              {reminders.map((rem) => (
                <div
                  key={rem.id}
                  className="flex items-center justify-between p-3 rounded-2xl bg-slate-900 border border-slate-800/80"
                >
                  <div className="flex items-center gap-3">
                    <Clock className="w-4 h-4 text-amber-400 shrink-0" />
                    <div>
                      <span className="font-mono text-xs font-bold text-slate-100 block">
                        {rem.timeOfDay}
                      </span>
                      <span className="text-[10px] text-slate-400 block">{rem.label}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleToggleReminder(rem.id)}
                      className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider cursor-pointer ${
                        rem.isEnabled
                          ? 'bg-amber-500/20 border border-amber-500/40 text-amber-400'
                          : 'bg-slate-800 text-slate-500'
                      }`}
                    >
                      {rem.isEnabled ? 'Active' : 'Off'}
                    </button>
                    <button
                      onClick={() => handleDeleteReminder(rem.id)}
                      className="p-1.5 text-slate-500 hover:text-rose-400 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2">
              <span className="text-[10px] font-bold uppercase text-slate-400 block">
                Add Daily Reminder Time
              </span>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="time"
                  value={newReminderTime}
                  onChange={(e) => setNewReminderTime(e.target.value)}
                  className="bg-slate-950 border border-slate-800 rounded-xl px-2.5 py-1.5 text-xs text-slate-100 font-mono"
                />
                <input
                  type="text"
                  placeholder="e.g. Sandhya Aarti Japa"
                  value={newReminderLabel}
                  onChange={(e) => setNewReminderLabel(e.target.value)}
                  className="bg-slate-950 border border-slate-800 rounded-xl px-2.5 py-1.5 text-xs text-slate-100"
                />
              </div>
              <button
                onClick={handleAddReminder}
                className="w-full py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs flex items-center justify-center gap-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" /> Add Reminder
              </button>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setIsRemindersModalOpen(false)}
                className="px-5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 font-bold text-xs"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 4: SHARE SACRED JOURNEY WITH FRIENDS / PUBLIC FEED */}
      {/* ========================================================================= */}
      {isShareModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-lg bg-slate-950 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Share2 className="w-5 h-5 text-amber-400" />
                <h3 className="font-bold text-sm text-slate-100">Share Sacred Journey &amp; Activity</h3>
              </div>
              <button
                onClick={() => setIsShareModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Sacred Card Preview */}
            <div className="bg-gradient-to-br from-amber-950/60 via-slate-900 to-slate-950 border border-amber-600/50 rounded-2xl p-5 text-center space-y-3 shadow-xl relative overflow-hidden">
              <img
                src={activeMala.deityPhotoUrl}
                alt={activeMala.deityName}
                className="w-16 h-16 rounded-full mx-auto object-cover border-2 border-amber-400 shadow-md"
              />
              <div>
                <h4 className="font-bold text-base text-slate-100">{activeMala.name}</h4>
                <p className="text-xs text-amber-400 font-serif">"{activeMala.mantraText}"</p>
              </div>

              <div className="grid grid-cols-2 gap-2 py-2 bg-slate-950/60 rounded-xl border border-slate-800/80 text-xs font-mono">
                <div>
                  <span className="text-[10px] text-slate-400 block">Session Beads</span>
                  <span className="font-bold text-slate-100 text-base">{sessionBeads}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block">Malas Completed</span>
                  <span className="font-bold text-amber-400 text-base">
                    {activeMala.completedMalas} Malas
                  </span>
                </div>
              </div>
            </div>

            {/* Option 1: Share to Friends & WhatsApp */}
            <div className="space-y-2">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                Option 1: Share with Friends &amp; Family
              </span>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={handleWhatsAppShare}
                  className="py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow-md"
                >
                  <Share2 className="w-4 h-4" /> Share on WhatsApp
                </button>

                <button
                  onClick={handleNativeShare}
                  className="py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-200 font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Copy className="w-4 h-4" />
                  {copiedToast ? 'Copied to Clipboard!' : 'Copy Sadhana Card'}
                </button>
              </div>
            </div>

            {/* Option 2: Publish to Public Community Feed */}
            <div className="space-y-2 pt-2 border-t border-slate-800">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                Option 2: Publish to Anant Public Community Feed
              </span>
              <button
                onClick={handlePublishFeed}
                disabled={publishedSuccess}
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-slate-950 font-black text-xs flex items-center justify-center gap-2 shadow-lg shadow-amber-950/40 cursor-pointer"
              >
                {publishedSuccess ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-emerald-950" /> Published to Feed!
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" /> Publish Milestone Post to Feed
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 5: EXPORT SADDHANA DATA / MALA BACKUP & REPORTS */}
      {/* ========================================================================= */}
      {isExportModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-lg bg-slate-950 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Download className="w-5 h-5 text-amber-400" />
                <h3 className="font-bold text-sm text-slate-100">Export Mala Sadhana &amp; Backup Data</h3>
              </div>
              <button
                onClick={() => setIsExportModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {exportToast && (
              <div className="p-3 bg-emerald-950/80 border border-emerald-800 rounded-xl text-xs text-emerald-300 font-bold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{exportToast}</span>
              </div>
            )}

            <p className="text-xs text-slate-400">
              Export your Sadhana logs, active malas, streak counters, and target preferences into JSON or CSV formats for personal offline records or sharing with your Guru / Temple Trust.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              <button
                onClick={handleExportJSON}
                className="p-4 rounded-2xl bg-slate-900 hover:bg-slate-850 border border-amber-500/30 hover:border-amber-400 text-left space-y-2 cursor-pointer transition-all group"
              >
                <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-black text-xs group-hover:scale-110 transition-transform">
                  JSON
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-100">Full JSON Backup</h4>
                  <p className="text-[10px] text-slate-400 mt-0.5">Complete database &amp; settings</p>
                </div>
              </button>

              <button
                onClick={handleExportCSV}
                className="p-4 rounded-2xl bg-slate-900 hover:bg-slate-850 border border-amber-500/30 hover:border-amber-400 text-left space-y-2 cursor-pointer transition-all group"
              >
                <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-black text-xs group-hover:scale-110 transition-transform">
                  CSV
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-100">Mala Log Sheet</h4>
                  <p className="text-[10px] text-slate-400 mt-0.5">Excel / Google Sheets tabular</p>
                </div>
              </button>

              <button
                onClick={handleCopyReport}
                className="p-4 rounded-2xl bg-slate-900 hover:bg-slate-850 border border-amber-500/30 hover:border-amber-400 text-left space-y-2 cursor-pointer transition-all group"
              >
                <div className="w-8 h-8 rounded-xl bg-orange-500/20 text-orange-400 flex items-center justify-center font-black text-xs group-hover:scale-110 transition-transform">
                  TXT
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-100">Copy Text Summary</h4>
                  <p className="text-[10px] text-slate-400 mt-0.5">Formatted text for WhatsApp</p>
                </div>
              </button>
            </div>

            <div className="pt-3 border-t border-slate-800 flex justify-end">
              <button
                onClick={() => setIsExportModalOpen(false)}
                className="px-5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 font-bold text-xs cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
