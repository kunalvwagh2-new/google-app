import React, { useState } from 'react';
import {
  Heart,
  MessageCircle,
  Share2,
  Volume2,
  VolumeX,
  Play,
  Pause,
  Sparkles,
  Landmark,
  Flame,
} from 'lucide-react';
import { mockShorts } from '../../data/anantData.ts';
import { SpiritualShort, SupportedLanguage } from '../../types/anant.ts';

interface ShortsReelsViewProps {
  language: SupportedLanguage;
}

export function ShortsReelsView({ language }: ShortsReelsViewProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [likesState, setLikesState] = useState<Record<string, boolean>>({});
  const [likesCountState, setLikesCountState] = useState<Record<string, number>>(
    mockShorts.reduce((acc, s) => ({ ...acc, [s.id]: s.likesCount }), {})
  );
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [activeCommentsShort, setActiveCommentsShort] = useState<SpiritualShort | null>(null);
  const [commentsInput, setCommentsInput] = useState('');
  const [commentsMap, setCommentsMap] = useState<Record<string, string[]>>({
    short_1: [
      'गणपती बाप्पा मोरया! मंगलमूर्ती मोरया! 🙏🌸',
      'Jai Shri Ganesh! Blessed to see morning abhishek.',
    ],
    short_2: ['Har Har Mahadev! 🔱 Beautiful chanting.', 'Om Namah Shivaya!'],
    short_3: ['जय हरी विठ्ठल! माऊली कृपा करो! ✨', 'Radhe Radhe! Such blissful abhang.'],
  });

  const currentShort = mockShorts[currentIndex];

  const handleToggleLike = (id: string) => {
    const isLiked = !!likesState[id];
    setLikesState({ ...likesState, [id]: !isLiked });
    setLikesCountState({
      ...likesCountState,
      [id]: isLiked ? likesCountState[id] - 1 : likesCountState[id] + 1,
    });
  };

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentsInput.trim() || !activeCommentsShort) return;
    const sId = activeCommentsShort.id;
    setCommentsMap({
      ...commentsMap,
      [sId]: [commentsInput.trim(), ...(commentsMap[sId] || [])],
    });
    setCommentsInput('');
  };

  return (
    <div className="max-w-md mx-auto space-y-4 select-none">
      {/* Short Switcher Pills */}
      <div className="flex items-center justify-between px-2 text-xs">
        <span className="font-bold text-amber-400 flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5" /> Divine Shorts & Reels (दर्शन रील्स)
        </span>
        <div className="flex gap-1.5">
          {mockShorts.map((s, idx) => (
            <button
              key={s.id}
              onClick={() => setCurrentIndex(idx)}
              className={`w-2 h-2 rounded-full transition-all cursor-pointer ${
                currentIndex === idx ? 'w-6 bg-amber-500' : 'bg-slate-700'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Vertical Reel Card */}
      <div className="relative aspect-[9/16] w-full rounded-3xl overflow-hidden bg-black border border-slate-800 shadow-2xl flex items-center justify-center">
        {/* Video Player */}
        <video
          key={currentShort.id}
          src={currentShort.videoUrl}
          autoPlay={isPlaying}
          loop
          muted={isMuted}
          playsInline
          className="w-full h-full object-cover"
        />

        {/* Top Floating Controls */}
        <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-20">
          <span className="text-[10px] font-bold uppercase tracking-wider text-amber-300 bg-black/60 px-2.5 py-1 rounded-full border border-amber-500/30 backdrop-blur-md">
            {currentShort.deityTag}
          </span>
          <button
            onClick={() => setIsMuted(!isMuted)}
            className="p-2 rounded-full bg-black/60 text-white backdrop-blur-md cursor-pointer hover:bg-black/80"
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>
        </div>

        {/* Center Tap to Play / Pause Overlay */}
        <div
          onClick={() => setIsPlaying(!isPlaying)}
          className="absolute inset-0 flex items-center justify-center cursor-pointer z-10"
        >
          {!isPlaying && (
            <div className="p-4 rounded-full bg-black/70 text-amber-400 border border-amber-500/40 backdrop-blur-md">
              <Play className="w-8 h-8 fill-current ml-0.5" />
            </div>
          )}
        </div>

        {/* Right Floating Actions (Likes, Comments, Shares) */}
        <div className="absolute right-3 bottom-20 flex flex-col items-center gap-4 z-20">
          <button
            onClick={() => handleToggleLike(currentShort.id)}
            className="flex flex-col items-center gap-1 text-white cursor-pointer group"
          >
            <div
              className={`p-3 rounded-full backdrop-blur-md transition-all ${
                likesState[currentShort.id]
                  ? 'bg-rose-600 text-white'
                  : 'bg-black/60 text-slate-200 group-hover:text-rose-400'
              }`}
            >
              <Heart
                className={`w-5 h-5 ${
                  likesState[currentShort.id] ? 'fill-current scale-110' : ''
                }`}
              />
            </div>
            <span className="text-[10px] font-mono font-bold drop-shadow">
              {likesCountState[currentShort.id]}
            </span>
          </button>

          <button
            onClick={() => setActiveCommentsShort(currentShort)}
            className="flex flex-col items-center gap-1 text-white cursor-pointer group"
          >
            <div className="p-3 rounded-full bg-black/60 backdrop-blur-md text-slate-200 group-hover:text-amber-400">
              <MessageCircle className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-mono font-bold drop-shadow">
              {(commentsMap[currentShort.id] || []).length}
            </span>
          </button>

          <button
            onClick={() => alert('Divine Reel link copied to clipboard!')}
            className="flex flex-col items-center gap-1 text-white cursor-pointer group"
          >
            <div className="p-3 rounded-full bg-black/60 backdrop-blur-md text-slate-200 group-hover:text-sky-400">
              <Share2 className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-mono font-bold drop-shadow">
              {currentShort.sharesCount}
            </span>
          </button>
        </div>

        {/* Bottom Author & Caption Card */}
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black via-black/80 to-transparent z-20 space-y-2 text-left">
          <div className="flex items-center gap-2">
            <img
              src={currentShort.authorAvatar}
              alt={currentShort.authorName}
              className="w-8 h-8 rounded-full object-cover border border-amber-500/50"
            />
            <div>
              <p className="font-bold text-xs text-white drop-shadow">
                {currentShort.authorName}
              </p>
              {currentShort.templeName && (
                <p className="text-[10px] text-amber-300 drop-shadow flex items-center gap-1">
                  <Landmark className="w-3 h-3" /> {currentShort.templeName}
                </p>
              )}
            </div>
          </div>

          <p className="text-xs text-slate-200 line-clamp-2 leading-snug drop-shadow">
            {currentShort.caption}
          </p>
        </div>
      </div>

      {/* Prev / Next Reel Navigation Controls */}
      <div className="flex items-center justify-between px-2 pt-1">
        <button
          onClick={() => setCurrentIndex((idx) => (idx > 0 ? idx - 1 : mockShorts.length - 1))}
          className="px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white text-xs font-bold cursor-pointer"
        >
          ← Previous Darshan
        </button>
        <button
          onClick={() => setCurrentIndex((idx) => (idx < mockShorts.length - 1 ? idx + 1 : 0))}
          className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-bold cursor-pointer shadow"
        >
          Next Darshan →
        </button>
      </div>

      {/* Comments Drawer / Modal */}
      {activeCommentsShort && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-t-3xl sm:rounded-3xl p-5 shadow-2xl space-y-4 text-slate-100 max-h-[80vh] flex flex-col">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <h3 className="font-bold text-sm text-slate-100">
                Devotee Prayers & Comments (प्रतिक्रिया)
              </h3>
              <button
                onClick={() => setActiveCommentsShort(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="flex-1 overflow-y-auto divide-y divide-slate-800/80 space-y-2 pr-1">
              {(commentsMap[activeCommentsShort.id] || []).map((c, i) => (
                <div key={i} className="pt-2 text-xs text-slate-200">
                  <p>{c}</p>
                </div>
              ))}
            </div>

            <form onSubmit={handleAddComment} className="flex gap-2 pt-2 border-t border-slate-800">
              <input
                type="text"
                required
                placeholder="Write a sacred prayer or greeting..."
                value={commentsInput}
                onChange={(e) => setCommentsInput(e.target.value)}
                className="flex-1 h-9 px-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
              />
              <button
                type="submit"
                className="px-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs cursor-pointer"
              >
                Post
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
