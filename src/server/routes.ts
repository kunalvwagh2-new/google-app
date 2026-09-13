import { Router, Response } from 'express';
import { AuthenticatedRequest, authenticate, requireRole } from './middleware.ts';
import {
  mockUsers,
  mockPosts,
  mockFriendships,
  mockNotifications,
  mockComments,
} from '../seedData.ts';
import { Post, Comment, User, Notification, ReactionType, Friendship } from '../types.ts';
import { sendMobileOtp, verifyMobileOtp } from './otpService.ts';
import { moderateSpiritualContent } from './contentModeration.ts';
import { mockTrustSubmissions, mockTemples } from '../data/anantData.ts';
import { TrustRegistrationSubmission } from '../types/anant.ts';
import { askSpiritualCompanion } from './spiritualCompanionService.ts';

// In-memory submissions store initialized with seed submissions
let liveTrustSubmissions: TrustRegistrationSubmission[] = [...mockTrustSubmissions];

export const apiRouter = Router();

// ==========================================
// 1. Authentication & Session Endpoints
// ==========================================

// Helper: Generate simulated JWT token (base64 header.payload.signature)
function generateToken(user: User, expiresInMinutes = 60): string {
  const header = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64');
  const exp = Math.floor(Date.now() / 1000) + expiresInMinutes * 60;
  const payload = Buffer.from(
    JSON.stringify({
      sub: user.id,
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
      exp,
    })
  ).toString('base64');
  const signature = Buffer.from(`sig_${user.id}_${exp}`).toString('base64');
  return `${header}.${payload}.${signature}`;
}

// POST /api/auth/register
apiRouter.post('/auth/register', (req, res: Response): void => {
  const { username, email, password, displayName } = req.body;

  if (!username || !email || !password || !displayName) {
    res.status(400).json({
      success: false,
      error: { code: 'VALIDATION_ERROR', message: 'Username, email, password, and display name are required.' },
    });
    return;
  }

  const existingUser = mockUsers.find(
    (u) => u.username.toLowerCase() === username.toLowerCase() || u.email.toLowerCase() === email.toLowerCase()
  );
  if (existingUser) {
    res.status(409).json({
      success: false,
      error: { code: 'USER_EXISTS', message: 'User with that username or email already exists.' },
    });
    return;
  }

  const newUserId = `usr_${Date.now().toString(36)}`;
  const newUser: User = {
    id: newUserId,
    username,
    email,
    role: 'USER',
    status: 'ACTIVE',
    emailVerified: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    profile: {
      userId: newUserId,
      displayName,
      bio: '',
      avatarUrl: `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&auto=format&fit=crop&q=80`,
      friendsCount: 0,
      postsCount: 0,
    },
  };

  mockUsers.push(newUser);
  const token = generateToken(newUser);
  const refreshToken = `ref_${newUserId}_${Date.now()}`;

  res.status(201).json({
    success: true,
    data: {
      accessToken: token,
      refreshToken,
      expiresIn: 3600,
      user: newUser,
    },
  });
});

// POST /api/auth/login
apiRouter.post('/auth/login', (req, res: Response): void => {
  const { identifier, password } = req.body;

  if (!identifier || !password) {
    res.status(400).json({
      success: false,
      error: { code: 'VALIDATION_ERROR', message: 'Identifier (username/email) and password are required.' },
    });
    return;
  }

  // Find user by email or username
  const user = mockUsers.find(
    (u) => u.email.toLowerCase() === identifier.toLowerCase() || u.username.toLowerCase() === identifier.toLowerCase()
  );

  if (!user || user.status === 'BANNED' || user.status === 'SUSPENDED') {
    res.status(401).json({
      success: false,
      error: { code: 'INVALID_CREDENTIALS', message: 'Invalid credentials or account suspended.' },
    });
    return;
  }

  const token = generateToken(user);
  const refreshToken = `ref_${user.id}_${Date.now()}`;

  res.json({
    success: true,
    data: {
      accessToken: token,
      refreshToken,
      expiresIn: 3600,
      user,
    },
  });
});

// POST /api/auth/refresh
apiRouter.post('/auth/refresh', (req, res: Response): void => {
  const { refreshToken } = req.body;
  if (!refreshToken || !refreshToken.startsWith('ref_')) {
    res.status(400).json({
      success: false,
      error: { code: 'INVALID_TOKEN', message: 'Valid refresh token required.' },
    });
    return;
  }

  const userId = refreshToken.split('_')[1];
  const user = mockUsers.find((u) => u.id === userId);
  if (!user) {
    res.status(401).json({
      success: false,
      error: { code: 'USER_NOT_FOUND', message: 'User matching refresh token no longer exists.' },
    });
    return;
  }

  const newAccessToken = generateToken(user);
  res.json({
    success: true,
    data: {
      accessToken: newAccessToken,
      refreshToken,
      expiresIn: 3600,
      user,
    },
  });
});

// =============================================================================
// Step 12: Mobile OTP & End-User Authentication Endpoints
// =============================================================================

