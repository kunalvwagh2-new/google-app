-- Migration 001: Initial Schema for Modern Social Media Platform
-- Database: PostgreSQL 14+
-- Generated for Production Deployment

BEGIN;

-- 1. Extensions
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "citext";

-- 2. Custom Types & Enumerations
DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_role') THEN
        CREATE TYPE user_role AS ENUM ('USER', 'VERIFIED_CREATOR', 'MODERATOR', 'ADMIN');
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_status') THEN
        CREATE TYPE user_status AS ENUM ('ACTIVE', 'SUSPENDED', 'BANNED', 'DEACTIVATED');
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'friendship_status') THEN
        CREATE TYPE friendship_status AS ENUM ('PENDING', 'ACCEPTED', 'DECLINED', 'BLOCKED');
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'post_visibility') THEN
        CREATE TYPE post_visibility AS ENUM ('PUBLIC', 'FRIENDS_ONLY', 'PRIVATE');
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'reaction_type') THEN
        CREATE TYPE reaction_type AS ENUM ('LIKE', 'LOVE', 'HAHA', 'WOW', 'SAD', 'ANGRY');
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'notification_type') THEN
        CREATE TYPE notification_type AS ENUM (
            'FRIEND_REQUEST',
            'FRIEND_ACCEPT',
            'POST_REACTION',
            'POST_COMMENT',
            'COMMENT_REPLY',
            'MENTION'
        );
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'report_status') THEN
        CREATE TYPE report_status AS ENUM ('OPEN', 'INVESTIGATING', 'RESOLVED', 'DISMISSED');
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'report_target_type') THEN
        CREATE TYPE report_target_type AS ENUM ('POST', 'COMMENT', 'USER');
    END IF;
END $$;

-- 3. Trigger Function: Automatically Update updated_at Timestamps
CREATE OR REPLACE FUNCTION trigger_set_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 4. Users Table (Core Identity & Auth)
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    username CITEXT UNIQUE NOT NULL,
    email CITEXT UNIQUE NOT NULL,
    password_hash VARCHAR(255),
    role user_role DEFAULT 'USER' NOT NULL,
    status user_status DEFAULT 'ACTIVE' NOT NULL,
    email_verified BOOLEAN DEFAULT FALSE NOT NULL,
    last_login_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    CONSTRAINT username_length_check CHECK (char_length(username) >= 3 AND char_length(username) <= 30),
    CONSTRAINT username_valid_chars CHECK (username ~ '^[a-zA-Z0-9_.]+$')
);

CREATE TRIGGER set_timestamp_users
    BEFORE UPDATE ON users
    FOR EACH ROW
    EXECUTE FUNCTION trigger_set_timestamp();

-- 5. User Profiles Table (Public Profile Data & Aggregated Counters)
CREATE TABLE IF NOT EXISTS user_profiles (
    user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    display_name VARCHAR(60) NOT NULL,
    bio VARCHAR(280),
    avatar_url TEXT,
    cover_url TEXT,
    location VARCHAR(100),
    website_url TEXT,
    birth_date DATE,
    friends_count INT DEFAULT 0 NOT NULL CHECK (friends_count >= 0),
    posts_count INT DEFAULT 0 NOT NULL CHECK (posts_count >= 0),
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE TRIGGER set_timestamp_user_profiles
    BEFORE UPDATE ON user_profiles
    FOR EACH ROW
    EXECUTE FUNCTION trigger_set_timestamp();

-- 6. Friendships Table (Bidirectional Relationship Graph)
CREATE TABLE IF NOT EXISTS friendships (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    requester_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    addressee_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    status friendship_status DEFAULT 'PENDING' NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    CONSTRAINT unique_friendship_pair UNIQUE (requester_id, addressee_id),
    CONSTRAINT cannot_friend_self CHECK (requester_id != addressee_id)
);

CREATE TRIGGER set_timestamp_friendships
    BEFORE UPDATE ON friendships
    FOR EACH ROW
    EXECUTE FUNCTION trigger_set_timestamp();

-- 7. Posts Table
CREATE TABLE IF NOT EXISTS posts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    author_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    content TEXT,
    media_urls TEXT[] DEFAULT '{}' NOT NULL,
    link_preview JSONB,
    visibility post_visibility DEFAULT 'FRIENDS_ONLY' NOT NULL,
    reactions_count INT DEFAULT 0 NOT NULL CHECK (reactions_count >= 0),
    comments_count INT DEFAULT 0 NOT NULL CHECK (comments_count >= 0),
    shares_count INT DEFAULT 0 NOT NULL CHECK (shares_count >= 0),
    is_pinned BOOLEAN DEFAULT FALSE NOT NULL,
    search_vector TSVECTOR GENERATED ALWAYS AS (to_tsvector('english', coalesce(content, ''))) STORED,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    CONSTRAINT content_or_media_present CHECK (
        (content IS NOT NULL AND trim(content) <> '') OR
        (cardinality(media_urls) > 0) OR
        (link_preview IS NOT NULL)
    )
);

CREATE TRIGGER set_timestamp_posts
    BEFORE UPDATE ON posts
    FOR EACH ROW
    EXECUTE FUNCTION trigger_set_timestamp();

-- 8. Post Reactions Table
CREATE TABLE IF NOT EXISTS post_reactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    post_id UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    type reaction_type DEFAULT 'LIKE' NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    CONSTRAINT unique_post_user_reaction UNIQUE (post_id, user_id)
);

