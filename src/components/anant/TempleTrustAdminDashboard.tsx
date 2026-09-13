import React, { useState } from 'react';
import {
  ShieldCheck,
  Users,
  Share2,
  Calendar,
  IndianRupee,
  FileCheck,
  UserPlus,
  Trash2,
  CheckCircle2,
  AlertTriangle,
  Radio,
  Download,
  Receipt,
  Plus,
  ExternalLink,
  MessageSquare,
  Facebook,
  Instagram,
  Youtube,
  Send,
  Lock,
} from 'lucide-react';
import {
  TrustMember,
  TenantRole,
  TempleEvent,
  DonationRecord,
  TrustComplianceInfo,
} from '../../types/anant.ts';
import {
  mockTrustMembers,
  mockTempleEvents,
  mockDonations,
  mockCompliance,
  mockTemples,
} from '../../data/anantData.ts';

export function TempleTrustAdminDashboard() {
  const [activeTab, setActiveTab] = useState<
    'TEAM' | 'MARKETING' | 'RITUALS' | 'FINANCE' | 'COMPLIANCE'
  >('TEAM');

  // 1. Team Management State (Max 5 Seats constraint)
  const [teamMembers, setTeamMembers] = useState<TrustMember[]>(mockTrustMembers);
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [inviteName, setInviteName] = useState('');
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteMobile, setInviteMobile] = useState('');
  const [inviteRole, setInviteRole] = useState<TenantRole>('EVENTS');
  const [teamError, setTeamError] = useState<string | null>(null);

  // 2. Marketing Hub State
  const [socialLinks, setSocialLinks] = useState({
    instagram: '@dagdushethganpati_official',
    facebook: 'facebook.com/dagdushethofficial',
    youtube: 'youtube.com/@dagdushethlive',
    whatsapp: '+91 98220 12345 (Meta Cloud WhatsApp API Connected)',
  });
  const [broadcastMessage, setBroadcastMessage] = useState('');
  const [broadcastSent, setBroadcastSent] = useState(false);

  // 3. Rituals & Events State
  const [events, setEvents] = useState<TempleEvent[]>(mockTempleEvents);
  const [isCreateEventModalOpen, setIsCreateEventModalOpen] = useState(false);
  const [eventTitle, setEventTitle] = useState('');
  const [eventTithi, setEventTithi] = useState('');
  const [eventDateTime, setEventDateTime] = useState('');
  const [eventLiveDarshan, setEventLiveDarshan] = useState(true);

  // 4. Finance & Donations State
  const [donations, setDonations] = useState<DonationRecord[]>(mockDonations);
  const [selectedReceipt, setSelectedReceipt] = useState<DonationRecord | null>(null);
  const [donationFilter, setDonationFilter] = useState<'ALL' | 'SUCCESS' | 'PENDING'>('ALL');

  // 5. Compliance State
  const [compliance, setCompliance] = useState<TrustComplianceInfo>(mockCompliance);
  const [attestationConfirmed, setAttestationConfirmed] = useState(
    mockCompliance.isConfirmedThisMonth
  );

  const MAX_TEAM_SEATS = 5;

  // Invite Team Member Handler (Strict 5-member limit check)
  const handleInviteMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (teamMembers.length >= MAX_TEAM_SEATS) {
      setTeamError('Maximum limit of 5 team seats reached. Please upgrade license or remove a member.');
      return;
    }
    if (!inviteName.trim() || !inviteEmail.trim()) {
      setTeamError('Please provide name and official email address.');
      return;
    }

    const newMember: TrustMember = {
      id: `member_${Date.now()}`,
      name: inviteName.trim(),
      email: inviteEmail.trim(),
      mobile: inviteMobile.trim() || '+91 98000 00000',
      role: inviteRole,
      avatarUrl:
        'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
      joinedDate: new Date().toISOString().split('T')[0],
      active: true,
    };

    setTeamMembers([...teamMembers, newMember]);
    setInviteName('');
    setInviteEmail('');
    setInviteMobile('');
    setTeamError(null);
    setIsInviteModalOpen(false);
  };

  const handleRemoveMember = (id: string) => {
    setTeamMembers(teamMembers.filter((m) => m.id !== id));
  };

  // Create New Ritual / Pooja Event
  const handleCreateEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!eventTitle.trim()) return;

    const newEvent: TempleEvent = {
      id: `evt_${Date.now()}`,
      templeId: 'temple_dagdusheth',
      templeName: 'Shreemant Dagdusheth Halwai Mandir',
      title: eventTitle.trim(),
      deityId: 'lord_ganesh',
      dateTime: eventDateTime || 'Upcoming Festival Day',
      panchangTithi: eventTithi || 'Shukla Paksha Chaturthi',
      expectedDevotees: 50000,
      isLiveDarshanLinked: eventLiveDarshan,
      status: 'UPCOMING',
    };

    setEvents([newEvent, ...events]);
    setEventTitle('');
    setEventTithi('');
    setEventDateTime('');
    setIsCreateEventModalOpen(false);
  };

  // Social Broadcast Push
  const handlePublishBroadcast = (e: React.FormEvent) => {
    e.preventDefault();
    if (!broadcastMessage.trim()) return;
    setBroadcastSent(true);
    setTimeout(() => {
      setBroadcastSent(false);
      setBroadcastMessage('');
    }, 2500);
  };

  // Download Donation CSV Simulation
  const handleDownloadDonationReport = () => {
    const csvContent =
      'Receipt,Donor Name,Email,Mobile,Amount,Purpose,Status,Date\n' +
      donations
        .map(
          (d) =>
            `${d.receiptNumber},"${d.donorName}",${d.donorEmail},${d.donorMobile},${d.amount},${d.purpose},${d.paymentStatus},${d.date}`
        )
        .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `temple_donation_report_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const totalDonationAmount = donations
    .filter((d) => d.paymentStatus === 'SUCCESS')
    .reduce((sum, d) => sum + d.amount, 0);

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 sm:p-6 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
            <span className="text-[11px] font-bold uppercase tracking-widest text-emerald-400">
              Tenant Admin Portal (संस्थान प्रशासन)
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-100 tracking-tight flex items-center gap-2">
            Shreemant Dagdusheth Halwai Mandir Trust
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Govt Reg: {compliance.govRegNumber} • Expiry: {compliance.expiryDate}
          </p>
        </div>

        {/* 5-Seat Usage Badge */}
        <div className="flex items-center gap-3 self-start md:self-auto">
          <div className="px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-2xl text-right">
            <span className="text-[10px] text-slate-400 font-semibold block">Team Seats Used</span>
            <span className="text-sm font-black text-amber-400 font-mono">
              {teamMembers.length} / {MAX_TEAM_SEATS} Max
            </span>
          </div>

          <div
            className={`px-3 py-2 rounded-2xl text-xs font-bold flex items-center gap-1.5 border ${
              attestationConfirmed
                ? 'bg-emerald-950/60 border-emerald-800 text-emerald-300'
                : 'bg-amber-950/60 border-amber-800 text-amber-300'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            {attestationConfirmed ? 'Trust Attested' : 'Attestation Pending'}
          </div>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        <button
          onClick={() => setActiveTab('TEAM')}
          className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-2 ${
            activeTab === 'TEAM'
              ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-950/40'
              : 'bg-slate-900 border border-slate-800 text-slate-300 hover:text-white'
          }`}
        >
          <Users className="w-4 h-4" /> Team Management ({teamMembers.length}/5)
        </button>

        <button
          onClick={() => setActiveTab('MARKETING')}
          className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-2 ${
            activeTab === 'MARKETING'
              ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-950/40'
              : 'bg-slate-900 border border-slate-800 text-slate-300 hover:text-white'
          }`}
        >
          <Share2 className="w-4 h-4" /> Marketing Hub
        </button>

        <button
          onClick={() => setActiveTab('RITUALS')}
          className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-2 ${
            activeTab === 'RITUALS'
              ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-950/40'
              : 'bg-slate-900 border border-slate-800 text-slate-300 hover:text-white'
          }`}
        >
          <Calendar className="w-4 h-4" /> Rituals & Events ({events.length})
        </button>

        <button
          onClick={() => setActiveTab('FINANCE')}
          className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-2 ${
            activeTab === 'FINANCE'
              ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-950/40'
              : 'bg-slate-900 border border-slate-800 text-slate-300 hover:text-white'
          }`}
        >
          <IndianRupee className="w-4 h-4" /> Donations & E-Receipts
        </button>

        <button
          onClick={() => setActiveTab('COMPLIANCE')}
          className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-2 ${
            activeTab === 'COMPLIANCE'
              ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-950/40'
              : 'bg-slate-900 border border-slate-800 text-slate-300 hover:text-white'
          }`}
        >
          <FileCheck className="w-4 h-4" /> Trust Compliance
        </button>
      </div>

      {/* ================================================================= */}
      {/* 1. TEAM MANAGEMENT VIEW (Strict Max 5 Seats RBAC) */}
      {/* ================================================================= */}
      {activeTab === 'TEAM' && (
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 sm:p-6 shadow-xl space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="font-bold text-base text-slate-100 flex items-center gap-2">
                <Users className="w-4 h-4 text-amber-400" /> Trust Team Roster & Permissions
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Multi-user RBAC. Limit: Up to 5 team members per temple tenant.
              </p>
            </div>

            <button
              onClick={() => setIsInviteModalOpen(true)}
              disabled={teamMembers.length >= MAX_TEAM_SEATS}
              className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 disabled:opacity-40 disabled:cursor-not-allowed text-slate-950 font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-md"
            >
              <UserPlus className="w-3.5 h-3.5" /> Invite Member ({MAX_TEAM_SEATS - teamMembers.length} left)
            </button>
          </div>

          {teamError && (
            <div className="p-3 bg-rose-950/60 border border-rose-800 text-rose-200 text-xs rounded-xl flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-400 flex-shrink-0" />
              <span>{teamError}</span>
            </div>
          )}

          {/* Members Table */}
          <div className="divide-y divide-slate-800/80 pt-2">
            {teamMembers.map((member) => (
              <div
                key={member.id}
                className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={member.avatarUrl}
                    alt={member.name}
                    className="w-10 h-10 rounded-full object-cover border border-slate-700"
                  />
                  <div>
                    <h4 className="font-bold text-xs sm:text-sm text-slate-100">{member.name}</h4>
                    <p className="text-[11px] text-slate-400">
                      {member.email} • {member.mobile}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 self-end sm:self-auto">
                  <span
                    className={`text-[10px] font-bold px-2.5 py-1 rounded-xl uppercase tracking-wider border ${
                      member.role === 'POOJARI_RITUALS'
                        ? 'bg-amber-950/60 text-amber-300 border-amber-800/60'
                        : member.role === 'DONATIONS_FINANCE'
                        ? 'bg-emerald-950/60 text-emerald-300 border-emerald-800/60'
                        : member.role === 'MEDIA'
                        ? 'bg-sky-950/60 text-sky-300 border-sky-800/60'
                        : member.role === 'MARKETING'
                        ? 'bg-purple-950/60 text-purple-300 border-purple-800/60'
                        : 'bg-slate-950 text-slate-300 border-slate-800'
                    }`}
                  >
                    Role: {member.role.replace('_', ' ')}
                  </span>

                  <button
                    onClick={() => handleRemoveMember(member.id)}
                    className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-950/40 cursor-pointer"
                    title="Remove Member"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ================================================================= */}
      {/* 2. MARKETING HUB VIEW */}
      {/* ================================================================= */}
      {activeTab === 'MARKETING' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Social Channels Integration */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 sm:p-6 shadow-xl space-y-4">
            <h3 className="font-bold text-base text-slate-100 flex items-center gap-2">
              <Share2 className="w-4 h-4 text-purple-400" /> Linked Social Media Channels
            </h3>
            <p className="text-xs text-slate-400">
              Synchronize live darshan announcements and videos across Meta, YouTube & WhatsApp API.
            </p>

            <div className="space-y-3 pt-2">
              <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <Instagram className="w-5 h-5 text-pink-400" />
                  <div>
                    <span className="text-xs font-bold text-slate-200 block">Instagram Graph API</span>
                    <span className="text-[10px] text-slate-400">{socialLinks.instagram}</span>
                  </div>
                </div>
                <span className="text-[10px] text-emerald-400 font-bold bg-emerald-950/60 px-2 py-0.5 rounded-md border border-emerald-800/40">
                  Connected
                </span>
              </div>

              <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <Youtube className="w-5 h-5 text-rose-500" />
                  <div>
                    <span className="text-xs font-bold text-slate-200 block">YouTube Live Stream</span>
                    <span className="text-[10px] text-slate-400">{socialLinks.youtube}</span>
                  </div>
                </div>
                <span className="text-[10px] text-emerald-400 font-bold bg-emerald-950/60 px-2 py-0.5 rounded-md border border-emerald-800/40">
                  Connected
                </span>
              </div>

              <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <Facebook className="w-5 h-5 text-blue-400" />
                  <div>
                    <span className="text-xs font-bold text-slate-200 block">Meta Facebook Page</span>
                    <span className="text-[10px] text-slate-400">{socialLinks.facebook}</span>
                  </div>
                </div>
                <span className="text-[10px] text-emerald-400 font-bold bg-emerald-950/60 px-2 py-0.5 rounded-md border border-emerald-800/40">
                  Connected
                </span>
              </div>

              <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <MessageSquare className="w-5 h-5 text-emerald-400" />
                  <div>
                    <span className="text-xs font-bold text-slate-200 block">WhatsApp Business Cloud API</span>
                    <span className="text-[10px] text-slate-400">{socialLinks.whatsapp}</span>
                  </div>
                </div>
                <span className="text-[10px] text-emerald-400 font-bold bg-emerald-950/60 px-2 py-0.5 rounded-md border border-emerald-800/40">
                  Verified
                </span>
              </div>
            </div>
          </div>

          {/* Direct Post & Video Publisher */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 sm:p-6 shadow-xl space-y-4">
            <h3 className="font-bold text-base text-slate-100 flex items-center gap-2">
              <Send className="w-4 h-4 text-amber-400" /> Direct Social & WhatsApp Broadcast
            </h3>
            <p className="text-xs text-slate-400">
              Publish an announcement simultaneously to Anant feed, WhatsApp subscribers, and Instagram.
            </p>

            {broadcastSent && (
              <div className="p-3 bg-emerald-950/60 border border-emerald-800 rounded-xl text-xs text-emerald-300 flex items-center gap-2 animate-in fade-in">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Broadcast successfully delivered to 184,500 devotees across all 4 channels!</span>
              </div>
            )}

            <form onSubmit={handlePublishBroadcast} className="space-y-3">
              <textarea
                rows={4}
                required
                value={broadcastMessage}
                onChange={(e) => setBroadcastMessage(e.target.value)}
                placeholder="Write official temple announcement (e.g. Special Abhishek timings on Angarki Chaturthi)..."
                className="w-full p-3 bg-slate-950 border border-slate-800 rounded-2xl text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500"
              />

              <div className="flex items-center justify-between pt-1">
                <span className="text-[11px] text-slate-400">Target Audience: All Registered Devotees</span>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-md"
                >
                  <Send className="w-3.5 h-3.5" /> Broadcast Now
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================================================================= */}
      {/* 3. RITUALS & EVENTS MANAGER */}
      {/* ================================================================= */}
      {activeTab === 'RITUALS' && (
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 sm:p-6 shadow-xl space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="font-bold text-base text-slate-100 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-amber-400" /> Temple Rituals & Poojas Schedule
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Create festivals, schedule abhishek archana, and integrate live sanctum darshan URLs.
              </p>
            </div>

            <button
              onClick={() => setIsCreateEventModalOpen(true)}
              className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-md"
            >
              <Plus className="w-3.5 h-3.5" /> Schedule New Pooja
            </button>
          </div>

          <div className="divide-y divide-slate-800/80 pt-2">
            {events.map((evt) => (
              <div
                key={evt.id}
                className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] uppercase font-bold text-amber-400 bg-amber-950/60 px-2.5 py-0.5 rounded-md border border-amber-800/40">
                      {evt.panchangTithi}
                    </span>
                    {evt.isLiveDarshanLinked && (
                      <span className="text-[10px] text-rose-400 font-bold flex items-center gap-1">
                        <Radio className="w-3 h-3" /> Live Feed Active
                      </span>
                    )}
                  </div>
                  <h4 className="font-bold text-sm text-slate-100">{evt.title}</h4>
                  <p className="text-xs text-slate-400">
                    {evt.dateTime} • Expected Devotees: {evt.expectedDevotees.toLocaleString()}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button className="px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 hover:text-white text-xs font-bold cursor-pointer">
                    Manage Bookings
                  </button>
                  <button className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold cursor-pointer">
                    Live Dashboard
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ================================================================= */}
      {/* 4. FINANCE DASHBOARD & DONATION E-RECEIPTS */}
      {/* ================================================================= */}
      {activeTab === 'FINANCE' && (
        <div className="space-y-6">
          {/* Revenue Matrix */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-5 bg-slate-900/90 border border-slate-800 rounded-3xl">
              <span className="text-xs font-semibold text-slate-400">Total Devotee Donations</span>
              <p className="text-2xl font-black text-amber-400 font-mono mt-1">
                ₹{totalDonationAmount.toLocaleString('en-IN')}
              </p>
              <span className="text-[10px] text-emerald-400 font-bold mt-1 block">
                +18.4% compared to previous month
              </span>
            </div>

            <div className="p-5 bg-slate-900/90 border border-slate-800 rounded-3xl">
              <span className="text-xs font-semibold text-slate-400">Annadaan Seva Fund</span>
              <p className="text-2xl font-black text-slate-100 font-mono mt-1">₹68,400</p>
              <span className="text-[10px] text-slate-500 mt-1 block">Serves 2,400 meals weekly</span>
            </div>

            <div className="p-5 bg-slate-900/90 border border-slate-800 rounded-3xl">
              <span className="text-xs font-semibold text-slate-400">80G Tax Exemption Status</span>
              <p className="text-base font-black text-emerald-400 mt-1 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" /> Active & Verified
              </p>
              <span className="text-[10px] text-slate-500 mt-1 block">
                Auto-generated 80G e-receipts sent on email
              </span>
            </div>
          </div>

          {/* Transactions List */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 sm:p-6 shadow-xl space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="font-bold text-base text-slate-100 flex items-center gap-2">
                  <Receipt className="w-4 h-4 text-emerald-400" /> Incoming Donations & E-Receipts
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Track real-time digital contributions, filter statuses, and print verified receipts.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleDownloadDonationReport}
                  className="px-3.5 py-1.5 rounded-xl bg-slate-950 border border-slate-800 hover:border-amber-500/40 text-slate-200 text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5 text-amber-400" /> Export CSV Report
                </button>
              </div>
            </div>

            <div className="divide-y divide-slate-800/80 pt-2">
              {donations.map((don) => (
                <div
                  key={don.id}
                  className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-100 text-sm">{don.donorName}</span>
                      <span className="text-[10px] font-mono text-amber-400 bg-amber-950/60 px-2 py-0.5 rounded-md border border-amber-900/40">
                        {don.receiptNumber}
                      </span>
                    </div>
                    <p className="text-slate-400 text-[11px] mt-0.5">
                      Purpose: <strong>{don.purpose}</strong> • {don.date}
                    </p>
                  </div>

                  <div className="flex items-center gap-3 self-end sm:self-auto">
                    <span className="font-black text-emerald-400 text-sm font-mono">
                      ₹{don.amount.toLocaleString('en-IN')}
                    </span>

                    <button
                      onClick={() => setSelectedReceipt(don)}
                      className="px-3 py-1 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold cursor-pointer"
                    >
                      View E-Receipt
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ================================================================= */}
      {/* 5. TRUST COMPLIANCE MANAGER */}
      {/* ================================================================= */}
      {activeTab === 'COMPLIANCE' && (
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 sm:p-6 shadow-xl space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div>
              <h3 className="font-bold text-base text-slate-100 flex items-center gap-2">
                <FileCheck className="w-4 h-4 text-amber-400" /> Trust Legal & Trustee Compliance
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Mandatory legal registrar details and monthly trustee identity attestation.
              </p>
            </div>
            <span className="text-xs font-bold text-emerald-400 bg-emerald-950/60 px-3 py-1 rounded-xl border border-emerald-800/60">
              Status: {compliance.status}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
            <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800">
              <span className="text-[10px] text-slate-400 font-semibold block">Reg. Number</span>
              <span className="font-mono font-bold text-slate-100 mt-0.5 block">
                {compliance.govRegNumber}
              </span>
            </div>

            <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800">
              <span className="text-[10px] text-slate-400 font-semibold block">Registration Date</span>
              <span className="font-mono font-bold text-slate-100 mt-0.5 block">
                {compliance.registrationDate}
              </span>
            </div>

            <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800">
              <span className="text-[10px] text-slate-400 font-semibold block">Registration Expiry Date</span>
              <span className="font-mono font-bold text-amber-400 mt-0.5 block">
                {compliance.expiryDate}
              </span>
            </div>

            <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800">
              <span className="text-[10px] text-slate-400 font-semibold block">Next Attestation Due</span>
              <span className="font-mono font-bold text-sky-400 mt-0.5 block">
                {compliance.nextMonthlyAttestationDate}
              </span>
            </div>
          </div>

          {/* Active Trustees Board */}
          <div className="space-y-2">
            <span className="text-xs font-bold text-slate-300">Registered Board of Trustees:</span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {compliance.trusteeNames.map((name, i) => (
                <div
                  key={i}
                  className="p-2.5 bg-slate-950 rounded-xl border border-slate-800 text-xs text-slate-200 flex items-center gap-2"
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                  <span>{name}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Monthly Attestation Confirmation Checkbox Prompt */}
          <div className="p-4 bg-amber-950/30 border border-amber-800/60 rounded-2xl space-y-3">
            <div className="flex items-start gap-3">
              <input
                type="checkbox"
                id="trustee-attest-check"
                checked={attestationConfirmed}
                onChange={(e) => setAttestationConfirmed(e.target.checked)}
                className="w-4 h-4 mt-0.5 rounded border-slate-700 text-amber-500 focus:ring-amber-500 cursor-pointer"
              />
              <label htmlFor="trustee-attest-check" className="text-xs text-slate-200 cursor-pointer">
                <strong className="block text-amber-300 font-semibold mb-0.5">
                  Monthly Trustee Identity Attestation (सप्टेंबर २०२६ पुष्टीकरण)
                </strong>
                I hereby declare on behalf of the Trust Board that the trustee names, government registration credentials, and bank account routing for devotee contributions remain lawful, active, and fully compliant with state charity commissioner guidelines.
              </label>
            </div>

            <div className="text-right">
              <button
                disabled={!attestationConfirmed}
                onClick={() => alert('Monthly Trust Attestation successfully recorded and timestamped!')}
                className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 disabled:opacity-40 disabled:cursor-not-allowed text-slate-950 font-bold text-xs cursor-pointer shadow-md"
              >
                Submit Monthly Attestation
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================================================================= */}
      {/* MODAL: INVITE TEAM MEMBER (Max 5 Limit Enforced) */}
      {/* ================================================================= */}
      {isInviteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-4 text-slate-100">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="font-bold text-base text-slate-100">
                Invite Team Member ({teamMembers.length}/5 Seats Used)
              </h3>
              <button
                onClick={() => setIsInviteModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleInviteMember} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-300 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Pt. Narayan Shastri"
                  value={inviteName}
                  onChange={(e) => setInviteName(e.target.value)}
                  className="w-full h-9 px-3 bg-slate-950 border border-slate-800 rounded-xl text-slate-100"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Official Email Address</label>
                <input
                  type="email"
                  required
                  placeholder="e.g. narayan@dagdushethtrust.org"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  className="w-full h-9 px-3 bg-slate-950 border border-slate-800 rounded-xl text-slate-100"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Mobile / WhatsApp</label>
                <input
                  type="text"
                  placeholder="e.g. +91 98220 99887"
                  value={inviteMobile}
                  onChange={(e) => setInviteMobile(e.target.value)}
                  className="w-full h-9 px-3 bg-slate-950 border border-slate-800 rounded-xl text-slate-100"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Assigned Role</label>
                <select
                  value={inviteRole}
                  onChange={(e) => setInviteRole(e.target.value as TenantRole)}
                  className="w-full h-9 px-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-100"
                >
                  <option value="MARKETING">Marketing (Social integrations & broadcast)</option>
                  <option value="POOJARI_RITUALS">Poojari / Rituals (Schedules & sankalp)</option>
                  <option value="DONATIONS_FINANCE">Donations / Finance (80G & reports)</option>
                  <option value="MEDIA">Media (Videos, Artis & live feeds)</option>
                  <option value="EVENTS">Events (Devotee crowd management)</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsInviteModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-400 hover:text-slate-200 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold cursor-pointer"
                >
                  Send Invitation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================================================================= */}
      {/* MODAL: CREATE POOJA / RITUAL EVENT */}
      {/* ================================================================= */}
      {isCreateEventModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-4 text-slate-100">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="font-bold text-base text-slate-100">Schedule Sacred Pooja / Event</h3>
              <button
                onClick={() => setIsCreateEventModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateEvent} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-300 mb-1">Pooja / Festival Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Sahasravartan Modak Maha Naivedya"
                  value={eventTitle}
                  onChange={(e) => setEventTitle(e.target.value)}
                  className="w-full h-9 px-3 bg-slate-950 border border-slate-800 rounded-xl text-slate-100"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Panchang Tithi</label>
                <input
                  type="text"
                  placeholder="e.g. Shukla Chaturthi • Shubh Muhurat"
                  value={eventTithi}
                  onChange={(e) => setEventTithi(e.target.value)}
                  className="w-full h-9 px-3 bg-slate-950 border border-slate-800 rounded-xl text-slate-100"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Date & Timings</label>
                <input
                  type="text"
                  placeholder="e.g. Tuesday, Sep 22 • 06:00 AM - 10:00 AM"
                  value={eventDateTime}
                  onChange={(e) => setEventDateTime(e.target.value)}
                  className="w-full h-9 px-3 bg-slate-950 border border-slate-800 rounded-xl text-slate-100"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="event-live-check"
                  checked={eventLiveDarshan}
                  onChange={(e) => setEventLiveDarshan(e.target.checked)}
                  className="w-4 h-4 rounded text-amber-500 focus:ring-amber-500 cursor-pointer"
                />
                <label htmlFor="event-live-check" className="text-slate-300 cursor-pointer">
                  Link 24x7 Live Darshan Embed Stream
                </label>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsCreateEventModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-400 hover:text-slate-200 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold cursor-pointer"
                >
                  Publish Schedule
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================================================================= */}
      {/* MODAL: VIEW E-RECEIPT */}
      {/* ================================================================= */}
      {selectedReceipt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-4 text-slate-100">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <span className="text-xs font-bold text-amber-400">Official Donation E-Receipt</span>
              <button
                onClick={() => setSelectedReceipt(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-white cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 font-mono text-xs space-y-2">
              <div className="text-center pb-2 border-b border-slate-800">
                <h4 className="font-bold text-sm text-slate-100">
                  SHREEMANT DAGDUSHETH HALWAI MANDIR TRUST
                </h4>
                <p className="text-[10px] text-slate-400">Govt Reg: MAH-PUN-TRUST-49102-1982</p>
                <p className="text-[10px] text-emerald-400">80G Income Tax Exemption Eligible</p>
              </div>

              <div className="flex justify-between">
                <span className="text-slate-500">Receipt No:</span>
                <span className="font-bold text-amber-400">{selectedReceipt.receiptNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Donor Name:</span>
                <span className="text-slate-200">{selectedReceipt.donorName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Amount Paid:</span>
                <span className="text-emerald-400 font-bold text-sm">
                  ₹{selectedReceipt.amount.toLocaleString('en-IN')}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Seva Purpose:</span>
                <span className="text-slate-200">{selectedReceipt.purpose}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Date & Time:</span>
                <span className="text-slate-400">{selectedReceipt.date}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Status:</span>
                <span className="text-emerald-400 font-bold">PAID (SUCCESS)</span>
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <button
                onClick={() => window.print()}
                className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs cursor-pointer"
              >
                Print / Download PDF
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
