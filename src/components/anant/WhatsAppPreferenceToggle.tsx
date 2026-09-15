'use client';

import React, { useState } from 'react';
import { Smartphone, Bell, CheckCircle2, ShieldCheck } from 'lucide-react';
import { supabase } from '../../lib/supabaseClient';

interface WhatsAppPreferenceToggleProps {
  userId?: string;
}

export function WhatsAppPreferenceToggle({ userId = 'user_devotee_1' }: WhatsAppPreferenceToggleProps) {
  const [eventsAlert, setEventsAlert] = useState(true);
  const [liveDarshanAlert, setLiveDarshanAlert] = useState(true);
  const [poojariSlotsAlert, setPoojariSlotsAlert] = useState(true);
  const [savedToast, setSavedToast] = useState(false);

  const handleSavePreferences = async () => {
    try {
      if (supabase && typeof supabase.from === 'function') {
        await supabase.from('notification_preferences').upsert({
          id: `pref_${userId}`,
          user_id: userId,
          events_alert: eventsAlert,
          live_darshan_alert: liveDarshanAlert,
          poojari_slots_alert: poojariSlotsAlert,
          updated_at: new Date().toISOString(),
        });
      }
      setSavedToast(true);
      setTimeout(() => setSavedToast(false), 2500);
    } catch (e) {
      console.warn('[WhatsAppPreferenceToggle] Error saving prefs:', e);
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-4">
      <div className="flex items-center gap-3 border-b border-slate-800 pb-3">
        <div className="w-10 h-10 rounded-2xl bg-emerald-500/15 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
          <Smartphone className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-sm font-black text-slate-100">WhatsApp Notification Preferences</h3>
          <p className="text-[11px] text-slate-400">
            Customize instant WhatsApp alerts for followed temples &amp; poojari availability
          </p>
        </div>
      </div>

      {savedToast && (
        <div className="p-3 bg-emerald-950/50 border border-emerald-800 rounded-xl text-xs text-emerald-300 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>WhatsApp preferences saved successfully!</span>
        </div>
      )}

      <div className="space-y-3">
        <label className="flex items-center justify-between p-3 bg-slate-950 border border-slate-800 rounded-2xl cursor-pointer">
          <div className="space-y-0.5">
            <span className="text-xs font-bold text-slate-200 block">Upcoming Events &amp; Festivals</span>
            <span className="text-[10px] text-slate-400">Receive schedule updates for next month's poojas</span>
          </div>
          <input
            type="checkbox"
            checked={eventsAlert}
            onChange={(e) => setEventsAlert(e.target.checked)}
            className="w-4 h-4 rounded border-slate-700 text-emerald-500 focus:ring-emerald-500"
          />
        </label>

        <label className="flex items-center justify-between p-3 bg-slate-950 border border-slate-800 rounded-2xl cursor-pointer">
          <div className="space-y-0.5">
            <span className="text-xs font-bold text-slate-200 block">Live Darshan Alerts</span>
            <span className="text-[10px] text-slate-400">Instant WhatsApp link when temple starts live streaming</span>
          </div>
          <input
            type="checkbox"
            checked={liveDarshanAlert}
            onChange={(e) => setLiveDarshanAlert(e.target.checked)}
            className="w-4 h-4 rounded border-slate-700 text-emerald-500 focus:ring-emerald-500"
          />
        </label>

        <label className="flex items-center justify-between p-3 bg-slate-950 border border-slate-800 rounded-2xl cursor-pointer">
          <div className="space-y-0.5">
            <span className="text-xs font-bold text-slate-200 block">Poojari Slot Availability &amp; Booking</span>
            <span className="text-[10px] text-slate-400">Alerts when verified poojaris open new booking slots</span>
          </div>
          <input
            type="checkbox"
            checked={poojariSlotsAlert}
            onChange={(e) => setPoojariSlotsAlert(e.target.checked)}
            className="w-4 h-4 rounded border-slate-700 text-emerald-500 focus:ring-emerald-500"
          />
        </label>
      </div>

      <button
        onClick={handleSavePreferences}
        className="w-full py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-xs shadow-lg shadow-emerald-950/50 flex items-center justify-center gap-2 cursor-pointer transition"
      >
        <ShieldCheck className="w-4 h-4" />
        <span>Save WhatsApp Preferences</span>
      </button>
    </div>
  );
}
