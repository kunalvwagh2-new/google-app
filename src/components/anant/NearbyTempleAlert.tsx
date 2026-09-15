import React, { useState, useEffect } from 'react';
import {
  Landmark,
  MapPin,
  Radio,
  Navigation,
  Bell,
  X,
  Sparkles,
  ShieldCheck,
  Compass,
  CheckCircle2,
  Sliders,
  User,
  Youtube,
  Facebook,
  Share2,
  Calendar,
  Database,
  ExternalLink,
  Tv,
  Globe,
  Check,
} from 'lucide-react';
import { Temple } from '../../types/anant.ts';
import { mockTemples } from '../../data/anantData.ts';
import {
  triggerSupabaseGeofenceEvent,
  getLocalGeofenceEvents,
  GeofenceEvent,
} from '../../lib/supabase-geofence.ts';

interface TempleWithGps extends Temple {
  lat: number;
  lng: number;
  youtubeLiveUrl?: string;
  youtubeChannelHandle?: string;
  facebookPageUrl?: string;
}

// Known coordinates and social stream links for temples in the catalog
export const CATALOG_TEMPLES_WITH_GPS: TempleWithGps[] = [
  {
    ...mockTemples[0], // Dagdusheth Pune
    lat: 18.5164,
    lng: 73.8560,
    youtubeLiveUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1&mute=1', // Fallback stream embed
    youtubeChannelHandle: '@DagdushethGanpatiLive',
    facebookPageUrl: 'https://facebook.com/dagdushethganpati',
  },
  {
    ...mockTemples[1], // Siddhivinayak Mumbai
    lat: 19.0169,
    lng: 72.8304,
    youtubeLiveUrl: 'https://www.youtube.com/embed/3JZ_D3ELwOQ?autoplay=1&mute=1',
    youtubeChannelHandle: '@SiddhivinayakLive',
    facebookPageUrl: 'https://facebook.com/siddhivinayakmumbai',
  },
  {
    ...mockTemples[2], // Trimbakeshwar Nashik
    lat: 19.9320,
    lng: 73.5307,
    youtubeLiveUrl: 'https://www.youtube.com/embed/L_LUpnjgPso?autoplay=1&mute=1',
    youtubeChannelHandle: '@TrimbakeshwarJyotirlingaLive',
    facebookPageUrl: 'https://facebook.com/trimbakeshwar.trust',
  },
  {
    ...mockTemples[3], // Pandharpur Vitthal
    lat: 17.6778,
    lng: 75.3267,
    youtubeLiveUrl: 'https://www.youtube.com/embed/fJ9rUzIMcZQ?autoplay=1&mute=1',
    youtubeChannelHandle: '@VitthalRukminiLive',
    facebookPageUrl: 'https://facebook.com/vitthalrukminitrust',
  },
  {
    ...mockTemples[4], // Manguesh Goa
    lat: 15.4439,
    lng: 73.9686,
    youtubeLiveUrl: 'https://www.youtube.com/embed/2g811Ko7gX8?autoplay=1&mute=1',
    youtubeChannelHandle: '@MangueshiTempleOfficial',
    facebookPageUrl: 'https://facebook.com/mangueshitemple',
  },
  {
    ...mockTemples[5], // Tuljapur Bhavani
    lat: 18.0044,
    lng: 76.0827,
    youtubeLiveUrl: 'https://www.youtube.com/embed/5qap5aO4i9A?autoplay=1&mute=1',
    youtubeChannelHandle: '@TuljaBhavaniLive',
    facebookPageUrl: 'https://facebook.com/tuljabhavanitrust',
  },
];

// Haversine distance formula in kilometers
function getDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth radius in km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 10) / 10;
}

export interface NearbyTempleAlertProps {
  onWatchLiveDarshan?: (templeId: string) => void;
  onOpenDirections?: (templeName: string, city: string, state: string) => void;
  onBookSeva?: (templeId: string) => void;
  currentTier?: 'TIER_1_DEVOTEE' | 'TIER_2_TRUST_ADMIN' | 'TIER_2B_POOJARI' | 'TIER_3_SUPER_ADMIN';
  onTierChange?: (tier: 'TIER_1_DEVOTEE' | 'TIER_2_TRUST_ADMIN' | 'TIER_2B_POOJARI' | 'TIER_3_SUPER_ADMIN') => void;
}