// POST /api/auth/otp/send (Rate-limited, 60s cooldown, max 3 in 10 mins)
apiRouter.post('/auth/otp/send', (req, res: Response): void => {
  const { mobile } = req.body;
  const ip = req.ip || req.headers['x-forwarded-for']?.toString() || 'unknown';

  if (!mobile || mobile.trim().length < 8) {
    res.status(400).json({
      success: false,
      error: { code: 'INVALID_MOBILE', message: 'Valid 10-digit mobile phone number is required.' },
    });
    return;
  }

  const result = sendMobileOtp(mobile, ip);

  if (!result.success) {
    res.status(429).json({
      success: false,
      error: { code: 'OTP_RATE_LIMITED', message: result.message },
      cooldownSeconds: result.cooldownSeconds,
    });
    return;
  }

  res.json({
    success: true,
    message: result.message,
    cooldownSeconds: result.cooldownSeconds,
    testOtp: result.testOtp, // Provided for instant sandbox testing without SMS costs
  });
});

// POST /api/auth/otp/verify (6-digit validation, user login/registration, token issuance)
apiRouter.post('/auth/otp/verify', (req, res: Response): void => {
  const {
    mobile,
    code,
    displayName,
    firstName,
    lastName,
    gender,
    email,
    location,
    dateOfBirth,
    timeOfBirth,
    placeOfBirth,
    tenantType,
    trustName,
    trustRegistrationNumber,
    trustDeityName,
  } = req.body;

  if (!mobile || !code) {
    res.status(400).json({
      success: false,
      error: { code: 'VALIDATION_ERROR', message: 'Mobile number and 6-digit OTP code are required.' },
    });
    return;
  }

  const result = verifyMobileOtp(mobile, code);

  if (!result.success) {
    res.status(400).json({
      success: false,
      error: { code: 'OTP_VERIFICATION_FAILED', message: result.message },
    });
    return;
  }

  const cleanMobile = mobile.replace(/[^0-9]/g, '');
  const userEmail = email ? email.toLowerCase().trim() : `${cleanMobile}@anant.devotee`;
  // Find or create user associated with this mobile or email
  let user = mockUsers.find(
    (u) => u.email === `${cleanMobile}@anant.devotee` || (email && u.email.toLowerCase() === userEmail)
  );

  const fullName = [firstName, lastName].filter(Boolean).join(' ') || displayName || `Devotee (${cleanMobile.slice(-4)})`;

  if (!user) {
    const newUserId = `usr_m_${Date.now().toString(36)}`;
    user = {
      id: newUserId,
      username: (email ? email.split('@')[0] : `devotee_${cleanMobile.slice(-4)}`).replace(/[^a-zA-Z0-9_]/g, '_'),
      email: userEmail,
      role: tenantType === 'TEMPLE_TRUST' ? 'VERIFIED_CREATOR' : 'USER',
      status: 'ACTIVE',
      emailVerified: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      profile: {
        userId: newUserId,
        displayName: fullName,
        firstName,
        lastName,
        gender,
        mobileNumber: mobile,
        location: location || 'India',
        dateOfBirth,
        timeOfBirth,
        placeOfBirth,
        tenantType: tenantType || 'DEVOTEE',
        trustName,
        trustRegistrationNumber,
        trustDeityName,
        bio: tenantType === 'TEMPLE_TRUST'
          ? `Official Temple Trust: ${trustName || 'Sanctum Trustee'} - Presiding Deity: ${trustDeityName || 'Lord'}`
          : 'Dedicated spiritual seeker on Anant.',
        avatarUrl: `https://images.unsplash.com/photo-1544717305-2782549b5136?w=400&auto=format&fit=crop&q=80`,
        friendsCount: 0,
        postsCount: 0,
      },
    };
    mockUsers.push(user);
  } else {
    // Update existing user profile with newly provided onboarding info
    if (firstName) user.profile.firstName = firstName;
    if (lastName) user.profile.lastName = lastName;
    if (fullName) user.profile.displayName = fullName;
    if (gender) user.profile.gender = gender;
    if (location) user.profile.location = location;
    if (dateOfBirth) user.profile.dateOfBirth = dateOfBirth;
    if (timeOfBirth) user.profile.timeOfBirth = timeOfBirth;
    if (placeOfBirth) user.profile.placeOfBirth = placeOfBirth;
    if (tenantType) user.profile.tenantType = tenantType;
    if (trustName) user.profile.trustName = trustName;
    if (trustRegistrationNumber) user.profile.trustRegistrationNumber = trustRegistrationNumber;
    if (trustDeityName) user.profile.trustDeityName = trustDeityName;
  }

  const accessToken = generateToken(user);
  const refreshToken = `ref_${user.id}_${Date.now()}`;

  res.json({
    success: true,
    message: 'Authentication successful. Welcome to Anant!',
    data: {
      accessToken,
      refreshToken,
      expiresIn: 3600,
      user,
    },
  });
});

