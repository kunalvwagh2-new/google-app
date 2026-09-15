import React, { useState, useEffect } from 'react';
import {
  X,
  Calendar,
  Sun,
  Moon,
  AlertOctagon,
  CheckCircle2,
  Sparkles,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Download,
  RotateCcw,
  Music,
  FileText,
  Clock,
  WifiOff,
  Share2,
  MapPin,
  BookOpen,
  ChevronRight,
  Send,
  Copy,
  Check,
} from 'lucide-react';
import { mockPanchang } from '../../data/anantData.ts';
import { SupportedLanguage } from '../../types/anant.ts';

interface PanchangModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: SupportedLanguage;
}

interface AartiTrack {
  id: string;
  title: string;
  titleDevanagari: string;
  deity: string;
  duration: string;
  audioUrl: string;
  timing: string;
  lyricsSnippet: string;
}

interface CityOption {
  id: string;
  cityName: string;
  stateCountry: string;
  sunrise: string;
  sunset: string;
  brahmaStart: string;
  brahmaEnd: string;
  moonrise: string;
  moonset: string;
  choghadiya: {
    name: string;
    meaning: string;
    isShubh: boolean;
    type: 'AMRIT' | 'SHUBH' | 'LABH' | 'CHARA' | 'ROG' | 'UDVEG' | 'KAAL';
    timeWindow: string;
  };
}

const CITY_PANCHANG_DATA: Record<string, CityOption> = {
  pune: {
    id: 'pune',
    cityName: 'Pune (पुणे)',
    stateCountry: 'Maharashtra, India',
    sunrise: '06:14 AM',
    sunset: '06:36 PM',
    brahmaStart: '04:36 AM',
    brahmaEnd: '05:24 AM',
    moonrise: '08:42 PM',
    moonset: '09:15 AM',
    choghadiya: {
      name: 'Amrit (अमृत)',
      meaning: 'Best for Sadhana, Pooja & Initiation',
      isShubh: true,
      type: 'AMRIT',
      timeWindow: '09:18 AM - 10:48 AM',
    },
  },
  mumbai: {
    id: 'mumbai',
    cityName: 'Mumbai (मुंबई)',
    stateCountry: 'Maharashtra, India',
    sunrise: '06:18 AM',
    sunset: '06:40 PM',
    brahmaStart: '04:40 AM',
    brahmaEnd: '05:28 AM',
    moonrise: '08:45 PM',
    moonset: '09:18 AM',
    choghadiya: {
      name: 'Shubh (शुभ)',
      meaning: 'Auspicious for all spiritual works',
      isShubh: true,
      type: 'SHUBH',
      timeWindow: '12:18 PM - 01:48 PM',
    },
  },
  nashik: {
    id: 'nashik',
    cityName: 'Nashik (नाशिक)',
    stateCountry: 'Trimbakeshwar Region, India',
    sunrise: '06:12 AM',
    sunset: '06:34 PM',
    brahmaStart: '04:34 AM',
    brahmaEnd: '05:22 AM',
    moonrise: '08:40 PM',
    moonset: '09:12 AM',
    choghadiya: {
      name: 'Labh (लाभ)',
      meaning: 'Prosperity & Japa Siddhi',
      isShubh: true,
      type: 'LABH',
      timeWindow: '07:44 AM - 09:14 AM',
    },
  },
  varanasi: {
    id: 'varanasi',
    cityName: 'Varanasi (वाराणसी / काशी)',
    stateCountry: 'Uttar Pradesh, India',
    sunrise: '05:48 AM',
    sunset: '06:12 PM',
    brahmaStart: '04:10 AM',
    brahmaEnd: '04:58 AM',
    moonrise: '08:15 PM',
    moonset: '08:48 AM',
    choghadiya: {
      name: 'Amrit (अमृत)',
      meaning: 'Maha Sandhya & Ganga Aarti Time',
      isShubh: true,
      type: 'AMRIT',
      timeWindow: '05:48 AM - 07:18 AM',
    },
  },
  new_delhi: {
    id: 'new_delhi',
    cityName: 'New Delhi (नवी दिल्ली)',
    stateCountry: 'NCR, India',
    sunrise: '06:02 AM',
    sunset: '06:28 PM',
    brahmaStart: '04:24 AM',
    brahmaEnd: '05:12 AM',
    moonrise: '08:30 PM',
    moonset: '09:02 AM',
    choghadiya: {
      name: 'Chara (चल)',
      meaning: 'Neutral - Suitable for Travel',
      isShubh: true,
      type: 'CHARA',
      timeWindow: '01:48 PM - 03:18 PM',
    },
  },
  bengaluru: {
    id: 'bengaluru',
    cityName: 'Bengaluru (बंगळुरू)',
    stateCountry: 'Karnataka, India',
    sunrise: '06:08 AM',
    sunset: '06:22 PM',
    brahmaStart: '04:30 AM',
    brahmaEnd: '05:18 AM',
    moonrise: '08:35 PM',
    moonset: '09:05 AM',
    choghadiya: {
      name: 'Shubh (शुभ)',
      meaning: 'Good for Deep Meditation',
      isShubh: true,
      type: 'SHUBH',
      timeWindow: '10:38 AM - 12:08 PM',
    },
  },
};

