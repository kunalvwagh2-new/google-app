'use client';

import React, { useState } from 'react';
import {
  Users,
  ShieldCheck,
  Lock,
  Plus,
  Mail,
  UserPlus,
  Sparkles,
  Building2,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react';
import { inviteTenantMemberAction } from '../../app/actions/tenant-auth.ts';

interface SeatManagementProps {
  tenantStatus?: 'pending_verification' | 'verified' | 'suspended';
  baseSeatLimit?: number;
  purchasedExtraSeats?: number;
}

export function SeatManagement({
  tenantStatus = 'pending_verification',
  baseSeatLimit = 5,
  purchasedExtraSeats = 0,
}: SeatManagementProps) {
  const [isPending, setIsPending] = useState(tenantStatus === 'pending_verification');
  const [activeMembers, setActiveMembers] = useState([
    {
      id: 'm1',
      name: 'Pandit Rajesh Sharma',
      email: 'trust@kalbhairav.org',
      role: 'temple_admin',
      isPrimary: true,
      status: 'active',
    },
    {
      id: 'm2',
      name: 'Suresh Kulkarni',
      email: 'accounts@kalbhairav.org',
      role: 'accounts',
      isPrimary: false,
      status: 'active',
    },
  ]);

  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteName, setInviteName] = useState('');
  const [inviteRole, setInviteRole] = useState('poojari');
  const [inviteMessage, setInviteMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const totalAllowedSeats = isPending ? 1 : baseSeatLimit + purchasedExtraSeats;
  const currentSeatCount = activeMembers.length;

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isPending) {
      alert('Seat invitations are locked while organization status is pending_verification.');
      return;
    }
    if (currentSeatCount >= totalAllowedSeats) {
      alert('Seat limit reached! Please upgrade to add extra seats.');
      return;
    }

    setLoading(true);
    setInviteMessage(null);

    try {
      const res = await inviteTenantMemberAction('tenant_sample_1', inviteEmail, inviteName, inviteRole);
      if (!res.success) {
        setInviteMessage(res.error || 'Failed to invite.');
        setLoading(false);
        return;
      }

      setActiveMembers([
        ...activeMembers,
        {
          id: `m_${Date.now()}`,
          name: inviteName,
          email: inviteEmail,
          role: inviteRole,
          isPrimary: false,
          status: 'invited',
        },
      ]);
      setInviteName('');
      setInviteEmail('');
      setInviteMessage(res.message);
    } catch (err: any) {
      setInviteMessage(err.message || 'Invitation failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-amber-500/15 border border-amber-500/40 flex items-center justify-center text-amber-400">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-black text-slate-100 flex items-center gap-2">
              Scalable Seat Management &amp; Role-Based Access
              {isPending && (
                <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30 font-mono text-[10px]">
                  Pending Verification (1 Seat Single-User Mode)
                </span>
              )}
            </h3>
            <p className="text-xs text-slate-400">
              Manage organization staff seats, sub-user roles, and verification gating
            </p>
          </div>
        </div>

        {/* Seat Counter Pill */}
        <div className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-slate-950 border border-slate-800 font-mono text-xs">
          <span className="text-slate-400">Active Seats:</span>
          <span className="text-amber-400 font-bold">
            {currentSeatCount} / {totalAllowedSeats}
          </span>
        </div>
      </div>

      {/* Verification Status Warning if Pending */}
      {isPending && (
        <div className="p-4 bg-amber-950/40 border border-amber-500/50 rounded-2xl flex items-start gap-3">
          <Lock className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          <div className="space-y-1 text-xs text-amber-200">
            <strong className="block text-amber-300 font-bold">
              Dynamic 2-Stage Verification Gate Active
            </strong>
            <span>
              Your temple organization status is currently <span className="font-mono bg-amber-950 px-1.5 py-0.5 rounded">pending_verification</span>. Sub-user seat invitations and role assignments are locked to single-seat basic access until Tier 3 verification is approved by Anant moderators.
            </span>
          </div>
        </div>
      )}

      {/* Active Members List */}
      <div className="space-y-3">
        <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
          Organization Team &amp; Roles ({activeMembers.length})
        </h4>
        <div className="space-y-2">
          {activeMembers.map((m) => (
            <div
              key={m.id}
              className="flex items-center justify-between p-3.5 bg-slate-950 border border-slate-800 rounded-2xl"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-slate-800 flex items-center justify-center text-slate-200 font-bold text-xs uppercase">
                  {m.name.charAt(0)}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-xs font-bold text-slate-100">{m.name}</p>
                    {m.isPrimary && (
                      <span className="px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-400 text-[9px] font-bold border border-amber-500/30">
                        Primary Admin
                      </span>
                    )}
                  </div>
                  <p className="text-[10px] text-slate-400">{m.email} • Role: <span className="text-amber-300 font-mono uppercase">{m.role}</span></p>
                </div>
              </div>

              <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${
                m.status === 'active' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
              }`}>
                {m.status}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Invite Sub-User Form */}
      <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl space-y-3">
        <h4 className="text-xs font-bold text-slate-200 flex items-center gap-2">
          <UserPlus className="w-4 h-4 text-amber-400" />
          <span>Invite New Sub-User / Staff Seat</span>
          {isPending && <Lock className="w-3.5 h-3.5 text-amber-500 ml-auto" />}
        </h4>

        {inviteMessage && (
          <div className="p-2.5 bg-emerald-950/50 border border-emerald-800 rounded-xl text-xs text-emerald-300">
            {inviteMessage}
          </div>
        )}

        <form onSubmit={handleInvite} className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          <input
            type="text"
            required
            disabled={isPending}
            value={inviteName}
            onChange={(e) => setInviteName(e.target.value)}
            placeholder="Staff Full Name"
            className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 focus:border-amber-500 focus:outline-none disabled:opacity-50"
          />
          <input
            type="email"
            required
            disabled={isPending}
            value={inviteEmail}
            onChange={(e) => setInviteEmail(e.target.value)}
            placeholder="staff@temple.org"
            className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 focus:border-amber-500 focus:outline-none disabled:opacity-50"
          />
          <div className="flex gap-2">
            <select
              value={inviteRole}
              disabled={isPending}
              onChange={(e) => setInviteRole(e.target.value)}
              className="bg-slate-900 border border-slate-800 rounded-xl px-2.5 py-2 text-xs text-amber-300 font-bold focus:border-amber-500 focus:outline-none flex-1 disabled:opacity-50"
            >
              <option value="poojari">Poojari / Rituals</option>
              <option value="accounts">Accounts &amp; Donations</option>
              <option value="marketing">Marketing &amp; Media</option>
              <option value="temple_admin">Temple Admin</option>
            </select>
            <button
              type="submit"
              disabled={isPending || loading}
              className="px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs shadow-md transition cursor-pointer disabled:opacity-50"
            >
              Invite
            </button>
          </div>
        </form>
      </div>

      {/* Upgrade / Add Extra Seats CTA Banner */}
      <div className="p-4 bg-gradient-to-r from-amber-950/60 via-slate-950 to-orange-950/60 border border-amber-500/40 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <Sparkles className="w-5 h-5 text-amber-400 shrink-0" />
          <div className="text-xs">
            <strong className="text-slate-100 block">Need more than {baseSeatLimit} staff seats?</strong>
            <span className="text-slate-400">Scale your temple operations with paid extra seat additions ($10/seat/month).</span>
          </div>
        </div>
        <button
          onClick={() => alert('Redirecting to Stripe / Razorpay Checkout for Extra Seat Add-on...')}
          className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-slate-950 font-black text-xs shadow-md cursor-pointer whitespace-nowrap"
        >
          Upgrade / Add Extra Seats
        </button>
      </div>
    </div>
  );
}