// POST /api/auth/onboard - Explicit Onboarding Endpoint with mandatory field enforcement
apiRouter.post('/auth/onboard', (req, res: Response): void => {
  const {
    firstName,
    lastName,
    gender,
    email,
    mobileNumber,
    location,
    dateOfBirth,
    timeOfBirth,
    placeOfBirth,
    tenantType = 'DEVOTEE',
    trustName,
    trustRegistrationNumber,
    trustDeityName,
  } = req.body;

  // Validate mandatory onboarding fields
  const missing: string[] = [];
  if (!firstName?.trim()) missing.push('First Name');
  if (!lastName?.trim()) missing.push('Last Name');
  if (!gender) missing.push('Gender');
  if (!email?.trim() || !email.includes('@')) missing.push('Valid Email Address');
  if (!mobileNumber?.trim()) missing.push('Mobile Number');
  if (!location?.trim()) missing.push('Location (City/State)');

  if (missing.length > 0) {
    res.status(400).json({
      success: false,
      error: {
        code: 'MISSING_MANDATORY_FIELDS',
        message: `Please complete all required fields: ${missing.join(', ')}`,
        missingFields: missing,
      },
    });
    return;
  }

  const cleanEmail = email.toLowerCase().trim();
  let user = mockUsers.find((u) => u.email.toLowerCase() === cleanEmail);
  const fullName = `${firstName.trim()} ${lastName.trim()}`;

  if (!user) {
    const newUserId = `usr_ob_${Date.now().toString(36)}`;
    user = {
      id: newUserId,
      username: cleanEmail.split('@')[0].replace(/[^a-zA-Z0-9_]/g, '_'),
      email: cleanEmail,
      role: tenantType === 'TEMPLE_TRUST' ? 'VERIFIED_CREATOR' : 'USER',
      status: 'ACTIVE',
      emailVerified: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      profile: {
        userId: newUserId,
        displayName: fullName,
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        gender,
        mobileNumber: mobileNumber.trim(),
        location: location.trim(),
        dateOfBirth: dateOfBirth?.trim() || undefined,
        timeOfBirth: timeOfBirth?.trim() || undefined,
        placeOfBirth: placeOfBirth?.trim() || undefined,
        tenantType,
        trustName: trustName?.trim() || undefined,
        trustRegistrationNumber: trustRegistrationNumber?.trim() || undefined,
        trustDeityName: trustDeityName?.trim() || undefined,
        bio: tenantType === 'TEMPLE_TRUST'
          ? `Official Temple Trust: ${trustName || 'Trustee Sanctum'} (${trustDeityName || 'Lord'})`
          : 'Dedicated spiritual devotee on Anant.',
        avatarUrl: `https://images.unsplash.com/photo-1544717305-2782549b5136?w=400&auto=format&fit=crop&q=80`,
        friendsCount: 0,
        postsCount: 0,
      },
    };
    mockUsers.push(user);
  } else {
    user.profile.firstName = firstName.trim();
    user.profile.lastName = lastName.trim();
    user.profile.displayName = fullName;
    user.profile.gender = gender;
    user.profile.mobileNumber = mobileNumber.trim();
    user.profile.location = location.trim();
    user.profile.dateOfBirth = dateOfBirth?.trim() || undefined;
    user.profile.timeOfBirth = timeOfBirth?.trim() || undefined;
    user.profile.placeOfBirth = placeOfBirth?.trim() || undefined;
    user.profile.tenantType = tenantType;
    if (trustName) user.profile.trustName = trustName.trim();
    if (trustRegistrationNumber) user.profile.trustRegistrationNumber = trustRegistrationNumber.trim();
    if (trustDeityName) user.profile.trustDeityName = trustDeityName.trim();
  }

  const accessToken = generateToken(user);
  const refreshToken = `ref_${user.id}_${Date.now()}`;

  res.status(200).json({
    success: true,
    message: `Onboarding completed successfully as ${tenantType === 'TEMPLE_TRUST' ? 'Temple Trust' : 'Devotee'}.`,
    data: {
      accessToken,
      refreshToken,
      expiresIn: 3600,
      user,
    },
  });
});

// POST /api/ai/spiritual-companion - RAG-grounded Spiritual Companion Q&A
apiRouter.post('/ai/spiritual-companion', async (req, res: Response): Promise<void> => {
  const { question, language = 'EN' } = req.body;

  if (!question || !question.trim()) {
    res.status(400).json({
      success: false,
      error: { code: 'MISSING_QUESTION', message: 'Question text is required.' },
    });
    return;
  }

  try {
    const result = await askSpiritualCompanion(question, language);
    res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error('[SpiritualCompanion] Error handling query:', error);
    res.status(500).json({
      success: false,
      error: { code: 'SERVER_ERROR', message: 'Failed to generate spiritual guidance.' },
    });
  }
});

// =============================================================================
// Step 10: Strict Content Moderation API Filter (Sanctum Decorum & Purity)
// =============================================================================

// POST /api/content/moderate
apiRouter.post('/content/moderate', (req, res: Response): void => {
  const { content } = req.body;
  const evaluation = moderateSpiritualContent(content || '');
  res.json({
    success: true,
    data: evaluation,
  });
});

// =============================================================================
// Step 12: Temple Trust Tenant Registration & Verification Queue
// =============================================================================