-- 9. Comments Table (Single-Depth / Multi-Level Tree Hierarchy)
CREATE TABLE IF NOT EXISTS comments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    post_id UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
    author_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    parent_comment_id UUID REFERENCES comments(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    reactions_count INT DEFAULT 0 NOT NULL CHECK (reactions_count >= 0),
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    CONSTRAINT comment_not_empty CHECK (trim(content) <> '')
);

CREATE TRIGGER set_timestamp_comments
    BEFORE UPDATE ON comments
    FOR EACH ROW
    EXECUTE FUNCTION trigger_set_timestamp();

-- 10. Comment Reactions Table
CREATE TABLE IF NOT EXISTS comment_reactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    comment_id UUID NOT NULL REFERENCES comments(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    type reaction_type DEFAULT 'LIKE' NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    CONSTRAINT unique_comment_user_reaction UNIQUE (comment_id, user_id)
);

-- 11. Notifications Table
CREATE TABLE IF NOT EXISTS notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    recipient_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    actor_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    type notification_type NOT NULL,
    entity_id UUID,
    is_read BOOLEAN DEFAULT FALSE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 12. Content Moderation & Reports Table
CREATE TABLE IF NOT EXISTS reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    reporter_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    target_type report_target_type NOT NULL,
    target_id UUID NOT NULL,
    reason VARCHAR(80) NOT NULL,
    details TEXT,
    status report_status DEFAULT 'OPEN' NOT NULL,
    reviewed_by UUID REFERENCES users(id) ON DELETE SET NULL,
    resolution_notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE TRIGGER set_timestamp_reports
    BEFORE UPDATE ON reports
    FOR EACH ROW
    EXECUTE FUNCTION trigger_set_timestamp();

-- 13. Counter Synchronization Triggers
-- (Keeps posts_count, reactions_count, and comments_count consistent in high-volume traffic)

-- Post counter on User Profile
CREATE OR REPLACE FUNCTION update_user_post_count()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE user_profiles SET posts_count = posts_count + 1 WHERE user_id = NEW.author_id;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE user_profiles SET posts_count = GREATEST(posts_count - 1, 0) WHERE user_id = OLD.author_id;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_user_post_count
AFTER INSERT OR DELETE ON posts
FOR EACH ROW EXECUTE FUNCTION update_user_post_count();

-- Reactions count on Posts
CREATE OR REPLACE FUNCTION update_post_reaction_count()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE posts SET reactions_count = reactions_count + 1 WHERE id = NEW.post_id;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE posts SET reactions_count = GREATEST(reactions_count - 1, 0) WHERE id = OLD.post_id;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_post_reaction_count
AFTER INSERT OR DELETE ON post_reactions
FOR EACH ROW EXECUTE FUNCTION update_post_reaction_count();

-- Comments count on Posts
CREATE OR REPLACE FUNCTION update_post_comment_count()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE posts SET comments_count = comments_count + 1 WHERE id = NEW.post_id;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE posts SET comments_count = GREATEST(comments_count - 1, 0) WHERE id = OLD.post_id;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_post_comment_count
AFTER INSERT OR DELETE ON comments
FOR EACH ROW EXECUTE FUNCTION update_post_comment_count();

-- 14. Performance Indices
-- Users & Profiles
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);
CREATE INDEX IF NOT EXISTS idx_users_role_status ON users(role, status);
CREATE INDEX IF NOT EXISTS idx_profiles_display_name ON user_profiles(display_name);

-- Friendships (Covering queries for bidirectional lookups)
CREATE INDEX IF NOT EXISTS idx_friendships_requester_status ON friendships(requester_id, status) INCLUDE (addressee_id);
CREATE INDEX IF NOT EXISTS idx_friendships_addressee_status ON friendships(addressee_id, status) INCLUDE (requester_id);
CREATE INDEX IF NOT EXISTS idx_friendships_pending ON friendships(addressee_id) WHERE status = 'PENDING';

-- Posts (Core newsfeed query optimization)
CREATE INDEX IF NOT EXISTS idx_posts_author_created ON posts(author_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_posts_visibility_created ON posts(visibility, created_at DESC) WHERE visibility = 'PUBLIC';
CREATE INDEX IF NOT EXISTS idx_posts_search_vector ON posts USING GIN(search_vector);
CREATE INDEX IF NOT EXISTS idx_posts_created_at_desc ON posts(created_at DESC);

-- Reactions & Comments
CREATE INDEX IF NOT EXISTS idx_post_reactions_post_user ON post_reactions(post_id, user_id);
CREATE INDEX IF NOT EXISTS idx_post_reactions_user ON post_reactions(user_id);
CREATE INDEX IF NOT EXISTS idx_comments_post_thread ON comments(post_id, parent_comment_id, created_at ASC);
CREATE INDEX IF NOT EXISTS idx_comments_author ON comments(author_id);
CREATE INDEX IF NOT EXISTS idx_comment_reactions_comment ON comment_reactions(comment_id);

-- Notifications
CREATE INDEX IF NOT EXISTS idx_notifications_recipient_unread ON notifications(recipient_id, created_at DESC) WHERE is_read = FALSE;
CREATE INDEX IF NOT EXISTS idx_notifications_recipient_all ON notifications(recipient_id, created_at DESC);

-- Reports & Moderation
CREATE INDEX IF NOT EXISTS idx_reports_status_created ON reports(status, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_reports_target ON reports(target_type, target_id);

COMMIT;
