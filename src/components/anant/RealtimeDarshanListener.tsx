'use client';

import React, { useEffect, useState } from 'react';
import { Bell, MapPin, Sparkles, X } from 'lucide-react';
import { supabase } from '../../lib/supabaseClient';
import { mockTemples } from '../../data/anantData.ts';
import { SupportedLanguage } from '../../types/anant.ts';

interface RealtimeDarshanListenerProps {
  language: SupportedLanguage;
  followedTempleIds: string[];
  onOpenDarshan?: (templeName: string) => void;
}

export function RealtimeDarshanListener({
  language,
  followedTempleIds,
  onOpenDarshan,
}: RealtimeDarshanListenerProps) {
  const [toastNotification, setToastNotification] = useState<{
    id: string;
    templeName: string;
    title: string;
    message: string;
  } | null>(null);

  // 1. Supabase Realtime Channel Listener on 'darshan_media' table
  useEffect(() => {
    let channel: any = null;
    try {
      channel = supabase
        .channel('public:darshan_media')
        .on(
          'postgres_changes',
          { event: 'INSERT', schema: 'public', table: 'darshan_media' },
          (payload: any) => {
            const newMedia = payload.new;
            if (newMedia && followedTempleIds.includes(newMedia.temple_id)) {
              const matchedTemple = mockTemples.find((t) => t.id === newMedia.temple_id);
              const templeName = matchedTemple ? matchedTemple.name : 'Followed Temple';

              setToastNotification({
                id: newMedia.id || Date.now().toString(),
                templeName,
                title: language === 'MR' ? 'नवीन दैनिक दर्शन अपलोड!' : 'New Darshan Uploaded!',
                message: newMedia.title || `${templeName} has uploaded new morning alankar & shringar darshan.`,
              });
            }
          }
        )
        .subscribe();

      return () => {
        try {
          if (supabase && typeof supabase.removeChannel === 'function' && channel) {
            supabase.removeChannel(channel);
          } else if (channel && typeof channel.unsubscribe === 'function') {
            channel.unsubscribe();
          }
        } catch {}
      };
    } catch (err) {
      console.warn('[Supabase Realtime] Channel subscription warning:', err);
    }
  }, [followedTempleIds, language]);

  // 2. Low-Battery Background Geolocation (8km Radius Alert) Simulation & Native Geofence Registration
  useEffect(() => {
    if (typeof window === 'undefined' || !navigator.geolocation) return;

    const checkGeofences = (latitude: number, longitude: number) => {
      mockTemples.forEach((temple: any) => {
        const tLat = temple.lat || 18.5204;
        const tLng = temple.lng || 73.8567;

        // Haversine distance formula
        const R = 6371; // Radius of earth in km
        const dLat = ((tLat - latitude) * Math.PI) / 180;
        const dLon = ((tLng - longitude) * Math.PI) / 180;
        const a =
          Math.sin(dLat / 2) * Math.sin(dLat / 2) +
          Math.cos((latitude * Math.PI) / 180) *
            Math.cos((tLat * Math.PI) / 180) *
            Math.sin(dLon / 2) *
            Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        const distanceKm = R * c;

        // 8km radius alert
        if (distanceKm <= 8) {
          const alertKey = `anant_geofence_alert_${temple.id}`;
          const lastAlert = sessionStorage.getItem(alertKey);
          if (!lastAlert) {
            sessionStorage.setItem(alertKey, 'triggered');
            setToastNotification({
              id: `geo-${temple.id}`,
              templeName: temple.name,
              title: language === 'MR' ? '📍 जवळच पवित्र तीर्थक्षेत्र!' : '📍 Sacred Temple Nearby (8km Radius)',
              message: `You are within 8km of ${temple.name}. Tap to view live darshan and trust updates.`,
            });
          }
        }
      });
    };

    // Watch position passively (low power mode)
    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        checkGeofences(position.coords.latitude, position.coords.longitude);
      },
      (error) => {
        console.warn('Geolocation watch error:', error);
      },
      { enableHighAccuracy: false, maximumAge: 600000, timeout: 30000 }
    );

    return () => {
      navigator.geolocation.clearWatch(watchId);
    };
  }, [language]);

  if (!toastNotification) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 max-w-sm bg-slate-900 border-2 border-amber-500/50 rounded-2xl p-4 shadow-2xl backdrop-blur-md animate-in slide-in-from-bottom-5 duration-300">
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center flex-shrink-0 shadow-lg">
          <Bell className="w-5 h-5 animate-bounce" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] font-black uppercase tracking-wider text-amber-400 bg-amber-950/80 px-2 py-0.5 rounded-full border border-amber-500/30">
              {toastNotification.templeName}
            </span>
            <button
              onClick={() => setToastNotification(null)}
              className="text-slate-400 hover:text-white transition p-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <h4 className="font-bold text-sm text-white">{toastNotification.title}</h4>
          <p className="text-xs text-slate-300 mt-1 line-clamp-2">{toastNotification.message}</p>
          {onOpenDarshan && (
            <button
              onClick={() => {
                onOpenDarshan(toastNotification.templeName);
                setToastNotification(null);
              }}
              className="mt-3 w-full bg-amber-600 hover:bg-amber-500 text-slate-950 font-semibold py-1.5 px-3 rounded-xl text-xs transition shadow flex items-center justify-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5" />
              View Live Darshan Now
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
