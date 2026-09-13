import React, { useState } from 'react';
import {
  X,
  QrCode,
  Calendar,
  Clock,
  Users,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Download,
  Share2,
  Scan,
  Sparkles,
  Search,
  Filter,
  ArrowRight,
  Landmark,
  Plus,
  Ticket,
  ChevronRight,
  ExternalLink,
} from 'lucide-react';
import { DarshanSlot, DarshanPass, QuotaType } from '../../types/anant.ts';
import { mockDarshanSlots, mockDarshanPasses, mockTemples } from '../../data/anantData.ts';

interface VirtualQueueDarshanModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTempleId?: string;
}

export function VirtualQueueDarshanModal({
  isOpen,
  onClose,
  initialTempleId,
}: VirtualQueueDarshanModalProps) {
  const [activeTab, setActiveTab] = useState<'DEVOTEE_BOOK' | 'MY_PASSES' | 'ADMIN_SLOTS' | 'GATE_SCANNER'>('DEVOTEE_BOOK');

  // Slots State
  const [slots, setSlots] = useState<DarshanSlot[]>(mockDarshanSlots);
  const [selectedTempleId, setSelectedTempleId] = useState<string>(initialTempleId || 'temple_dagdusheth');
  const [selectedSlot, setSelectedSlot] = useState<DarshanSlot | null>(slots[0]);

  // Devotee Booking Form State
  const [devoteeName, setDevoteeName] = useState('Kunal V. Wagh');
  const [devoteeMobile, setDevoteeMobile] = useState('+91 98220 11223');
  const [devoteeCount, setDevoteeCount] = useState(2);
  const [idProof, setIdProof] = useState('Aadhaar: **** 4891');
  const [issuedPasses, setIssuedPasses] = useState<DarshanPass[]>(mockDarshanPasses);
  const [activePass, setActivePass] = useState<DarshanPass | null>(mockDarshanPasses[0] || null);

  // Admin New Slot State
  const [newSlotDate, setNewSlotDate] = useState('2026-09-12');
  const [newSlotTime, setNewSlotTime] = useState('02:00 PM - 03:30 PM');
  const [newSlotFestival, setNewSlotFestival] = useState('Ganesh Chaturthi Special Darshan');
  const [newSlotQuota, setNewSlotQuota] = useState<QuotaType>('GENERAL');
  const [newSlotCapacity, setNewSlotCapacity] = useState(300);
  const [newSlotGate, setNewSlotGate] = useState('Gate 1 (Shivaji Road)');

  // Gate Scanner Simulator State
  const [scannerInput, setScannerInput] = useState('DAG-2026-Q042');
  const [scanResult, setScanResult] = useState<{
    status: 'VALID' | 'ALREADY_CHECKED_IN' | 'INVALID' | 'EXPIRED';
    pass?: DarshanPass;
    message: string;
  } | null>(null);

  if (!isOpen) return null;

  const filteredSlots = slots.filter(
    (s) => !selectedTempleId || s.templeId === selectedTempleId
  );

  const handleBookPass = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSlot) return;

    const tokenNum = `DAG-${new Date().getFullYear()}-Q${Math.floor(100 + Math.random() * 900)}`;
    const newPass: DarshanPass = {
      id: `pass_${Date.now()}`,
      slotId: selectedSlot.id,
      tokenNumber: tokenNum,
      devoteeName: devoteeName.trim(),
      devoteeMobile: devoteeMobile.trim(),
      devoteeCount: Number(devoteeCount),
      idProofNumber: idProof.trim(),
      templeId: selectedSlot.templeId,
      templeName: selectedSlot.templeName,
      date: selectedSlot.date,
      timeSlot: selectedSlot.timeSlot,
      gateNumber: selectedSlot.gateNumber,
      quotaType: selectedSlot.quotaType,
      verificationStatus: 'ISSUED',
      qrPayload: `ANANT_PASS:${tokenNum}:${devoteeName.toUpperCase()}:COUNT${devoteeCount}:${selectedSlot.gateNumber}:${selectedSlot.date}:${selectedSlot.timeSlot}`,
      issuedAt: new Date().toISOString(),
    };

    setIssuedPasses((prev) => [newPass, ...prev]);
    setActivePass(newPass);

    // Update slot booked count
    setSlots((prev) =>
      prev.map((s) =>
        s.id === selectedSlot.id
          ? {
              ...s,
              bookedCount: s.bookedCount + Number(devoteeCount),
              status: s.bookedCount + Number(devoteeCount) >= s.maxCapacity ? 'FULL' : 'FILLING_FAST',
            }
          : s
      )
    );

    setActiveTab('MY_PASSES');
  };

  const handleCreateSlot = (e: React.FormEvent) => {
    e.preventDefault();
    const created: DarshanSlot = {
      id: `slot_${Date.now()}`,
      templeId: selectedTempleId,
      templeName:
        mockTemples.find((t) => t.id === selectedTempleId)?.name || 'Mandir Sanctum',
      date: newSlotDate,
      timeSlot: newSlotTime,
      festivalName: newSlotFestival,
      quotaType: newSlotQuota,
      maxCapacity: Number(newSlotCapacity),
      bookedCount: 0,
      status: 'OPEN',
      gateNumber: newSlotGate,
      reportingTimeMinutesBefore: 15,
    };
    setSlots((prev) => [created, ...prev]);
    setSelectedSlot(created);
    alert(`✅ Timed Darshan Slot created successfully for ${newSlotDate} (${newSlotTime})!`);
  };

  const handleScanToken = () => {
    const query = scannerInput.trim().toUpperCase();
    const found = issuedPasses.find((p) => p.tokenNumber.toUpperCase() === query);

    if (!found) {
      setScanResult({
        status: 'INVALID',
        message: `Token "${scannerInput}" not found in temple registration records.`,
      });
      return;
    }

    if (found.verificationStatus === 'CHECKED_IN') {
      setScanResult({
        status: 'ALREADY_CHECKED_IN',
        pass: found,
        message: `Token ${found.tokenNumber} was already scanned and checked in at gate.`,
      });
      return;
    }

    // Mark checked in
    setIssuedPasses((prev) =>
      prev.map((p) =>
        p.id === found.id ? { ...p, verificationStatus: 'CHECKED_IN' } : p
      )
    );
    setScanResult({
      status: 'VALID',
      pass: { ...found, verificationStatus: 'CHECKED_IN' },
      message: `Verified! Admitted ${found.devoteeCount} devotees via ${found.gateNumber}.`,
    });
  };

  const sharePassOnWhatsApp = (pass: DarshanPass) => {
    const text = `🎫 *श्री दगडूशेठ मंदिर डिजिटल दर्शन पास* 🕉️\n\n• टोकन: *${pass.tokenNumber}*\n• भाविक: *${pass.devoteeName}* (${pass.devoteeCount} व्यक्ती)\n• स्लॉट: *${pass.date} (${pass.timeSlot})*\n• प्रवेश द्वार: *${pass.gateNumber}*\n\nQR कोड पास अधिकृतरीत्या जारी झाला आहे: https://anant.org/pass/${pass.tokenNumber}`;
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/80 backdrop-blur-md animate-in fade-in overflow-y-auto">
      <div className="w-full max-w-4xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col my-auto max-h-[92vh]">
        {/* Modal Header */}
        <div className="p-5 border-b border-slate-800/80 bg-slate-950/70 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Ticket className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-black text-slate-100 tracking-tight">
                  Virtual Queue & Timed Darshan Pass System
                </h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  Peak Crowd Control
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Prevent crowds during Mahashivratri & Ganesh Chaturthi with timed QR tokens
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

        {/* Tab Selector */}
        <div className="flex items-center gap-1.5 p-3 bg-slate-950/80 border-b border-slate-800/80 overflow-x-auto">
          <button
            onClick={() => setActiveTab('DEVOTEE_BOOK')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'DEVOTEE_BOOK'
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-950/40'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <Ticket className="w-3.5 h-3.5" />
            <span>Book Darshan Pass</span>
          </button>

          <button
            onClick={() => setActiveTab('MY_PASSES')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'MY_PASSES'
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-950/40'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <QrCode className="w-3.5 h-3.5" />
            <span>My Digital QR Passes ({issuedPasses.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('ADMIN_SLOTS')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'ADMIN_SLOTS'
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-950/40'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
            <span>Temple Admin: Manage Slots</span>
          </button>

          <button
            onClick={() => setActiveTab('GATE_SCANNER')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'GATE_SCANNER'
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-950/40'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <Scan className="w-3.5 h-3.5" />
            <span>Gate Volunteer Scanner</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 overflow-y-auto space-y-5 flex-1">
          {/* ================================================================= */}
          {/* TAB 1: DEVOTEE PASS BOOKING */}
          {/* ================================================================= */}
          {activeTab === 'DEVOTEE_BOOK' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
              {/* Left Column: Select Temple & Slot */}
              <div className="lg:col-span-7 space-y-4">
                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1.5 flex items-center gap-1.5">
                    <Landmark className="w-3.5 h-3.5 text-amber-400" /> Select Holy Temple
                  </label>
                  <select
                    value={selectedTempleId}
                    onChange={(e) => setSelectedTempleId(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-200 font-semibold focus:border-amber-500 focus:outline-none"
                  >
                    {mockTemples.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.name} ({t.city})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1.5 flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-amber-400" /> Available Timed Slots
                    </span>
                    <span className="text-[10px] text-amber-400 font-mono font-bold">
                      {filteredSlots.length} Slots Found
                    </span>
                  </label>

                  <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
                    {filteredSlots.map((slot) => {
                      const isSelected = selectedSlot?.id === slot.id;
                      const occupancyPercent = Math.round((slot.bookedCount / slot.maxCapacity) * 100);
                      return (
                        <div
                          key={slot.id}
                          onClick={() => slot.status !== 'FULL' && setSelectedSlot(slot)}
                          className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
                            isSelected
                              ? 'bg-amber-500/10 border-amber-500/70 shadow-lg shadow-amber-950/30'
                              : slot.status === 'FULL'
                              ? 'bg-slate-950/40 border-slate-800/60 opacity-50 cursor-not-allowed'
                              : 'bg-slate-950 border-slate-800 hover:border-slate-700'
                          }`}
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="text-xs font-bold text-slate-100 font-mono">
                                  {slot.timeSlot}
                                </span>
                                <span
                                  className={`text-[9px] px-2 py-0.5 rounded-full font-bold uppercase ${
                                    slot.quotaType === 'VIP'
                                      ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                                      : slot.quotaType === 'SENIOR_DIVYANG'
                                      ? 'bg-sky-500/20 text-sky-300 border border-sky-500/30'
                                      : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                                  }`}
                                >
                                  {slot.quotaType.replace('_', ' ')}
                                </span>
                              </div>
                              <p className="text-[11px] text-amber-400 font-medium mt-1">
                                {slot.festivalName}
                              </p>
                              <p className="text-[10px] text-slate-400 mt-0.5">
                                {slot.gateNumber} • Report {slot.reportingTimeMinutesBefore} mins prior
                              </p>
                            </div>

                            <div className="text-right shrink-0">
                              <span
                                className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                                  slot.status === 'OPEN'
                                    ? 'bg-emerald-950/60 text-emerald-300 border border-emerald-800'
                                    : slot.status === 'FILLING_FAST'
                                    ? 'bg-amber-950/60 text-amber-300 border border-amber-800'
                                    : 'bg-rose-950/60 text-rose-300 border border-rose-800'
                                }`}
                              >
                                {slot.status.replace('_', ' ')}
                              </span>
                              <p className="text-[10px] text-slate-500 font-mono mt-1">
                                {slot.bookedCount} / {slot.maxCapacity} Booked
                              </p>
                            </div>
                          </div>

                          {/* Progress bar */}
                          <div className="w-full bg-slate-900 rounded-full h-1.5 mt-2.5 overflow-hidden">
                            <div
                              className={`h-full rounded-full transition-all ${
                                occupancyPercent >= 90
                                  ? 'bg-rose-500'
                                  : occupancyPercent >= 70
                                  ? 'bg-amber-500'
                                  : 'bg-emerald-500'
                              }`}
                              style={{ width: `${occupancyPercent}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Right Column: Devotee Details & Confirmation Form */}
              <div className="lg:col-span-5 bg-slate-950/80 border border-slate-800 rounded-2xl p-4.5 space-y-4">
                <div className="border-b border-slate-800/80 pb-3">
                  <span className="text-[10px] font-mono text-amber-400 uppercase tracking-wider block font-bold">
                    Devotee Token Generation
                  </span>
                  <h3 className="text-sm font-bold text-slate-100 mt-0.5">
                    Reserve Timed Darshan Pass
                  </h3>
                  {selectedSlot && (
                    <p className="text-[11px] text-slate-400 mt-1">
                      Slot: <strong className="text-slate-200">{selectedSlot.timeSlot}</strong> on{' '}
                      <strong className="text-amber-300">{selectedSlot.date}</strong>
                    </p>
                  )}
                </div>

                <form onSubmit={handleBookPass} className="space-y-3">
                  <div>
                    <label className="text-[11px] text-slate-300 font-bold block mb-1">
                      Primary Devotee Name (नाव)
                    </label>
                    <input
                      type="text"
                      required
                      value={devoteeName}
                      onChange={(e) => setDevoteeName(e.target.value)}
                      placeholder="e.g. Kunal V. Wagh"
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:border-amber-500 focus:outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2.5">
                    <div>
                      <label className="text-[11px] text-slate-300 font-bold block mb-1">
                        Mobile Number
                      </label>
                      <input
                        type="text"
                        required
                        value={devoteeMobile}
                        onChange={(e) => setDevoteeMobile(e.target.value)}
                        placeholder="+91 98220 12345"
                        className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:border-amber-500 focus:outline-none font-mono"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] text-slate-300 font-bold block mb-1">
                        Devotees Count (1-6)
                      </label>
                      <select
                        value={devoteeCount}
                        onChange={(e) => setDevoteeCount(Number(e.target.value))}
                        className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:border-amber-500 focus:outline-none"
                      >
                        {[1, 2, 3, 4, 5, 6].map((num) => (
                          <option key={num} value={num}>
                            {num} {num === 1 ? 'Devotee' : 'Devotees'}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] text-slate-300 font-bold block mb-1">
                      ID Proof Reference (Optional)
                    </label>
                    <input
                      type="text"
                      value={idProof}
                      onChange={(e) => setIdProof(e.target.value)}
                      placeholder="e.g. Aadhaar / Voter ID"
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:border-amber-500 focus:outline-none"
                    />
                  </div>

                  <div className="p-3 bg-amber-950/30 border border-amber-800/40 rounded-xl text-[11px] text-amber-200/90 leading-relaxed flex items-start gap-2">
                    <ShieldCheck className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    <span>
                      Pass grants queue bypass directly to sanctum gate at appointed time. Show QR on
                      mobile for contactless verification.
                    </span>
                  </div>

                  <button
                    type="submit"
                    disabled={!selectedSlot || selectedSlot.status === 'FULL'}
                    className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-slate-950 font-black text-xs shadow-lg shadow-amber-950/50 flex items-center justify-center gap-2 cursor-pointer transition-all disabled:opacity-40"
                  >
                    <QrCode className="w-4 h-4" />
                    <span>Generate Instant QR Darshan Pass</span>
                  </button>
                </form>
              </div>
            </div>
          )}

          {/* ================================================================= */}
          {/* TAB 2: MY DIGITAL QR PASSES */}
          {/* ================================================================= */}
          {activeTab === 'MY_PASSES' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                  <QrCode className="w-4 h-4 text-amber-400" /> Issued Timed Darshan Tokens
                </h3>
                <span className="text-xs text-slate-400 font-mono">
                  {issuedPasses.length} Active Digital Passes
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {issuedPasses.map((pass) => (
                  <div
                    key={pass.id}
                    className="bg-slate-950 border border-amber-500/30 rounded-3xl p-5 shadow-2xl relative overflow-hidden flex flex-col justify-between space-y-4"
                  >
                    {/* Top Notch styling */}
                    <div className="flex items-start justify-between gap-3 border-b border-slate-800/80 pb-3">
                      <div>
                        <span className="text-[10px] font-mono font-black uppercase text-amber-400 tracking-wider">
                          {pass.templeName}
                        </span>
                        <h4 className="text-base font-black text-slate-100 mt-0.5 flex items-center gap-2">
                          Token: {pass.tokenNumber}
                        </h4>
                        <p className="text-xs text-slate-400">
                          {pass.date} • <strong className="text-amber-300 font-mono">{pass.timeSlot}</strong>
                        </p>
                      </div>

                      <div
                        className={`px-2.5 py-1 rounded-xl text-[10px] font-black uppercase border ${
                          pass.verificationStatus === 'CHECKED_IN'
                            ? 'bg-emerald-950/80 border-emerald-700 text-emerald-300'
                            : 'bg-amber-950/80 border-amber-700 text-amber-300 animate-pulse'
                        }`}
                      >
                        {pass.verificationStatus.replace('_', ' ')}
                      </div>
                    </div>

                    {/* QR Code Visual representation */}
                    <div className="flex flex-col sm:flex-row items-center gap-4 bg-slate-900/90 p-4 rounded-2xl border border-slate-800">
                      <div className="w-32 h-32 bg-white p-2 rounded-2xl flex flex-col items-center justify-center shrink-0 shadow-lg relative">
                        {/* High fidelity SVG simulated QR matrix */}
                        <svg className="w-full h-full text-slate-950" viewBox="0 0 100 100" fill="currentColor">
                          <rect x="0" y="0" width="30" height="30" rx="3" />
                          <rect x="5" y="5" width="20" height="20" fill="white" />
                          <rect x="10" y="10" width="10" height="10" />

                          <rect x="70" y="0" width="30" height="30" rx="3" />
                          <rect x="75" y="5" width="20" height="20" fill="white" />
                          <rect x="80" y="10" width="10" height="10" />

                          <rect x="0" y="70" width="30" height="30" rx="3" />
                          <rect x="5" y="75" width="20" height="20" fill="white" />
                          <rect x="10" y="80" width="10" height="10" />

                          {/* Data points */}
                          <rect x="38" y="8" width="6" height="6" />
                          <rect x="48" y="14" width="6" height="6" />
                          <rect x="38" y="24" width="8" height="8" />
                          <rect x="12" y="38" width="8" height="6" />
                          <rect x="25" y="45" width="6" height="6" />
                          <rect x="38" y="42" width="14" height="8" />
                          <rect x="58" y="42" width="8" height="8" />
                          <rect x="72" y="38" width="6" height="6" />
                          <rect x="84" y="46" width="8" height="8" />
                          <rect x="45" y="60" width="8" height="14" />
                          <rect x="62" y="62" width="10" height="6" />
                          <rect x="78" y="74" width="12" height="12" />
                          <rect x="42" y="84" width="8" height="8" />
                        </svg>
                        <span className="text-[8px] font-mono text-slate-600 font-bold mt-1">
                          ANANT PASS
                        </span>
                      </div>

                      <div className="space-y-1.5 text-xs text-slate-300 w-full">
                        <div className="flex justify-between border-b border-slate-800 pb-1">
                          <span className="text-slate-400 text-[11px]">Devotee:</span>
                          <span className="font-bold text-slate-100">{pass.devoteeName}</span>
                        </div>
                        <div className="flex justify-between border-b border-slate-800 pb-1">
                          <span className="text-slate-400 text-[11px]">Pass Count:</span>
                          <span className="font-bold text-amber-300 font-mono">
                            {pass.devoteeCount} Persons
                          </span>
                        </div>
                        <div className="flex justify-between border-b border-slate-800 pb-1">
                          <span className="text-slate-400 text-[11px]">Gate #:</span>
                          <span className="font-bold text-slate-100">{pass.gateNumber}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400 text-[11px]">ID Verified:</span>
                          <span className="text-slate-300 font-mono text-[10px]">{pass.idProofNumber || 'Registered'}</span>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 pt-2 border-t border-slate-800/80">
                      <button
                        onClick={() => sharePassOnWhatsApp(pass)}
                        className="flex-1 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer transition-all shadow-md"
                      >
                        <Share2 className="w-3.5 h-3.5" />
                        <span>Send to WhatsApp</span>
                      </button>

                      <button
                        onClick={() => alert(`📥 Digital Darshan Pass token #${pass.tokenNumber} saved to device wallet / photos!`)}
                        className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs flex items-center gap-1.5 cursor-pointer transition-all"
                        title="Download Pass Image"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Save</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ================================================================= */}
          {/* TAB 3: TEMPLE ADMIN SLOT MANAGER */}
          {/* ================================================================= */}
          {activeTab === 'ADMIN_SLOTS' && (
            <div className="space-y-5">
              <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-3">
                <div>
                  <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-amber-400" /> Peak Festival Slot Management
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Configure timed entry windows for Mahashivratri, Ganesh Chaturthi & Navratri crowds
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-400 font-medium">Total Managed Slots:</span>
                  <span className="px-2.5 py-1 rounded-xl bg-amber-500/20 text-amber-300 font-mono font-bold text-xs border border-amber-500/30">
                    {slots.length} Slots
                  </span>
                </div>
              </div>

              {/* Create Slot Form */}
              <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-4.5 space-y-3.5">
                <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
                  <Plus className="w-3.5 h-3.5 text-amber-400" /> Issue New Timed Slot
                </h4>

                <form onSubmit={handleCreateSlot} className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div>
                    <label className="text-[11px] text-slate-400 block mb-1">Slot Date</label>
                    <input
                      type="date"
                      value={newSlotDate}
                      onChange={(e) => setNewSlotDate(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:border-amber-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] text-slate-400 block mb-1">Time Window (e.g. 06:00 - 07:30 AM)</label>
                    <input
                      type="text"
                      value={newSlotTime}
                      onChange={(e) => setNewSlotTime(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:border-amber-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] text-slate-400 block mb-1">Max Capacity (Devotees)</label>
                    <input
                      type="number"
                      value={newSlotCapacity}
                      onChange={(e) => setNewSlotCapacity(Number(e.target.value))}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:border-amber-500 focus:outline-none font-mono"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] text-slate-400 block mb-1">Festival / Occasion Title</label>
                    <input
                      type="text"
                      value={newSlotFestival}
                      onChange={(e) => setNewSlotFestival(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:border-amber-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] text-slate-400 block mb-1">Quota Type</label>
                    <select
                      value={newSlotQuota}
                      onChange={(e) => setNewSlotQuota(e.target.value as QuotaType)}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:border-amber-500 focus:outline-none"
                    >
                      <option value="GENERAL">GENERAL (Public Queue)</option>
                      <option value="VIP">VIP (Fast Track Access)</option>
                      <option value="SENIOR_DIVYANG">SENIOR CITIZEN & DIVYANG</option>
                      <option value="SPECIAL_UTSAV">SPECIAL UTSAV PASS</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[11px] text-slate-400 block mb-1">Entry Gate Assigned</label>
                    <input
                      type="text"
                      value={newSlotGate}
                      onChange={(e) => setNewSlotGate(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:border-amber-500 focus:outline-none"
                    />
                  </div>

                  <div className="md:col-span-3 pt-1">
                    <button
                      type="submit"
                      className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-md"
                    >
                      <Plus className="w-4 h-4" /> Issue & Publish Slot
                    </button>
                  </div>
                </form>
              </div>

              {/* Slots Table */}
              <div className="border border-slate-800 rounded-2xl overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs text-slate-300">
                    <thead className="bg-slate-950 text-slate-400 font-mono text-[11px] border-b border-slate-800">
                      <tr>
                        <th className="p-3">Time Window</th>
                        <th className="p-3">Festival / Occasion</th>
                        <th className="p-3">Quota</th>
                        <th className="p-3">Gate</th>
                        <th className="p-3">Occupancy</th>
                        <th className="p-3">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/80 bg-slate-900/40">
                      {slots.map((s) => (
                        <tr key={s.id} className="hover:bg-slate-800/30">
                          <td className="p-3 font-mono font-bold text-slate-100">
                            {s.date}
                            <span className="block text-[11px] text-amber-400">{s.timeSlot}</span>
                          </td>
                          <td className="p-3 font-semibold">{s.festivalName}</td>
                          <td className="p-3">
                            <span className="text-[10px] px-2 py-0.5 rounded-md font-mono font-bold bg-slate-800 text-slate-300">
                              {s.quotaType}
                            </span>
                          </td>
                          <td className="p-3 text-slate-400">{s.gateNumber}</td>
                          <td className="p-3 font-mono">
                            {s.bookedCount} / {s.maxCapacity} ({Math.round((s.bookedCount / s.maxCapacity) * 100)}%)
                          </td>
                          <td className="p-3">
                            <span
                              className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                                s.status === 'OPEN'
                                  ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                                  : s.status === 'FILLING_FAST'
                                  ? 'bg-amber-950 text-amber-300 border border-amber-800'
                                  : 'bg-rose-950 text-rose-300 border border-rose-800'
                              }`}
                            >
                              {s.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ================================================================= */}
          {/* TAB 4: GATE VOLUNTEER SCANNER */}
          {/* ================================================================= */}
          {activeTab === 'GATE_SCANNER' && (
            <div className="max-w-xl mx-auto space-y-5">
              <div className="text-center space-y-1">
                <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 mx-auto">
                  <Scan className="w-6 h-6 animate-pulse" />
                </div>
                <h3 className="text-base font-bold text-slate-100">
                  Temple Gate Verification Scanner
                </h3>
                <p className="text-xs text-slate-400">
                  Scan devotee QR code or type token number for instant admission validation
                </p>
              </div>

              {/* Input Form */}
              <div className="bg-slate-950 p-4.5 rounded-2xl border border-slate-800 space-y-3">
                <label className="text-xs font-bold text-slate-300 block">
                  Enter Token ID / Scan QR Barcode
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={scannerInput}
                    onChange={(e) => setScannerInput(e.target.value)}
                    placeholder="e.g. DAG-2026-Q042"
                    className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-100 font-mono focus:border-amber-500 focus:outline-none uppercase"
                  />
                  <button
                    onClick={handleScanToken}
                    className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-md transition-all"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Validate</span>
                  </button>
                </div>

                <div className="flex items-center gap-2 text-[11px] text-slate-400 pt-1">
                  <span>Quick Test Tokens:</span>
                  <button
                    onClick={() => setScannerInput('DAG-2026-Q042')}
                    className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-amber-300 font-mono cursor-pointer"
                  >
                    DAG-2026-Q042
                  </button>
                  <button
                    onClick={() => setScannerInput('INVALID-999')}
                    className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-400 font-mono cursor-pointer"
                  >
                    INVALID-999
                  </button>
                </div>
              </div>

              {/* Scan Result Feedback Card */}
              {scanResult && (
                <div
                  className={`p-5 rounded-3xl border transition-all ${
                    scanResult.status === 'VALID'
                      ? 'bg-emerald-950/40 border-emerald-700 text-emerald-200'
                      : scanResult.status === 'ALREADY_CHECKED_IN'
                      ? 'bg-amber-950/40 border-amber-700 text-amber-200'
                      : 'bg-rose-950/40 border-rose-700 text-rose-200'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    {scanResult.status === 'VALID' ? (
                      <CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0 mt-0.5" />
                    ) : scanResult.status === 'ALREADY_CHECKED_IN' ? (
                      <AlertTriangle className="w-6 h-6 text-amber-400 shrink-0 mt-0.5" />
                    ) : (
                      <X className="w-6 h-6 text-rose-400 shrink-0 mt-0.5" />
                    )}

                    <div className="space-y-1 w-full">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-black font-mono uppercase tracking-wider">
                          Status: {scanResult.status}
                        </span>
                        {scanResult.pass && (
                          <span className="text-[10px] font-mono bg-slate-900/80 px-2 py-0.5 rounded-full border border-slate-700 text-slate-200">
                            {scanResult.pass.gateNumber}
                          </span>
                        )}
                      </div>
                      <p className="text-xs font-semibold">{scanResult.message}</p>

                      {scanResult.pass && (
                        <div className="mt-3 p-3 bg-slate-950/80 rounded-xl border border-slate-800 text-xs text-slate-300 space-y-1">
                          <p>
                            Devotee: <strong className="text-white">{scanResult.pass.devoteeName}</strong> (
                            {scanResult.pass.devoteeCount} Persons)
                          </p>
                          <p>
                            Slot: <strong className="text-amber-300">{scanResult.pass.timeSlot}</strong> ({scanResult.pass.date})
                          </p>
                          <p className="text-[11px] text-slate-400">
                            Temple: {scanResult.pass.templeName}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
