import React, { useState } from 'react';
import {
  X,
  Radio,
  Video,
  Calendar,
  Clock,
  IndianRupee,
  ShieldCheck,
  CheckCircle2,
  Share2,
  ExternalLink,
  Copy,
  Sparkles,
  Package,
  Plus,
  Landmark,
  FileText,
  User,
  MapPin,
  Flame,
} from 'lucide-react';
import { EPoojaSeva, SevaBooking, LiveStreamPlatform } from '../../types/anant.ts';
import { mockEPoojaSevas, mockSevaBookings, mockTemples } from '../../data/anantData.ts';

interface EPoojaSevaBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialSevaId?: string;
}

export function EPoojaSevaBookingModal({
  isOpen,
  onClose,
  initialSevaId,
}: EPoojaSevaBookingModalProps) {
  const [activeTab, setActiveTab] = useState<'SEVA_CATALOG' | 'BOOKING_FORM' | 'MY_BOOKINGS' | 'ADMIN_SEVAS'>('SEVA_CATALOG');

  const [sevas, setSevas] = useState<EPoojaSeva[]>(mockEPoojaSevas);
  const [selectedSeva, setSelectedSeva] = useState<EPoojaSeva>(
    mockEPoojaSevas.find((s) => s.id === initialSevaId) || mockEPoojaSevas[0]
  );
  const [bookings, setBookings] = useState<SevaBooking[]>(mockSevaBookings);
  const [activeBooking, setActiveBooking] = useState<SevaBooking | null>(mockSevaBookings[0] || null);

  // Booking Form Fields
  const [kartaName, setKartaName] = useState('Kunal V. Wagh');
  const [gotra, setGotra] = useState('Kashyap');
  const [nakshatra, setNakshatra] = useState('Rohini');
  const [sankalpPurpose, setSankalpPurpose] = useState('Family Health, Peace & Spiritual Prosperity');
  const [bookingDate, setBookingDate] = useState('2026-09-15');
  const [timeSlot, setTimeSlot] = useState('07:00 AM - 08:15 AM');
  const [prasadAddress, setPrasadAddress] = useState('Flat 402, Shiv Sadan, Model Colony, Pune 411016');

  // Admin New Seva Fields
  const [newSevaTitle, setNewSevaTitle] = useState('');
  const [newSevaTitleMr, setNewSevaTitleMr] = useState('');
  const [newSevaPrice, setNewSevaPrice] = useState(1500);
  const [newSevaDuration, setNewSevaDuration] = useState(60);
  const [newSevaPriest, setNewSevaPriest] = useState('Pandit Vidyadhar Shastri');
  const [newSevaPlatform, setNewSevaPlatform] = useState<LiveStreamPlatform>('YOUTUBE_PRIVATE');
  const [newSevaDesc, setNewSevaDesc] = useState('');

  const [copiedLink, setCopiedLink] = useState(false);

  if (!isOpen) return null;

  const handleBookSeva = (e: React.FormEvent) => {
    e.preventDefault();
    const streamCode = `ANANT-SEVA-${Math.floor(1000 + Math.random() * 9000)}`;
    const streamUrl =
      selectedSeva.liveStreamPlatform === 'JITSI_MEET'
        ? `https://meet.jit.si/AnantSpiritual_${selectedSeva.templeId}_${streamCode}`
        : `https://youtube.com/watch?v=live_private_${streamCode.toLowerCase()}`;

    const newBooking: SevaBooking = {
      id: `booking_${Date.now()}`,
      sevaId: selectedSeva.id,
      sevaTitle: selectedSeva.titleEn,
      templeName: selectedSeva.templeName,
      kartaName: kartaName.trim(),
      gotra: gotra.trim(),
      nakshatra: nakshatra.trim(),
      sankalpPurpose: sankalpPurpose.trim(),
      bookingDate,
      timeSlot,
      amountPaid: selectedSeva.priceInr,
      currency: 'INR',
      transactionRef: `UPI-SEVA-${Math.floor(100000 + Math.random() * 900000)}`,
      prasadAddress: selectedSeva.includesPrasadCourier ? prasadAddress.trim() : undefined,
      privateStreamUrl: streamUrl,
      streamPasscode: streamCode,
      status: 'CONFIRMED',
      bookedAt: new Date().toISOString(),
      whatsappConfirmationSent: true,
    };

    setBookings((prev) => [newBooking, ...prev]);
    setActiveBooking(newBooking);
    setActiveTab('MY_BOOKINGS');
  };

  const handleCreateSeva = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSevaTitle.trim()) return;

    const created: EPoojaSeva = {
      id: `seva_${Date.now()}`,
      templeId: 'temple_dagdusheth',
      templeName: 'Shreemant Dagdusheth Halwai Ganpati Mandir, Pune',
      deityId: 'lord_ganesh',
      titleEn: newSevaTitle.trim(),
      titleMr: newSevaTitleMr.trim() || newSevaTitle.trim(),
      priceInr: Number(newSevaPrice),
      durationMinutes: Number(newSevaDuration),
      description: newSevaDesc.trim() || 'Sacred temple ritual conducted by ordained archakas.',
      priestName: newSevaPriest.trim(),
      includesPrasadCourier: true,
      liveStreamPlatform: newSevaPlatform,
      streamUrlTemplate: 'https://youtube.com/live/private_stream_room',
      itemsIncluded: [
        'Family Sankalp with Gotra & Nakshatra invocation',
        'Sacred offering & flowers dedicated to sanctum deity',
        'Holy dry fruit Prasad dispatched to residential address',
        'Direct 1080p private live video stream access',
      ],
      bannerImageUrl: 'https://images.unsplash.com/photo-1567591370504-20a2d2188849?w=600&auto=format&fit=crop&q=80',
    };

    setSevas((prev) => [created, ...prev]);
    setSelectedSeva(created);
    alert(`✅ New Seva "${newSevaTitle}" created with private livestream link!`);
  };

  const copyToClipboard = (url: string) => {
    navigator.clipboard?.writeText(url);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const shareBookingOnWhatsApp = (booking: SevaBooking) => {
    const text = `🕉️ *ई-पूजा व संकल्प दर्शन नोंदणी निश्चित झाली आहे* 🙏\n\n• पूजा: *${booking.sevaTitle}*\n• मंदिर: *${booking.templeName}*\n• संकल्प कर्ता: *${booking.kartaName}* (गोत्र: ${booking.gotra})\n• दिनांक: *${booking.bookingDate} (${booking.timeSlot})*\n\n🔴 *थेट खाजगी दर्शन लिंक (Live Stream)*:\n${booking.privateStreamUrl}\n\nपासकोड: *${booking.streamPasscode}*\n\n_प्रसाद आपल्या पत्त्यावर कुरिअरने पाठवला जाईल._`;
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/80 backdrop-blur-md animate-in fade-in overflow-y-auto">
      <div className="w-full max-w-4xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col my-auto max-h-[92vh]">
        {/* Header */}
        <div className="p-5 border-b border-slate-800/80 bg-slate-950/70 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Flame className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-black text-slate-100 tracking-tight">
                  E-Pooja & Seva Booking with Live Stream
                </h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30 flex items-center gap-1">
                  <Radio className="w-3 h-3 animate-pulse text-rose-400" /> Private Remote Darshan
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Book remote Vedic rituals with Gotra Sankalp, live YouTube/Jitsi broadcast & Prasad delivery
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
            onClick={() => setActiveTab('SEVA_CATALOG')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'SEVA_CATALOG'
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-950/40'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Pooja Offerings ({sevas.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('BOOKING_FORM')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'BOOKING_FORM'
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-950/40'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Sankalp Booking Form</span>
          </button>

          <button
            onClick={() => setActiveTab('MY_BOOKINGS')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'MY_BOOKINGS'
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-950/40'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <Video className="w-3.5 h-3.5 text-amber-400" />
            <span>Live Stream Links ({bookings.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('ADMIN_SEVAS')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'ADMIN_SEVAS'
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-950/40'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Temple Admin: Manage Sevas</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 overflow-y-auto space-y-5 flex-1">
          {/* ================================================================= */}
          {/* TAB 1: SEVA CATALOG */}
          {/* ================================================================= */}
          {activeTab === 'SEVA_CATALOG' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {sevas.map((seva) => (
                <div
                  key={seva.id}
                  className="bg-slate-950 border border-slate-800 hover:border-amber-500/40 rounded-2xl p-4.5 transition-all flex flex-col justify-between space-y-3 group"
                >
                  <div className="space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span className="text-[10px] text-amber-400 font-bold uppercase tracking-wider block">
                          {seva.templeName}
                        </span>
                        <h4 className="text-sm font-black text-slate-100 mt-0.5 group-hover:text-amber-300 transition-colors">
                          {seva.titleEn}
                        </h4>
                        <p className="text-xs text-slate-400 font-serif">{seva.titleMr}</p>
                      </div>

                      <div className="text-right shrink-0">
                        <span className="text-base font-black text-amber-400 font-mono flex items-center justify-end">
                          <IndianRupee className="w-3.5 h-3.5" />
                          {seva.priceInr.toLocaleString('en-IN')}
                        </span>
                        <span className="text-[10px] text-slate-500 block font-mono">
                          {seva.durationMinutes} mins ritual
                        </span>
                      </div>
                    </div>

                    <p className="text-xs text-slate-300 leading-relaxed line-clamp-2">
                      {seva.description}
                    </p>

                    <div className="space-y-1 pt-1 text-[11px] text-slate-400">
                      <p className="flex items-center gap-1.5">
                        <User className="w-3 h-3 text-amber-400" />
                        <span>Priest: <strong className="text-slate-300">{seva.priestName}</strong></span>
                      </p>
                      <p className="flex items-center gap-1.5">
                        <Video className="w-3 h-3 text-rose-400" />
                        <span>
                          Stream:{' '}
                          <strong className="text-slate-300">
                            {seva.liveStreamPlatform === 'JITSI_MEET'
                              ? 'Interactive Jitsi 2-Way Blessing'
                              : 'Private YouTube Live 1080p HD'}
                          </strong>
                        </span>
                      </p>
                      {seva.includesPrasadCourier && (
                        <p className="flex items-center gap-1.5">
                          <Package className="w-3 h-3 text-emerald-400" />
                          <span className="text-emerald-300 font-medium">Consecrated Prasad courier included</span>
                        </p>
                      )}
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      setSelectedSeva(seva);
                      setActiveTab('BOOKING_FORM');
                    }}
                    className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer transition-all shadow-md"
                  >
                    <span>Book Seva & Join Live Stream</span>
                    <IndianRupee className="w-3.5 h-3.5" />
                    <span>{seva.priceInr.toLocaleString('en-IN')}</span>
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* ================================================================= */}
          {/* TAB 2: SANKALP BOOKING FORM */}
          {/* ================================================================= */}
          {activeTab === 'BOOKING_FORM' && (
            <div className="max-w-2xl mx-auto bg-slate-950 border border-slate-800 rounded-3xl p-5 sm:p-6 space-y-4 shadow-xl">
              <div className="border-b border-slate-800/80 pb-3">
                <span className="text-[10px] font-mono text-amber-400 font-bold uppercase tracking-wider block">
                  Sacred Sankalp Registration
                </span>
                <h3 className="text-base font-black text-slate-100 mt-0.5">
                  {selectedSeva.titleEn}
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">{selectedSeva.templeName}</p>
              </div>

              <form onSubmit={handleBookSeva} className="space-y-3.5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] text-slate-300 font-bold block mb-1">
                      Karta Name / मुख्य यजमान नाव
                    </label>
                    <input
                      type="text"
                      required
                      value={kartaName}
                      onChange={(e) => setKartaName(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:border-amber-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] text-slate-300 font-bold block mb-1">
                      Gotra (गोत्र)
                    </label>
                    <input
                      type="text"
                      required
                      value={gotra}
                      onChange={(e) => setGotra(e.target.value)}
                      placeholder="e.g. Kashyap / Bharadwaja"
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:border-amber-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] text-slate-300 font-bold block mb-1">
                      Nakshatra / Rashi (नक्षत्र)
                    </label>
                    <input
                      type="text"
                      required
                      value={nakshatra}
                      onChange={(e) => setNakshatra(e.target.value)}
                      placeholder="e.g. Rohini / Ashwini"
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:border-amber-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] text-slate-300 font-bold block mb-1">
                      Preferred Pooja Date
                    </label>
                    <input
                      type="date"
                      required
                      value={bookingDate}
                      onChange={(e) => setBookingDate(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:border-amber-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[11px] text-slate-300 font-bold block mb-1">
                    Sankalp Purpose / Prayer Intent (संकल्प उद्देश)
                  </label>
                  <textarea
                    rows={2}
                    value={sankalpPurpose}
                    onChange={(e) => setSankalpPurpose(e.target.value)}
                    placeholder="e.g. Health, prosperity, academic success, relief from obstacles"
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:border-amber-500 focus:outline-none"
                  />
                </div>

                {selectedSeva.includesPrasadCourier && (
                  <div>
                    <label className="text-[11px] text-slate-300 font-bold block mb-1 flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-amber-400" />
                      <span>Prasad Courier Delivery Address (संपूर्ण पत्ता)</span>
                    </label>
                    <textarea
                      rows={2}
                      required
                      value={prasadAddress}
                      onChange={(e) => setPrasadAddress(e.target.value)}
                      placeholder="House/Flat No, Landmark, City, State, PIN Code"
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:border-amber-500 focus:outline-none"
                    />
                  </div>
                )}

                <div className="p-3 bg-amber-950/30 border border-amber-800/40 rounded-2xl flex items-center justify-between text-xs">
                  <div>
                    <span className="text-[10px] text-slate-400 block font-bold">Total Seva Dakshina</span>
                    <span className="text-base font-black text-amber-400 font-mono flex items-center">
                      <IndianRupee className="w-3.5 h-3.5" />
                      {selectedSeva.priceInr.toLocaleString('en-IN')}
                    </span>
                  </div>

                  <div className="text-right text-[11px] text-slate-400">
                    <span>Includes: Ritual + Prasad Courier</span>
                    <span className="block text-emerald-400 font-bold">Instant Private Live Stream</span>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-slate-950 font-black text-xs shadow-lg shadow-amber-950/50 flex items-center justify-center gap-2 cursor-pointer transition-all"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Confirm Seva & Generate Live Stream Link</span>
                </button>
              </form>
            </div>
          )}

          {/* ================================================================= */}
          {/* TAB 3: MY BOOKINGS & LIVE STREAM LINKS */}
          {/* ================================================================= */}
          {activeTab === 'MY_BOOKINGS' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                  <Video className="w-4 h-4 text-rose-400" /> Active Seva Live Streams & Prasad Tracker
                </h3>
                <span className="text-xs text-slate-400 font-mono">
                  {bookings.length} Bookings
                </span>
              </div>

              <div className="space-y-4">
                {bookings.map((booking) => (
                  <div
                    key={booking.id}
                    className="bg-slate-950 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-4"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 border-b border-slate-800/80 pb-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-mono font-bold uppercase text-amber-400">
                            {booking.transactionRef}
                          </span>
                          <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                            {booking.status}
                          </span>
                        </div>
                        <h4 className="text-base font-black text-slate-100 mt-1">
                          {booking.sevaTitle}
                        </h4>
                        <p className="text-xs text-slate-400">{booking.templeName}</p>
                      </div>

                      <div className="text-right">
                        <span className="text-sm font-black text-amber-400 font-mono">
                          ₹{booking.amountPaid.toLocaleString('en-IN')}
                        </span>
                        <p className="text-[10px] text-slate-400 mt-0.5">
                          Date: <strong className="text-slate-200">{booking.bookingDate}</strong>
                        </p>
                      </div>
                    </div>

                    {/* Stream Box */}
                    <div className="bg-slate-900 border border-rose-500/30 rounded-2xl p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping" />
                          <span className="text-xs font-bold text-rose-400 font-mono">
                            PRIVATE REMOTE DARSHAN BROADCAST
                          </span>
                        </div>
                        <span className="text-[11px] text-slate-400 font-mono">
                          Passcode: <strong className="text-amber-400">{booking.streamPasscode}</strong>
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          readOnly
                          value={booking.privateStreamUrl}
                          className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 font-mono"
                        />
                        <button
                          onClick={() => copyToClipboard(booking.privateStreamUrl)}
                          className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs flex items-center gap-1.5 cursor-pointer transition-all"
                        >
                          <Copy className="w-3.5 h-3.5" />
                          <span>{copiedLink ? 'Copied!' : 'Copy'}</span>
                        </button>
                        <a
                          href={booking.privateStreamUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-md transition-all"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                          <span>Join Live</span>
                        </a>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] text-slate-400 pt-1">
                        <p>
                          Yajman:{' '}
                          <strong className="text-slate-200">{booking.kartaName}</strong> (Gotra:{' '}
                          <strong className="text-slate-200">{booking.gotra}</strong>, Nakshatra:{' '}
                          <strong className="text-slate-200">{booking.nakshatra}</strong>)
                        </p>
                        <p>
                          Prasad Dispatch:{' '}
                          <strong className="text-emerald-400">Express SpeedPost Scheduled</strong>
                        </p>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 pt-1">
                      <button
                        onClick={() => shareBookingOnWhatsApp(booking)}
                        className="flex-1 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer transition-all shadow-md"
                      >
                        <Share2 className="w-3.5 h-3.5" />
                        <span>Share Stream Link on WhatsApp</span>
                      </button>

                      <button
                        onClick={() => alert(`📅 Added "${booking.sevaTitle}" to your calendar for ${booking.bookingDate} at ${booking.timeSlot}!`)}
                        className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs flex items-center gap-1.5 cursor-pointer transition-all"
                      >
                        <Calendar className="w-3.5 h-3.5" />
                        <span>Add to Calendar</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ================================================================= */}
          {/* TAB 4: TEMPLE ADMIN MANAGE SEVAS */}
          {/* ================================================================= */}
          {activeTab === 'ADMIN_SEVAS' && (
            <div className="space-y-5">
              <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-3">
                <div>
                  <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-amber-400" /> Temple Rituals & E-Pooja Roster
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    List temple Poojas with prices, assigned priests & automated live stream links
                  </p>
                </div>

                <span className="px-3 py-1 rounded-xl bg-amber-500/20 text-amber-300 font-mono font-bold text-xs border border-amber-500/30">
                  {sevas.length} Published Sevas
                </span>
              </div>

              {/* Add Seva Form */}
              <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-4.5 space-y-3.5">
                <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
                  <Plus className="w-3.5 h-3.5 text-amber-400" /> Add New E-Pooja / Seva Offering
                </h4>

                <form onSubmit={handleCreateSeva} className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] text-slate-400 block mb-1">Pooja Title (English)</label>
                    <input
                      type="text"
                      required
                      value={newSevaTitle}
                      onChange={(e) => setNewSevaTitle(e.target.value)}
                      placeholder="e.g. Maha Rudrabhishek with Bilva Patra"
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:border-amber-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] text-slate-400 block mb-1">Pooja Title (Marathi / Devanagari)</label>
                    <input
                      type="text"
                      value={newSevaTitleMr}
                      onChange={(e) => setNewSevaTitleMr(e.target.value)}
                      placeholder="e.g. महा रुद्राभिषेक व बिल्वार्चन"
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:border-amber-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] text-slate-400 block mb-1">Price / Dakshina (INR)</label>
                    <input
                      type="number"
                      required
                      value={newSevaPrice}
                      onChange={(e) => setNewSevaPrice(Number(e.target.value))}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:border-amber-500 focus:outline-none font-mono"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] text-slate-400 block mb-1">Duration (Minutes)</label>
                    <input
                      type="number"
                      value={newSevaDuration}
                      onChange={(e) => setNewSevaDuration(Number(e.target.value))}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:border-amber-500 focus:outline-none font-mono"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] text-slate-400 block mb-1">Assigned Chief Priest / Purohit</label>
                    <input
                      type="text"
                      value={newSevaPriest}
                      onChange={(e) => setNewSevaPriest(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:border-amber-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] text-slate-400 block mb-1">Live Stream Platform</label>
                    <select
                      value={newSevaPlatform}
                      onChange={(e) => setNewSevaPlatform(e.target.value as LiveStreamPlatform)}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:border-amber-500 focus:outline-none"
                    >
                      <option value="YOUTUBE_PRIVATE">Private YouTube Live (Unlisted Stream)</option>
                      <option value="JITSI_MEET">Interactive Jitsi Meet (2-Way Priest Call)</option>
                      <option value="TEMPLE_LIVE_HLS">Dedicated Temple HLS Feed</option>
                    </select>
                  </div>

                  <div className="md:col-span-2">
                    <label className="text-[11px] text-slate-400 block mb-1">Seva Description & Inclusions</label>
                    <textarea
                      rows={2}
                      value={newSevaDesc}
                      onChange={(e) => setNewSevaDesc(e.target.value)}
                      placeholder="Explain the spiritual significance, items offered, and Prasad courier details."
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:border-amber-500 focus:outline-none"
                    />
                  </div>

                  <div className="md:col-span-2 pt-1">
                    <button
                      type="submit"
                      className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-md"
                    >
                      <Plus className="w-4 h-4" /> Publish Seva Offering
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
