/**
 * Core Domain Types and Interfaces for Social Media Platform
 */

export type UserRole = 'USER' | 'VERIFIED_CREATOR' | 'MODERATOR' | 'ADMIN';
export type UserStatus = 'ACTIVE' | 'SUSPENDED' | 'BANNED' | 'DEACTIVATED';
export type FriendshipStatus = 'PENDING' | 'ACCEPTED' | 'DECLINED' | 'BLOCKED';
export type PostVisibility = 'PUBLIC' | 'FRIENDS_ONLY' | 'PRIVATE';
export type ReactionType = 'LIKE' | 'LOVE' | 'HAHA' | 'WOW' | 'SAD' | 'ANGRY';
export type NotificationType =
  | 'FRIEND_REQUEST'
  | 'FRIEND_ACCEPT'
  | 'POST_REACTION'
  | 'POST_COMMENT'
  | 'COMMENT_REPLY'
  | 'MENTION';

export interface UserProfile {
  userId: string;
  displayName: string;
  firstName?: string;
  lastName?: string;
  gender?: 'MALE' | 'FEMALE' | 'OTHER' | 'PREFER_NOT_TO_SAY';
  mobileNumber?: string;
  location?: string;
  dateOfBirth?: string; // Optional DOB (YYYY-MM-DD)
  timeOfBirth?: string; // Optional TOB (HH:MM)
  placeOfBirth?: string; // Optional POB (City, State)
  tenantType?: 'DEVOTEE' | 'TEMPLE_TRUST';
  anantTier?: 'TIER_1_DEVOTEE' | 'TIER_2_TRUST_ADMIN' | 'TIER_2B_POOJARI' | 'TIER_3_SUPER_ADMIN';
  trustName?: string;
  trustRegistrationNumber?: string;
  trustDeityName?: string;
  bio?: string;
  avatarUrl: string;
  coverUrl?: string;
  websiteUrl?: string;
  friendsCount: number;
  postsCount: number;
}

export interface User {
  id: string;
  username: string;
  email: string;
  passwordHash?: string;
  role: UserRole;
  status: UserStatus;
  emailVerified: boolean;
  createdAt: string;
  updatedAt: string;
  profile: UserProfile;
}

export interface LinkPreview {
  title: string;
  description: string;
  url: string;
  image?: string;
}

export interface PostReactionSummary {
  LIKE?: number;
  LOVE?: number;
  HAHA?: number;
  WOW?: number;
  SAD?: number;
  ANGRY?: number;
}

export interface Post {
  id: string;
  authorId: string;
  content: string;
  mediaUrls: string[];
  linkPreview?: LinkPreview;
  visibility: PostVisibility;
  reactionsCount: number;
  commentsCount: number;
  sharesCount: number;
  isPinned: boolean;
  createdAt: string;
  updatedAt: string;
  author: {
    id: string;
    username: string;
    displayName: string;
    avatarUrl: string;
    role: UserRole;
  };
  currentUserReaction?: ReactionType;
}

export interface Comment {
  id: string;
  postId: string;
  authorId: string;
  parentCommentId?: string;
  content: string;
  reactionsCount: number;
  createdAt: string;
  author: {
    id: string;
    username: string;
    displayName: string;
    avatarUrl: string;
  };
  currentUserReaction?: ReactionType;
  replies?: Comment[];
}

export interface Friendship {
  id: string;
  requesterId: string;
  addresseeId: string;
  status: FriendshipStatus;
  createdAt: string;
  requester?: User;
  addressee?: User;
}

export interface Notification {
  id: string;
  recipientId: string;
  actorId: string;
  type: NotificationType;
  entityId?: string;
  isRead: boolean;
  createdAt: string;
  actor?: {
    id: string;
    username: string;
    displayName: string;
    avatarUrl: string;
  };
  message?: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  user: User;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: unknown;
  };
}
