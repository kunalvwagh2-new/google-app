'use client';

import React, { useState } from 'react';
import { Bell, Check, Sparkles, Smartphone, X } from 'lucide-react';
import { supabase } from '../../lib/supabaseClient';

interface FollowTempleButtonProps {
  tenantId: string;
  templeName: string;
  userId?: string;
}

export function FollowTempleButton({
  tenantId,
  templeName,
  userId = 'user_devotee_1',
}: FollowTempleButtonProps) {
  const [isFollowing, setIsFollowing] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [whatsappOptIn, setWhatsappOptIn] = useState(true);
  const [loading, setLoading] = useState(false);

  const handleToggleFollow = async () => {
    if (!isFollowing) {
      setShowModal(true);
    } else {
      // Unfollow
      setIsFollowing(false);
      try {
        if (supabase && typeof supabase.from === 'function') {
          await supabase
            .from('temple_followers')
            .delete()
            .eq('user_id', userId)
            .eq('tenant_id', tenantId);
        }
      } catch {}
    }
  };

  const confirmFollowWithWhatsApp = async () => {
    setLoading(true);
    try {
      setIsFollowing(true);
      setShowModal(false);

      if (supabase && typeof supabase.from === 'function') {
        await supabase.from('temple_followers').upsert({
          id: `follow_${Date.now()}`,
          user_id: userId,
          tenant_id: tenantId,
          whatsapp_opt_in: whatsappOptIn,
        });
      }
    } catch (e) {
      console.warn('[FollowTempleButton] Error saving follow state:', e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={handleToggleFollow}
        className={`px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition cursor-pointer shadow-md ${
          isFollowing
            ? 'bg-emerald-500/25 border border-emerald-500 text-emerald-300'
            : 'bg-amber-500 hover:bg-amber-600 text-slate-950'
        }`}
      >
        {isFollowing ? (
          <>
            <Check className="w-3.5 h-3.5" /> Following (WhatsApp Active)
          </>
        ) : (
          <>
            <Bell className="w-3.5 h-3.5" /> Follow Temple
          </>
        )}
      </button>

      {/* WhatsApp Opt-in Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-slate-950/80 backdrop-blur-md animate-in fade-in">
          <div className="w-full max-w-sm bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                  <Smartphone className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-slate-100">Follow {templeName}</h4>
                  <p className="text-[10px] text-slate-400">Instant WhatsApp &amp; In-App Alerts</p>
                </div>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-3 bg-slate-950 border border-slate-800 rounded-2xl space-y-2">
              <label className="flex items-center gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={whatsappOptIn}
                  onChange={(e) => setWhatsappOptIn(e.target.checked)}
                  className="w-4 h-4 rounded border-slate-700 text-emerald-500 focus:ring-emerald-500"
                />
                <span className="text-xs font-bold text-slate-200">
                  Receive automated WhatsApp updates for festivals, live darshans &amp; poojari slots
                </span>
              </label>
            </div>

            <button
              onClick={confirmFollowWithWhatsApp}
              disabled={loading}
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-xs shadow-lg shadow-emerald-950/50 flex items-center justify-center gap-2 cursor-pointer transition"
            >
              <Sparkles className="w-4 h-4" />
              <span>Confirm Follow &amp; Enable WhatsApp Alerts</span>
            </button>
          </div>
        </div>
      )}
    </>
  );
}
