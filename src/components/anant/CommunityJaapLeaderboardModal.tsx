import React, { useState } from 'react';
import {
  X,
  Trophy,
  Flame,
  Sparkles,
  Users,
  Target,
  Plus,
  ShieldCheck,
  CheckCircle2,
  Share2,
  Medal,
  Award,
  Crown,
  Heart,
  TrendingUp,
} from 'lucide-react';
import { CommunityJaapGoal, JaapLeaderboardEntry } from '../../types/anant.ts';
import { mockCommunityJaapGoals } from '../../data/anantData.ts';

interface CommunityJaapLeaderboardModalProps {
  isOpen: boolean;
  onClose: () => void;
  onContributeCount?: (addedCount: number) => void;
}

export function CommunityJaapLeaderboardModal({
  isOpen,
  onClose,
  onContributeCount,
}: CommunityJaapLeaderboardModalProps) {
  const [goals, setGoals] = useState<CommunityJaapGoal[]>(mockCommunityJaapGoals);
  const [selectedGoal, setSelectedGoal] = useState<CommunityJaapGoal>(mockCommunityJaapGoals[0]);
  const [activeTab, setActiveTab] = useState<'OVERVIEW' | 'CONTRIBUTE' | 'LEADERBOARD' | 'ADMIN_TARGETS'>('OVERVIEW');

  // Devotee contribution
  const [malasCount, setMalasCount] = useState(1);
  const [contributorName, setContributorName] = useState('Kunal V. Wagh');
  const [contributorCity, setContributorCity] = useState('Pune, India');
  const [hasContributed, setHasContributed] = useState(false);

  // Admin New Target
  const [newMantra, setNewMantra] = useState('ॐ गं गणपतये नमः (Om Gam Ganapataye Namaha)');
  const [newFestival, setNewFestival] = useState('Ganesh Utsav Mahasankalp');
  const [newTargetCount, setNewTargetCount] = useState(10000000); // 1 Crore

  if (!isOpen) return null;

  const currentPercent = Math.min(
    100,
    Math.round((selectedGoal.currentCount / selectedGoal.targetCount) * 100)
  );

  const handleContributeJaap = (e: React.FormEvent) => {
    e.preventDefault();
    const countToAdd = malasCount * 108;

    const updatedGoals = goals.map((g) => {
      if (g.id === selectedGoal.id) {
        const newTotal = g.currentCount + countToAdd;
        // update top contributors if needed
        const newContributors = [...g.topContributors];
        const existingIdx = newContributors.findIndex(
          (c) => c.devoteeName.toLowerCase() === contributorName.toLowerCase()
        );
        if (existingIdx >= 0) {
          newContributors[existingIdx] = {
            ...newContributors[existingIdx],
            totalChants: newContributors[existingIdx].totalChants + countToAdd,
          };
        } else {
          newContributors.push({
            rank: newContributors.length + 1,
            devoteeName: contributorName,
            city: contributorCity,
            totalChants: countToAdd,
            badge: countToAdd >= 10000 ? 'Maha Sadhak' : 'Bhakta',
          });
        }
        // sort by total chants
        newContributors.sort((a, b) => b.totalChants - a.totalChants);
        newContributors.forEach((c, idx) => (c.rank = idx + 1));

        return {
          ...g,
          currentCount: newTotal,
          activeChanterCount: g.activeChanterCount + 1,
          topContributors: newContributors,
        };
      }
      return g;
    });

    setGoals(updatedGoals);
    const updatedSelected = updatedGoals.find((g) => g.id === selectedGoal.id);
    if (updatedSelected) setSelectedGoal(updatedSelected);

    if (onContributeCount) {
      onContributeCount(countToAdd);
    }

    setHasContributed(true);
    setTimeout(() => setHasContributed(false), 3000);
  };

  const handleCreateAdminGoal = (e: React.FormEvent) => {
    e.preventDefault();
    const created: CommunityJaapGoal = {
      id: `goal_${Date.now()}`,
      templeId: 'temple_dagdusheth',
      templeName: 'Shreemant Dagdusheth Halwai Ganpati Mandir',
      deityId: 'lord_ganesh',
      deityName: 'Lord Ganesh',
      mantraName: newMantra,
      mantraDevanagari: 'ॐ गं गणपतये नमः',
      festivalName: newFestival,
      targetCount: Number(newTargetCount),
      currentCount: 10800,
      activeDevoteesCount: 42,
      activeChanterCount: 42,
      deadlineDate: '2026-09-22 (Ganesh Visarjan)',
      description: `Collective Japa offering for ${newFestival}`,
      startDate: new Date().toISOString().split('T')[0],
      targetDate: '2026-09-22',
      status: 'ACTIVE',
      topContributors: [
        {
          id: 'dev_created_1',
          rank: 1,
          devoteeName: 'Kunal V. Wagh',
          avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
          city: 'Pune',
          malasCount: 20,
          totalBeads: 2160,
          badge: 'Pramukh Sadhak',
          lastChantedAt: 'Just now',
        },
      ],
    };
    setGoals((prev) => [created, ...prev]);
    setSelectedGoal(created);
    alert(`✅ New Community Jaap Target "${newFestival}" published!`);
  };

  const shareGoalOnWhatsApp = () => {
    const text = `🕉️ *श्री मंदिर सामूहिक १ कोटी जप महासंकल्प* 🙏\n\n• मंत्र: *${selectedGoal.mantraName}*\n• उत्सव: *${selectedGoal.festivalName}*\n• सामूहिक प्रगती: *${selectedGoal.currentCount.toLocaleString('en-IN')} / ${selectedGoal.targetCount.toLocaleString('en-IN')} जप* (${currentPercent}% पूर्ण!)\n• सहभागी भाविक: *${selectedGoal.activeChanterCount.toLocaleString('en-IN')} साधक*\n\nआपल्या नामाची माळ आजच अर्पण करा आणि सामूहिक पुण्य प्राप्त करा: https://anant.org/jaap-target/${selectedGoal.id}`;
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/80 backdrop-blur-md animate-in fade-in overflow-y-auto">
      <div className="w-full max-w-4xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col my-auto max-h-[92vh]">
        {/* Header */}
        <div className="p-5 border-b border-slate-800/80 bg-slate-950/70 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Trophy className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-black text-slate-100 tracking-tight">
                  Community Jaap Target & Global Leaderboard
                </h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30">
                  1 Crore Mantra Sankalp
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Turn individual rosary counting into a collective global temple offering for festival blessings
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

        {/* Tab Navigation */}
        <div className="flex items-center gap-1.5 p-3 bg-slate-950/80 border-b border-slate-800/80 overflow-x-auto">
          <button
            onClick={() => setActiveTab('OVERVIEW')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'OVERVIEW'
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-950/40'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <Target className="w-3.5 h-3.5" />
            <span>Active Temple Sankalp</span>
          </button>

          <button
            onClick={() => setActiveTab('CONTRIBUTE')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'CONTRIBUTE'
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-950/40'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Contribute My Malas</span>
          </button>

          <button
            onClick={() => setActiveTab('LEADERBOARD')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'LEADERBOARD'
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-950/40'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <Crown className="w-3.5 h-3.5 text-amber-400" />
            <span>Global Sadhak Leaderboard</span>
          </button>

          <button
            onClick={() => setActiveTab('ADMIN_TARGETS')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'ADMIN_TARGETS'
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-950/40'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Temple Admin Target Manager</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 overflow-y-auto space-y-5 flex-1">
          {/* ================================================================= */}
          {/* TAB 1: OVERVIEW & LIVE 1 CRORE PROGRESS */}
          {/* ================================================================= */}
          {activeTab === 'OVERVIEW' && (
            <div className="space-y-5">
              {/* Goal Selector */}
              <div className="flex items-center gap-2 overflow-x-auto pb-1">
                {goals.map((g) => (
                  <button
                    key={g.id}
                    onClick={() => setSelectedGoal(g)}
                    className={`px-4 py-2.5 rounded-2xl text-xs font-bold border transition-all cursor-pointer whitespace-nowrap ${
                      selectedGoal.id === g.id
                        ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-md'
                        : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-amber-500/40'
                    }`}
                  >
                    <span>{g.festivalName}</span>
                  </button>
                ))}
              </div>

              {/* Grand Collective Meter Card */}
              <div className="bg-gradient-to-br from-slate-950 via-slate-900 to-amber-950/40 border border-amber-500/30 rounded-3xl p-6 shadow-2xl relative overflow-hidden space-y-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <span className="text-[10px] font-mono font-bold uppercase text-amber-400 tracking-wider block">
                      {selectedGoal.templeName}
                    </span>
                    <h3 className="text-xl font-black text-slate-100 mt-1">
                      {selectedGoal.festivalName}
                    </h3>
                    <p className="text-xs text-amber-200/90 font-serif italic mt-0.5">
                      {selectedGoal.mantraName}
                    </p>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="text-3xl font-black text-amber-400 font-mono">
                      {currentPercent}%
                    </span>
                    <span className="text-[11px] text-slate-400 block font-mono">
                      Completed Toward Target
                    </span>
                  </div>
                </div>

                {/* Main Progress Bar */}
                <div className="space-y-2">
                  <div className="w-full bg-slate-950/80 rounded-2xl h-6 p-1 border border-slate-800 shadow-inner">
                    <div
                      className="h-full rounded-xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-400 transition-all duration-700 shadow-md"
                      style={{ width: `${Math.max(5, currentPercent)}%` }}
                    />
                  </div>

                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="text-slate-300">
                      Chanted: <strong className="text-amber-400">{selectedGoal.currentCount.toLocaleString('en-IN')}</strong>
                    </span>
                    <span className="text-slate-400">
                      Target: <strong className="text-white">{selectedGoal.targetCount.toLocaleString('en-IN')}</strong> (1 Crore)
                    </span>
                  </div>
                </div>

                {/* Metrics row */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-slate-800/80 text-xs">
                  <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800/60">
                    <span className="text-[10px] text-slate-400 block font-mono">Active Devotees Chanting</span>
                    <strong className="text-base text-slate-100 font-mono flex items-center gap-1.5 mt-0.5">
                      <Users className="w-4 h-4 text-amber-400" />
                      {selectedGoal.activeChanterCount.toLocaleString('en-IN')} Sadhaks
                    </strong>
                  </div>

                  <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800/60">
                    <span className="text-[10px] text-slate-400 block font-mono">Target Festival Date</span>
                    <strong className="text-base text-slate-100 font-mono flex items-center gap-1.5 mt-0.5">
                      <Flame className="w-4 h-4 text-orange-400" />
                      {selectedGoal.targetDate}
                    </strong>
                  </div>

                  <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800/60">
                    <span className="text-[10px] text-slate-400 block font-mono">Remaining Jaap</span>
                    <strong className="text-base text-amber-300 font-mono flex items-center gap-1.5 mt-0.5">
                      <Sparkles className="w-4 h-4 text-amber-400" />
                      {(selectedGoal.targetCount - selectedGoal.currentCount).toLocaleString('en-IN')}
                    </strong>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
                  <button
                    onClick={() => setActiveTab('CONTRIBUTE')}
                    className="w-full sm:flex-1 py-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs flex items-center justify-center gap-2 cursor-pointer transition-all shadow-lg shadow-amber-950/50"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Contribute Chants to 1 Crore Goal</span>
                  </button>

                  <button
                    onClick={shareGoalOnWhatsApp}
                    className="w-full sm:w-auto px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-2 cursor-pointer transition-all shadow-md"
                  >
                    <Share2 className="w-4 h-4" />
                    <span>Share on WhatsApp</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ================================================================= */}
          {/* TAB 2: CONTRIBUTE MALAS */}
          {/* ================================================================= */}
          {activeTab === 'CONTRIBUTE' && (
            <div className="max-w-xl mx-auto bg-slate-950 border border-slate-800 rounded-3xl p-6 space-y-4 shadow-xl">
              <div className="border-b border-slate-800 pb-3">
                <span className="text-[10px] font-mono font-bold uppercase text-amber-400 tracking-wider block">
                  Sacred Contribution
                </span>
                <h3 className="text-base font-bold text-slate-100 mt-0.5">
                  Offer Chanted Malas (१०८ मण्यांची माळ)
                </h3>
                <p className="text-xs text-slate-400">
                  Target: {selectedGoal.festivalName} • {selectedGoal.mantraName}
                </p>
              </div>

              <form onSubmit={handleContributeJaap} className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">
                    Your Name (नाव)
                  </label>
                  <input
                    type="text"
                    required
                    value={contributorName}
                    onChange={(e) => setContributorName(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 focus:border-amber-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">
                    City / Location (शहर)
                  </label>
                  <input
                    type="text"
                    required
                    value={contributorCity}
                    onChange={(e) => setContributorCity(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 focus:border-amber-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1.5 flex items-center justify-between">
                    <span>Number of Malas Completed (1 Mala = 108 Chants)</span>
                    <span className="text-amber-400 font-mono font-bold">
                      = {malasCount * 108} Mantras Chanted
                    </span>
                  </label>

                  <div className="flex items-center gap-2">
                    {[1, 3, 5, 11, 21, 51, 108].map((preset) => (
                      <button
                        key={preset}
                        type="button"
                        onClick={() => setMalasCount(preset)}
                        className={`flex-1 py-2 rounded-xl text-xs font-bold font-mono transition-all cursor-pointer ${
                          malasCount === preset
                            ? 'bg-amber-500 text-slate-950 font-black shadow-md'
                            : 'bg-slate-900 border border-slate-800 text-slate-300 hover:border-amber-500/40'
                        }`}
                      >
                        {preset}
                      </button>
                    ))}
                  </div>

                  <div className="mt-2 flex items-center gap-2">
                    <span className="text-xs text-slate-400">Custom Malas:</span>
                    <input
                      type="number"
                      min="1"
                      value={malasCount}
                      onChange={(e) => setMalasCount(Math.max(1, Number(e.target.value)))}
                      className="w-24 bg-slate-900 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-amber-400 font-mono font-bold focus:border-amber-500 focus:outline-none"
                    />
                  </div>
                </div>

                {hasContributed && (
                  <div className="p-3 bg-emerald-950/80 border border-emerald-700 rounded-xl text-emerald-200 text-xs flex items-center gap-2 animate-bounce">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                    <span>
                      Har Har Mahadev! {malasCount * 108} chants contributed to the 1 Crore temple target!
                    </span>
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-slate-950 font-black text-xs shadow-lg shadow-amber-950/50 flex items-center justify-center gap-2 cursor-pointer transition-all"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Dedicate {malasCount * 108} Chants to Temple Sankalp</span>
                </button>
              </form>
            </div>
          )}

          {/* ================================================================= */}
          {/* TAB 3: GLOBAL LEADERBOARD */}
          {/* ================================================================= */}
          {activeTab === 'LEADERBOARD' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                  <Crown className="w-4 h-4 text-amber-400" /> Top Devotees & Sadhaks (Global)
                </h3>
                <span className="text-xs text-slate-400 font-mono">
                  {selectedGoal.topContributors.length} Sadhaks Ranked
                </span>
              </div>

              <div className="border border-slate-800 rounded-2xl overflow-hidden">
                <table className="w-full text-left text-xs text-slate-300">
                  <thead className="bg-slate-950 text-slate-400 font-mono text-[11px] border-b border-slate-800">
                    <tr>
                      <th className="p-3">Rank</th>
                      <th className="p-3">Sadhak Name</th>
                      <th className="p-3">Location</th>
                      <th className="p-3">Total Chants</th>
                      <th className="p-3">Seva Badge</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/80 bg-slate-900/40">
                    {selectedGoal.topContributors.map((c) => (
                      <tr key={c.rank} className="hover:bg-slate-800/30">
                        <td className="p-3">
                          <span
                            className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-[11px] ${
                              c.rank === 1
                                ? 'bg-amber-400 text-slate-950'
                                : c.rank === 2
                                ? 'bg-slate-300 text-slate-950'
                                : c.rank === 3
                                ? 'bg-amber-700 text-white'
                                : 'bg-slate-800 text-slate-300'
                            }`}
                          >
                            {c.rank}
                          </span>
                        </td>
                        <td className="p-3 font-bold text-slate-100">{c.devoteeName}</td>
                        <td className="p-3 text-slate-400">{c.city}</td>
                        <td className="p-3 font-mono font-black text-amber-400">
                          {c.totalChants.toLocaleString('en-IN')}
                        </td>
                        <td className="p-3">
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-300 border border-amber-500/30">
                            {c.badge}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ================================================================= */}
          {/* TAB 4: TEMPLE ADMIN TARGET MANAGER */}
          {/* ================================================================= */}
          {activeTab === 'ADMIN_TARGETS' && (
            <div className="space-y-4 max-w-xl mx-auto">
              <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl flex items-center justify-between">
                <div>
                  <h3 className="text-xs font-bold text-slate-100 flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-amber-400" /> Collective Utsav Targets
                  </h3>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Initiate community-wide mantra targets for upcoming festivals
                  </p>
                </div>
                <span className="px-2.5 py-1 rounded-xl bg-amber-500/20 text-amber-300 font-mono text-xs font-bold">
                  {goals.length} Targets
                </span>
              </div>

              <form onSubmit={handleCreateAdminGoal} className="bg-slate-950 border border-slate-800 rounded-2xl p-5 space-y-3.5">
                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">
                    Festival / Occasion Title
                  </label>
                  <input
                    type="text"
                    required
                    value={newFestival}
                    onChange={(e) => setNewFestival(e.target.value)}
                    placeholder="e.g. Navratri 108 Lakh Devi Suktam Jaap"
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 focus:border-amber-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">
                    Mantra To Chant
                  </label>
                  <input
                    type="text"
                    required
                    value={newMantra}
                    onChange={(e) => setNewMantra(e.target.value)}
                    placeholder="e.g. ॐ नमः शिवाय / Gayatri Mantra"
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 focus:border-amber-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">
                    Target Count (e.g. 10,000,000 for 1 Crore)
                  </label>
                  <input
                    type="number"
                    required
                    value={newTargetCount}
                    onChange={(e) => setNewTargetCount(Number(e.target.value))}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 font-mono focus:border-amber-500 focus:outline-none"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow-md"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Publish Collective Temple Goal</span>
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