const DAILY_AARTIS: AartiTrack[] = [
  {
    id: 'aarti_sukhkarta',
    title: 'Sukhkarta Dukhharta',
    titleDevanagari: 'सुखकर्ता दुखहर्ता वार्ता विघ्नाची',
    deity: 'Lord Ganesha',
    duration: '03:45',
    audioUrl: 'https://cdn.pixabay.com/download/audio/2022/05/16/audio_c8973d8a87.mp3?filename=meditative-spiritual-ambient-111161.mp3',
    timing: 'Morning 07:00 AM & Evening 07:30 PM',
    lyricsSnippet: 'सुखकर्ता दुखहर्ता वार्ता विघ्नाची । नुरवी पुरवी प्रेम कृपा जयाची ॥ सर्वांगी सुंदर उटी शेंदुराची । कंठी झळके माळ मुक्ताफळांची ॥',
  },
  {
    id: 'aarti_shendur',
    title: 'Shendur Lal Chadhayo',
    titleDevanagari: 'शेंदुर लाल चढायो चांगो मखमली',
    deity: 'Lord Ganesha',
    duration: '04:12',
    audioUrl: 'https://cdn.pixabay.com/download/audio/2022/03/15/audio_c8b9390233.mp3?filename=temple-bells-spiritual-10145.mp3',
    timing: 'Madhyahna Pooja (12:00 PM)',
    lyricsSnippet: 'शेंदुर लाल चढायो चांगो मखमली । हिरवे पातळ शोभे कंचुकी पिवळी ॥ जय देव जय देव जय श्री मंगलमूर्ती । दर्शनमात्रे मनकामना पूर्ती ॥',
  },
  {
    id: 'aarti_ghalin_lotangan',
    title: 'Ghalin Lotangan Vandin Charan',
    titleDevanagari: 'घालीन लोटांगण वंदीन चरण',
    deity: 'Sarva Devata Prarthana',
    duration: '02:30',
    audioUrl: 'https://cdn.pixabay.com/download/audio/2022/05/16/audio_c8973d8a87.mp3?filename=meditative-spiritual-ambient-111161.mp3',
    timing: 'Universal Aarti Concluding Mantra',
    lyricsSnippet: 'घालीन लोटांगण वंदीन चरण । डोळ्यांनी पाहीन रूप तुझें ॥ प्रेमें आलिंगीन आनंदें पूजीन । भावें ओवाळीन म्हणे नामा ॥',
  },
  {
    id: 'stotra_atharvashirsha',
    title: 'Ganapati Atharvashirsha Upanishad',
    titleDevanagari: 'श्री गणपती अथर्वशीर्ष स्तोत्र',
    deity: 'Lord Ganesha',
    duration: '06:18',
    audioUrl: 'https://cdn.pixabay.com/download/audio/2022/03/15/audio_c8b9390233.mp3?filename=temple-bells-spiritual-10145.mp3',
    timing: 'Brahma Muhurat (05:30 AM)',
    lyricsSnippet: 'ॐ नमस्ते गणपतये । त्वमेव प्रत्यक्षं तत्त्वमसि । त्वमेव केवलं कर्ताऽसि । त्वमेव केवलं धर्ताऽसि । त्वमेव केवलं हर्ताऽसि ॥',
  },
  {
    id: 'stotra_mrityunjaya',
    title: 'Maha Mrityunjaya Stotram',
    titleDevanagari: 'महामृत्युंजय स्तोत्र व जप',
    deity: 'Lord Shiva',
    duration: '05:04',
    audioUrl: 'https://cdn.pixabay.com/download/audio/2022/05/16/audio_c8973d8a87.mp3?filename=meditative-spiritual-ambient-111161.mp3',
    timing: 'Pradosh & Evening Sandhya',
    lyricsSnippet: 'ॐ त्र्यम्बकं यजामहे सुगन्धिं पुष्टिवर्धनम् । उर्वारुकमिव बन्धनान्मृ त्योर्मुक्षीय मामृतात् ॥',
  },
];

