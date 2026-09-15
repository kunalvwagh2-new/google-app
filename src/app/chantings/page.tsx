import React from 'react';
import { Sparkles, Music, Play, Radio, Volume2, ArrowLeft } from 'lucide-react';
import { mockChantTracks } from '../../data/anantData.ts';

export default function ChantingsPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <a
          href="/"
          className="inline-flex items-center gap-2 text-sm text-amber-400 hover:text-amber-300 mb-8 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Anant Sanctum
        </a>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-2xl mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-3 bg-amber-500/10 text-amber-400 rounded-xl border border-amber-500/20">
              <Music className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">Sacred Chants, Stotras & Mantras</h1>
              <p className="text-slate-400 text-sm">Continuous background playback mode for undisturbed meditation</p>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          {mockChantTracks.map((track) => (
            <div
              key={track.id}
              className="bg-slate-900 border border-slate-800 rounded-xl p-5 flex items-center justify-between hover:border-amber-500/40 transition group"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-amber-600/20 text-amber-400 flex items-center justify-center font-bold text-lg group-hover:scale-105 transition">
                  <Play className="w-5 h-5 fill-current" />
                </div>
                <div>
                  <h3 className="font-semibold text-white text-base">{track.titleEn}</h3>
                  <p className="text-xs text-slate-400">
                    {track.category} • {Math.floor(track.durationSec / 60)}:{(track.durationSec % 60).toString().padStart(2, '0')} min
                  </p>
                </div>
              </div>
              <button className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-slate-950 font-semibold rounded-xl text-xs transition flex items-center gap-1.5">
                <Volume2 className="w-4 h-4" />
                Play Chant
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
