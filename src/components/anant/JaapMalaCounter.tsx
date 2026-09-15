'use client';

import React, { useState, useRef } from 'react';
import { Sparkles, RotateCcw, Volume2, VolumeX, Share2, Flame } from 'lucide-react';
import { JaapMalaCircle } from './JaapMalaCircle.tsx';

interface JaapMalaCounterProps {
  initialMantra?: string;
  deityName?: string;
  onCompleteMala?: (completedMalas: number) => void;
  onShare?: () => void;
}

export function JaapMalaCounter({
  initialMantra = 'Om Namah Shivaya (ॐ नमः शिवाय)',
  deityName = 'Lord Shiva',
  onCompleteMala,
  onShare,
}: JaapMalaCounterProps) {
  const [currentBead, setCurrentBead] = useState(0);
  const [completedMalas, setCompletedMalas] = useState(0);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const bellAudioRef = useRef<HTMLAudioElement | null>(null);

  const handleIncrement = () => {
    const nextBead = currentBead + 1;

    // Haptic feedback on tap
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate(25);
    }

    if (nextBead >= 108) {
      // 108 Completed: Play Temple Bell Sound, reset bead count to 0, increment completed Malas
      if (soundEnabled && bellAudioRef.current) {
        bellAudioRef.current.currentTime = 0;
        bellAudioRef.current.play().catch(() => {});
      }

      // Grand haptic vibration
      if (typeof navigator !== 'undefined' && navigator.vibrate) {
        navigator.vibrate([100, 50, 100, 50, 400]);
      }

      const newCompleted = completedMalas + 1;
      setCompletedMalas(newCompleted);
      setCurrentBead(0);
      if (onCompleteMala) onCompleteMala(newCompleted);
    } else {
      // Regular Increment: Silent (No audio on single taps)
      setCurrentBead(nextBead);
    }
  };

  const handleReset = () => {
    if (confirm('Reset active bead count back to 0?')) {
      setCurrentBead(0);
    }
  };

  // Calculate rotation angle for ornamental bead marker (360 degrees / 108 beads)
  const angleDegrees = (currentBead / 108) * 360;
  const radius = 80;
  // Convert angle to cartesian coordinates for the marker
  const angleRad = ((angleDegrees - 90) * Math.PI) / 180;
  const markerX = 100 + radius * Math.cos(angleRad);
  const markerY = 100 + radius * Math.sin(angleRad);

  return (
    <div className="flex flex-col items-center justify-center p-6 bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl max-w-md mx-auto space-y-6">
      {/* Hidden Audio Element for Temple Bell */}
      <audio
        ref={bellAudioRef}
        src="https://actions.google.com/sounds/v1/alarms/bell_transition.ogg"
        preload="auto"
      />

      {/* Header Info */}
      <div className="text-center space-y-1">
        <span className="text-[10px] font-bold uppercase tracking-wider bg-amber-500/20 text-amber-400 border border-amber-500/30 px-3 py-1 rounded-full">
          {deityName} • 108 Jaap Rosary
        </span>
        <h3 className="text-base font-bold text-slate-100">{initialMantra}</h3>
      </div>

      {/* Circular Progress Container with Ornamental Marker */}
      <div className="relative flex items-center justify-center w-64 h-64">
        <JaapMalaCircle count={currentBead} />

        {/* Ornamental Bead Marker rotating in 1-to-1 sync */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 200 200">
          <circle
            cx={markerX}
            cy={markerY}
            r="6"
            className="fill-amber-400 stroke-slate-950 stroke-2 shadow-lg transition-all duration-150 ease-out"
          />
        </svg>
      </div>

      {/* Outer/Header Goal Tracker: Completed Malas vs Target */}
      <div className="grid grid-cols-2 gap-4 w-full bg-slate-950 border border-slate-800 rounded-2xl p-3 text-center text-xs font-mono">
        <div>
          <span className="text-[10px] text-slate-400 block">Completed Malas</span>
          <span className="text-base font-black text-amber-400">{completedMalas} Malas</span>
        </div>
        <div>
          <span className="text-[10px] text-slate-400 block">Sankalp Target</span>
          <span className="text-base font-black text-slate-100">11 Malas</span>
        </div>
      </div>

      {/* Primary Tap Action Button */}
      <button
        onClick={handleIncrement}
        className="w-full py-4 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-600 hover:to-orange-600 text-slate-950 font-black text-base shadow-xl shadow-amber-950/50 flex items-center justify-center gap-2 cursor-pointer transition-transform active:scale-95"
      >
        <Sparkles className="w-5 h-5" />
        <span>Tap Bead (मंत्र जप)</span>
      </button>

      {/* Utility Controls */}
      <div className="flex items-center justify-between w-full pt-2 border-t border-slate-800">
        <button
          onClick={() => setSoundEnabled(!soundEnabled)}
          className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-200 cursor-pointer"
        >
          {soundEnabled ? <Volume2 className="w-4 h-4 text-amber-400" /> : <VolumeX className="w-4 h-4" />}
          <span>{soundEnabled ? 'Bell at 108 ON' : 'Muted'}</span>
        </button>

        <button
          onClick={handleReset}
          className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-200 cursor-pointer"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Reset Mala</span>
        </button>

        {onShare && (
          <button
            onClick={onShare}
            className="flex items-center gap-1.5 text-xs text-amber-400 hover:text-amber-300 cursor-pointer font-bold"
          >
            <Share2 className="w-4 h-4" />
            <span>Share</span>
          </button>
        )}
      </div>
    </div>
  );
}
