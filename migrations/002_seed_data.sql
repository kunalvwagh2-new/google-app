-- Migration 002: Seed Data for Testing & Development
-- Database: PostgreSQL 14+

BEGIN;

-- 1. Insert Seed Users (Passwords: 'Password123!' hashed with bcrypt format for test purposes)
INSERT INTO users (id, username, email, password_hash, role, status, email_verified)
VALUES
    ('a0000000-0000-0000-0000-000000000001', 'alex_rivers', 'alex@example.com', '$2a$10$abcdef1234567890abcdef1234567890abcdef1234567890abcdef', 'ADMIN', 'ACTIVE', true),
    ('a0000000-0000-0000-0000-000000000002', 'sarah_chen', 'sarah@example.com', '$2a$10$abcdef1234567890abcdef1234567890abcdef1234567890abcdef', 'VERIFIED_CREATOR', 'ACTIVE', true),
    ('a0000000-0000-0000-0000-000000000003', 'marcus_vance', 'marcus@example.com', '$2a$10$abcdef1234567890abcdef1234567890abcdef1234567890abcdef', 'USER', 'ACTIVE', true),
    ('a0000000-0000-0000-0000-000000000004', 'elena_rostova', 'elena@example.com', '$2a$10$abcdef1234567890abcdef1234567890abcdef1234567890abcdef', 'USER', 'ACTIVE', true),
    ('a0000000-0000-0000-0000-000000000005', 'david_kim', 'david@example.com', '$2a$10$abcdef1234567890abcdef1234567890abcdef1234567890abcdef', 'MODERATOR', 'ACTIVE', true),
    ('a0000000-0000-0000-0000-000000000006', 'spammer_bot', 'bot99@spam.xyz', '$2a$10$abcdef1234567890abcdef1234567890abcdef1234567890abcdef', 'USER', 'SUSPENDED', false)
ON CONFLICT (id) DO NOTHING;

-- 2. Insert User Profiles
INSERT INTO user_profiles (user_id, display_name, bio, avatar_url, cover_url, location, website_url, friends_count, posts_count)
VALUES
    (
        'a0000000-0000-0000-0000-000000000001',
        'Alex Rivers',
        'Staff Infrastructure Architect | Open Source & Distributed Systems Enthusiast',
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&auto=format&fit=crop&q=80',
        'San Francisco, CA',
        'https://alexrivers.dev',
        3,
        2
    ),
    (
        'a0000000-0000-0000-0000-000000000002',
        'Sarah Chen',
        'Product Designer & Photographer. Exploring spatial computing and tactile UI.',
        'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200&auto=format&fit=crop&q=80',
        'Seattle, WA',
        'https://sarahchen.design',
        3,
        2
    ),
    (
        'a0000000-0000-0000-0000-000000000003',
        'Marcus Vance',
        'Running marathons, brewing specialty coffee, and building early-stage tech.',
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1448375240586-882707db888b?w=1200&auto=format&fit=crop&q=80',
        'Austin, TX',
        'https://marcusvance.me',
        2,
        1
    ),
    (
        'a0000000-0000-0000-0000-000000000004',
        'Elena Rostova',
        'Creative writer, indie film lover, and architectural historian.',
        'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=1200&auto=format&fit=crop&q=80',
        'Brooklyn, NY',
        'https://elenarostova.substack.com',
        2,
        1
    ),
    (
        'a0000000-0000-0000-0000-000000000005',
        'David Kim',
        'Community safety, ethical AI, and digital public spaces.',
        'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=1200&auto=format&fit=crop&q=80',
        'Chicago, IL',
        NULL,
        2,
        1
    ),
    (
        'a0000000-0000-0000-0000-000000000006',
        'Spam Bot 99',
        'Get rich quick with guaranteed 500x crypto returns! Click my bio.',
        'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&auto=format&fit=crop&q=80',
        NULL,
        'Unknown',
        'http://phishing-site.example.biz',
        0,
        1
    )
ON CONFLICT (user_id) DO NOTHING;

