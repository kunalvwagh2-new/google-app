import React, { useState } from 'react';
import {
  Sparkles,
  Landmark,
  Calendar,
  BookOpen,
  ChevronRight,
  Radio,
  MapPin,
  Flame,
  Volume2,
  Clock,
  CheckCircle2,
  ExternalLink,
} from 'lucide-react';
import { Deity, Temple, TempleEvent, MediaItem, SupportedLanguage } from '../../types/anant.ts';
import {
  mockDeities,
  mockTemples,
  mockTempleEvents,
  mockMediaLibrary,
} from '../../data/anantData.ts';

interface DeityDirectoryViewProps {
  initialDeity?: Deity;
  language: SupportedLanguage;
  onSelectTemple?: (temple: Temple) => void;
  onSelectMedia?: (media: MediaItem) => void;
  onOpenRosaryForDeity?: (deity: Deity) => void;
  onSelectDeity?: (deity: Deity) => void;
}

export function DeityDirectoryView({
  initialDeity,
  language,
  onSelectTemple = () => {},
  onSelectMedia = () => {},
  onOpenRosaryForDeity,
  onSelectDeity,
}: DeityDirectoryViewProps) {
  const handleRosary = onOpenRosaryForDeity || onSelectDeity || (() => {});
  const [selectedDeity, setSelectedDeity] = useState<Deity>(initialDeity || mockDeities[0]);
  const [activeSubTab, setActiveSubTab] = useState<'TEMPLES' | 'POOJAS' | 'ARTIS' | 'NEAREST'>('TEMPLES');

  // Filtered relations based on selected deity
  const associatedTemples = mockTemples.filter((t) => t.deityId === selectedDeity.id);
  const associatedPoojas = mockTempleEvents.filter((e) => e.deityId === selectedDeity.id);
  const associatedMedia = mockMediaLibrary.filter((m) => m.deityId === selectedDeity.id);

  // Sorted nearest temples
  const nearestTemples = [...associatedTemples].sort(
    (a, b) => (a.distanceKm || 999) - (b.distanceKm || 999)
  );

  const deityDisplayName =
    language === 'MR'
      ? selectedDeity.nameMr
      : language === 'HI'
      ? selectedDeity.nameHi
      : selectedDeity.nameEn;

  return (
    <div className="space-y-6">
      {/* 1. Category View: Select God Horizon Pill Carousel */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-4 sm:p-6 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-500" />
              <span className="text-[11px] font-bold uppercase tracking-widest text-amber-400">
                Category View • देव दर्शन निर्देशिका
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-100 tracking-tight">
              Select Sacred Deity / देवता निवडा
            </h2>
          </div>
          <span className="text-xs text-slate-400 font-medium">
            Explore associated sanctums, upcoming poojas & artis
          </span>
        </div>

        {/* Deity Selector Cards Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {mockDeities.map((deity) => {
            const isSelected = selectedDeity.id === deity.id;
            const name =
              language === 'MR'
                ? deity.nameMr
                : language === 'HI'
                ? deity.nameHi
                : deity.nameEn;

            return (
              <div
                key={deity.id}
                onClick={() => setSelectedDeity(deity)}
                className={`group relative p-3 rounded-2xl border transition-all cursor-pointer flex flex-col items-center text-center ${
                  isSelected
                    ? 'bg-gradient-to-b from-amber-950/70 to-slate-950 border-amber-500 shadow-lg shadow-amber-950/40 ring-1 ring-amber-500/50 scale-[1.02]'
                    : 'bg-slate-950/70 border-slate-800 hover:border-slate-700 hover:bg-slate-900/60'
                }`}
              >
                <div className="relative w-14 h-14 rounded-2xl overflow-hidden mb-2 border border-slate-700 group-hover:scale-105 transition-transform">
                  <img
                    src={deity.iconUrl}
                    alt={deity.nameEn}
                    className="w-full h-full object-cover"
                  />
                  {isSelected && (
                    <div className="absolute inset-0 bg-amber-500/20 flex items-center justify-center">
                      <Sparkles className="w-5 h-5 text-amber-300 animate-pulse" />
                    </div>
                  )}
                </div>

                <h3 className="font-bold text-xs text-slate-100 line-clamp-1">{name}</h3>
                <span className="text-[10px] text-amber-400 mt-0.5">
                  {deity.associatedTemplesCount} Temples
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* 2. Deity Hero Banner & Spiritual Dossier */}
      <div className="relative rounded-3xl overflow-hidden border border-slate-800 bg-slate-900 shadow-2xl">
        <div className="h-44 sm:h-52 w-full relative">
          <img
            src={selectedDeity.bannerUrl}
            alt={selectedDeity.nameEn}
            className="w-full h-full object-cover opacity-35"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/70 to-transparent" />
        </div>

        <div className="p-5 sm:p-8 -mt-20 relative space-y-4">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div className="space-y-1">
              <span className="inline-block text-[11px] font-bold uppercase tracking-wider text-amber-400 bg-amber-950/80 px-2.5 py-0.5 rounded-full border border-amber-800/60">
                {selectedDeity.title}
              </span>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-100">{deityDisplayName}</h1>
              <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
                {selectedDeity.description}
              </p>
            </div>

            <button
              onClick={() => handleRosary(selectedDeity)}
              className="px-4 py-2.5 rounded-2xl bg-gradient-to-tr from-amber-600 to-orange-500 hover:from-amber-500 hover:to-orange-400 text-slate-950 font-bold text-xs flex items-center gap-2 shadow-lg shadow-amber-950/60 cursor-pointer self-start md:self-auto transition-transform active:scale-95"
            >
              <Flame className="w-4 h-4 fill-current" />
              Chant {selectedDeity.nameEn.split(' ')[1] || 'Lord'} Mala (108)
            </button>
          </div>

          {/* Popular Mantras Pill Cluster */}
          <div className="pt-2 flex flex-wrap items-center gap-2">
            <span className="text-[11px] font-bold text-slate-400">Popular Mantras:</span>
            {selectedDeity.popularMantras.map((m, idx) => (
              <span
                key={idx}
                className="text-[11px] font-medium bg-slate-950/80 border border-slate-800 text-amber-300 px-3 py-1 rounded-xl"
              >
                ॐ {m}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* 3. Sub-Category Tabs: Temples | Events & Poojas | Sacred Artis & Stotras | Top Nearest */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-4 sm:p-6 shadow-xl space-y-5">
        <div className="flex items-center gap-1.5 p-1 bg-slate-950 border border-slate-800 rounded-2xl self-start overflow-x-auto">
          <button
            onClick={() => setActiveSubTab('TEMPLES')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
              activeSubTab === 'TEMPLES'
                ? 'bg-amber-500 text-slate-950 shadow'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Landmark className="w-3.5 h-3.5" /> Temples ({associatedTemples.length})
          </button>

          <button
            onClick={() => setActiveSubTab('POOJAS')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
              activeSubTab === 'POOJAS'
                ? 'bg-amber-500 text-slate-950 shadow'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" /> Poojas & Events ({associatedPoojas.length})
          </button>

          <button
            onClick={() => setActiveSubTab('ARTIS')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
              activeSubTab === 'ARTIS'
                ? 'bg-amber-500 text-slate-950 shadow'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" /> Artis & Stotras ({associatedMedia.length})
          </button>

          <button
            onClick={() => setActiveSubTab('NEAREST')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
              activeSubTab === 'NEAREST'
                ? 'bg-amber-500 text-slate-950 shadow'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <MapPin className="w-3.5 h-3.5" /> Nearest Temples
          </button>
        </div>

        {/* TAB 1: Associated Temples */}
        {activeSubTab === 'TEMPLES' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {associatedTemples.map((temple) => (
              <div
                key={temple.id}
                className="bg-slate-950 rounded-2xl border border-slate-800/90 overflow-hidden hover:border-slate-700 transition-all flex flex-col justify-between p-4"
              >
                <div className="flex gap-3">
                  <img
                    src={temple.coverImageUrl}
                    alt={temple.name}
                    className="w-20 h-20 rounded-xl object-cover flex-shrink-0"
                  />
                  <div className="space-y-1">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] uppercase font-bold text-amber-400 bg-amber-950/60 px-2 py-0.5 rounded-md border border-amber-800/40">
                        {temple.city}
                      </span>
                      {temple.isVerified && (
                        <span className="text-[10px] text-emerald-400 font-bold flex items-center gap-0.5">
                          <CheckCircle2 className="w-3 h-3" /> Verified
                        </span>
                      )}
                    </div>
                    <h4 className="font-bold text-sm text-slate-100 line-clamp-1">{temple.name}</h4>
                    <p className="text-[11px] text-slate-400 flex items-center gap-1">
                      <Clock className="w-3 h-3 text-slate-500" /> {temple.darshanTimings}
                    </p>
                  </div>
                </div>

                <div className="mt-3 pt-3 border-t border-slate-800 flex items-center justify-between">
                  <span className="text-[11px] text-slate-400">
                    {temple.followersCount.toLocaleString()} Devotees
                  </span>
                  <button
                    onClick={() => onSelectTemple(temple)}
                    className="px-3.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs flex items-center gap-1 cursor-pointer transition-colors"
                  >
                    View Sanctum <ChevronRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* TAB 2: Upcoming Poojas & Rituals */}
        {activeSubTab === 'POOJAS' && (
          <div className="space-y-3">
            {associatedPoojas.length === 0 ? (
              <div className="p-8 text-center bg-slate-950 rounded-2xl text-slate-500">
                No scheduled temple poojas for this deity this week.
              </div>
            ) : (
              associatedPoojas.map((pooja) => (
                <div
                  key={pooja.id}
                  className="p-4 bg-slate-950 rounded-2xl border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div className="space-y-1">
                    <span className="text-[10px] uppercase font-bold text-orange-400 bg-orange-950/60 px-2 py-0.5 rounded-md border border-orange-800/40">
                      {pooja.panchangTithi}
                    </span>
                    <h4 className="font-bold text-sm text-slate-100">{pooja.title}</h4>
                    <p className="text-xs text-slate-400">{pooja.templeName} • {pooja.dateTime}</p>
                  </div>

                  <div className="flex items-center gap-2">
                    {pooja.isLiveDarshanLinked && (
                      <span className="flex items-center gap-1 text-[11px] text-rose-400 bg-rose-950/60 px-2 py-1 rounded-xl border border-rose-900/50">
                        <Radio className="w-3 h-3 animate-pulse" /> Live Stream
                      </span>
                    )}
                    <button className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold cursor-pointer">
                      Book Sankalp
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* TAB 3: Sacred Artis & Stotras */}
        {activeSubTab === 'ARTIS' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {associatedMedia.map((media) => (
              <div
                key={media.id}
                onClick={() => onSelectMedia(media)}
                className="p-4 bg-slate-950 rounded-2xl border border-slate-800 hover:border-amber-500/40 cursor-pointer transition-all flex items-center justify-between"
              >
                <div className="space-y-1">
                  <span className="text-[10px] uppercase font-bold text-sky-400 bg-sky-950/60 px-2 py-0.5 rounded-md border border-sky-800/40">
                    {media.category}
                  </span>
                  <h4 className="font-bold text-xs sm:text-sm text-slate-100">{media.titleEn}</h4>
                  <p className="text-[11px] text-slate-400">{media.titleMr}</p>
                </div>
                <button className="p-2 rounded-xl bg-slate-900 text-amber-400 hover:bg-amber-500 hover:text-slate-950 transition-colors">
                  <Volume2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* TAB 4: Nearest Temples (Geolocation aware) */}
        {activeSubTab === 'NEAREST' && (
          <div className="space-y-3">
            <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800 text-xs text-slate-400 flex items-center justify-between">
              <span>Sorted by proximity to your current location (Pune / Maharashtra)</span>
              <span className="text-amber-400 font-bold">GPS Active</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {nearestTemples.map((temple) => (
                <div
                  key={temple.id}
                  className="p-4 bg-slate-950 rounded-2xl border border-slate-800 flex items-center justify-between gap-3"
                >
                  <div>
                    <h4 className="font-bold text-xs sm:text-sm text-slate-100">{temple.name}</h4>
                    <p className="text-xs text-slate-400 mt-0.5">{temple.address}</p>
                    <span className="inline-block mt-2 text-[11px] font-bold text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded-md border border-emerald-800/40">
                      📍 {temple.distanceKm} km away
                    </span>
                  </div>

                  <button
                    onClick={() => onSelectTemple(temple)}
                    className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs cursor-pointer"
                  >
                    Directions
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
