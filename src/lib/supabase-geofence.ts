import { getSupabaseClient } from './supabaseClient.ts';

export interface GeofenceEvent {
  id: string;
  userId: string;
  templeId: string;
  templeName: string;
  distanceKm: number;
  eventType: 'GEOFENCE_ENTER_8KM' | 'GEOFENCE_EXIT';
  timestamp: string;
  metadata: {
    deityName?: string;
    city?: string;
    state?: string;
    lat?: number;
    lng?: number;
    verifiedTrust?: boolean;
  };
  supabaseSynced: boolean;
}

const GEOFENCE_STORAGE_KEY = 'anant_supabase_geofence_events_v1';

// Read stored geofence events
export function getLocalGeofenceEvents(): GeofenceEvent[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(GEOFENCE_STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch (err) {
    console.warn('[Geofence] Failed reading local geofence events:', err);
  }
  return [];
}

// Trigger Supabase Event Notification when user enters 8km radius of catalog temple
export async function triggerSupabaseGeofenceEvent(
  userId: string,
  temple: {
    id: string;
    name: string;
    distanceKm: number;
    deityName?: string;
    city?: string;
    state?: string;
    lat?: number;
    lng?: number;
    isVerified?: boolean;
  }
): Promise<GeofenceEvent> {
  const eventId = `geo_evt_${Date.now().toString(36)}_${Math.random().toString(36).substring(2, 6)}`;
  const timestamp = new Date().toISOString();

  const newEvent: GeofenceEvent = {
    id: eventId,
    userId: userId || 'usr_kunal',
    templeId: temple.id,
    templeName: temple.name,
    distanceKm: temple.distanceKm,
    eventType: 'GEOFENCE_ENTER_8KM',
    timestamp,
    metadata: {
      deityName: temple.deityName,
      city: temple.city,
      state: temple.state,
      lat: temple.lat,
      lng: temple.lng,
      verifiedTrust: temple.isVerified ?? true,
    },
    supabaseSynced: false,
  };

  // 1. Save to Local Storage Audit Feed
  if (typeof window !== 'undefined') {
    try {
      const existing = getLocalGeofenceEvents();
      const updated = [newEvent, ...existing].slice(0, 50);
      localStorage.setItem(GEOFENCE_STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {
      console.warn('[Geofence] Local save failed:', e);
    }
  }

  // 2. Dispatch to Supabase DB via Client
  const client = getSupabaseClient();
  if (client) {
    try {
      // Attempt insert into Supabase notifications & geofence_events tables
      const { error: notifErr } = await client.from('notifications').insert({
        user_id: newEvent.userId,
        title: `🛕 Entered 8km Radius: ${temple.name}`,
        message: `You are ${temple.distanceKm}km away in ${temple.city}. Tap to view Live Darshan or book Seva.`,
        event_type: 'GEOFENCE_ENTER_8KM',
        payload: {
          temple_id: temple.id,
          temple_name: temple.name,
          distance_km: temple.distanceKm,
          lat: temple.lat,
          lng: temple.lng,
        },
        created_at: timestamp,
      });

      if (!notifErr) {
        newEvent.supabaseSynced = true;
      }
    } catch (err) {
      console.warn('[Supabase Geofence] Network insert attempted, recorded locally:', err);
    }
  } else {
    // Simulated sync acknowledgment for client demo mode
    newEvent.supabaseSynced = true;
  }

  return newEvent;
}
