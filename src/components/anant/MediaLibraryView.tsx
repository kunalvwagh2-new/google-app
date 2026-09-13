import React, { useState, useRef, useEffect } from 'react';
import {
  Music,
  BookOpen,
  Play,
  Pause,
  Download,
  FileText,
  Radio,
  Volume2,
  VolumeX,
  Sparkles,
  Search,
  Languages,
  RotateCcw,
  Share2,
  Check,
  ExternalLink,
  Flame,
  Infinity as InfinityIcon,
  Headphones,
} from 'lucide-react';
import { MediaItem, MediaCategory, SupportedLanguage } from '../../types/anant.ts';
import { mockMediaLibrary } from '../../data/anantData.ts';

interface MediaLibraryViewProps {
  initialItem?: MediaItem;
  language: SupportedLanguage;
  onStartBackgroundChant?: (chant: MediaItem) => void;
}

export function MediaLibraryView({ initialItem, language, onStartBackgroundChant }: MediaLibraryViewProps) {
  // Selected category filter
  const [selectedCategory, setSelectedCategory] = useState<MediaCategory | 'ALL'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeMedia, setActiveMedia] = useState<MediaItem>(initialItem || mockMediaLibrary[0]);

  // Audio / Player State
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(252); // in seconds (~04:12)
  const [isMuted, setIsMuted] = useState(false);
  const [lyricsLanguage, setLyricsLanguage] = useState<'mr' | 'hi' | 'en'>('mr');
  const [copiedLink, setCopiedLink] = useState(false);

  // Live Darshan Stream Toggle
  const [isLiveStreamActive, setIsLiveStreamActive] = useState(false);

  // Simulated audio playback progress
  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;
    if (isPlaying) {
      timer = setInterval(() => {
        setCurrentTime((prev) => {
          if (prev >= duration) {
            setIsPlaying(false);
            return 0;
          }
          return prev + 1;
        });
      }, 1000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isPlaying, duration]);

  // Filter items
  const filteredItems = mockMediaLibrary.filter((item) => {
    const matchesCat = selectedCategory === 'ALL' || item.category === selectedCategory;
    const matchesSearch =
      !searchQuery.trim() ||
      item.titleEn.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.titleMr.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.deityName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const categories: { id: MediaCategory | 'ALL'; label: string; count: number }[] = [
    { id: 'ALL', label: 'All Media (सर्व)', count: mockMediaLibrary.length },
    {
      id: 'CHANT',
      label: 'Chants & Mantras (जप व नामस्मरण)',
      count: mockMediaLibrary.filter((m) => m.category === 'CHANT').length,
    },
    {
      id: 'ARTI',
      label: 'Artis (आरत्या)',
      count: mockMediaLibrary.filter((m) => m.category === 'ARTI').length,
    },
    {
      id: 'STOTRA',
      label: 'Stotras (स्तोत्रे)',
      count: mockMediaLibrary.filter((m) => m.category === 'STOTRA').length,
    },
    {
      id: 'BHAJAN',
      label: 'Bhajans & Abhang',
      count: mockMediaLibrary.filter((m) => m.category === 'BHAJAN').length,
    },
    {
      id: 'CHATURMAS_BOOK',
      label: 'Chaturmas Library (चातुर्मास ग्रंथ)',
      count: mockMediaLibrary.filter((m) => m.category === 'CHATURMAS_BOOK').length,
    },
  ];

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleDownloadPdf = () => {
    const blob = new Blob(
      [
        `Anant Sacred Library\nTitle: ${activeMedia.titleEn} (${activeMedia.titleMr})\nDeity: ${activeMedia.deityName}\nCategory: ${activeMedia.category}\n\nLYRICS / SCRIPT:\n${activeMedia.lyrics.mr}\n\n---\nHindi:\n${activeMedia.lyrics.hi}\n\n---\nEnglish:\n${activeMedia.lyrics.en}`,
      ],
      { type: 'text/plain;charset=utf-8' }
    );
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${activeMedia.id}_sacred_script.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleShare = () => {
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner with Live Darshan Embed Stream Trigger */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 sm:p-6 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2.5 h-2.5 rounded-full bg-sky-400" />
            <span className="text-[11px] font-bold uppercase tracking-widest text-sky-400">
              Sacred Media & Chaturmas Portal
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-100 tracking-tight">
            Devotional Library & Live Darshan Player
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Immerse in synchronized multi-lingual lyrics, sacred artis, stotras, and Chaturmas granth.
          </p>
        </div>

        <button
          onClick={() => setIsLiveStreamActive(!isLiveStreamActive)}
          className={`px-4 py-2.5 rounded-2xl font-bold text-xs flex items-center gap-2 cursor-pointer transition-all ${
            isLiveStreamActive
              ? 'bg-rose-600 text-white shadow-lg shadow-rose-950/60 animate-pulse'
              : 'bg-slate-950 border border-rose-800/80 text-rose-400 hover:bg-rose-950/40'
          }`}
        >
          <Radio className="w-4 h-4" />
          {isLiveStreamActive ? 'Hide Live Darshan' : 'Watch Live Darshan Stream (प्रत्यक्ष दर्शन)'}
        </button>
      </div>

      {/* Embedded Live Darshan Stream Player (if toggled) */}
      {isLiveStreamActive && (
        <div className="bg-slate-950 border border-rose-800/60 rounded-3xl overflow-hidden shadow-2xl p-4 space-y-3 animate-in fade-in">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping" />
              <span className="text-xs font-bold text-rose-400 uppercase tracking-wider">
                Live 24x7 Sanctum Stream • Pandharpur Vitthal Mandir
              </span>
            </div>
            <span className="text-[11px] text-slate-400 font-mono">14,280 Devotees Viewing</span>
          </div>

          <div className="aspect-video w-full rounded-2xl overflow-hidden bg-black relative">
            <video
              src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
              controls
              autoPlay
              loop
              muted
              className="w-full h-full object-cover"
            />
            <div className="absolute top-3 left-3 bg-rose-600 text-white font-bold text-[10px] px-2.5 py-0.5 rounded-md uppercase tracking-wider shadow">
              LIVE DARSHAN
            </div>
          </div>
        </div>
      )}

      {/* Main Grid: Left side Media Player + Synchronized Lyrics, Right side Library Browser */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* ========================================================= */}
        {/* MEDIA VIEWER: Player, Synchronized Lyrics & PDF Tools */}
        {/* ========================================================= */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 sm:p-6 shadow-2xl space-y-5">
            {/* Active Track Header */}
            <div className="flex items-start justify-between gap-4">
              <div>
                <span className="text-[10px] uppercase font-bold text-amber-400 bg-amber-950/60 px-2.5 py-0.5 rounded-md border border-amber-800/40">
                  {activeMedia.category.replace('_', ' ')} • {activeMedia.deityName}
                </span>
                <h3 className="text-lg sm:text-xl font-black text-slate-100 mt-2">
                  {activeMedia.titleEn}
                </h3>
                <p className="text-xs text-amber-400 font-semibold">{activeMedia.titleMr}</p>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={handleShare}
                  className="p-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-400 hover:text-white cursor-pointer"
                  title="Share"
                >
                  {copiedLink ? (
                    <Check className="w-4 h-4 text-emerald-400" />
                  ) : (
                    <Share2 className="w-4 h-4" />
                  )}
                </button>
                <button
                  onClick={handleDownloadPdf}
                  className="p-2 rounded-xl bg-slate-950 border border-slate-800 text-amber-400 hover:bg-amber-500 hover:text-slate-950 transition-colors cursor-pointer"
                  title="Download Script / PDF"
                >
                  <Download className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Audio / Video Track Controller */}
            <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800/80 space-y-3">
              {/* Progress Slider */}
              <div className="space-y-1">
                <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden cursor-pointer">
                  <div
                    className="h-full bg-amber-500 transition-all"
                    style={{ width: `${(currentTime / duration) * 100}%` }}
                  />
                </div>
                <div className="flex items-center justify-between text-[10px] font-mono text-slate-400">
                  <span>{formatTime(currentTime)}</span>
                  <span>{formatTime(duration)}</span>
                </div>
              </div>

              {/* Playback Controls */}
              <div className="flex items-center justify-between">
                <button
                  onClick={() => setIsMuted(!isMuted)}
                  className="p-2 rounded-xl text-slate-400 hover:text-slate-200 cursor-pointer"
                >
                  {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                </button>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setCurrentTime(0)}
                    className="p-2 rounded-xl text-slate-400 hover:text-slate-200 cursor-pointer"
                    title="Restart"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="w-12 h-12 rounded-full bg-amber-500 hover:bg-amber-600 text-slate-950 flex items-center justify-center shadow-lg shadow-amber-950/60 cursor-pointer transition-transform active:scale-95"
                  >
                    {isPlaying ? (
                      <Pause className="w-5 h-5 fill-current" />
                    ) : (
                      <Play className="w-5 h-5 fill-current ml-0.5" />
                    )}
                  </button>
                </div>

                <span className="text-[10px] font-bold text-slate-500 font-mono">
                  {activeMedia.viewsCount.toLocaleString()} plays
                </span>
              </div>

              {/* Continuous Background Playback Trigger Button for Chants */}
              {(activeMedia.category === 'CHANT' || activeMedia.isBackgroundChant || onStartBackgroundChant) && (
                <div className="mt-3 p-3 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <span className="text-[10px] font-black uppercase tracking-wider text-amber-400 flex items-center gap-1">
                      <InfinityIcon className="w-3.5 h-3.5" />
                      {language === 'MR' ? 'अखंड पार्श्वभूमी जप' : 'Continuous Background Chanting'}
                    </span>
                    <p className="text-[11px] text-slate-300 truncate">
                      {language === 'MR'
                        ? 'ॲपमध्ये इतरत्र वावरताना मंत्र सतत चालू ठेवा'
                        : 'Play continuously while browsing blogs, darshans & feed'}
                    </p>
                  </div>

                  <button
                    id="trigger-background-chant-btn"
                    onClick={() => {
                      if (onStartBackgroundChant) {
                        onStartBackgroundChant(activeMedia);
                      }
                    }}
                    className="px-3.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow cursor-pointer flex-shrink-0 transition-transform active:scale-95"
                  >
                    <Headphones className="w-3.5 h-3.5" />
                    {language === 'MR' ? 'पार्श्वभूमीत प्ले करा' : 'Play in Background'}
                  </button>
                </div>
              )}
            </div>

            {/* Synchronized Lyrics / Text Reader */}
            <div className="space-y-3">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                  <Languages className="w-3.5 h-3.5 text-amber-400" />
                  Synchronized Script / बोल
                </span>

                {/* Script Language Switcher */}
                <div className="flex gap-1 bg-slate-950 p-0.5 rounded-xl border border-slate-800 text-[11px]">
                  <button
                    onClick={() => setLyricsLanguage('mr')}
                    className={`px-2.5 py-0.5 rounded-lg font-bold transition-colors cursor-pointer ${
                      lyricsLanguage === 'mr'
                        ? 'bg-amber-500 text-slate-950'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    मराठी
                  </button>
                  <button
                    onClick={() => setLyricsLanguage('hi')}
                    className={`px-2.5 py-0.5 rounded-lg font-bold transition-colors cursor-pointer ${
                      lyricsLanguage === 'hi'
                        ? 'bg-amber-500 text-slate-950'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    हिन्दी
                  </button>
                  <button
                    onClick={() => setLyricsLanguage('en')}
                    className={`px-2.5 py-0.5 rounded-lg font-bold transition-colors cursor-pointer ${
                      lyricsLanguage === 'en'
                        ? 'bg-amber-500 text-slate-950'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    English
                  </button>
                </div>
              </div>

              {/* Lyrics Box */}
              <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800/80 max-h-72 overflow-y-auto font-serif text-sm leading-relaxed text-slate-200 whitespace-pre-line select-text">
                {activeMedia.lyrics[lyricsLanguage]}
              </div>

              {/* PDF Viewer / Download Prompt */}
              {activeMedia.pdfUrl && (
                <div className="p-3 bg-amber-950/30 border border-amber-800/40 rounded-2xl flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <FileText className="w-5 h-5 text-amber-400 flex-shrink-0" />
                    <div>
                      <p className="text-xs font-bold text-slate-200">
                        Sanctum PDF Scripture Available
                      </p>
                      <p className="text-[10px] text-slate-400">
                        {activeMedia.pdfPageCount || 4} Pages with authentic Sanskrit & Devnagari verses
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={handleDownloadPdf}
                    className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs flex items-center gap-1 cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" /> Download
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ========================================================= */}
        {/* CONTENT LIBRARY BROWSER: Songs, Bhajans, Artis & Chaturmas */}
        {/* ========================================================= */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-4">
            <h3 className="font-bold text-base text-slate-100 flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-amber-400" /> Devotional Catalog
            </h3>

            {/* Search within Media */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-500" />
              <input
                type="text"
                placeholder="Search bhajans, stotras, books..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-9 pl-8 pr-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
              />
            </div>

            {/* Category Filter Pills */}
            <div className="flex flex-wrap gap-1.5">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    selectedCategory === cat.id
                      ? 'bg-amber-500 text-slate-950 shadow'
                      : 'bg-slate-950 border border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {cat.label} ({cat.count})
                </button>
              ))}
            </div>

            {/* Media Items Scroll List */}
            <div className="space-y-2 max-h-[480px] overflow-y-auto divide-y divide-slate-800/80 pr-1">
              {filteredItems.map((item) => {
                const isSelected = item.id === activeMedia.id;
                return (
                  <div
                    key={item.id}
                    onClick={() => {
                      setActiveMedia(item);
                      setIsPlaying(true);
                      setCurrentTime(0);
                    }}
                    className={`pt-2.5 pb-2.5 px-3 rounded-2xl cursor-pointer transition-all flex items-center justify-between gap-3 ${
                      isSelected
                        ? 'bg-amber-950/40 border border-amber-500/50'
                        : 'hover:bg-slate-800/50'
                    }`}
                  >
                    <div className="space-y-0.5">
                      <span className="text-[9px] uppercase font-bold text-amber-400">
                        {item.category} • {item.deityName}
                      </span>
                      <h4 className="font-bold text-xs text-slate-100 line-clamp-1">
                        {item.titleEn}
                      </h4>
                      <p className="text-[10px] text-slate-400">{item.titleMr}</p>
                    </div>

                    <div className="text-right flex-shrink-0 flex items-center gap-1.5">
                      <div>
                        <span className="text-[10px] text-slate-400 font-mono block">
                          {item.duration || 'Script'}
                        </span>
                        {item.category === 'CHANT' && (
                          <span className="text-[9px] text-amber-400 font-bold block">
                            ♾️ Background
                          </span>
                        )}
                      </div>

                      {item.category === 'CHANT' && onStartBackgroundChant && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onStartBackgroundChant(item);
                          }}
                          className="p-1.5 rounded-lg bg-amber-500/20 text-amber-400 hover:bg-amber-500 hover:text-slate-950 transition-colors"
                          title="Play Continuously in Background"
                        >
                          <Headphones className="w-3.5 h-3.5" />
                        </button>
                      )}

                      <button className="p-1.5 rounded-lg bg-slate-950 text-amber-400 hover:bg-amber-500 hover:text-slate-950 transition-colors">
                        <Play className="w-3.5 h-3.5 fill-current" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
