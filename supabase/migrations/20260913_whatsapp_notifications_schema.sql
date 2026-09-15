-- =========================================================================
-- ANANT (अनंत) WHATSAPP NOTIFICATIONS & TEMPLE FOLLOWERS SCHEMA
-- =========================================================================

-- 1. Temple Followers Table
CREATE TABLE IF NOT EXISTS public.temple_followers (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  tenant_id TEXT NOT NULL,
  whatsapp_opt_in BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT unique_user_tenant_follow UNIQUE (user_id, tenant_id)
);

CREATE INDEX IF NOT EXISTS idx_temple_followers_tenant ON public.temple_followers(tenant_id);
CREATE INDEX IF NOT EXISTS idx_temple_followers_user ON public.temple_followers(user_id);

-- 2. Notification Preferences Table
CREATE TABLE IF NOT EXISTS public.notification_preferences (
  id TEXT PRIMARY KEY,
  user_id TEXT UNIQUE NOT NULL,
  events_alert BOOLEAN DEFAULT TRUE,
  live_darshan_alert BOOLEAN DEFAULT TRUE,
  poojari_slots_alert BOOLEAN DEFAULT TRUE,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_notification_prefs_user ON public.notification_preferences(user_id);

-- Enable RLS
ALTER TABLE public.temple_followers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notification_preferences ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Followers viewable by everyone" ON public.temple_followers FOR SELECT USING (true);
CREATE POLICY "Users manage own follows" ON public.temple_followers FOR ALL USING (true);
CREATE POLICY "Preferences viewable by owner" ON public.notification_preferences FOR ALL USING (true);