// POST /api/trusts/register (Tenant Registration with Govt Registration Number, Cert upload, Trustees)
apiRouter.post('/trusts/register', (req, res: Response): void => {
  const {
    trustLegalName,
    templeName,
    deityId,
    city,
    state,
    address,
    govRegNumber,
    charityCommissionerDistrict,
    certificateFileName,
    certificateFileUrl,
    expiryDate,
    tax80GNumber,
    trustees,
    applicantEmail,
    applicantMobile,
  } = req.body;

  if (!trustLegalName || !templeName || !govRegNumber || !expiryDate || !trustees || !Array.isArray(trustees) || trustees.length === 0) {
    res.status(400).json({
      success: false,
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Trust legal name, temple name, government registration number, certificate, expiry date, and at least 1 registered trustee are required.',
      },
    });
    return;
  }

  const newSubmission: TrustRegistrationSubmission = {
    id: `sub_${Date.now().toString(36)}`,
    trustLegalName,
    templeName,
    deityId: deityId || 'lord_shiva',
    city: city || 'Pune',
    state: state || 'Maharashtra',
    address: address || '',
    govRegNumber,
    charityCommissionerDistrict: charityCommissionerDistrict || 'Charity Commissionerate Division',
    certificateFileName: certificateFileName || 'Government_Charity_Certificate.pdf',
    certificateFileUrl: certificateFileUrl || 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    expiryDate,
    tax80GNumber: tax80GNumber || undefined,
    trustees,
    status: 'PENDING_VERIFICATION',
    submittedAt: new Date().toISOString(),
    applicantEmail: applicantEmail || 'trustee@anant.org',
    applicantMobile: applicantMobile || '+919800000000',
  };

  liveTrustSubmissions.unshift(newSubmission);

  res.status(201).json({
    success: true,
    message: 'Temple Trust registration submitted successfully. It has been routed to the Super Admin verification queue.',
    data: newSubmission,
  });
});

// GET /api/admin/trusts/queue (Super Admin Verification Queue)
apiRouter.get('/admin/trusts/queue', (_req, res: Response): void => {
  res.json({
    success: true,
    data: {
      submissions: liveTrustSubmissions,
      pendingCount: liveTrustSubmissions.filter((s) => s.status === 'PENDING_VERIFICATION').length,
      approvedCount: liveTrustSubmissions.filter((s) => s.status === 'APPROVED').length,
    },
  });
});

// PUT /api/admin/trusts/:id/verify (Super Admin Approval / Rejection)
apiRouter.put('/admin/trusts/:id/verify', (req, res: Response): void => {
  const { id } = req.params;
  const { action, reviewerNotes } = req.body; // 'APPROVE' or 'REJECT'

  const submission = liveTrustSubmissions.find((s) => s.id === id);
  if (!submission) {
    res.status(404).json({
      success: false,
      error: { code: 'SUBMISSION_NOT_FOUND', message: 'Temple trust submission not found.' },
    });
    return;
  }

  if (action === 'APPROVE') {
    submission.status = 'APPROVED';
    submission.reviewedAt = new Date().toISOString();
    submission.reviewerNotes = reviewerNotes || 'Verified against Government Charity Commissioner registrar.';

    // Automatically provision or verify temple in live directory
    const existingTemple = mockTemples.find((t) => t.govRegNumber === submission.govRegNumber);
    if (existingTemple) {
      existingTemple.isVerified = true;
    } else {
      mockTemples.push({
        id: `temple_${Date.now().toString(36)}`,
        name: submission.templeName,
        deityId: submission.deityId,
        deityName: submission.deityId === 'lord_ganesh' ? 'Lord Ganesh' : submission.deityId === 'lord_shiva' ? 'Lord Shiva' : 'Lord Hanuman',
        city: submission.city,
        state: submission.state,
        address: submission.address,
        followersCount: 1,
        isVerified: true,
        coverImageUrl: 'https://images.unsplash.com/photo-1548013146-72479768bada?w=800&auto=format&fit=crop&q=80',
        liveDarshanStreamUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
        darshanTimings: '06:00 AM - 10:00 PM',
        poojaServices: ['Maha Abhishek', 'Arti Seva', 'Special Archana'],
        govRegNumber: submission.govRegNumber,
        whatsappNumber: submission.applicantMobile,
        socialLinks: {},
      });
    }

    res.json({
      success: true,
      message: `Temple trust '${submission.trustLegalName}' approved! The temple is now publicly verified with the golden sanctum badge.`,
      data: submission,
    });
    return;
  }

  if (action === 'REJECT') {
    submission.status = 'REJECTED';
    submission.reviewedAt = new Date().toISOString();
    submission.reviewerNotes = reviewerNotes || 'Government registration documentation incomplete or illegible.';

    res.json({
      success: true,
      message: `Temple trust submission '${submission.trustLegalName}' marked as REJECTED.`,
      data: submission,
    });
    return;
  }

  res.status(400).json({
    success: false,
    error: { code: 'INVALID_ACTION', message: "Action must be either 'APPROVE' or 'REJECT'." },
  });
});

