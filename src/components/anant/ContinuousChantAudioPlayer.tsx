import React, { useState, useEffect, useRef } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  Sparkles,
  Infinity as InfinityIcon,
  X,
  ChevronUp,
  ChevronDown,
  Headphones,
  Music,
  Flame,
} from 'lucide-react';
import { MediaItem, SupportedLanguage } from '../../types/anant.ts';

export interface ContinuousChantAudioPlayerProps {
  activeChant: MediaItem | null;
  isPlaying: boolean;
  onTogglePlay: () => void;
  onStop: () => void;
  language: SupportedLanguage;
}

export function ContinuousChantAudioPlayer({
  activeChant,
  isPlaying,
  onTogglePlay,
  onStop,
  language,
}: ContinuousChantAudioPlayerProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1);
  const [loopCount, setLoopCount] = useState<number>(0);
  const [loopMode, setLoopMode] = useState<'INFINITE' | '108' | '21' | '11'>('INFINITE');
  const [droneEnabled, setDroneEnabled] = useState(true);

  // Web Audio Context reference for the Tanpura drone & chant pulse synthesizer
  const audioCtxRef = useRef<AudioContext | null>(null);
  const droneOsc1Ref = useRef<OscillatorNode | null>(null);
  const droneOsc2Ref = useRef<OscillatorNode | null>(null);
  const droneGainRef = useRef<GainNode | null>(null);
  const intervalTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize or resume AudioContext
  const getAudioContext = () => {
    if (typeof window === 'undefined') return null;
    if (!audioCtxRef.current) {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        audioCtxRef.current = new AudioCtx();
      }
    }
    if (audioCtxRef.current && audioCtxRef.current.state === 'suspended') {
      audioCtxRef.current.resume().catch(() => {});
    }
    return audioCtxRef.current;
  };

  // Play periodic soft bell / singing bowl resonance to mark repetition rhythm
  const playChantChime = (freq: number = 432) => {
    if (isMuted) return;
    const ctx = getAudioContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now);
      osc.frequency.exponentialRampToValueAtTime(freq * 1.5, now + 0.1);
      osc.frequency.exponentialRampToValueAtTime(freq, now + 1.2);

      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 2.5);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 2.6);
    } catch {
      // Audio fallback safe
    }
  };

  // Start / Stop Tanpura acoustic drone
  useEffect(() => {
    if (!activeChant || !isPlaying) {
      // Stop drone
      if (droneGainRef.current && audioCtxRef.current) {
        try {
          droneGainRef.current.gain.linearRampToValueAtTime(0.0001, audioCtxRef.current.currentTime + 0.5);
        } catch {}
      }
      if (intervalTimerRef.current) {
        clearInterval(intervalTimerRef.current);
        intervalTimerRef.current = null;
      }
      return;
    }

    const ctx = getAudioContext();
    if (!ctx) return;

    const baseFreq = activeChant.audioFrequency || 432;

    if (droneEnabled && !isMuted) {
      try {
        const now = ctx.currentTime;
        if (!droneGainRef.current) {
          droneGainRef.current = ctx.createGain();
          droneGainRef.current.connect(ctx.destination);
        }
        droneGainRef.current.gain.setValueAtTime(0.05, now);

        if (!droneOsc1Ref.current) {
          const osc1 = ctx.createOscillator();
          osc1.type = 'sine';
          osc1.frequency.setValueAtTime(baseFreq / 2, now); // Sub-harmonic 216Hz
          osc1.connect(droneGainRef.current);
          osc1.start();
          droneOsc1Ref.current = osc1;
        }

        if (!droneOsc2Ref.current) {
          const osc2 = ctx.createOscillator();
          osc2.type = 'triangle';
          osc2.frequency.setValueAtTime(baseFreq * 1.5, now); // Fifth harmonic
          osc2.connect(droneGainRef.current);
          osc2.start();
          droneOsc2Ref.current = osc2;
        }
      } catch {
        // Fallback
      }
    }

    // Interval to count chant loops and trigger rhythmic chimes
    const chantIntervalMs = Math.max(3000, 6000 / playbackSpeed);
    playChantChime(baseFreq);

    intervalTimerRef.current = setInterval(() => {
      setLoopCount((prev) => {
        const next = prev + 1;
        playChantChime(baseFreq);

        if (loopMode === '11' && next >= 11) {
          onTogglePlay();
          return next;
        }
        if (loopMode === '21' && next >= 21) {
          onTogglePlay();
          return next;
        }
        if (loopMode === '108' && next >= 108) {
          onTogglePlay();
          return next;
        }
        return next;
      });
    }, chantIntervalMs);

    return () => {
      if (intervalTimerRef.current) {
        clearInterval(intervalTimerRef.current);
        intervalTimerRef.current = null;
      }
    };
  }, [activeChant, isPlaying, isMuted, playbackSpeed, droneEnabled, loopMode]);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      try {
        if (droneOsc1Ref.current) droneOsc1Ref.current.stop();
        if (droneOsc2Ref.current) droneOsc2Ref.current.stop();
        if (audioCtxRef.current) audioCtxRef.current.close().catch(() => {});
      } catch {}
    };
  }, []);

  if (!activeChant) return null;

  return (
    <aside
      id="global-continuous-chant-player"
      aria-label="Continuous Background Chanting Player"
      className="fixed bottom-14 md:bottom-3 left-2 right-2 md:left-6 md:right-6 lg:left-72 lg:right-10 z-40 transition-all duration-300 pointer-events-auto"
    >
      <div className="bg-slate-950/95 border-2 border-amber-500/60 rounded-3xl shadow-2xl backdrop-blur-xl p-3 sm:p-4 text-slate-100 ring-1 ring-amber-500/30">
        {/* Compact Bar Mode */}
        <div className="flex items-center justify-between gap-3">
          {/* Left: Deity & Mantra Badge */}
          <div className="flex items-center gap-3 min-w-0 flex-1">
            <div className="relative flex-shrink-0">
              <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-gradient-to-tr from-amber-600 via-orange-500 to-amber-300 flex items-center justify-center text-slate-950 font-black shadow-lg">
                <span className={`text-base ${isPlaying ? 'animate-pulse' : ''}`}>ॐ</span>
              </div>
              {isPlaying && (
                <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-emerald-500 rounded-full border-2 border-slate-950 flex items-center justify-center">
                  <span className="w-1.5 h-1.5 bg-white rounded-full animate-ping" />
                </span>
              )}
            </div>

            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 bg-amber-950/60 px-2 py-0.5 rounded-md border border-amber-700/50 flex items-center gap-1">
                  <InfinityIcon className="w-3 h-3 text-amber-400 animate-spin-slow" />
                  Continuous Background Chant
                </span>
                <span className="text-[10px] font-mono text-slate-400 hidden sm:inline">
                  {activeChant.audioFrequency || 432} Hz Dhyan
                </span>
              </div>
              <h4 className="font-bold text-xs sm:text-sm text-slate-100 truncate">
                {language === 'MR'
                  ? activeChant.titleMr
                  : language === 'HI'
                  ? activeChant.titleHi
                  : activeChant.titleEn}
              </h4>
              <p className="text-[11px] text-amber-300/90 font-serif truncate">
                {activeChant.chantLoopText || activeChant.lyrics.mr.slice(0, 45) + '...'}
              </p>
            </div>
          </div>

          {/* Center: Playback Controls */}
          <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
            {/* Repetition Counter Badge */}
            <div className="hidden sm:flex flex-col items-center justify-center px-3 py-1 rounded-xl bg-slate-900 border border-slate-800 text-center">
              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Repeated</span>
              <span className="text-xs font-mono font-black text-amber-400">
                {loopCount} {loopMode === 'INFINITE' ? 'times (अखंड)' : `/ ${loopMode}`}
              </span>
            </div>

            {/* Loop Mode Selector */}
            <div className="hidden md:flex bg-slate-900 border border-slate-800 rounded-xl p-0.5 text-[10px] font-bold">
              {(['INFINITE', '108', '21'] as const).map((mode) => (
                <button
                  key={mode}
                  onClick={() => setLoopMode(mode)}
                  className={`px-2 py-1 rounded-lg transition-colors cursor-pointer ${
                    loopMode === mode
                      ? 'bg-amber-500 text-slate-950 shadow'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {mode === 'INFINITE' ? '♾️ Loop' : `${mode}x`}
                </button>
              ))}
            </div>

            {/* Main Play / Pause Button */}
            <button
              id="chant-player-toggle-btn"
              onClick={onTogglePlay}
              className={`w-10 h-10 sm:w-11 sm:h-11 rounded-full flex items-center justify-center transition-all cursor-pointer shadow-lg active:scale-95 ${
                isPlaying
                  ? 'bg-amber-500 hover:bg-amber-600 text-slate-950 shadow-amber-950/60'
                  : 'bg-slate-800 hover:bg-slate-700 text-amber-400 border border-amber-500/40'
              }`}
              title={isPlaying ? 'Pause Background Chant' : 'Play Background Chant'}
            >
              {isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current ml-0.5" />}
            </button>

            {/* Reset Counter Button */}
            <button
              onClick={() => setLoopCount(0)}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-200 hover:bg-slate-900 transition-colors cursor-pointer"
              title="Reset Count to 0"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            {/* Expand / Details Toggle */}
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-2 rounded-xl text-slate-400 hover:text-amber-400 hover:bg-slate-900 transition-colors cursor-pointer"
              title={isExpanded ? 'Collapse' : 'Show Full Stotra & Settings'}
            >
              {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
            </button>

            {/* Stop & Dismiss Player */}
            <button
              onClick={onStop}
              className="p-2 rounded-xl text-rose-400 hover:bg-rose-950/40 transition-colors cursor-pointer"
              title="Stop & Close Background Chant"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Expanded Drawer Details (Stotra text, speed, drone toggle) */}
        {isExpanded && (
          <div className="mt-4 pt-4 border-t border-slate-800/80 space-y-3 animate-in fade-in">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
              {/* Full Shloka / Stotra Display */}
              <div className="md:col-span-8 p-3.5 bg-slate-900/90 rounded-2xl border border-slate-800 font-serif text-xs leading-relaxed text-amber-200 select-text">
                <p className="font-bold text-slate-400 text-[10px] uppercase font-sans mb-1 flex items-center gap-1.5">
                  <Sparkles className="w-3 h-3 text-amber-400" /> Complete Sacred Text / संपूर्ण श्लोक
                </p>
                <div className="whitespace-pre-line">
                  {language === 'HI' ? activeChant.lyrics.hi : activeChant.lyrics.mr}
                </div>
                {activeChant.meaning && (
                  <p className="mt-2 text-[11px] text-slate-400 font-sans italic border-t border-slate-800/80 pt-1.5">
                    <strong>Meaning:</strong> {activeChant.meaning}
                  </p>
                )}
              </div>

              {/* Chanting Sadhana Settings */}
              <div className="md:col-span-4 p-3 bg-slate-900/90 rounded-2xl border border-slate-800 space-y-3 text-xs">
                <div>
                  <label className="text-[10px] font-bold text-slate-400 block mb-1">
                    Chanting Speed / जप गती
                  </label>
                  <div className="grid grid-cols-3 gap-1">
                    {[0.75, 1, 1.25].map((speed) => (
                      <button
                        key={speed}
                        onClick={() => setPlaybackSpeed(speed)}
                        className={`py-1 rounded-lg font-mono text-[11px] font-bold cursor-pointer transition-colors ${
                          playbackSpeed === speed
                            ? 'bg-amber-500 text-slate-950'
                            : 'bg-slate-950 border border-slate-800 text-slate-400'
                        }`}
                      >
                        {speed}x
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-[11px] text-slate-300">432Hz Tanpura Drone</span>
                  <button
                    onClick={() => setDroneEnabled(!droneEnabled)}
                    className={`px-2.5 py-1 rounded-lg text-[10px] font-bold cursor-pointer transition-colors ${
                      droneEnabled
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                        : 'bg-slate-950 border border-slate-800 text-slate-500'
                    }`}
                  >
                    {droneEnabled ? 'Enabled (चालू)' : 'Muted'}
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-[11px] text-slate-300">Audio Sound</span>
                  <button
                    onClick={() => setIsMuted(!isMuted)}
                    className="p-1.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-300 hover:text-white cursor-pointer"
                  >
                    {isMuted ? <VolumeX className="w-3.5 h-3.5 text-rose-400" /> : <Volume2 className="w-3.5 h-3.5 text-amber-400" />}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}
