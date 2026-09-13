export type SupportedLanguage = 'EN' | 'MR' | 'HI';

export type TenantType = 'TEMPLE_TRUST' | 'SPIRITUAL_GUIDE' | 'SPIRITUAL_CREATOR';

export type TenantRole =
  | 'MARKETING'
  | 'POOJARI_RITUALS'
  | 'DONATIONS_FINANCE'
  | 'MEDIA'
  | 'EVENTS';

export interface Deity {
  id: string;
  nameEn: string;
  nameMr: string;
  nameHi: string;
  title: string;
  iconUrl: string;
  bannerUrl: string;
  description: string;
  associatedTemplesCount: number;
  popularMantras: string[];
}

export interface Temple {
  id: string;
  name: string;
  deityId: string;
  deityName: string;
  city: string;
  state: string;
  address: string;
  distanceKm?: number;
  followersCount: number;
  isVerified: boolean;
  coverImageUrl: string;
  liveDarshanStreamUrl?: string;
  darshanTimings: string;
  poojaServices: string[];
  govRegNumber: string;
  whatsappNumber?: string;
  socialLinks: {
    facebook?: string;
    instagram?: string;
    youtube?: string;
  };
}

export type MediaCategory = 'SONG' | 'BHAJAN' | 'STOTRA' | 'SHLOKA' | 'ARTI' | 'CHATURMAS_BOOK' | 'CHANT';

export interface MediaItem {
  id: string;
  category: MediaCategory;
  deityId: string;
  deityName: string;
  titleEn: string;
  titleMr: string;
  titleHi: string;
  viewsCount: number;
  duration?: string;
  audioUrl?: string;
  videoUrl?: string;
  pdfUrl?: string;
  pdfPageCount?: number;
  lyrics: {
    mr: string;
    hi: string;
    en: string;
  };
  isBackgroundChant?: boolean;
  chantLoopText?: string;
  chantLoopCount?: number;
  audioFrequency?: number;
  meaning?: string;
}

export type BlogCategory =
  | 'TEMPLES_PILGRIMAGE'
  | 'SPIRITUAL_GURUS'
  | 'SACRED_SCRIPTURES'
  | 'FESTIVALS_UTSAV'
  | 'SADHANA_DHYAN'
  | 'CONTENT_CREATORS';

export interface SpiritualBlog {
  id: string;
  titleEn: string;
  titleMr: string;
  titleHi: string;
  authorName: string;
  authorRole: 'SPIRITUAL_GURU' | 'TEMPLE_TRUST' | 'SCHOLAR_WRITER' | 'CONTENT_CREATOR';
  authorAvatar: string;
  category: BlogCategory;
  categoryLabel: {
    en: string;
    mr: string;
    hi: string;
  };
  tags: string[];
  summary: string;
  content: string;
  bannerImageUrl: string;
  publishedAt: string;
  readTimeMinutes: number;
  likesCount: number;
  videoUrl?: string;
  videoTitle?: string;
  videoDuration?: string;
  associatedTempleId?: string;
  associatedTempleName?: string;
}

export interface DailyDarshanUpload {
  id: string;
  templeId: string;
  templeName: string;
  deityName: string;
  date: string;
  timeSlot: string;
  title: string;
  description: string;
  photoUrl: string;
  videoUrl?: string;
  alankarType: 'MORNING_SHRINGAR' | 'SANDHYA_AARTI' | 'MAHAPOOJA' | 'SPECIAL_UTSAV';
  uploadedBy: string;
  uploadedAt: string;
  likesCount: number;
  blessingsCount: number;
}

export interface ChantTrack {
  id: string;
  titleEn: string;
  titleMr: string;
  titleHi: string;
  deityName: string;
  mantraDevanagari: string;
  meaningEn: string;
  durationSec: number;
  tempoBpm: number;
  frequencyHz: number;
  category: 'MANTRA' | 'STOTRA' | 'SHLOKA' | 'NAAM_JAPA';
  audioSampleUrl?: string;
  isContinuousLoop: boolean;
}

export interface TrustMember {
  id: string;
  name: string;
  email: string;
  mobile: string;
  role: TenantRole;
  avatarUrl: string;
  joinedDate: string;
  active: boolean;
}

