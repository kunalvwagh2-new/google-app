// Supabase Jaap Mala Service with Graceful LocalStorage Fallback
// Provides fault-tolerant persistence for jaap_goals, jaap_reminders, and jaap_logs

export interface JaapGoal {
  period: 'daily' | 'weekly' | 'monthly' | 'yearly';
  targetMalas: number;
  completedMalas: number;
  targetBeads: number;
  completedBeads: number;
}

export interface JaapReminder {
  id: string;
  timeOfDay: string; // "06:00"
  label: string; // "Brahma Muhurta Sadhana"
  daysOfWeek: string[];
  isEnabled: boolean;
  mantra?: string;
}

export interface JaapSessionLog {
  id: string;
  userId: string;
  mantraName: string;
  deityName: string;
  beadsCount: number;
  malasCompleted: number;
  durationSeconds: number;
  timestamp: string;
}

const STORAGE_KEYS = {
  GOALS: 'anant_jaap_goals_v2',
  REMINDERS: 'anant_jaap_reminders_v2',
  LOGS: 'anant_jaap_logs_v2',
};

const DEFAULT_GOALS: Record<string, JaapGoal> = {
  daily: { period: 'daily', targetMalas: 4, completedMalas: 3, targetBeads: 432, completedBeads: 324 },
  weekly: { period: 'weekly', targetMalas: 28, completedMalas: 18, targetBeads: 3024, completedBeads: 1944 },
  monthly: { period: 'monthly', targetMalas: 108, completedMalas: 64, targetBeads: 11664, completedBeads: 6912 },
  yearly: { period: 'yearly', targetMalas: 1008, completedMalas: 430, targetBeads: 108864, completedBeads: 46440 },
};

const DEFAULT_REMINDERS: JaapReminder[] = [
  {
    id: 'rem_1',
    timeOfDay: '06:00',
    label: 'Brahma Muhurta Sadhana',
    daysOfWeek: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    isEnabled: true,
    mantra: 'Hare Krishna Maha Mantra',
  },
  {
    id: 'rem_2',
    timeOfDay: '18:30',
    label: 'Sandhya Aarti & Japa',
    daysOfWeek: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    isEnabled: true,
    mantra: 'Om Namah Shivaya',
  },
];

// Helper to get stored goals
export function getLocalJaapGoals(): Record<string, JaapGoal> {
  if (typeof window === 'undefined') return DEFAULT_GOALS;
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.GOALS);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.warn('[JaapService] Failed to read goals from localStorage', e);
  }
  return DEFAULT_GOALS;
}

// Helper to save goals
export function saveLocalJaapGoals(goals: Record<string, JaapGoal>): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEYS.GOALS, JSON.stringify(goals));
  } catch (e) {
    console.warn('[JaapService] Failed to save goals to localStorage', e);
  }
}

// Helper to get reminders
export function getLocalJaapReminders(): JaapReminder[] {
  if (typeof window === 'undefined') return DEFAULT_REMINDERS;
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.REMINDERS);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.warn('[JaapService] Failed to read reminders from localStorage', e);
  }
  return DEFAULT_REMINDERS;
}

// Helper to save reminders
export function saveLocalJaapReminders(reminders: JaapReminder[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEYS.REMINDERS, JSON.stringify(reminders));
  } catch (e) {
    console.warn('[JaapService] Failed to save reminders to localStorage', e);
  }
}

// Helper to get logs
export function getLocalJaapLogs(): JaapSessionLog[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.LOGS);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.warn('[JaapService] Failed to read logs from localStorage', e);
  }
  return [];
}

// Log a completed session
export async function logJaapSession(
  userId: string,
  logData: Omit<JaapSessionLog, 'id' | 'timestamp' | 'userId'>
): Promise<JaapSessionLog> {
  const newLog: JaapSessionLog = {
    id: `log_${Date.now().toString(36)}_${Math.random().toString(36).substring(2, 6)}`,
    userId: userId || 'anonymous_devotee',
    ...logData,
    timestamp: new Date().toISOString(),
  };

  // 1. Update localStorage logs
  if (typeof window !== 'undefined') {
    try {
      const existing = getLocalJaapLogs();
      const updated = [newLog, ...existing].slice(0, 100);
      localStorage.setItem(STORAGE_KEYS.LOGS, JSON.stringify(updated));

      // 2. Increment completed count in goals
      const goals = getLocalJaapGoals();
      if (goals.daily) {
        goals.daily.completedMalas += logData.malasCompleted;
        goals.daily.completedBeads += logData.beadsCount;
      }
      if (goals.weekly) {
        goals.weekly.completedMalas += logData.malasCompleted;
        goals.weekly.completedBeads += logData.beadsCount;
      }
      if (goals.monthly) {
        goals.monthly.completedMalas += logData.malasCompleted;
        goals.monthly.completedBeads += logData.beadsCount;
      }
      if (goals.yearly) {
        goals.yearly.completedMalas += logData.malasCompleted;
        goals.yearly.completedBeads += logData.beadsCount;
      }
      saveLocalJaapGoals(goals);
    } catch (e) {
      console.warn('[JaapService] Failed to log session locally', e);
    }
  }

  // 3. Attempt async Supabase sync if client is available
  try {
    const supabaseUrl = (typeof process !== 'undefined' && process.env?.NEXT_PUBLIC_SUPABASE_URL) || '';
    if (supabaseUrl && !supabaseUrl.includes('mock-supabase')) {
      // In a real deployed Supabase environment, post to REST endpoint
      await fetch(`${supabaseUrl}/rest/v1/jaap_logs`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: newLog.userId,
          mantra_name: newLog.mantraName,
          deity_name: newLog.deityName,
          beads_count: newLog.beadsCount,
          malas_completed: newLog.malasCompleted,
          duration_seconds: newLog.durationSeconds,
        }),
      });
    }
  } catch {
    // Supabase network failure is gracefully absorbed
  }

  return newLog;
}