-- 3. Insert Friendships
INSERT INTO friendships (id, requester_id, addressee_id, status, created_at)
VALUES
    -- Alex & Sarah (Accepted Friends)
    ('b0000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000002', 'ACCEPTED', NOW() - INTERVAL '30 days'),
    -- Alex & Marcus (Accepted Friends)
    ('b0000000-0000-0000-0000-000000000002', 'a0000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000003', 'ACCEPTED', NOW() - INTERVAL '20 days'),
    -- Alex & David (Accepted Friends)
    ('b0000000-0000-0000-0000-000000000003', 'a0000000-0000-0000-0000-000000000005', 'a0000000-0000-0000-0000-000000000001', 'ACCEPTED', NOW() - INTERVAL '15 days'),
    -- Sarah & Elena (Accepted Friends)
    ('b0000000-0000-0000-0000-000000000004', 'a0000000-0000-0000-0000-000000000002', 'a0000000-0000-0000-0000-000000000004', 'ACCEPTED', NOW() - INTERVAL '10 days'),
    -- Marcus & Elena (Accepted Friends)
    ('b0000000-0000-0000-0000-000000000005', 'a0000000-0000-0000-0000-000000000003', 'a0000000-0000-0000-0000-000000000004', 'ACCEPTED', NOW() - INTERVAL '8 days'),
    -- Sarah & David (Accepted Friends)
    ('b0000000-0000-0000-0000-000000000006', 'a0000000-0000-0000-0000-000000000002', 'a0000000-0000-0000-0000-000000000005', 'ACCEPTED', NOW() - INTERVAL '5 days'),
    -- Elena -> Alex (Pending Request from Elena to Alex)
    ('b0000000-0000-0000-0000-000000000007', 'a0000000-0000-0000-0000-000000000004', 'a0000000-0000-0000-0000-000000000001', 'PENDING', NOW() - INTERVAL '1 day')
ON CONFLICT (id) DO NOTHING;

-- 4. Insert Posts
INSERT INTO posts (id, author_id, content, media_urls, link_preview, visibility, reactions_count, comments_count, created_at)
VALUES
    (
        'c0000000-0000-0000-0000-000000000001',
        'a0000000-0000-0000-0000-000000000001',
        'Just finished redesigning our cluster topology to handle multi-region active replication with zero downtime during network partitions. The latency drop is incredible!',
        ARRAY[]::TEXT[],
        '{"title": "Principles of Distributed Consistency", "description": "A deep dive into partition tolerance and monotonic read guarantees.", "url": "https://distributed-systems.org/article", "image": "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&auto=format&fit=crop&q=80"}'::JSONB,
        'PUBLIC',
        3,
        2,
        NOW() - INTERVAL '4 hours'
    ),
    (
        'c0000000-0000-0000-0000-000000000002',
        'a0000000-0000-0000-0000-000000000002',
        'Morning hike along the Pacific Northwest coast. Caught the sunrise piercing through the coastal fog. Nature always provides the best color palettes.',
        ARRAY[
            'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=1000&auto=format&fit=crop&q=80',
            'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=1000&auto=format&fit=crop&q=80'
        ]::TEXT[],
        NULL,
        'PUBLIC',
        4,
        1,
        NOW() - INTERVAL '8 hours'
    ),
    (
        'c0000000-0000-0000-0000-000000000003',
        'a0000000-0000-0000-0000-000000000003',
        '20 miles logged this morning in Austin heat. Preparing for the November marathon. Remember to hydrate and maintain cadence!',
        ARRAY['https://images.unsplash.com/photo-1452626038306-9aae5e071dd3?w=1000&auto=format&fit=crop&q=80']::TEXT[],
        NULL,
        'FRIENDS_ONLY',
        2,
        1,
        NOW() - INTERVAL '1 day'
    ),
    (
        'c0000000-0000-0000-0000-000000000004',
        'a0000000-0000-0000-0000-000000000004',
        'Exploring modernist concrete brutalism in central libraries. There is an honest poetry in unadorned structural honesty.',
        ARRAY['https://images.unsplash.com/photo-1513694203232-719a280e022f?w=1000&auto=format&fit=crop&q=80']::TEXT[],
        NULL,
        'PUBLIC',
        2,
        0,
        NOW() - INTERVAL '2 days'
    ),
    (
        'c0000000-0000-0000-0000-000000000005',
        'a0000000-0000-0000-0000-000000000005',
        'Community reminder: Our new safety transparent guidelines are active. Let us keep discussions constructive, respectful, and evidence-based.',
        ARRAY[]::TEXT[],
        NULL,
        'PUBLIC',
        3,
        1,
        NOW() - INTERVAL '3 days'
    ),
    (
        'c0000000-0000-0000-0000-000000000006',
        'a0000000-0000-0000-0000-000000000006',
        'CLICK HERE NOW TO CLAIM 10,000 FREE TOKENS BEFORE THE AIRDROP CLOSES!',
        ARRAY[]::TEXT[],
        '{"title": "Free Crypto Giveaway", "description": "Connect wallet now", "url": "http://scam-airdrop.xyz"}'::JSONB,
        'PUBLIC',
        0,
        0,
        NOW() - INTERVAL '1 hour'
    )
ON CONFLICT (id) DO NOTHING;

