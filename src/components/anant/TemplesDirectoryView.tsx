import React, { useState } from 'react';
import {
  Landmark,
  CheckCircle2,
  Clock,
  MapPin,
  Radio,
  Search,
  Users,
  ChevronRight,
  ExternalLink,
  MessageSquare,
  Sparkles,
  Heart,
  Plus,
} from 'lucide-react';
import { Temple, SupportedLanguage } from '../../types/anant.ts';
import { mockTemples } from '../../data/anantData.ts';

interface TemplesDirectoryViewProps {
  language: SupportedLanguage;
  onSelectTemple: (temple: Temple) => void;
  onOpenLiveDarshan: (temple: Temple) => void;
}

export function TemplesDirectoryView({
  language,
  onSelectTemple,
  onOpenLiveDarshan,
}: TemplesDirectoryViewProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterMode, setFilterMode] = useState<'ALL' | 'FOLLOWING' | 'LIVE'>('ALL');
  const [followedTemples, setFollowedTemples] = useState<Record<string, boolean>>({
    temple_dagdusheth: true,
    temple_pandharpur: true,
  });
  const [selectedTempleModal, setSelectedTempleModal] = useState<Temple | null>(null);

  const toggleFollow = (id: string) => {
    setFollowedTemples((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const filteredTemples = mockTemples.filter((temple) => {
    const matchesSearch =
      !searchQuery.trim() ||
      temple.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      temple.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
      temple.deityName.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;
    if (filterMode === 'FOLLOWING') return !!followedTemples[temple.id];
    if (filterMode === 'LIVE') return !!temple.liveDarshanStreamUrl;
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Directory Header Banner */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 sm:p-6 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
            <span className="text-[11px] font-bold uppercase tracking-widest text-amber-400">
              Sacred Sanctums & Following
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-100 tracking-tight">
            Temples Directory & Following List
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Verified temple trusts across India with genuine charity registrar credentials.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-950 border border-slate-800 rounded-2xl self-start sm:self-auto">
          <button
            onClick={() => setFilterMode('ALL')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              filterMode === 'ALL'
                ? 'bg-amber-500 text-slate-950 shadow'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            All Temples ({mockTemples.length})
          </button>
          <button
            onClick={() => setFilterMode('FOLLOWING')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              filterMode === 'FOLLOWING'
                ? 'bg-amber-500 text-slate-950 shadow'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Following ({Object.values(followedTemples).filter(Boolean).length})
          </button>
          <button
            onClick={() => setFilterMode('LIVE')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
              filterMode === 'LIVE'
                ? 'bg-rose-600 text-white shadow'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Radio className="w-3.5 h-3.5" /> 24x7 Live
          </button>
        </div>
      </div>

      {/* Search Input */}
      <div className="relative">
        <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-500" />
        <input
          type="text"
          placeholder="Search temple by name, deity, or city (e.g. Dagdusheth, Shiva, Pune, Pandharpur)..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full h-10 pl-10 pr-4 bg-slate-900 border border-slate-800 rounded-2xl text-xs sm:text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500"
        />
      </div>

      {/* Temples Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredTemples.map((temple) => {
          const isFollowing = !!followedTemples[temple.id];

          return (
            <div
              key={temple.id}
              className="bg-slate-900/90 border border-slate-800 rounded-3xl overflow-hidden shadow-xl hover:border-slate-700 transition-all flex flex-col justify-between"
            >
              <div className="relative h-36 w-full overflow-hidden">
                <img
                  src={temple.coverImageUrl}
                  alt={temple.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />

                <div className="absolute top-3 left-3 flex items-center gap-1.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-amber-300 bg-black/60 backdrop-blur-md px-2.5 py-0.5 rounded-full border border-amber-500/30">
                    {temple.deityName}
                  </span>
                  {temple.isVerified && (
                    <span className="text-[10px] text-emerald-400 font-bold bg-black/60 backdrop-blur-md px-2 py-0.5 rounded-full border border-emerald-500/30 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> Verified Trust
                    </span>
                  )}
                </div>

                {temple.liveDarshanStreamUrl && (
                  <button
                    onClick={() => onOpenLiveDarshan(temple)}
                    className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-rose-600/90 text-white font-bold text-[10px] flex items-center gap-1 shadow cursor-pointer hover:bg-rose-500"
                  >
                    <Radio className="w-3 h-3 animate-pulse" /> Live Stream
                  </button>
                )}

                <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between">
                  <div>
                    <h3 className="text-base font-bold text-slate-100 drop-shadow line-clamp-1">
                      {temple.name}
                    </h3>
                    <p className="text-xs text-slate-300 drop-shadow flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3 h-3 text-amber-400" /> {temple.city}, {temple.state} • ~
                      {temple.distanceKm} km
                    </p>
                  </div>
                </div>
              </div>

              {/* Card Footer Details */}
              <div className="p-4 space-y-3">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-slate-500" /> {temple.darshanTimings}
                  </span>
                  <span className="font-mono text-slate-300">
                    {temple.followersCount.toLocaleString()} Devotees
                  </span>
                </div>

                <div className="flex items-center gap-2 pt-1 border-t border-slate-800">
                  <button
                    onClick={() => toggleFollow(temple.id)}
                    className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                      isFollowing
                        ? 'bg-slate-800 text-amber-400 border border-amber-500/30'
                        : 'bg-amber-500 hover:bg-amber-600 text-slate-950 shadow'
                    }`}
                  >
                    {isFollowing ? (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5" /> Following
                      </>
                    ) : (
                      <>
                        <Plus className="w-3.5 h-3.5" /> Follow Temple
                      </>
                    )}
                  </button>

                  <button
                    onClick={() => setSelectedTempleModal(temple)}
                    className="px-4 py-2 rounded-xl bg-slate-950 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white text-xs font-bold cursor-pointer"
                  >
                    Details & Pooja
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Temple Details Modal */}
      {selectedTempleModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-4 text-slate-100">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                Temple Sanctum Dossier
              </span>
              <button
                onClick={() => setSelectedTempleModal(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-white cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3">
              <h3 className="font-bold text-lg text-slate-100">{selectedTempleModal.name}</h3>
              <p className="text-xs text-slate-400">{selectedTempleModal.address}</p>

              <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800 text-xs space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-slate-500">Government Registration:</span>
                  <span className="font-mono text-slate-200">{selectedTempleModal.govRegNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Daily Darshan Timings:</span>
                  <span className="text-slate-200">{selectedTempleModal.darshanTimings}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Devotee Community:</span>
                  <span className="text-amber-400 font-bold">
                    {selectedTempleModal.followersCount.toLocaleString()} Following
                  </span>
                </div>
              </div>

              <div>
                <span className="text-xs font-bold text-slate-300 block mb-2">
                  Available Pooja & Abhishek Services:
                </span>
                <div className="grid grid-cols-2 gap-2">
                  {selectedTempleModal.poojaServices.map((p, i) => (
                    <div
                      key={i}
                      className="p-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-amber-300 flex items-center gap-1.5"
                    >
                      <Sparkles className="w-3 h-3 text-amber-400 flex-shrink-0" />
                      <span>{p}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
                <button
                  onClick={() => {
                    setSelectedTempleModal(null);
                    alert(`Booking request for ${selectedTempleModal.name} initiated!`);
                  }}
                  className="w-full py-2.5 rounded-2xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs cursor-pointer shadow-md"
                >
                  Book Sanctum Pooja / Abhishek
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
