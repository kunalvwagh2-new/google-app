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
  Radio,
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

export function PanchangModal({ isOpen, onClose, language }: PanchangModalProps) {
  const [activeTab, setActiveTab] = useState<'PANCHANG' | 'AARTI_PLAYER'>('PANCHANG');

  // Audio Player State
  const [currentTrack, setCurrentTrack] = useState<AartiTrack>(DAILY_AARTIS[0]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progressSec, setProgressSec] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [showLyrics, setShowLyrics] = useState(true);
  const [isOfflineCached, setIsOfflineCached] = useState(true);
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
      alert('💾 Stotra / Aarti cached to offline storage for offline mandir playback!');
    }
  };

  const formatSec = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/80 backdrop-blur-md animate-in fade-in overflow-y-auto">
      <div className="w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col my-auto max-h-[92vh]">
        {/* Header */}
        <div className="p-5 border-b border-slate-800/80 bg-slate-950/70 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Calendar className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-black text-base sm:text-lg text-slate-100 flex items-center gap-2">
                Dainik Panchang & Daily Aarti Player
              </h3>
              <p className="text-xs text-amber-400 font-medium">
                {mockPanchang.dateStr} • Bhadrapada Shukla Chaturthi
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-1.5 p-3 bg-slate-950/80 border-b border-slate-800/80 overflow-x-auto">
          <button
            onClick={() => setActiveTab('PANCHANG')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'PANCHANG'
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-950/40'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Vedic Panchang & Muhurat</span>
          </button>

          <button
            onClick={() => setActiveTab('AARTI_PLAYER')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'AARTI_PLAYER'
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-950/40'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <Music className="w-3.5 h-3.5" />
            <span>Daily Aarti & Stotra Player</span>
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-5 overflow-y-auto space-y-5 flex-1">
          {/* ================================================================= */}
          {/* TAB 1: PANCHANG CALENDAR */}
          {/* ================================================================= */}
          {activeTab === 'PANCHANG' && (
            <div className="space-y-4">
              {/* Festival Highlight */}
              {mockPanchang.festival && (
                <div className="p-4 bg-gradient-to-r from-amber-950/60 to-orange-950/40 border border-amber-800/60 rounded-2xl flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <Sparkles className="w-5 h-5 text-amber-400 shrink-0 animate-pulse" />
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400">
                        Auspicious Observance / मुख्य उत्सव
                      </span>
                      <p className="text-xs font-semibold text-slate-200">{mockPanchang.festival}</p>
                    </div>
                  </div>

                  <button
                    onClick={() => setActiveTab('AARTI_PLAYER')}
                    className="px-3 py-1.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-xs font-bold flex items-center gap-1.5 cursor-pointer shrink-0"
                  >
                    <Play className="w-3 h-3 fill-current" />
                    <span>Play Today's Aarti</span>
                  </button>
                </div>
              )}

              {/* 6-Grid Core Panchang Attributes */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div className="p-3.5 bg-slate-950 rounded-2xl border border-slate-800/80">
                  <span className="text-[10px] text-slate-400 font-semibold block">Tithi (तिथि)</span>
                  <span className="text-sm font-bold text-amber-400 block mt-0.5">{mockPanchang.tithi}</span>
                  <span className="text-[10px] text-slate-500">{mockPanchang.paksha}</span>
                </div>

                <div className="p-3.5 bg-slate-950 rounded-2xl border border-slate-800/80">
                  <span className="text-[10px] text-slate-400 font-semibold block">Nakshatra (नक्षत्र)</span>
                  <span className="text-sm font-bold text-slate-200 block mt-0.5">{mockPanchang.nakshatra}</span>
                  <span className="text-[10px] text-slate-500">Till 11:48 PM</span>
                </div>

                <div className="p-3.5 bg-slate-950 rounded-2xl border border-slate-800/80">
                  <span className="text-[10px] text-slate-400 font-semibold block">Yoga (योग)</span>
                  <span className="text-sm font-bold text-emerald-400 block mt-0.5">{mockPanchang.yoga}</span>
                  <span className="text-[10px] text-slate-500">Auspicious for Japa</span>
                </div>

                <div className="p-3.5 bg-slate-950 rounded-2xl border border-slate-800/80">
                  <span className="text-[10px] text-slate-400 font-semibold block">Karana (करण)</span>
                  <span className="text-sm font-bold text-slate-200 block mt-0.5">{mockPanchang.karana}</span>
                  <span className="text-[10px] text-slate-500">Bhadrapada Maas</span>
                </div>

                <div className="p-3.5 bg-slate-950 rounded-2xl border border-slate-800/80">
                  <span className="text-[10px] text-slate-400 font-semibold block flex items-center gap-1">
                    <Sun className="w-3 h-3 text-amber-400" /> Surya Uday & Ast
                  </span>
                  <span className="text-sm font-bold text-slate-200 block mt-0.5">{mockPanchang.sunrise}</span>
                  <span className="text-[10px] text-slate-500">Sunset: {mockPanchang.sunset}</span>
                </div>

                <div className="p-3.5 bg-slate-950 rounded-2xl border border-slate-800/80">
                  <span className="text-[10px] text-slate-400 font-semibold block flex items-center gap-1">
                    <Moon className="w-3 h-3 text-sky-300" /> Chandra Rashi
                  </span>
                  <span className="text-sm font-bold text-slate-200 block mt-0.5">Kanya Rashi</span>
                  <span className="text-[10px] text-slate-500">कन्या राशी (हस्त)</span>
                </div>
              </div>

              {/* Shubh Muhurat vs Rahu Kaal */}
              <div className="space-y-2.5 pt-1">
                <div className="p-3.5 bg-emerald-950/40 border border-emerald-800/60 rounded-2xl flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <div>
                      <span className="text-xs font-bold text-emerald-300 block">
                        Abhijit Muhurat (शुभ काळ)
                      </span>
                      <span className="text-[11px] text-slate-300 block">{mockPanchang.abhijitMuhurat}</span>
                    </div>
                  </div>
                  <span className="text-[10px] uppercase font-bold text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded-md border border-emerald-800/40">
                    Best for Poojas
                  </span>
                </div>

                <div className="p-3.5 bg-rose-950/40 border border-rose-800/60 rounded-2xl flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <AlertOctagon className="w-4 h-4 text-rose-400 shrink-0" />
                    <div>
                      <span className="text-xs font-bold text-rose-300 block">Rahu Kaal (राहु काळ)</span>
                      <span className="text-[11px] text-slate-300 block">{mockPanchang.rahuKaal}</span>
                    </div>
                  </div>
                  <span className="text-[10px] uppercase font-bold text-rose-400 bg-rose-950 px-2 py-0.5 rounded-md border border-rose-800/40">
                    Inauspicious (वर्ज्य)
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* ================================================================= */}
          {/* TAB 2: OFFLINE-CAPABLE DAILY AARTI AUDIO PLAYER */}
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
                      className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 cursor-pointer"
                      title="Restart Aarti"
                    >
                      <RotateCcw className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setIsMuted(!isMuted)}
                      className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 cursor-pointer"
                    >
                      {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4" />}
                    </button>
                  </div>

                  {/* Play / Pause Main Button */}
                  <button
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="w-12 h-12 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 flex items-center justify-center shadow-lg shadow-amber-950/60 cursor-pointer transition-transform active:scale-95"
                  >
                    {isPlaying ? <Pause className="w-6 h-6 fill-current" /> : <Play className="w-6 h-6 fill-current ml-0.5" />}
                  </button>

                  <button
                    onClick={() => setShowLyrics(!showLyrics)}
                    className={`px-3 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer flex items-center gap-1.5 ${
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
                    Daily Nitya Aartis & Stotra Sangrah
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
                      className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
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
                          className={`p-1.5 rounded-lg border cursor-pointer ${
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
      </div>
    </div>
  );
}

