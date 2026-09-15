import React, { useState } from 'react';
import {
  Sparkles,
  BookOpen,
  Search,
  Flame,
  Volume2,
  Share2,
  Check,
  X,
  Compass,
  Layers,
  ChevronRight,
  ShieldCheck,
  Award,
  Info,
  Copy,
  Landmark,
  Radio,
  ExternalLink,
} from 'lucide-react';
import { SupportedLanguage } from '../../types/anant.ts';
import {
  DivineForm,
  DeityFormsCollection,
  ALL_DEITY_FORM_COLLECTIONS,
} from '../../data/divineFormsData.ts';

interface DivineFormsViewProps {
  language: SupportedLanguage;
  onSelectFormForSadhana?: (form: DivineForm) => void;
  onOpenTempleForDeity?: (deityId: string) => void;
}

export function DivineFormsView({
  language,
  onSelectFormForSadhana,
  onOpenTempleForDeity,
}: DivineFormsViewProps) {
  const [selectedGodId, setSelectedGodId] = useState<'ganesha' | 'shiva' | 'vishnu' | 'durga' | 'hanuman'>('ganesha');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<string>('ALL');
  const [selectedFormDetail, setSelectedFormDetail] = useState<DivineForm | null>(null);
  const [copiedMantraId, setCopiedMantraId] = useState<string | null>(null);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  // Active Deity Collection
  const currentCollection =
    ALL_DEITY_FORM_COLLECTIONS.find((c) => c.godId === selectedGodId) ||
    ALL_DEITY_FORM_COLLECTIONS[0];

  // Filtered Forms list
  const filteredForms = currentCollection.forms.filter((form) => {
    // 1. Category Filter
    if (activeCategoryFilter !== 'ALL' && form.category !== activeCategoryFilter) {
      return false;
    }

    // 2. Search Query Filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = form.formNameEn.toLowerCase().includes(q) || form.formNameDevanagari.includes(q);
      const matchSymbolism = form.symbolism.toLowerCase().includes(q);
      const matchDescription = form.description.toLowerCase().includes(q);
      const matchAttr = form.keyAttributes.some((a) => a.toLowerCase().includes(q));
      return matchName || matchSymbolism || matchDescription || matchAttr;
    }

    return true;
  });

  // Handle Copy Mantra
  const handleCopyMantra = (form: DivineForm) => {
    if (form.mantraDevanagari) {
      navigator.clipboard.writeText(`${form.formNameDevanagari}: ${form.mantraDevanagari}`);
      setCopiedMantraId(form.id);
      setTimeout(() => setCopiedMantraId(null), 2000);
    }
  };

  // Play Bell Audio Sound
  const playSacredBellSound = () => {
    try {
      setIsPlayingAudio(true);
      const ctx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(432, ctx.currentTime); // 432Hz sacred harmonic tuning
      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 2.5);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 2.5);

      setTimeout(() => setIsPlayingAudio(false), 2500);
    } catch {
      setIsPlayingAudio(false);
    }
  };

  // WhatsApp Share Helper
  const shareFormToWhatsApp = (form: DivineForm) => {
    const text = encodeURIComponent(
      `🛕 *${form.formNameDevanagari} (${form.formNameEn})* - ${form.category}\n` +
      `✨ *Symbolism:* ${form.symbolism}\n` +
      `🕉️ *Mantra:* ${form.mantraDevanagari || 'Om Namah Shivaya'}\n\n` +
      `Explore sacred deity forms on Anant Spiritual App: https://anantsadhana.org`
    );
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
  };

  return (
    <div className="space-y-6">
      {/* ========================================================= */}
      {/* 1. HERO HEADER: SACRED DEITY FORMS CATALOGUE */}
      {/* ========================================================= */}
      <div className="relative rounded-3xl overflow-hidden border border-amber-500/30 bg-slate-900 shadow-2xl p-6 sm:p-8 space-y-5">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-amber-500/15 via-slate-950/80 to-slate-950 pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="p-1.5 bg-amber-500/20 text-amber-400 rounded-xl border border-amber-500/40">
                <BookOpen className="w-4 h-4" />
              </span>
              <span className="text-xs font-mono font-bold text-amber-400 uppercase tracking-wider">
                Vedic Iconography &amp; Divine Manifestations • देव रूप संग्रह
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-slate-100 tracking-tight">
              {language === 'HI'
                ? '३२ गणेश रूप एवं भगवान शिव अष्टमूर्ति अवतार'
                : language === 'MR'
                ? '३२ श्री गणेश रूपे व भगवान शिव अष्टमूर्ती दर्शन'
                : 'Sacred Divine Forms & Manifestations'}
            </h1>

            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
              Explore the 32 traditional forms of Lord Ganesha (Mudgala Purana), Lord Shiva's 8 Cosmic Elements (Ashtamurthi) &amp; major iconographic avatars, and Lord Vishnu's Dashavatara.
            </p>
          </div>

          {/* Deity Selector Tabs */}
          <div className="flex items-center gap-2 p-1.5 bg-slate-950 border border-slate-800 rounded-2xl self-start md:self-center">
            {ALL_DEITY_FORM_COLLECTIONS.map((col) => {
              const isSelected = selectedGodId === col.godId;
              return (
                <button
                  key={col.godId}
                  onClick={() => {
                    setSelectedGodId(col.godId);
                    setActiveCategoryFilter('ALL');
                    setSearchQuery('');
                  }}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                    isSelected
                      ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-950/50'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                  }`}
                >
                  <Sparkles className={`w-3.5 h-3.5 ${isSelected ? 'fill-current' : ''}`} />
                  <span>{col.godNameEn} ({col.totalFormsCount})</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Search & Sub-category Filter Bar */}
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
          {/* Search Bar */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search forms (e.g. Bala, Nataraja, Earth, Mudgala Purana...)"
              className="w-full bg-slate-950 border border-slate-800 rounded-2xl pl-10 pr-4 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-500 transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 text-xs font-bold"
              >
                Clear
              </button>
            )}
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            <button
              onClick={() => setActiveCategoryFilter('ALL')}
              className={`px-3 py-1.5 rounded-xl text-[11px] font-bold cursor-pointer transition-all whitespace-nowrap ${
                activeCategoryFilter === 'ALL'
                  ? 'bg-amber-500/20 border border-amber-500 text-amber-300'
                  : 'bg-slate-950 border border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              All Categories ({currentCollection.forms.length})
            </button>

            {currentCollection.categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategoryFilter(cat)}
                className={`px-3 py-1.5 rounded-xl text-[11px] font-bold cursor-pointer transition-all whitespace-nowrap ${
                  activeCategoryFilter === cat
                    ? 'bg-amber-500/20 border border-amber-500 text-amber-300'
                    : 'bg-slate-950 border border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ========================================================= */}
      {/* 2. FORMS GRID CARDS DISPLAY */}
      {/* ========================================================= */}
      <div className="space-y-4">
        <div className="flex items-center justify-between text-xs text-slate-400 px-1">
          <span>
            Showing <strong className="text-amber-400">{filteredForms.length}</strong> divine forms for{' '}
            <strong className="text-slate-200">{currentCollection.godNameEn}</strong>
          </span>
          <span className="font-mono text-[11px]">
            Source: Mudgala Purana, Sritattvanidhi &amp; Agama Shastras
          </span>
        </div>

        {filteredForms.length === 0 ? (
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-10 text-center space-y-3">
            <Compass className="w-8 h-8 text-amber-500 mx-auto animate-pulse" />
            <p className="font-bold text-slate-200 text-sm">No divine forms match your search criteria</p>
            <p className="text-xs text-slate-400">
              Try searching for terms like "Bala", "Warrior", "Earth", or "Water".
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setActiveCategoryFilter('ALL');
              }}
              className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredForms.map((form) => (
              <div
                key={form.id}
                onClick={() => setSelectedFormDetail(form)}
                className="group relative bg-slate-900/90 border border-slate-800 hover:border-amber-500/60 rounded-3xl p-5 shadow-xl transition-all hover:-translate-y-1 cursor-pointer flex flex-col justify-between space-y-4"
              >
                {/* Top Badge Row */}
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5">
                    {form.number && (
                      <span className="w-6 h-6 rounded-full bg-amber-500/20 text-amber-400 text-[11px] font-mono font-bold flex items-center justify-center border border-amber-500/30">
                        #{form.number}
                      </span>
                    )}
                    <span className="text-[10px] font-mono font-bold text-slate-400 bg-slate-950 px-2 py-0.5 rounded-md border border-slate-800 truncate max-w-[150px]">
                      {form.category}
                    </span>
                  </div>

                  {form.scriptureSource && (
                    <span className="text-[10px] text-emerald-400 font-bold bg-emerald-950/60 px-2 py-0.5 rounded-md border border-emerald-800/40">
                      {form.scriptureSource.split('&')[0]}
                    </span>
                  )}
                </div>

                {/* Form Image / Icon Header */}
                <div className="flex items-start gap-3.5">
                  <div className="relative w-16 h-16 rounded-2xl overflow-hidden border border-slate-700 shrink-0 shadow-md group-hover:scale-105 transition-transform">
                    <img
                      src={form.imageUrl}
                      alt={form.formNameEn}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
                  </div>

                  <div className="space-y-0.5 min-w-0 flex-1">
                    <h3 className="font-black text-base text-slate-100 group-hover:text-amber-300 transition-colors truncate">
                      {form.formNameDevanagari}
                    </h3>
                    <p className="text-xs font-bold text-amber-400 truncate">
                      {form.formNameEn}
                    </p>
                    <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
                      {form.symbolism}
                    </p>
                  </div>
                </div>

                {/* Key Attributes Tags */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {form.keyAttributes.slice(0, 3).map((attr, idx) => (
                    <span
                      key={idx}
                      className="text-[10px] font-medium text-slate-300 bg-slate-950 px-2 py-0.5 rounded-lg border border-slate-800"
                    >
                      • {attr}
                    </span>
                  ))}
                </div>

                {/* Bottom Card Footer */}
                <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
                  <span className="text-[11px] font-mono text-amber-400 font-bold flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-amber-400" /> View Form Details
                  </span>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCopyMantra(form);
                    }}
                    className="p-1.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-400 hover:text-amber-300 hover:border-amber-500/40 transition-colors cursor-pointer"
                    title="Copy Mantra"
                  >
                    {copiedMantraId === form.id ? (
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ========================================================= */}
      {/* 3. FULL SACRED FORM DETAIL MODAL */}
      {/* ========================================================= */}
      {selectedFormDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
          <div className="w-full max-w-2xl bg-slate-950 border border-amber-500/40 rounded-3xl p-6 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-start justify-between gap-3 border-b border-slate-800 pb-4">
              <div className="flex items-center gap-3">
                <img
                  src={selectedFormDetail.imageUrl}
                  alt={selectedFormDetail.formNameEn}
                  className="w-16 h-16 rounded-2xl object-cover border-2 border-amber-500/50 shadow-lg"
                />
                <div>
                  <div className="flex items-center gap-2">
                    {selectedFormDetail.number && (
                      <span className="text-[10px] font-mono font-bold bg-amber-500 text-slate-950 px-2 py-0.5 rounded-full">
                        Form #{selectedFormDetail.number}
                      </span>
                    )}
                    <span className="text-xs text-slate-400 font-mono">
                      {selectedFormDetail.category}
                    </span>
                  </div>
                  <h2 className="text-xl font-black text-slate-100">
                    {selectedFormDetail.formNameDevanagari} ({selectedFormDetail.formNameEn})
                  </h2>
                  <p className="text-xs text-amber-400 font-bold">
                    Scripture: {selectedFormDetail.scriptureSource}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setSelectedFormDetail(null)}
                className="p-2 rounded-2xl bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Symbolism & Description */}
            <div className="space-y-3">
              <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl space-y-1">
                <span className="text-[10px] font-mono font-bold text-amber-400 uppercase tracking-wider block">
                  Sacred Symbolism &amp; Meaning
                </span>
                <p className="text-sm font-semibold text-slate-200 leading-relaxed">
                  {selectedFormDetail.symbolism}
                </p>
              </div>

              <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl space-y-1">
                <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider block">
                  Form Description
                </span>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {selectedFormDetail.description}
                </p>
              </div>

              <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl space-y-1">
                <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider block">
                  Iconography &amp; Physical Appearance
                </span>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {selectedFormDetail.iconography}
                </p>
              </div>
            </div>

            {/* Sacred Mantra Box */}
            {selectedFormDetail.mantraDevanagari && (
              <div className="p-4 bg-gradient-to-br from-amber-950/60 to-slate-900 border border-amber-600/50 rounded-2xl space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
                    <Flame className="w-4 h-4 text-amber-400 fill-current" />
                    Sacred Bija Mantra
                  </span>

                  <button
                    onClick={playSacredBellSound}
                    className="px-2.5 py-1 rounded-xl bg-amber-500 text-slate-950 font-bold text-[11px] flex items-center gap-1 cursor-pointer hover:bg-amber-400 transition-colors"
                  >
                    <Volume2 className={`w-3.5 h-3.5 ${isPlayingAudio ? 'animate-bounce' : ''}`} />
                    <span>{isPlayingAudio ? 'Chanting Bell...' : 'Sound Bell (432Hz)'}</span>
                  </button>
                </div>

                <div className="p-3 bg-slate-950 rounded-xl border border-amber-800/40 text-center space-y-1">
                  <p className="text-base sm:text-lg font-bold text-slate-100 font-serif">
                    {selectedFormDetail.mantraDevanagari}
                  </p>
                  {selectedFormDetail.mantraEn && (
                    <p className="text-xs text-amber-300 font-mono">
                      "{selectedFormDetail.mantraEn}"
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Key Attributes Tags */}
            <div className="space-y-1.5">
              <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider">
                Divine Attributes
              </span>
              <div className="flex flex-wrap gap-2">
                {selectedFormDetail.keyAttributes.map((attr, idx) => (
                  <span
                    key={idx}
                    className="text-xs font-medium text-amber-300 bg-amber-950/60 border border-amber-800/60 px-3 py-1 rounded-xl"
                  >
                    ✨ {attr}
                  </span>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-900">
              <button
                onClick={() => shareFormToWhatsApp(selectedFormDetail)}
                className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md cursor-pointer"
              >
                <Share2 className="w-4 h-4" />
                <span>Share WhatsApp</span>
              </button>

              <button
                onClick={() => {
                  if (onSelectFormForSadhana) {
                    onSelectFormForSadhana(selectedFormDetail);
                  } else {
                    alert(`📿 Form selected for 108 Jaap Sadhana: ${selectedFormDetail.formNameDevanagari}`);
                  }
                  setSelectedFormDetail(null);
                }}
                className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 shadow-md cursor-pointer"
              >
                <Flame className="w-4 h-4 fill-current" />
                <span>Start 108 Jaap Sadhana</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
