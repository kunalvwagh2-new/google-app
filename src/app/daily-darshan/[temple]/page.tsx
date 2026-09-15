import React from 'react';
import { Sparkles, Calendar, MapPin, ArrowLeft, Heart, Share2, Video, Camera } from 'lucide-react';
import { mockTemples } from '../../../data/anantData.ts';

interface PageProps {
  params: Promise<{ temple: string }>;
}

export default async function TempleDailyDarshanPage({ params }: PageProps) {
  const resolvedParams = await params;
  const { temple } = resolvedParams;

  const decodedTemple = decodeURIComponent(temple);
  const matchedTemple = mockTemples.find(
    (t) => t.id === decodedTemple || t.name.toLowerCase().replace(/[^a-z0-9]+/g, '-') === decodedTemple
  ) || mockTemples[0];

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

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-2xl">
          <div className="flex items-center justify-between mb-6">
            <div>
              <span className="px-3 py-1 bg-amber-500/10 text-amber-400 border border-amber-500/20 rounded-full text-xs font-semibold">
                Live Sanctuary Darshan
              </span>
              <h1 className="text-3xl font-bold text-white mt-2">{matchedTemple.name}</h1>
              <p className="text-sm text-slate-400 flex items-center gap-1 mt-1">
                <MapPin className="w-3.5 h-3.5 text-amber-500" />
                {matchedTemple.city}, {matchedTemple.state}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button className="flex items-center gap-1.5 px-4 py-2 bg-amber-600 hover:bg-amber-500 text-slate-950 font-semibold rounded-xl transition text-sm">
                <Heart className="w-4 h-4" />
                Follow Temple
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="rounded-xl overflow-hidden border border-slate-800 relative group">
              <img
                src={matchedTemple.coverImageUrl || 'https://images.unsplash.com/photo-1609137144850-429402d7e9c9?w=800'}
                alt={matchedTemple.name}
                className="w-full h-72 object-cover group-hover:scale-105 transition duration-500"
              />
              <div className="absolute bottom-3 left-3 bg-slate-950/80 backdrop-blur-md px-3 py-1.5 rounded-lg text-xs font-medium text-amber-300 flex items-center gap-1.5">
                <Camera className="w-3.5 h-3.5" />
                Morning Alankar & Shringar (Today)
              </div>
            </div>
            <div className="rounded-xl overflow-hidden border border-slate-800 relative group">
              <div className="w-full h-72 bg-slate-950 flex flex-col items-center justify-center p-6 text-center relative">
                <div className="w-16 h-16 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center mb-4 border border-amber-500/30">
                  <Video className="w-8 h-8" />
                </div>
                <h3 className="font-semibold text-white text-lg">Live Mangala Aarti Video</h3>
                <p className="text-xs text-slate-400 mt-1">Streamed live directly from the temple sanctum</p>
                <button className="mt-4 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-amber-300 rounded-xl text-xs font-semibold transition">
                  Watch Live Stream
                </button>
              </div>
            </div>
          </div>

          <div className="border-t border-slate-800 pt-6">
            <h3 className="text-lg font-semibold text-white mb-3">Today's Sacred Blessings & Trust Updates</h3>
            <p className="text-slate-300 text-sm leading-relaxed">
              Special morning darshan alankar adorned with fresh jasmine garlands and sacred sandalwood paste. Timings: {matchedTemple.darshanTimings}. Devotees are invited to offer online e-pooja and digital hundi offerings.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