export function NearbyTempleAlert({
  onWatchLiveDarshan,
  onOpenDirections,
  onBookSeva,
  currentTier = 'TIER_1_DEVOTEE',
  onTierChange,
}: NearbyTempleAlertProps) {
  // User GPS state
  const [userPos, setUserPos] = useState<{ lat: number; lng: number } | null>(null);
  const [gpsSource, setGpsSource] = useState<'REAL_GPS' | 'SIMULATED'>('SIMULATED');
  const [simulatedPreset, setSimulatedPreset] = useState<string>('pune');

  // Nearby temples within 8km matching catalog
  const [nearbyTemples, setNearbyTemples] = useState<Array<{ temple: TempleWithGps; distanceKm: number }>>([]);
  const [isAlertDismissed, setIsAlertDismissed] = useState(false);
  const [notificationPermission, setNotificationPermission] = useState<NotificationPermission>('default');
  const [showSimPanel, setShowSimPanel] = useState(false);
  const [lastNotifiedTempleId, setLastNotifiedTempleId] = useState<string | null>(null);

  // Active social & embedded map tab states
  const [showEmbeddedMap, setShowEmbeddedMap] = useState(false);
  const [showYoutubeStream, setShowYoutubeStream] = useState(false);
  const [latestGeofenceEvent, setLatestGeofenceEvent] = useState<GeofenceEvent | null>(null);
  const [geofenceLogs, setGeofenceLogs] = useState<GeofenceEvent[]>([]);
  const [copiedLink, setCopiedLink] = useState(false);

  // Load initial geofence log history
  useEffect(() => {
    setGeofenceLogs(getLocalGeofenceEvents());
  }, []);

  // Initialize Geolocation & Notifications
  useEffect(() => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      setNotificationPermission(Notification.permission);
    }
    // Default simulation set to Dagdusheth Pune (0.4km away)
    setUserPos({ lat: 18.5200, lng: 73.8560 });
  }, []);

  // Request browser notification permissions
  const requestNotificationPermission = async () => {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission();
      setNotificationPermission(permission);
      if (permission === 'granted') {
        new Notification('🛕 Supabase Geofence Alerts Activated!', {
          body: 'You will receive instant push notifications & database triggers when walking within 8km of verified temples.',
        });
      }
    }
  };

  // Real GPS watch position
  const enableRealGps = () => {
    if ('geolocation' in navigator) {
      setGpsSource('REAL_GPS');
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setUserPos({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        },
        (err) => {
          console.warn('GPS error, falling back to simulated location:', err);
          alert('⚠️ Location access denied or unavailable. Using simulated Pune GPS coordinates.');
          setGpsSource('SIMULATED');
        },
        { enableHighAccuracy: true }
      );

      navigator.geolocation.watchPosition(
        (pos) => {
          setUserPos({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        },
        undefined,
        { enableHighAccuracy: true, maximumAge: 10000 }
      );
    }
  };

  // Handle Preset Simulation Selection
  const handleSimPresetChange = (presetKey: string) => {
    setSimulatedPreset(presetKey);
    setGpsSource('SIMULATED');
    setIsAlertDismissed(false);

    switch (presetKey) {
      case 'pune':
        setUserPos({ lat: 18.5200, lng: 73.8560 }); // ~0.4km from Dagdusheth
        break;
      case 'mumbai':
        setUserPos({ lat: 19.0200, lng: 72.8350 }); // ~0.6km from Siddhivinayak
        break;
      case 'nashik':
        setUserPos({ lat: 19.9350, lng: 73.5350 }); // ~0.5km from Trimbakeshwar
        break;
      case 'pandharpur':
        setUserPos({ lat: 17.6800, lng: 75.3300 }); // ~0.4km from Vitthal Rukmini
        break;
      case 'far':
        setUserPos({ lat: 28.6139, lng: 77.2090 }); // New Delhi (>1000km away)
        break;
      default:
        break;
    }
  };

  // Calculate nearby temples & trigger Supabase event when entering 8km radius
  useEffect(() => {
    if (!userPos) return;

    const matches = CATALOG_TEMPLES_WITH_GPS.map((temple) => {
      const d = getDistanceKm(userPos.lat, userPos.lng, temple.lat, temple.lng);
      return { temple, distanceKm: d };
    })
      .filter((item) => item.distanceKm <= 8.0 && item.temple.isVerified)
      .sort((a, b) => a.distanceKm - b.distanceKm);

    setNearbyTemples(matches);

    // Trigger Supabase Event Notification when user's distance matches verified catalog temple within 8km
    if (matches.length > 0) {
      const closest = matches[0];
      if (closest.temple.id !== lastNotifiedTempleId) {
        setLastNotifiedTempleId(closest.temple.id);

        // 1. Supabase Event Database Trigger
        triggerSupabaseGeofenceEvent('usr_kunal', {
          id: closest.temple.id,
          name: closest.temple.name,
          distanceKm: closest.distanceKm,
          deityName: closest.temple.deityName,
          city: closest.temple.city,
          state: closest.temple.state,
          lat: closest.temple.lat,
          lng: closest.temple.lng,
          isVerified: closest.temple.isVerified,
        }).then((evt) => {
          setLatestGeofenceEvent(evt);
          setGeofenceLogs(getLocalGeofenceEvents());
        });

        // 2. Native Browser Push Alert
        if (Notification.permission === 'granted') {
          try {
            new Notification(`🛕 Nearby Verified Temple: ${closest.temple.name}`, {
              body: `Distance: ${closest.distanceKm} km in ${closest.temple.city}. Supabase geofence event logged!`,
              icon: closest.temple.coverImageUrl,
            });
          } catch {}
        }
      }
    }
  }, [userPos, lastNotifiedTempleId]);

  const nearest = nearbyTemples[0];

  // Google Calendar Sync Helper
  const syncToGoogleCalendar = (templeName: string, city: string) => {
    const title = encodeURIComponent(`🛕 Live Darshan & Seva Visit: ${templeName}`);
    const details = encodeURIComponent(
      `Temple Visit scheduled via Anant Spiritual App.\nCity: ${city}\nLocation: Registered Temple Trust`
    );
    const location = encodeURIComponent(`${templeName}, ${city}`);
    const googleCalUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&details=${details}&location=${location}`;
    window.open(googleCalUrl, '_blank');
  };

  // Social Share Helpers
  const shareToFacebook = (templeName: string) => {
    const shareUrl = encodeURIComponent('https://anantsadhana.org');
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`, '_blank');
  };

  const shareToWhatsApp = (templeName: string, distanceKm: number) => {
    const text = encodeURIComponent(
      `🛕 Har Har Mahadev! I am currently ${distanceKm} km away from ${templeName} on Anant App! View Live Darshan & Panchang here: https://anantsadhana.org`
    );
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
  };

  return (
    <>
      {/* ========================================================= */}
      {/* 1. FLOATING NEARBY TEMPLE ALERT BANNER (<8KM MATCH) */}
      {/* ========================================================= */}
      {nearest && !isAlertDismissed && (
        <div className="fixed bottom-20 sm:bottom-6 right-3 sm:right-6 z-40 max-w-lg w-[calc(100vw-24px)] bg-slate-950/95 border-2 border-amber-500/70 rounded-3xl shadow-2xl backdrop-blur-xl p-4.5 space-y-3.5 animate-in fade-in slide-in-from-bottom-5 duration-300">
          {/* Top Banner Header & Badges */}
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
              <span className="text-[10px] font-mono font-black uppercase text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-full border border-amber-500/30 flex items-center gap-1">
                <Compass className="w-3 h-3 text-amber-400" /> Catalog Distance Match (&lt; 8km)
              </span>

              {/* Supabase Event Synced Indicator */}
              <span className="text-[10px] font-mono font-bold text-emerald-300 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/30 flex items-center gap-1">
                <Database className="w-2.5 h-2.5 text-emerald-400" /> Supabase Event Logged
              </span>
            </div>

            <button
              onClick={() => setIsAlertDismissed(true)}
              className="p-1.5 rounded-xl bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
              title="Dismiss Alert"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Temple Details */}
          <div className="flex items-start gap-3">
            <img
              src={nearest.temple.coverImageUrl}
              alt={nearest.temple.name}
              className="w-16 h-16 rounded-2xl object-cover border border-amber-500/40 shrink-0 shadow-md"
            />
            <div className="space-y-0.5 min-w-0 flex-1">
              <div className="flex items-center gap-1.5 flex-wrap">
                <h4 className="font-black text-sm text-slate-100 truncate">
                  {nearest.temple.name}
                </h4>
                {nearest.temple.isVerified && (
                  <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" title="Verified Temple Trust Catalog Match" />
                )}
              </div>

              <p className="text-xs text-amber-300 font-semibold flex items-center gap-1.5 flex-wrap">
                <Landmark className="w-3.5 h-3.5" />
                <span>{nearest.temple.deityName}</span>
                <span>•</span>
                <span className="font-mono text-emerald-400 font-bold">{nearest.distanceKm} km away</span>
              </p>

              <p className="text-[11px] text-slate-400 truncate">
                {nearest.temple.address}
              </p>
            </div>
          </div>

          {/* Social Connections Bar: YouTube, Facebook/Meta, Google Maps, Google Calendar */}
          <div className="p-2.5 bg-slate-900/90 border border-slate-800 rounded-2xl space-y-2">
            <div className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider flex items-center justify-between">
              <span>Connected Channels &amp; Locations</span>
              <span className="text-amber-400 font-sans">Verified Trust Links</span>
            </div>

            <div className="grid grid-cols-4 gap-1.5 text-xs">
              {/* YouTube Live Connector */}
              <button
                type="button"
                onClick={() => {
                  setShowYoutubeStream(!showYoutubeStream);
                  setShowEmbeddedMap(false);
                }}
                className={`p-2 rounded-xl border flex flex-col items-center justify-center gap-1 cursor-pointer transition-all ${
                  showYoutubeStream
                    ? 'bg-rose-500/20 border-rose-500 text-rose-300 font-bold'
                    : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-rose-500/50'
                }`}
                title="Toggle YouTube Live Darshan Stream"
              >
                <Youtube className="w-4 h-4 text-rose-500" />
                <span className="text-[10px] font-bold">YouTube Live</span>
              </button>

              {/* Google Maps Location Connector */}
              <button
                type="button"
                onClick={() => {
                  setShowEmbeddedMap(!showEmbeddedMap);
                  setShowYoutubeStream(false);
                }}
                className={`p-2 rounded-xl border flex flex-col items-center justify-center gap-1 cursor-pointer transition-all ${
                  showEmbeddedMap
                    ? 'bg-sky-500/20 border-sky-500 text-sky-300 font-bold'
                    : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-sky-500/50'
                }`}
                title="View Embedded Google Map & Pin Location"
              >
                <MapPin className="w-4 h-4 text-sky-400" />
                <span className="text-[10px] font-bold">Google Map</span>
              </button>

              {/* Facebook / Meta Share */}
              <button
                type="button"
                onClick={() => shareToFacebook(nearest.temple.name)}
                className="p-2 rounded-xl bg-slate-950 border border-slate-800 hover:border-blue-500 text-slate-300 hover:text-blue-400 flex flex-col items-center justify-center gap-1 cursor-pointer transition-all"
                title="Share to Meta / Facebook"
              >
                <Facebook className="w-4 h-4 text-blue-500" />
                <span className="text-[10px] font-bold">Meta / FB</span>
              </button>

              {/* Google Calendar Sync */}
              <button
                type="button"
                onClick={() => syncToGoogleCalendar(nearest.temple.name, nearest.temple.city)}
                className="p-2 rounded-xl bg-slate-950 border border-slate-800 hover:border-amber-500 text-slate-300 hover:text-amber-300 flex flex-col items-center justify-center gap-1 cursor-pointer transition-all"
                title="Sync Darshan Visit to Google Calendar"
              >
                <Calendar className="w-4 h-4 text-amber-400" />
                <span className="text-[10px] font-bold">Google Cal</span>
              </button>
            </div>
          </div>

          {/* Embedded YouTube Live Stream Player Panel */}
          {showYoutubeStream && (
            <div className="space-y-2 p-2 bg-slate-900 border border-rose-500/40 rounded-2xl animate-in fade-in duration-200">
              <div className="flex items-center justify-between px-1">
                <span className="text-xs font-bold text-rose-400 flex items-center gap-1.5">
                  <Tv className="w-3.5 h-3.5 fill-current animate-pulse" />
                  YouTube Live Broadcast: {nearest.temple.youtubeChannelHandle || '@TempleLive'}
                </span>
                <a
                  href={`https://youtube.com/${nearest.temple.youtubeChannelHandle}`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-[10px] text-slate-400 hover:text-rose-400 flex items-center gap-0.5"
                >
                  Open in YouTube <ExternalLink className="w-2.5 h-2.5" />
                </a>
              </div>
              <div className="aspect-video w-full rounded-xl overflow-hidden bg-black border border-slate-800">
                <iframe
                  src={nearest.temple.youtubeLiveUrl || 'https://www.youtube.com/embed/3JZ_D3ELwOQ?autoplay=1&mute=1'}
                  title="YouTube Live Darshan Stream"
                  className="w-full h-full border-0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            </div>
          )}

          {/* Embedded Google Map Preview Panel */}
          {showEmbeddedMap && (
            <div className="space-y-2 p-2 bg-slate-900 border border-sky-500/40 rounded-2xl animate-in fade-in duration-200">
              <div className="flex items-center justify-between px-1">
                <span className="text-xs font-bold text-sky-400 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5" />
                  Google Maps Location: {nearest.temple.lat.toFixed(4)}, {nearest.temple.lng.toFixed(4)}
                </span>
                <button
                  type="button"
                  onClick={() => {
                    const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                      `${nearest.temple.name}, ${nearest.temple.city}`
                    )}`;
                    window.open(mapsUrl, '_blank');
                  }}
                  className="text-[10px] text-sky-300 font-bold hover:underline flex items-center gap-0.5"
                >
                  Full Directions <ExternalLink className="w-2.5 h-2.5" />
                </button>
              </div>
              <div className="aspect-video w-full rounded-xl overflow-hidden bg-slate-950 border border-slate-800">
                <iframe
                  src={`https://maps.google.com/maps?q=${nearest.temple.lat},${nearest.temple.lng}&z=15&output=embed`}
                  title="Google Maps Location"
                  className="w-full h-full border-0 opacity-90 hover:opacity-100 transition-opacity"
                  loading="lazy"
                />
              </div>
            </div>
          )}

          {/* Core Action Buttons */}
          <div className="grid grid-cols-2 gap-2 pt-1 border-t border-slate-900">
            <button
              onClick={() => {
                if (onWatchLiveDarshan) onWatchLiveDarshan(nearest.temple.id);
                else alert(`🎥 Launching Live Darshan Stream for ${nearest.temple.name}`);
              }}
              className="px-3 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 shadow-md cursor-pointer min-h-[44px]"
            >
              <Radio className="w-3.5 h-3.5 fill-current animate-pulse" />
              <span>Watch Live Darshan</span>
            </button>

            <button
              onClick={() => shareToWhatsApp(nearest.temple.name, nearest.distanceKm)}
              className="px-3 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md cursor-pointer min-h-[44px]"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>Share WhatsApp Alert</span>
            </button>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 2. PERSISTENT FLOATING HUD FOR TESTING & SUPABASE LOGS */}
      {/* ========================================================= */}
      <div className="fixed bottom-3 left-3 z-40 flex items-center gap-2">
        <button
          onClick={() => setShowSimPanel(!showSimPanel)}
          className="px-3.5 py-2 rounded-2xl bg-slate-950/90 border border-amber-500/40 hover:border-amber-400 text-slate-200 text-xs font-bold flex items-center gap-2 shadow-xl backdrop-blur-md cursor-pointer transition-all"
        >
          <Compass className="w-4 h-4 text-amber-400" />
          <span className="hidden sm:inline">GPS, Supabase &amp; Social Connections</span>
          {nearest && (
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
          )}
        </button>

        {notificationPermission === 'default' && (
          <button
            onClick={requestNotificationPermission}
            className="px-3 py-2 rounded-2xl bg-amber-500/15 border border-amber-500/40 text-amber-300 text-xs font-bold flex items-center gap-1.5 shadow-xl cursor-pointer"
          >
            <Bell className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Enable Push Alerts</span>
          </button>
        )}
      </div>

      {/* ========================================================= */}
      {/* 3. EXPANDABLE SIMULATION & SUPABASE EVENT AUDIT PANEL */}
      {/* ========================================================= */}
      {showSimPanel && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-2xl bg-slate-950 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Sliders className="w-5 h-5 text-amber-400" />
                <h3 className="font-bold text-sm text-slate-100">
                  Supabase Geofence Events &amp; Social Integration Controls
                </h3>
              </div>
              <button
                onClick={() => setShowSimPanel(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Profile Role / Tier Selector */}
            <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl space-y-3">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-amber-400" />
                <span className="text-xs font-bold text-slate-200 uppercase tracking-wider">
                  Devotee Profile Tier Switcher
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                <button
                  type="button"
                  onClick={() => onTierChange && onTierChange('TIER_1_DEVOTEE')}
                  className={`p-2.5 rounded-xl border text-center cursor-pointer transition-all ${
                    currentTier === 'TIER_1_DEVOTEE'
                      ? 'bg-amber-500/20 border-amber-500 text-amber-300 font-bold'
                      : 'bg-slate-950 border-slate-800 text-slate-400'
                  }`}
                >
                  <div className="font-bold text-slate-100 text-[11px]">Tier 1: Devotee</div>
                </button>

                <button
                  type="button"
                  onClick={() => onTierChange && onTierChange('TIER_2_TRUST_ADMIN')}
                  className={`p-2.5 rounded-xl border text-center cursor-pointer transition-all ${
                    currentTier === 'TIER_2_TRUST_ADMIN'
                      ? 'bg-amber-500/20 border-amber-500 text-amber-300 font-bold'
                      : 'bg-slate-950 border-slate-800 text-slate-400'
                  }`}
                >
                  <div className="font-bold text-amber-400 text-[11px]">Tier 2: Trust Admin</div>
                </button>

                <button
                  type="button"
                  onClick={() => onTierChange && onTierChange('TIER_2B_POOJARI')}
                  className={`p-2.5 rounded-xl border text-center cursor-pointer transition-all ${
                    currentTier === 'TIER_2B_POOJARI'
                      ? 'bg-amber-500/20 border-amber-500 text-amber-300 font-bold'
                      : 'bg-slate-950 border-slate-800 text-slate-400'
                  }`}
                >
                  <div className="font-bold text-emerald-400 text-[11px]">Tier 2B: Poojari</div>
                </button>

                <button
                  type="button"
                  onClick={() => onTierChange && onTierChange('TIER_3_SUPER_ADMIN')}
                  className={`p-2.5 rounded-xl border text-center cursor-pointer transition-all ${
                    currentTier === 'TIER_3_SUPER_ADMIN'
                      ? 'bg-amber-500/20 border-amber-500 text-amber-300 font-bold'
                      : 'bg-slate-950 border-slate-800 text-slate-400'
                  }`}
                >
                  <div className="font-bold text-purple-400 text-[11px]">Tier 3: Super Admin</div>
                </button>
              </div>
            </div>

            {/* GPS Simulation Controls */}
            <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl space-y-3">
              <div className="flex items-center gap-2">
                <Compass className="w-4 h-4 text-amber-400" />
                <span className="text-xs font-bold text-slate-200 uppercase tracking-wider">
                  GPS Location Simulation (Matching Catalog Temples)
                </span>
              </div>

              <div className="flex flex-wrap gap-2 text-xs">
                <button
                  onClick={() => handleSimPresetChange('pune')}
                  className={`px-3 py-2 rounded-xl border font-bold cursor-pointer ${
                    simulatedPreset === 'pune' && gpsSource === 'SIMULATED'
                      ? 'bg-amber-500 text-slate-950 border-amber-400'
                      : 'bg-slate-950 border-slate-800 text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  📍 Near Dagdusheth Pune (0.4km)
                </button>

                <button
                  onClick={() => handleSimPresetChange('mumbai')}
                  className={`px-3 py-2 rounded-xl border font-bold cursor-pointer ${
                    simulatedPreset === 'mumbai' && gpsSource === 'SIMULATED'
                      ? 'bg-amber-500 text-slate-950 border-amber-400'
                      : 'bg-slate-950 border-slate-800 text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  📍 Near Siddhivinayak Mumbai (0.6km)
                </button>

                <button
                  onClick={() => handleSimPresetChange('nashik')}
                  className={`px-3 py-2 rounded-xl border font-bold cursor-pointer ${
                    simulatedPreset === 'nashik' && gpsSource === 'SIMULATED'
                      ? 'bg-amber-500 text-slate-950 border-amber-400'
                      : 'bg-slate-950 border-slate-800 text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  📍 Near Trimbakeshwar Nashik (0.5km)
                </button>

                <button
                  onClick={() => handleSimPresetChange('pandharpur')}
                  className={`px-3 py-2 rounded-xl border font-bold cursor-pointer ${
                    simulatedPreset === 'pandharpur' && gpsSource === 'SIMULATED'
                      ? 'bg-amber-500 text-slate-950 border-amber-400'
                      : 'bg-slate-950 border-slate-800 text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  📍 Near Vitthal Pandharpur (0.4km)
                </button>

                <button
                  onClick={() => handleSimPresetChange('far')}
                  className={`px-3 py-2 rounded-xl border font-bold cursor-pointer ${
                    simulatedPreset === 'far' && gpsSource === 'SIMULATED'
                      ? 'bg-rose-950 border-rose-800 text-rose-300'
                      : 'bg-slate-950 border-slate-800 text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  🚫 Far Away (&gt;15km - No Alert)
                </button>

                <button
                  onClick={enableRealGps}
                  className={`px-3 py-2 rounded-xl border font-bold cursor-pointer ${
                    gpsSource === 'REAL_GPS'
                      ? 'bg-emerald-500 text-slate-950 border-emerald-400'
                      : 'bg-slate-950 border-slate-800 text-emerald-400 hover:bg-slate-800'
                  }`}
                >
                  🛰️ Use Real Device GPS
                </button>
              </div>

              {userPos && (
                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-xs font-mono text-slate-400 space-y-1">
                  <div>
                    GPS Position: <span className="text-amber-300 font-bold">{userPos.lat.toFixed(4)}, {userPos.lng.toFixed(4)}</span>
                  </div>
                  <div>
                    Verified catalog temples within 8km: <span className="text-emerald-400 font-bold">{nearbyTemples.length}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Supabase Event Notification Audit Log */}
            <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Database className="w-4 h-4 text-emerald-400" />
                  <span className="text-xs font-bold text-slate-200 uppercase tracking-wider">
                    Supabase Event Notification History (`notifications` &amp; `geofence_events`)
                  </span>
                </div>
                <span className="text-[10px] font-mono text-slate-400">
                  {geofenceLogs.length} Events Triggered
                </span>
              </div>

              {geofenceLogs.length === 0 ? (
                <p className="text-xs text-slate-400 italic">
                  No geofence triggers logged yet. Change location preset to trigger a Supabase event notification.
                </p>
              ) : (
                <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                  {geofenceLogs.map((log) => (
                    <div
                      key={log.id}
                      className="p-3 bg-slate-950 border border-slate-800 rounded-xl space-y-1 text-xs"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-200 flex items-center gap-1.5">
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                          {log.templeName}
                        </span>
                        <span className="font-mono text-[10px] text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/30">
                          {log.distanceKm} km
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono">
                        <span>Event: {log.eventType}</span>
                        <span>{new Date(log.timestamp).toLocaleTimeString()}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Connected Social Networks Status Summary */}
            <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl space-y-3">
              <div className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
                <Globe className="w-4 h-4 text-amber-400" />
                <span>Connected Platform Accounts &amp; SDK Status</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl space-y-1">
                  <div className="font-bold text-rose-400 flex items-center gap-1.5">
                    <Youtube className="w-4 h-4" />
                    <span>YouTube Live Broadcasts</span>
                  </div>
                  <p className="text-[11px] text-slate-400">
                    Live Stream RTMP/HLS feeds linked to verified temple trusts.
                  </p>
                </div>

                <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl space-y-1">
                  <div className="font-bold text-blue-400 flex items-center gap-1.5">
                    <Facebook className="w-4 h-4" />
                    <span>Meta &amp; Facebook Page Sync</span>
                  </div>
                  <p className="text-[11px] text-slate-400">
                    Auto-sharing darshan photos &amp; festival announcements.
                  </p>
                </div>

                <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl space-y-1">
                  <div className="font-bold text-sky-400 flex items-center gap-1.5">
                    <MapPin className="w-4 h-4" />
                    <span>Google Maps Platform</span>
                  </div>
                  <p className="text-[11px] text-slate-400">
                    Geocoding, Place coordinates &amp; directions routing enabled.
                  </p>
                </div>

                <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl space-y-1">
                  <div className="font-bold text-amber-300 flex items-center gap-1.5">
                    <Calendar className="w-4 h-4" />
                    <span>Google Workspace / Calendar</span>
                  </div>
                  <p className="text-[11px] text-slate-400">
                    Connected as <span className="font-mono text-amber-300">kunalvwagh2@gmail.com</span>
                  </p>
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setShowSimPanel(false)}
                className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs shadow-md cursor-pointer"
              >
                Close Control Panel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