export function PanchangModal({ isOpen, onClose }: PanchangModalProps) {
  const [activeTab, setActiveTab] = useState<'PANCHANG' | 'WISDOM' | 'AARTI_PLAYER'>('PANCHANG');
  const [selectedCityId, setSelectedCityId] = useState<string>('pune');
  const cityData = CITY_PANCHANG_DATA[selectedCityId] || CITY_PANCHANG_DATA.pune;

  // Shloka Audio Pronunciation State
  const [isPlayingShlokaAudio, setIsPlayingShlokaAudio] = useState(false);
  const [copiedShare, setCopiedShare] = useState(false);

  // Aarti Player State
  const [currentTrack, setCurrentTrack] = useState<AartiTrack>(DAILY_AARTIS[0]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progressSec, setProgressSec] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [showLyrics, setShowLyrics] = useState(true);
  const [downloadedTracks, setDownloadedTracks] = useState<string[]>(['aarti_sukhkarta', 'aarti_ghalin_lotangan']);

  // Timer simulation for player
  useEffect(() => {
    let interval: any = null;
    if (isPlaying) {
      interval = setInterval(() => {
        setProgressSec((prev) => (prev >= 210 ? 0 : prev + 1));
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPlaying]);

  if (!isOpen) return null;

  const toggleDownloadTrack = (trackId: string) => {
    if (downloadedTracks.includes(trackId)) {
      setDownloadedTracks((prev) => prev.filter((id) => id !== trackId));
    } else {
      setDownloadedTracks((prev) => [...prev, trackId]);
    }
  };

  const formatSec = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Play Shloka Pronunciation using Web Speech API
  const handlePlayShlokaAudio = () => {
    if ('speechSynthesis' in window) {
      if (isPlayingShlokaAudio) {
        window.speechSynthesis.cancel();
        setIsPlayingShlokaAudio(false);
        return;
      }
      const textToSpeak = "ॐ असतो मा सद्गमय । तमसो मा ज्योतिर्गमय । मृत्योर्मा अमृतं गमय ॥ Lead me from falsehood to truth, from darkness to light, from death to immortality.";
      const utterance = new SpeechSynthesisUtterance(textToSpeak);
      utterance.rate = 0.85;
      utterance.onend = () => setIsPlayingShlokaAudio(false);
      utterance.onerror = () => setIsPlayingShlokaAudio(false);
      setIsPlayingShlokaAudio(true);
      window.speechSynthesis.speak(utterance);
    } else {
      alert('🔊 Audio pronunciation playing: "Om Asato Ma Sadgamaya..."');
    }
  };

  // Pre-formatted WhatsApp share content
  const getShareText = () => {
    return `*🙏 Dainik Panchang & Daily Wisdom - Anant Sadhana*
📅 Date: ${mockPanchang.dateStr}
📍 City: ${cityData.cityName}

✨ *Vedic Samvat & Tithi:*
• Samvat: Vikram Samvat 2083 (Krodhi Samvatsara)
• Tithi: ${mockPanchang.tithi} (${mockPanchang.hinduMonth})
• Nakshatra: ${mockPanchang.nakshatra}

⏳ *Auspicious Muhurat:*
• Brahma Muhurta: ${cityData.brahmaStart} - ${cityData.brahmaEnd} (Best for Meditation)
• Abhijit Muhurat: ${mockPanchang.abhijitMuhurat}
• Current Choghadiya: ${cityData.choghadiya.name} (${cityData.choghadiya.timeWindow})
• Rahu Kaal (Avoid): ${mockPanchang.rahuKaal}

📿 *Daily Shloka:*
"ॐ असतो मा सद्गमय । तमसो मा ज्योतिर्गमय । मृत्योर्मा अमृतं गमय ॥"
(Lead me from falsehood to truth, from darkness to light, from death to immortality)

Read Panchang & Chant Jaap on Anant App:
https://ais-dev-wwnpdzunkfxqjpj7tulgpa-1050932369541.asia-southeast1.run.app`;
  };

  const handleShareWhatsApp = () => {
    const text = encodeURIComponent(getShareText());
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
  };

  const handleCopyPanchang = () => {
    navigator.clipboard.writeText(getShareText());
    setCopiedShare(true);
    setTimeout(() => setCopiedShare(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-md animate-in fade-in overflow-y-auto">
      <div className="w-full max-w-3xl bg-slate-950 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col my-auto max-h-[92vh]">
        {/* Header Bar */}
        <div className="p-5 border-b border-slate-800/80 bg-slate-900/90 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/15 border border-amber-500/40 flex items-center justify-center text-amber-400 shrink-0">
              <Calendar className="w-6 h-6 text-amber-400" />
            </div>
            <div>
              <h3 className="font-black text-base sm:text-lg text-slate-100 flex items-center gap-2">
                Dainik Panchang &amp; Daily Wisdom (दैणिक पंचांग व नित्य ज्ञान)
              </h3>
              <p className="text-xs text-amber-400 font-bold flex items-center gap-1.5 mt-0.5">
                <span>Vikram Samvat 2083</span>
                <span>•</span>
                <span>{mockPanchang.hinduMonth}</span>
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* City Selector Bar */}
        <div className="px-5 py-3 bg-slate-900/60 border-b border-slate-800 flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-amber-400 shrink-0" />
            <span className="font-bold text-slate-300">Panchang Location:</span>
            <select
              value={selectedCityId}
              onChange={(e) => setSelectedCityId(e.target.value)}
              className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 font-bold text-amber-300 focus:outline-none focus:border-amber-500 min-h-[40px] cursor-pointer"
            >
              {Object.values(CITY_PANCHANG_DATA).map((c) => (
                <option key={c.id} value={c.id}>
                  {c.cityName} ({c.stateCountry})
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2 font-mono text-[11px] text-slate-400">
            <span>Sunrise: <strong className="text-amber-300">{cityData.sunrise}</strong></span>
            <span>•</span>
            <span>Sunset: <strong className="text-amber-300">{cityData.sunset}</strong></span>
          </div>
        </div>

        {/* Tab Switcher Bar */}
        <div className="flex items-center gap-1.5 p-2.5 bg-slate-950 border-b border-slate-800/80 overflow-x-auto">
          <button
            onClick={() => setActiveTab('PANCHANG')}
            className={`min-h-[44px] px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'PANCHANG'
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-950/40'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>Vedic Timings &amp; Choghadiya</span>
          </button>

          <button
            onClick={() => setActiveTab('WISDOM')}
            className={`min-h-[44px] px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'WISDOM'
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-950/40'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Daily Shloka &amp; Gita Wisdom</span>
          </button>

          <button
            onClick={() => setActiveTab('AARTI_PLAYER')}
            className={`min-h-[44px] px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'AARTI_PLAYER'
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-950/40'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <Music className="w-4 h-4" />
            <span>Nitya Aarti &amp; Stotra Player</span>
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-5 overflow-y-auto space-y-5 flex-1">
          {/* ================================================================= */}
          {/* TAB 1: VEDIC TIMINGS & CHOGHADIYA GRID */}
          {/* ================================================================= */}
          {activeTab === 'PANCHANG' && (
            <div className="space-y-4">
              {/* Highlighted Current Choghadiya Banner */}
              <div className="p-4 bg-gradient-to-r from-emerald-950/60 via-slate-900 to-slate-950 border border-emerald-800/60 rounded-2xl flex flex-wrap items-center justify-between gap-3 shadow-md">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 font-black text-sm shrink-0">
                    ⚡
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 block">
                      Active Choghadiya Muhurat Right Now (सध्याचा चोघडिया)
                    </span>
                    <h4 className="text-sm font-black text-slate-100 flex items-center gap-2 mt-0.5">
                      <span className="text-emerald-300 font-bold">{cityData.choghadiya.name}</span>
                      <span className="text-xs text-slate-400 font-mono">({cityData.choghadiya.timeWindow})</span>
                    </h4>
                    <p className="text-xs text-slate-300 mt-0.5">{cityData.choghadiya.meaning}</p>
                  </div>
                </div>

                <span className="px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold flex items-center gap-1.5 shrink-0">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Auspicious Time
                </span>
              </div>

              {/* 6-Grid Core Vedic Attributes */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {/* Brahma Muhurta (Best for Meditation) */}
                <div className="p-3.5 bg-slate-900 rounded-2xl border border-amber-500/40 shadow-sm space-y-1">
                  <span className="text-[10px] font-bold uppercase text-amber-400 tracking-wider flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-amber-400" /> Brahma Muhurta
                  </span>
                  <p className="text-sm font-black font-mono text-amber-300">
                    {cityData.brahmaStart} - {cityData.brahmaEnd}
                  </p>
                  <span className="text-[10px] text-slate-400 font-medium block">
                    Ideal for Dhyan, Yoga &amp; Jaap
                  </span>
                </div>

                {/* Tithi & Masa */}
                <div className="p-3.5 bg-slate-900 rounded-2xl border border-slate-800 space-y-1">
                  <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">
                    Tithi &amp; Paksha
                  </span>
                  <p className="text-sm font-bold text-amber-400">{mockPanchang.tithi}</p>
                  <span className="text-[10px] text-slate-400 block">Bhadrapada Shukla Paksha</span>
                </div>

                {/* Nakshatra */}
                <div className="p-3.5 bg-slate-900 rounded-2xl border border-slate-800 space-y-1">
                  <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">
                    Nakshatra (नक्षत्र)
                  </span>
                  <p className="text-sm font-bold text-slate-100">{mockPanchang.nakshatra}</p>
                  <span className="text-[10px] text-slate-500">Till 11:48 PM</span>
                </div>

                {/* Moonrise & Moonset */}
                <div className="p-3.5 bg-slate-900 rounded-2xl border border-slate-800 space-y-1">
                  <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider flex items-center gap-1">
                    <Moon className="w-3 h-3 text-sky-300" /> Chandra Uday &amp; Ast
                  </span>
                  <p className="text-sm font-bold text-sky-300 font-mono">{cityData.moonrise}</p>
                  <span className="text-[10px] text-slate-400 block font-mono">Moonset: {cityData.moonset}</span>
                </div>

                {/* Yoga & Karana */}
                <div className="p-3.5 bg-slate-900 rounded-2xl border border-slate-800 space-y-1">
                  <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">
                    Yoga &amp; Karana
                  </span>
                  <p className="text-sm font-bold text-emerald-400">{mockPanchang.yoga}</p>
                  <span className="text-[10px] text-slate-400 block">{mockPanchang.karana}</span>
                </div>

                {/* Samvat & Rashi */}
                <div className="p-3.5 bg-slate-900 rounded-2xl border border-slate-800 space-y-1">
                  <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">
                    Chandra Rashi
                  </span>
                  <p className="text-sm font-bold text-slate-100">Kanya Rashi (कन्या)</p>
                  <span className="text-[10px] text-slate-400 block">Vikram Samvat 2083</span>
                </div>
              </div>

              {/* Shubh Abhijit Muhurat vs Rahu Kaal */}
              <div className="space-y-2.5 pt-1">
                <div className="p-4 bg-emerald-950/40 border border-emerald-800/60 rounded-2xl flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                    <div>
                      <span className="text-xs font-bold text-emerald-300 block">
                        Abhijit Muhurat (सर्वोत्तम मुहूर्त)
                      </span>
                      <span className="text-sm font-mono font-bold text-slate-100 block">{mockPanchang.abhijitMuhurat}</span>
                    </div>
                  </div>
                  <span className="text-[11px] font-bold text-emerald-400 bg-emerald-950 px-2.5 py-1 rounded-xl border border-emerald-800/40">
                    Auspicious for All Poojas
                  </span>
                </div>

                <div className="p-4 bg-rose-950/40 border border-rose-800/60 rounded-2xl flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <AlertOctagon className="w-5 h-5 text-rose-400 shrink-0" />
                    <div>
                      <span className="text-xs font-bold text-rose-300 block">Rahu Kaal (राहु काळ - वर्ज्य)</span>
                      <span className="text-sm font-mono font-bold text-slate-100 block">{mockPanchang.rahuKaal}</span>
                    </div>
                  </div>
                  <span className="text-[11px] font-bold text-rose-400 bg-rose-950 px-2.5 py-1 rounded-xl border border-rose-800/40">
                    Avoid New Beginnings
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* ================================================================= */}
          {/* TAB 2: DAILY WISDOM (DAILY SHLOKA & BHAGAVAD GITA THOUGHT) */}
          {/* ================================================================= */}
          {activeTab === 'WISDOM' && (
            <div className="space-y-4">
              {/* Daily Shloka Card */}
              <div className="p-5 bg-gradient-to-br from-slate-900 via-slate-950 to-amber-950/30 border border-amber-500/40 rounded-3xl shadow-xl space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-amber-400" />
                    <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
                      Nitya Daily Shloka (दैनिक श्लोक)
                    </span>
                  </div>

                  {/* Audio Pronunciation Button */}
                  <button
                    onClick={handlePlayShlokaAudio}
                    className={`min-h-[44px] px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
                      isPlayingShlokaAudio
                        ? 'bg-amber-500 text-slate-950 animate-pulse'
                        : 'bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 border border-amber-500/40'
                    }`}
                  >
                    <Volume2 className="w-4 h-4" />
                    <span>{isPlayingShlokaAudio ? 'Playing Pronunciation...' : 'Listen Pronunciation'}</span>
                  </button>
                </div>

                {/* Devanagari Shloka Text */}
                <div className="p-4 bg-slate-950/90 rounded-2xl border border-slate-800 text-center space-y-2">
                  <p className="text-base sm:text-lg font-serif font-black text-amber-300 leading-relaxed">
                    ॐ असतो मा सद्गमय ।<br />
                    तमसो मा ज्योतिर्गमय ।<br />
                    मृत्योर्मा अमृतं गमय ॥
                  </p>
                  <p className="text-xs text-slate-400 italic font-medium">
                    "Om Asato Ma Sadgamaya, Tamaso Ma Jyotirgamaya, Mrityorma Amritam Gamaya"
                  </p>
                </div>

                {/* Meaning */}
                <div className="p-3.5 bg-slate-900/90 rounded-xl border border-slate-800 text-xs text-slate-200 leading-relaxed">
                  <strong className="text-amber-400 block mb-0.5">Meaning:</strong>
                  Lead me from the unreal to the real, from darkness to divine light, and from the illusion of mortality to eternal immortality.
                </div>
              </div>

              {/* Bhagavad Gita Thought of the Day */}
              <div className="p-5 bg-slate-900 border border-slate-800 rounded-3xl shadow-xl space-y-3">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-amber-400" />
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-200">
                    Bhagavad Gita Thought of the Day (श्रीमद्भगवद्गीता चिंतन)
                  </span>
                </div>

                <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-2">
                  <span className="text-[10px] font-mono font-bold uppercase text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">
                    Chapter 2, Verse 47 (कर्मयोग)
                  </span>
                  <p className="text-sm font-serif font-bold text-amber-200 leading-relaxed">
                    कर्मण्येवाधिकारस्ते मा फलेषु कदाचन ।<br />
                    मा कर्मफलहेतुर्भूर्मा ते सङ्गोऽस्त्वकर्मणि ॥
                  </p>

                  <div className="pt-2 border-t border-slate-900 text-xs text-slate-300 leading-relaxed space-y-1">
                    <p>
                      <strong>Transliteration:</strong> Karmanye Vadhikaraste Ma Phaleshu Kadachana | Ma Karma Phala Hetur Bhur Ma Te Sangostv Akarmani ||
                    </p>
                    <p className="text-slate-200 pt-1">
                      <strong>Divine Insight:</strong> You have a right to perform your prescribed duties, but you are never entitled to the fruits of your actions. Perform every action as a selfless offering unto the Supreme without anxiety over outcomes.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ================================================================= */}
          {/* TAB 3: DAILY AARTI AUDIO PLAYER */}
          {/* ================================================================= */}
          {activeTab === 'AARTI_PLAYER' && (
            <div className="space-y-4">
              {/* Active Playing Banner */}
              <div className="bg-gradient-to-br from-slate-950 via-slate-900 to-amber-950/40 border border-amber-500/30 rounded-3xl p-5 shadow-xl space-y-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono font-bold uppercase text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">
                        {currentTrack.timing}
                      </span>
                      {downloadedTracks.includes(currentTrack.id) && (
                        <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" /> Offline Saved
                        </span>
                      )}
                    </div>
                    <h4 className="text-base font-black text-slate-100 mt-1">
                      {currentTrack.title}
                    </h4>
                    <p className="text-xs text-amber-300/90 font-serif font-semibold mt-0.5">
                      {currentTrack.titleDevanagari}
                    </p>
                  </div>

                  <button
                    onClick={() => toggleDownloadTrack(currentTrack.id)}
                    className={`p-2.5 rounded-xl border transition-all cursor-pointer ${
                      downloadedTracks.includes(currentTrack.id)
                        ? 'bg-emerald-950/60 border-emerald-700 text-emerald-400'
                        : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                    }`}
                    title="Download for offline temple playback"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                </div>

                {/* Scrubber */}
                <div className="space-y-1.5">
                  <div className="w-full bg-slate-950 rounded-full h-2 overflow-hidden border border-slate-800">
                    <div
                      className="h-full bg-amber-500 rounded-full transition-all"
                      style={{ width: `${(progressSec / 225) * 100}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-[11px] font-mono text-slate-400">
                    <span>{formatSec(progressSec)}</span>
                    <span>{currentTrack.duration}</span>
                  </div>
                </div>

                {/* Player Controls */}
                <div className="flex items-center justify-between pt-1">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setProgressSec(0)}
                      className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 cursor-pointer min-h-[44px] min-w-[44px] flex items-center justify-center"
                      title="Restart Aarti"
                    >
                      <RotateCcw className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setIsMuted(!isMuted)}
                      className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 cursor-pointer min-h-[44px] min-w-[44px] flex items-center justify-center"
                    >
                      {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4" />}
                    </button>
                  </div>

                  {/* Play / Pause Main Button */}
                  <button
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="w-12 h-12 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 flex items-center justify-center shadow-lg shadow-amber-950/60 cursor-pointer transition-transform active:scale-95 min-h-[48px] min-w-[48px]"
                  >
                    {isPlaying ? <Pause className="w-6 h-6 fill-current" /> : <Play className="w-6 h-6 fill-current ml-0.5" />}
                  </button>

                  <button
                    onClick={() => setShowLyrics(!showLyrics)}
                    className={`px-3 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer flex items-center gap-1.5 min-h-[44px] ${
                      showLyrics
                        ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                        : 'bg-slate-800 text-slate-400 border-slate-700'
                    }`}
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span>{showLyrics ? 'Lyrics ON' : 'Lyrics'}</span>
                  </button>
                </div>

                {/* Lyrics Display */}
                {showLyrics && (
                  <div className="p-3.5 bg-slate-950/80 rounded-2xl border border-slate-800 text-xs text-amber-100/90 font-serif leading-relaxed text-center italic">
                    "{currentTrack.lyricsSnippet}"
                  </div>
                )}
              </div>

              {/* Playlist of Daily Aartis & Stotras */}
              <div className="space-y-2">
                <div className="flex items-center justify-between px-1">
                  <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                    Daily Nitya Aartis &amp; Stotra Sangrah
                  </span>
                  <span className="text-[11px] font-mono text-emerald-400 flex items-center gap-1">
                    <WifiOff className="w-3 h-3" /> Offline Capable (IndexedDB)
                  </span>
                </div>

                {DAILY_AARTIS.map((track) => {
                  const isCurrent = currentTrack.id === track.id;
                  const isDownloaded = downloadedTracks.includes(track.id);
                  return (
                    <div
                      key={track.id}
                      onClick={() => {
                        setCurrentTrack(track);
                        setProgressSec(0);
                        setIsPlaying(true);
                      }}
                      className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 min-h-[48px] ${
                        isCurrent
                          ? 'bg-amber-500/10 border-amber-500/60 shadow-md shadow-amber-950/30'
                          : 'bg-slate-950 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                            isCurrent && isPlaying
                              ? 'bg-amber-500 text-slate-950 animate-pulse'
                              : 'bg-slate-900 text-slate-300'
                          }`}
                        >
                          {isCurrent && isPlaying ? (
                            <Pause className="w-4 h-4 fill-current" />
                          ) : (
                            <Play className="w-4 h-4 fill-current ml-0.5" />
                          )}
                        </div>
                        <div>
                          <p className="text-xs font-bold text-slate-100 leading-tight">
                            {track.title}
                          </p>
                          <p className="text-[11px] text-slate-400 font-serif">
                            {track.titleDevanagari}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 shrink-0 text-xs">
                        <span className="text-slate-400 font-mono text-[11px]">{track.duration}</span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleDownloadTrack(track.id);
                          }}
                          className={`p-1.5 rounded-lg border cursor-pointer min-h-[36px] min-w-[36px] flex items-center justify-center ${
                            isDownloaded
                              ? 'bg-emerald-950/80 border-emerald-700 text-emerald-400'
                              : 'bg-slate-900 border-slate-800 text-slate-500 hover:text-slate-200'
                          }`}
                          title={isDownloaded ? 'Cached Offline' : 'Cache for offline'}
                        >
                          <Download className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Footer Action & Sharing Bar */}
        <div className="p-4 bg-slate-900 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              onClick={handleShareWhatsApp}
              className="min-h-[48px] px-4 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-2 shadow-md shadow-emerald-950/40 transition-all cursor-pointer"
            >
              <Send className="w-4 h-4" />
              <span>Share Panchang on WhatsApp</span>
            </button>

            <button
              onClick={handleCopyPanchang}
              className="min-h-[48px] px-4 py-2.5 rounded-2xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-200 font-bold text-xs flex items-center gap-2 transition-all cursor-pointer"
            >
              {copiedShare ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-slate-400" />}
              <span>{copiedShare ? 'Copied to Clipboard!' : 'Copy Text'}</span>
            </button>
          </div>

          <button
            onClick={onClose}
            className="min-h-[48px] px-5 py-2.5 rounded-2xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs shadow-md transition-all cursor-pointer"
          >
            Close Panchang
          </button>
        </div>
      </div>
    </div>
  );
}
