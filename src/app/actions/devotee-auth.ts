'use server';

import { supabase } from '../../lib/supabaseClient';

export async function sendOtpAction(phoneNumber: string, countryCode: string = '+91') {
  const cleanPhone = `${countryCode} ${phoneNumber.trim()}`;
  if (!phoneNumber || phoneNumber.length < 10) {
    return { success: false, error: 'Please enter a valid 10-digit mobile number.' };
  }

  try {
    // In production with Supabase Auth:
    // const { error } = await supabase.auth.signInWithOtp({ phone: cleanPhone });
    // if (error) throw error;

    // Simulated OTP dispatch for preview / demo sandbox
    console.log(`[DevoteeAuth] OTP sent successfully to ${cleanPhone}`);
    return {
      success: true,
      message: `OTP sent successfully to ${cleanPhone}. Use 123456 for demo verification.`,
    };
  } catch (err: any) {
    return { success: false, error: err.message || 'Failed to send OTP.' };
  }
}

export async function verifyOtpAndLoginAction(
  phoneNumber: string,
  otpCode: string,
  fullName?: string,
  preferredLanguage: string = 'MR',
  guestData?: any
) {
  if (otpCode !== '123456' && otpCode !== '000000') {
    return { success: false, error: 'Invalid OTP code. Please enter 123456 for demo login.' };
  }

  try {
    const userId = `devotee_${Date.now()}`;
    const userEmail = `${phoneNumber.replace(/\D/g, '')}@anant.devotee.org`;

    // 1. Create or upsert profile in Supabase public.profiles table
    const profilePayload = {
      id: userId,
      phone_number: phoneNumber,
      full_name: fullName || 'Verified Devotee',
      email: userEmail,
      preferred_language: preferredLanguage,
      streak_days: 1,
      total_malas_completed: guestData?.totalMalas || 0,
      updated_at: new Date().toISOString(),
    };

    // Attempt Supabase upsert
    try {
      if (supabase && typeof supabase.from === 'function') {
        await supabase.from('profiles').upsert(profilePayload);
      }
    } catch (dbErr) {
      console.warn('[DevoteeAuth] Supabase profile upsert warning (using local fallback):', dbErr);
    }

    // 2. Sync guest localStorage data if present
    if (guestData && typeof window !== 'undefined') {
      try {
        const localLogs = localStorage.getItem('anant_jaap_logs_v2');
        if (localLogs) {
          const parsed = JSON.parse(localLogs);
          // Sync guest logs to Supabase jaap_sessions table
          for (const log of parsed) {
            await supabase.from('jaap_sessions').insert({
              user_id: userId,
              mantra_name: log.mantraName,
              deity_name: log.deityName,
              beads_count: log.beadsCount,
              malas_completed: log.malasCompleted,
              duration_seconds: log.durationSeconds,
            });
          }
        }
      } catch (syncErr) {
        console.warn('[DevoteeAuth] Guest data sync warning:', syncErr);
      }
    }

    return {
      success: true,
      data: {
        user: {
          id: userId,
          email: userEmail,
          phone: phoneNumber,
          user_metadata: {
            full_name: fullName || 'Verified Devotee',
            preferred_language: preferredLanguage,
            avatar_url: 'https://images.unsplash.com/photo-1544816155-12df9643f363?w=200&auto=format&fit=crop&q=80',
          },
        },
        session: {
          access_token: `mock_jwt_token_${userId}`,
        },
      },
    };
  } catch (err: any) {
    return { success: false, error: err.message || 'Authentication failed.' };
  }
}