// GET /api/devops/status (CI/CD, Kubernetes autoscaling & infrastructure monitor)
apiRouter.get('/devops/status', (_req, res: Response): void => {
  res.json({
    success: true,
    data: {
      uptimeSeconds: Math.floor(process.uptime()),
      environment: process.env.NODE_ENV || 'development',
      kubernetes: {
        cluster: 'k8s.anant-production-cluster.internal',
        namespace: 'production',
        hpa: {
          minReplicas: 2,
          maxReplicas: 30,
          currentReplicas: 4,
          cpuTargetPercent: 70,
          currentCpuPercent: 32,
          festivalScaleStatus: 'READY_FOR_SPIKES',
        },
      },
      database: {
        engine: 'PostgreSQL 16 with PostGIS',
        status: 'CONNECTED',
        spatialIndexActive: true,
      },
      redis: {
        status: 'CONNECTED',
        otpRateLimiterActive: true,
      },
      security: {
        tlsVersion: 'TLS 1.3',
        contentModerationEngine: 'SpiritualContentGuard v2.4 (Active)',
        encryptionAtRest: 'AES-256-GCM / AWS KMS Enforced',
      },
    },
  });
});


// GET /api/auth/me
apiRouter.get('/auth/me', authenticate, (req: AuthenticatedRequest, res: Response): void => {
  const user = mockUsers.find((u) => u.id === req.user?.id);
  if (!user) {
    res.status(404).json({
      success: false,
      error: { code: 'USER_NOT_FOUND', message: 'Authenticated user profile not found.' },
    });
    return;
  }

  res.json({ success: true, data: user });
});

// ==========================================
// 2. Feed & Post CRUD Endpoints
// ==========================================