export interface TempleEvent {
  id: string;
  templeId: string;
  templeName: string;
  title: string;
  deityId: string;
  dateTime: string;
  panchangTithi: string;
  expectedDevotees: number;
  isLiveDarshanLinked: boolean;
  status: 'UPCOMING' | 'ONGOING' | 'COMPLETED';
}

export interface DonationRecord {
  id: string;
  donorName: string;
  donorEmail: string;
  donorMobile: string;
  amount: number;
  currency: string;
  purpose: 'Annadaan' | 'Temple Construction' | 'Special Pooja Archana' | 'General Seva';
  paymentStatus: 'SUCCESS' | 'PENDING' | 'REFUNDED';
  date: string;
  receiptNumber: string;
}

export interface TrustComplianceInfo {
  trustName: string;
  govRegNumber: string;
  registrationDate: string;
  expiryDate: string;
  status: 'ACTIVE' | 'RENEWAL_DUE' | 'UNDER_REVIEW';
  lastAttestationDate: string;
  nextMonthlyAttestationDate: string;
  trusteeNames: string[];
  isConfirmedThisMonth: boolean;
}

export interface PanchangInfo {
  dateStr: string;
  hinduMonth: string;
  tithi: string;
  paksha: string;
  nakshatra: string;
  yoga: string;
  karana: string;
  sunrise: string;
  sunset: string;
  rahuKaal: string;
  abhijitMuhurat: string;
  festival?: string;
}

export interface SpiritualShort {
  id: string;
  authorName: string;
  authorAvatar: string;
  templeName?: string;
  videoUrl: string;
  thumbnailUrl: string;
  caption: string;
  likesCount: number;
  commentsCount: number;
  sharesCount: number;
  deityTag: string;
}

export type TrustVerificationStatus =
  | 'PENDING_VERIFICATION'
  | 'APPROVED'
  | 'REJECTED'
  | 'UNDER_AUDIT';

export interface RegisteredTrustee {
  name: string;
  designation: 'President / Trustee Chief' | 'Secretary' | 'Treasurer' | 'Trustee Member';
  mobile: string;
  panOrAadhaarRef: string;
}

export interface TrustRegistrationSubmission {
  id: string;
  trustLegalName: string;
  templeName: string;
  deityId: string;
  city: string;
  state: string;
  address: string;
  govRegNumber: string;
  charityCommissionerDistrict: string;
  certificateFileName: string;
  certificateFileUrl: string;
  expiryDate: string;
  tax80GNumber?: string;
  trustees: RegisteredTrustee[];
  status: TrustVerificationStatus;
  submittedAt: string;
  reviewedAt?: string;
  reviewerNotes?: string;
  applicantEmail: string;
  applicantMobile: string;
}

// =============================================================================
// Virtual Queue & Darshan Pass Types
// =============================================================================
export type QuotaType = 'GENERAL' | 'VIP' | 'SENIOR_DIVYANG' | 'SPECIAL_UTSAV';

export interface DarshanSlot {
  id: string;
  templeId: string;
  templeName: string;
  date: string; // YYYY-MM-DD
  timeSlot: string; // e.g. "06:00 AM - 07:00 AM"
  festivalName?: string; // e.g. "Mahashivratri Special" or "Ganesh Chaturthi"
  quotaType: QuotaType;
  maxCapacity: number;
  bookedCount: number;
  status: 'OPEN' | 'FILLING_FAST' | 'FULL' | 'CLOSED';
  gateNumber: string;
  reportingTimeMinutesBefore: number;
}

export interface DarshanPass {
  id: string;
  slotId: string;
  tokenNumber: string; // e.g. "DAG-2026-Q042"
  devoteeName: string;
  devoteeMobile: string;
  devoteeCount: number;
  idProofNumber?: string;
  templeId: string;
  templeName: string;
  date: string;
  timeSlot: string;
  gateNumber: string;
  quotaType: QuotaType;
  verificationStatus: 'ISSUED' | 'CHECKED_IN' | 'EXPIRED' | 'CANCELLED';
  qrPayload: string;
  issuedAt: string;
}