-- 5. Insert Post Reactions
INSERT INTO post_reactions (id, post_id, user_id, type, created_at)
VALUES
    -- Post 1 Reactions
    ('d0000000-0000-0000-0000-000000000001', 'c0000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000002', 'LOVE', NOW() - INTERVAL '3 hours'),
    ('d0000000-0000-0000-0000-000000000002', 'c0000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000003', 'LIKE', NOW() - INTERVAL '2 hours'),
    ('d0000000-0000-0000-0000-000000000003', 'c0000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000005', 'WOW', NOW() - INTERVAL '1 hour'),

    -- Post 2 Reactions (Sarah's photo)
    ('d0000000-0000-0000-0000-000000000004', 'c0000000-0000-0000-0000-000000000002', 'a0000000-0000-0000-0000-000000000001', 'LOVE', NOW() - INTERVAL '7 hours'),
    ('d0000000-0000-0000-0000-000000000005', 'c0000000-0000-0000-0000-000000000002', 'a0000000-0000-0000-0000-000000000004', 'WOW', NOW() - INTERVAL '6 hours'),
    ('d0000000-0000-0000-0000-000000000006', 'c0000000-0000-0000-0000-000000000002', 'a0000000-0000-0000-0000-000000000005', 'LIKE', NOW() - INTERVAL '5 hours'),
    ('d0000000-0000-0000-0000-000000000007', 'c0000000-0000-0000-0000-000000000002', 'a0000000-0000-0000-0000-000000000003', 'LIKE', NOW() - INTERVAL '4 hours'),

    -- Post 3 Reactions (Marcus's run)
    ('d0000000-0000-0000-0000-000000000008', 'c0000000-0000-0000-0000-000000000003', 'a0000000-0000-0000-0000-000000000001', 'LIKE', NOW() - INTERVAL '22 hours'),
    ('d0000000-0000-0000-0000-000000000009', 'c0000000-0000-0000-0000-000000000003', 'a0000000-0000-0000-0000-000000000004', 'LOVE', NOW() - INTERVAL '20 hours')
ON CONFLICT (id) DO NOTHING;

-- 6. Insert Comments (Including Threaded Child Comment)
INSERT INTO comments (id, post_id, author_id, parent_comment_id, content, reactions_count, created_at)
VALUES
    -- Comment on Post 1 (Sarah to Alex)
    (
        'e0000000-0000-0000-0000-000000000001',
        'c0000000-0000-0000-0000-000000000001',
        'a0000000-0000-0000-0000-000000000002',
        NULL,
        'Did you adopt Raft consensus or an optimistic CRDT conflict resolution engine for this setup?',
        1,
        NOW() - INTERVAL '3 hours'
    ),
    -- Threaded Reply to Sarah's Comment (Alex to Sarah)
    (
        'e0000000-0000-0000-0000-000000000002',
        'c0000000-0000-0000-0000-000000000001',
        'a0000000-0000-0000-0000-000000000001',
        'e0000000-0000-0000-0000-000000000001',
        'We opted for state-based CRDTs for the feed queues and Raft for transactional leader lease consensus. Best balance of latency and correctness!',
        2,
        NOW() - INTERVAL '2 hours'
    ),
    -- Comment on Post 2 (Elena to Sarah)
    (
        'e0000000-0000-0000-0000-000000000003',
        'c0000000-0000-0000-0000-000000000002',
        'a0000000-0000-0000-0000-000000000004',
        NULL,
        'The depth of field on that second frame is breathtaking! Which lens focal length did you use?',
        0,
        NOW() - INTERVAL '6 hours'
    )
ON CONFLICT (id) DO NOTHING;

-- 7. Insert Notifications
INSERT INTO notifications (id, recipient_id, actor_id, type, entity_id, is_read, created_at)
VALUES
    (
        'f0000000-0000-0000-0000-000000000001',
        'a0000000-0000-0000-0000-000000000001',
        'a0000000-0000-0000-0000-000000000004',
        'FRIEND_REQUEST',
        NULL,
        false,
        NOW() - INTERVAL '1 day'
    ),
    (
        'f0000000-0000-0000-0000-000000000002',
        'a0000000-0000-0000-0000-000000000001',
        'a0000000-0000-0000-0000-000000000002',
        'POST_COMMENT',
        'c0000000-0000-0000-0000-000000000001',
        true,
        NOW() - INTERVAL '3 hours'
    ),
    (
        'f0000000-0000-0000-0000-000000000003',
        'a0000000-0000-0000-0000-000000000001',
        'a0000000-0000-0000-0000-000000000003',
        'POST_REACTION',
        'c0000000-0000-0000-0000-000000000001',
        false,
        NOW() - INTERVAL '2 hours'
    )
ON CONFLICT (id) DO NOTHING;

-- 8. Insert Reports (Moderation Test Case)
INSERT INTO reports (id, reporter_id, target_type, target_id, reason, details, status, created_at)
VALUES
    (
        '01000000-0000-0000-0000-000000000001',
        'a0000000-0000-0000-0000-000000000005',
        'POST',
        'c0000000-0000-0000-0000-000000000006',
        'Spam / Financial Phishing',
        'Automated bot promoting unverified token giveaways and phishing URLs.',
        'OPEN',
        NOW() - INTERVAL '45 minutes'
    )
ON CONFLICT (id) DO NOTHING;

COMMIT;