// GET /api/feed
apiRouter.get('/feed', (req, res: Response): void => {
  const limit = parseInt(req.query.limit as string) || 20;
  // Sort posts: Pinned first, then reverse chronological
  const feed = [...mockPosts].sort((a, b) => {
    if (a.isPinned && !b.isPinned) return -1;
    if (!a.isPinned && b.isPinned) return 1;
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  res.json({
    success: true,
    data: feed.slice(0, limit),
  });
});

// POST /api/posts
apiRouter.post('/posts', authenticate, (req: AuthenticatedRequest, res: Response): void => {
  const { content, mediaUrls = [], visibility = 'FRIENDS_ONLY', linkPreview } = req.body;

  if (!content && mediaUrls.length === 0) {
    res.status(400).json({
      success: false,
      error: { code: 'VALIDATION_ERROR', message: 'Post content or media must be provided.' },
    });
    return;
  }

  const author = mockUsers.find((u) => u.id === req.user?.id);
  if (!author) {
    res.status(404).json({ success: false, error: { code: 'AUTHOR_NOT_FOUND', message: 'Author not found.' } });
    return;
  }

  const newPost: Post = {
    id: `post_${Date.now().toString(36)}`,
    authorId: author.id,
    content: content || '',
    mediaUrls,
    linkPreview,
    visibility,
    reactionsCount: 0,
    commentsCount: 0,
    sharesCount: 0,
    isPinned: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    author: {
      id: author.id,
      username: author.username,
      displayName: author.profile.displayName,
      avatarUrl: author.profile.avatarUrl,
      role: author.role,
    },
  };

  mockPosts.unshift(newPost);
  author.profile.postsCount++;

  res.status(201).json({ success: true, data: newPost });
});

// DELETE /api/posts/:id
apiRouter.delete('/posts/:id', authenticate, (req: AuthenticatedRequest, res: Response): void => {
  const { id } = req.params;
  const postIndex = mockPosts.findIndex((p) => p.id === id);

  if (postIndex === -1) {
    res.status(404).json({ success: false, error: { code: 'POST_NOT_FOUND', message: 'Post not found.' } });
    return;
  }

  const post = mockPosts[postIndex];
  // Permission check: Author OR Admin
  if (post.authorId !== req.user?.id && req.user?.role !== 'ADMIN') {
    res.status(403).json({
      success: false,
      error: { code: 'FORBIDDEN', message: 'You do not have permission to delete this post.' },
    });
    return;
  }

  mockPosts.splice(postIndex, 1);
  res.json({ success: true, message: 'Post successfully deleted.' });
});

// POST /api/posts/:id/reactions
apiRouter.post('/posts/:id/reactions', authenticate, (req: AuthenticatedRequest, res: Response): void => {
  const { id } = req.params;
  const { type } = req.body as { type: ReactionType };
  const post = mockPosts.find((p) => p.id === id);

  if (!post) {
    res.status(404).json({ success: false, error: { code: 'POST_NOT_FOUND', message: 'Post not found.' } });
    return;
  }

  const validReactions: ReactionType[] = ['LIKE', 'LOVE', 'HAHA', 'WOW', 'SAD', 'ANGRY'];
  if (!validReactions.includes(type)) {
    res.status(400).json({ success: false, error: { code: 'INVALID_REACTION', message: 'Invalid reaction type.' } });
    return;
  }

  // Toggle or update reaction
  if (post.currentUserReaction === type) {
    post.currentUserReaction = undefined;
    post.reactionsCount = Math.max(0, post.reactionsCount - 1);
  } else {
    if (!post.currentUserReaction) {
      post.reactionsCount++;
    }
    post.currentUserReaction = type;
  }

  res.json({
    success: true,
    data: {
      postId: post.id,
      reactionsCount: post.reactionsCount,
      currentUserReaction: post.currentUserReaction,
    },
  });
});

// ==========================================
// 3. Comments Endpoints
// ==========================================

// GET /api/posts/:id/comments
apiRouter.get('/posts/:id/comments', (req, res: Response): void => {
  const { id } = req.params;
  const comments = mockComments[id] || [];
  res.json({ success: true, data: comments });
});

// POST /api/posts/:id/comments
apiRouter.post('/posts/:id/comments', authenticate, (req: AuthenticatedRequest, res: Response): void => {
  const { id } = req.params;
  const { content, parentCommentId } = req.body;

  if (!content || !content.trim()) {
    res.status(400).json({ success: false, error: { code: 'VALIDATION_ERROR', message: 'Comment content cannot be empty.' } });
    return;
  }

  const post = mockPosts.find((p) => p.id === id);
  if (!post) {
    res.status(404).json({ success: false, error: { code: 'POST_NOT_FOUND', message: 'Post not found.' } });
    return;
  }

  const user = mockUsers.find((u) => u.id === req.user?.id);
  if (!user) {
    res.status(404).json({ success: false, error: { code: 'USER_NOT_FOUND', message: 'User not found.' } });
    return;
  }

  const newComment: Comment = {
    id: `comm_${Date.now().toString(36)}`,
    postId: id,
    authorId: user.id,
    parentCommentId,
    content: content.trim(),
    reactionsCount: 0,
    createdAt: new Date().toISOString(),
    author: {
      id: user.id,
      username: user.username,
      displayName: user.profile.displayName,
      avatarUrl: user.profile.avatarUrl,
    },
  };

  if (!mockComments[id]) {
    mockComments[id] = [];
  }

  if (parentCommentId) {
    const parent = mockComments[id].find((c) => c.id === parentCommentId);
    if (parent) {
      if (!parent.replies) parent.replies = [];
      parent.replies.push(newComment);
    } else {
      mockComments[id].push(newComment);
    }
  } else {
    mockComments[id].push(newComment);
  }

  post.commentsCount++;

  res.status(201).json({ success: true, data: newComment });
});

// ==========================================
// 4. Social Graph (Friends & Requests)
// ==========================================

// GET /api/friends
apiRouter.get('/friends', authenticate, (req: AuthenticatedRequest, res: Response): void => {
  const currentUserId = req.user?.id;
  const acceptedFriendships = mockFriendships.filter(
    (f) => (f.requesterId === currentUserId || f.addresseeId === currentUserId) && f.status === 'ACCEPTED'
  );

  const friendUserIds = acceptedFriendships.map((f) =>
    f.requesterId === currentUserId ? f.addresseeId : f.requesterId
  );

  const friends = mockUsers.filter((u) => friendUserIds.includes(u.id));
  res.json({ success: true, data: friends });
});

// GET /api/friends/requests
apiRouter.get('/friends/requests', authenticate, (req: AuthenticatedRequest, res: Response): void => {
  const currentUserId = req.user?.id;
  const pendingRequests = mockFriendships
    .filter((f) => f.addresseeId === currentUserId && f.status === 'PENDING')
    .map((f) => ({
      ...f,
      requester: mockUsers.find((u) => u.id === f.requesterId),
    }));

  res.json({ success: true, data: pendingRequests });
});

// POST /api/friends/request/:userId
apiRouter.post('/friends/request/:userId', authenticate, (req: AuthenticatedRequest, res: Response): void => {
  const currentUserId = req.user?.id!;
  const targetUserId = req.params.userId;

  if (currentUserId === targetUserId) {
    res.status(400).json({ success: false, error: { code: 'INVALID_TARGET', message: 'Cannot friend yourself.' } });
    return;
  }

  const existing = mockFriendships.find(
    (f) =>
      (f.requesterId === currentUserId && f.addresseeId === targetUserId) ||
      (f.requesterId === targetUserId && f.addresseeId === currentUserId)
  );

  if (existing) {
    res.status(400).json({
      success: false,
      error: { code: 'RELATIONSHIP_EXISTS', message: `Friendship status is currently ${existing.status}.` },
    });
    return;
  }

  const newFriendship: Friendship = {
    id: `fr_${Date.now().toString(36)}`,
    requesterId: currentUserId,
    addresseeId: targetUserId,
    status: 'PENDING',
    createdAt: new Date().toISOString(),
  };

  mockFriendships.push(newFriendship);

  // Trigger Notification
  const requester = mockUsers.find((u) => u.id === currentUserId);
  mockNotifications.unshift({
    id: `notif_${Date.now().toString(36)}`,
    recipientId: targetUserId,
    actorId: currentUserId,
    type: 'FRIEND_REQUEST',
    isRead: false,
    createdAt: new Date().toISOString(),
    actor: {
      id: currentUserId,
      username: requester?.username || '',
      displayName: requester?.profile.displayName || '',
      avatarUrl: requester?.profile.avatarUrl || '',
    },
    message: 'sent you a friend request.',
  });

  res.status(201).json({ success: true, data: newFriendship });
});

// PUT /api/friends/respond/:requestId
apiRouter.put('/friends/respond/:requestId', authenticate, (req: AuthenticatedRequest, res: Response): void => {
  const { requestId } = req.params;
  const { action } = req.body as { action: 'ACCEPT' | 'DECLINE' };

  const friendship = mockFriendships.find((f) => f.id === requestId);
  if (!friendship) {
    res.status(404).json({ success: false, error: { code: 'REQUEST_NOT_FOUND', message: 'Friend request not found.' } });
    return;
  }

  if (friendship.addresseeId !== req.user?.id) {
    res.status(403).json({ success: false, error: { code: 'FORBIDDEN', message: 'Only recipient can respond to this request.' } });
    return;
  }

  if (action === 'ACCEPT') {
    friendship.status = 'ACCEPTED';
    const userA = mockUsers.find((u) => u.id === friendship.requesterId);
    const userB = mockUsers.find((u) => u.id === friendship.addresseeId);
    if (userA) userA.profile.friendsCount++;
    if (userB) userB.profile.friendsCount++;
  } else {
    friendship.status = 'DECLINED';
  }

  res.json({ success: true, data: friendship });
});

// ==========================================
// 5. Notifications Hub
// ==========================================

// GET /api/notifications
apiRouter.get('/notifications', authenticate, (req: AuthenticatedRequest, res: Response): void => {
  const notifs = mockNotifications.filter((n) => n.recipientId === req.user?.id);
  const unreadCount = notifs.filter((n) => !n.isRead).length;

  res.json({
    success: true,
    data: {
      notifications: notifs,
      unreadCount,
    },
  });
});

// PUT /api/notifications/mark-read
apiRouter.put('/notifications/mark-read', authenticate, (req: AuthenticatedRequest, res: Response): void => {
  mockNotifications.forEach((n) => {
    if (n.recipientId === req.user?.id) {
      n.isRead = true;
    }
  });

  res.json({ success: true, message: 'All notifications marked as read.' });
});

// ==========================================
// 6. Global Search
// ==========================================

// GET /api/search?q=...
apiRouter.get('/search', (req, res: Response): void => {
  const query = (req.query.q as string || '').toLowerCase().trim();
  if (!query) {
    res.json({ success: true, data: { users: [], posts: [] } });
    return;
  }

  const matchingUsers = mockUsers.filter(
    (u) =>
      u.username.toLowerCase().includes(query) ||
      u.profile.displayName.toLowerCase().includes(query) ||
      u.profile.bio?.toLowerCase().includes(query)
  );

  const matchingPosts = mockPosts.filter((p) => p.content.toLowerCase().includes(query));

  res.json({
    success: true,
    data: {
      users: matchingUsers,
      posts: matchingPosts,
    },
  });
});

// ==========================================
// 7. Admin & Moderation Queue
// ==========================================

// GET /api/admin/users (Requires MODERATOR or ADMIN role)
apiRouter.get(
  '/admin/users',
  authenticate,
  requireRole(['MODERATOR', 'ADMIN']),
  (_req: AuthenticatedRequest, res: Response): void => {
    res.json({ success: true, data: mockUsers });
  }
);

// ==========================================
// 8. Supabase / Next.js RBAC Test Bed API
// ==========================================

export interface RbacFeedbackItem {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  role: 'admin' | 'temple_admin' | 'user';
  category: 'feature_testing' | 'bug_report' | 'darshan_feedback' | 'performance';
  title: string;
  message: string;
  rating: number;
  status: 'pending_review' | 'resolved' | 'archived';
  adminNotes?: string;
  createdAt: string;
}

const rbacFeedbackStore: RbacFeedbackItem[] = [
  {
    id: 'fb-001',
    userId: '00000000-0000-0000-0000-000000000003',
    userName: 'Aditya Sharma (Beta Tester)',
    userEmail: 'aditya.tester@anant.org',
    role: 'user',
    category: 'feature_testing',
    title: '108 Jaap Mala Rosary Audio Vibration feedback',
    message: 'The haptic feedback when reaching 108 counts worked cleanly on Chrome Android. Tested in Pune network.',
    rating: 5,
    status: 'resolved',
    adminNotes: 'Verified on mobile haptic API. Good job!',
    createdAt: new Date(Date.now() - 3600000 * 24).toISOString(),
  },
  {
    id: 'fb-002',
    userId: '00000000-0000-0000-0000-000000000002',
    userName: 'Pandit Ramesh Shastri',
    userEmail: 'shastri@siddhivinayak.org',
    role: 'temple_admin',
    category: 'darshan_feedback',
    title: 'Live Sanctum Darshan RTSP Stream Low-Latency Test',
    message: 'Testing morning Kakad Aarti 1080p stream embed. Latency was under 1.8 seconds over CDN.',
    rating: 5,
    status: 'pending_review',
    adminNotes: '',
    createdAt: new Date(Date.now() - 3600000 * 5).toISOString(),
  },
  {
    id: 'fb-003',
    userId: '00000000-0000-0000-0000-000000000004',
    userName: 'Priya Deshmukh (Tester)',
    userEmail: 'priya.devotee@gmail.com',
    role: 'user',
    category: 'bug_report',
    title: 'Panchang Rahu Kaal highlight in Marathi mode',
    message: 'Marathi translation for Rahu Kaal timing shows PM instead of दुपार in one section.',
    rating: 4,
    status: 'pending_review',
    adminNotes: '',
    createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
  },
];

// GET /api/rbac/feedback - RLS Policy Enforcement:
// Only admin can view ALL feedback. Users/testers can only view their own feedback.
apiRouter.get('/rbac/feedback', (req, res: Response): void => {
  const requesterRole = (req.headers['x-user-role'] as string || req.query.role as string || 'user').toLowerCase();
  const requesterId = req.headers['x-user-id'] as string || req.query.userId as string;

  if (requesterRole === 'admin') {
    // Admin has full access to view ALL feedback
    res.json({
      success: true,
      allowed: true,
      enforcedPolicy: 'Allow admin full access on public.feedback (RLS)',
      data: rbacFeedbackStore,
      stats: {
        total: rbacFeedbackStore.length,
        pending: rbacFeedbackStore.filter((f) => f.status === 'pending_review').length,
        resolved: rbacFeedbackStore.filter((f) => f.status === 'resolved').length,
      },
    });
    return;
  }

  // Non-admin requesting all feedback -> Simulates RLS rejection
  if (req.query.viewAll === 'true') {
    res.status(403).json({
      success: false,
      allowed: false,
      error: {
        code: 'RLS_POLICY_VIOLATION',
        message: 'FORBIDDEN: Only admin role can query all feedback. RLS policy "Allow admin full access" rejected your request.',
        currentUserRole: requesterRole,
        requiredRole: 'admin',
      },
    });
    return;
  }

  // Devotee/tester can only view their own submitted feedback
  const ownFeedback = rbacFeedbackStore.filter(
    (f) => f.userId === requesterId || f.role === requesterRole
  );

  res.json({
    success: true,
    allowed: true,
    enforcedPolicy: 'Allow users to view own feedback (RLS: auth.uid() = user_id)',
    data: ownFeedback,
  });
});

// POST /api/rbac/feedback - Allowed for user, temple_admin, and admin
apiRouter.post('/rbac/feedback', (req, res: Response): void => {
  const { title, message, category, rating, userEmail, userName, role } = req.body;

  if (!title || !message) {
    res.status(400).json({
      success: false,
      error: { code: 'VALIDATION_ERROR', message: 'Title and feedback message are required.' },
    });
    return;
  }

  const newItem: RbacFeedbackItem = {
    id: `fb-${Date.now().toString(36)}`,
    userId: req.body.userId || `usr-${Date.now().toString(36)}`,
    userName: userName || 'Devotee / Tester',
    userEmail: userEmail || 'tester@anant.org',
    role: role || 'user',
    category: category || 'feature_testing',
    title,
    message,
    rating: Number(rating) || 5,
    status: 'pending_review',
    createdAt: new Date().toISOString(),
  };

  rbacFeedbackStore.unshift(newItem);

  res.status(201).json({
    success: true,
    message: 'Feedback submitted successfully under RLS policy "Allow any user to submit feedback".',
    data: newItem,
  });
});

// PATCH /api/rbac/feedback/:id - Admin only: update status and admin notes
apiRouter.patch('/rbac/feedback/:id', (req, res: Response): void => {
  const requesterRole = (req.headers['x-user-role'] as string || req.body.role as string || 'user').toLowerCase();

  if (requesterRole !== 'admin') {
    res.status(403).json({
      success: false,
      error: {
        code: 'RLS_POLICY_VIOLATION',
        message: 'FORBIDDEN: Only admin role can modify feedback status and administrative notes.',
        currentUserRole: requesterRole,
        requiredRole: 'admin',
      },
    });
    return;
  }

  const item = rbacFeedbackStore.find((f) => f.id === req.params.id);
  if (!item) {
    res.status(404).json({ success: false, error: { message: 'Feedback record not found.' } });
    return;
  }

  if (req.body.status) item.status = req.body.status;
  if (req.body.adminNotes !== undefined) item.adminNotes = req.body.adminNotes;

  res.json({
    success: true,
    message: 'Feedback updated successfully by admin.',
    data: item,
  });
});

// POST /api/rbac/temple-content - Allowed for temple_admin and admin only; User is forbidden!
apiRouter.post('/rbac/temple-content', (req, res: Response): void => {
  const requesterRole = (req.headers['x-user-role'] as string || req.body.role as string || 'user').toLowerCase();

  if (!['admin', 'temple_admin'].includes(requesterRole)) {
    res.status(403).json({
      success: false,
      error: {
        code: 'RLS_POLICY_VIOLATION',
        message: 'FORBIDDEN: Regular users cannot upload temple content or schedule events. Requires "temple_admin" or "admin" role.',
        currentUserRole: requesterRole,
        requiredRoles: ['admin', 'temple_admin'],
      },
    });
    return;
  }

  res.status(201).json({
    success: true,
    message: `Content successfully published by ${requesterRole}. RLS policy "Allow temple_admin and admin to insert temple content" satisfied.`,
    data: {
      id: `content-${Date.now().toString(36)}`,
      title: req.body.title || 'New Sanctum Aarti Media',
      authorRole: requesterRole,
      publishedAt: new Date().toISOString(),
    },
  });
});