// =============================================================================
// E-Pooja & Seva Booking with Live Stream Link Types
// =============================================================================
export type LiveStreamPlatform = 'YOUTUBE_PRIVATE' | 'JITSI_MEET' | 'TEMPLE_LIVE_HLS';

export interface EPoojaSeva {
  id: string;
  templeId: string;
  templeName: string;
  deityId: string;
  titleEn: string;
  titleMr: string;
  priceInr: number;
  durationMinutes: number;
  description: string;
  priestName: string;
  includesPrasadCourier: boolean;
  liveStreamPlatform: LiveStreamPlatform;
  streamUrlTemplate: string;
  itemsIncluded: string[];
  bannerImageUrl: string;
}

export interface SevaBooking {
  id: string;
  sevaId: string;
  sevaTitle: string;
  templeName: string;
  kartaName: string;
  gotra: string;
  nakshatra: string;
  sankalpPurpose: string;
  bookingDate: string;
  timeSlot: string;
  amountPaid: number;
  currency: string;
  transactionRef: string;
  prasadAddress?: string;
  privateStreamUrl: string;
  streamPasscode?: string;
  status: 'CONFIRMED' | 'IN_PROGRESS' | 'COMPLETED';
  bookedAt: string;
  whatsappConfirmationSent: boolean;
}

// =============================================================================
// Community Jaap Target (Global Leaderboard) Types
// =============================================================================
export interface JaapContributor {
  id: string;
  devoteeName: string;
  avatarUrl: string;
  city: string;
  malasCount: number; // 1 Mala = 108 beads
  totalBeads: number;
  rank: number;
  badge: string;
  lastChantedAt: string;
}

export type JaapLeaderboardEntry = JaapContributor;

export interface CommunityJaapGoal {
  id: string;
  templeId: string;
  templeName: string;
  deityId: string;
  deityName: string;
  mantraName: string;
  mantraDevanagari: string;
  targetCount: number; // e.g. 1,000,000 counts
  currentCount: number;
  activeDevoteesCount: number;
  deadlineDate: string;
  description: string;
  topContributors: JaapContributor[];
  festivalName?: string;
  status?: string;
  startDate?: string;
  targetDate?: string;
  activeChanterCount?: number;
}

// =============================================================================
// WhatsApp Notification Integration Types (Twilio / Interakt API)
// =============================================================================
export type WhatsAppMessageType =
  | 'SUPRABHATAM'
  | 'EVENT_ALERT'
  | 'DARSHAN_PASS'
  | 'DONATION_80G_RECEIPT';

export interface WhatsAppNotificationTemplate {
  id: string;
  type: WhatsAppMessageType;
  title: string;
  description: string;
  triggerEvent: string;
  previewMessage: string;
  ctaButtonText: string;
  samplePayload: Record<string, string>;
}

// =============================================================================
// Feature Requirement & Feedback System Types
// =============================================================================
export type FeatureStatus = 'UNDER_REVIEW' | 'PLANNED' | 'IN_DEVELOPMENT' | 'COMPLETED';
export type FeatureCategory =
  | 'JAAP_MALA'
  | 'TEMPLE_DARSHAN'
  | 'MEDIA_AUDIO'
  | 'BLOGS_DISCOURSE'
  | 'PANCHANG_CALENDAR'
  | 'NOTIFICATIONS'
  | 'MOBILE_UX'
  | 'COMMUNITY_SEVA';

export type FeaturePriority = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'NICE_TO_HAVE';

export interface FeatureComment {
  id: string;
  authorName: string;
  authorAvatar?: string;
  isDevTeam?: boolean;
  content: string;
  createdAt: string;
}

export interface FeatureRequirementItem {
  id: string;
  title: string;
  description: string;
  communityBenefit: string; // How this will be useful for everyone
  category: FeatureCategory;
  priority: FeaturePriority;
  status: FeatureStatus;
  upvotesCount: number;
  upvotedByUser?: boolean;
  submitterName: string;
  submitterAvatar?: string;
  submitterContact?: string;
  submittedAt: string;
  progressPercentage?: number;
  targetSprint?: string;
  devTeamNote?: string;
  comments?: FeatureComment[];
  tags: string[];
}

