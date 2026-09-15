import React, { useState, useEffect } from 'react';
import {
  MapPin,
  Link as LinkIcon,
  Calendar,
  Grid,
  Users,
  Edit3,
  Youtube,
  Facebook,
  Globe,
  CheckCircle2,
  Radio,
  Sparkles,
  ExternalLink,
  ShieldCheck,
  RefreshCw,
} from 'lucide-react';
import { User, Post, Comment, ReactionType } from '../types.ts';
import { Avatar } from './ui/Avatar.tsx';
import { Button } from './ui/Button.tsx';
import { PostCard } from './PostCard.tsx';
import {
  getExternalIntegrationsState,
  connectYouTubeAccount,
  disconnectYouTubeAccount,
  connectFacebookMetaAccount,
  disconnectFacebookMetaAccount,
  connectGoogleMapsLocation,
  disconnectGoogleMapsLocation,
  ExternalIntegrationsState,
} from '../services/externalIntegrations.ts';

interface ProfileViewProps {
  user: User;
  currentUser: User | null;
  posts: Post[];
  comments: Record<string, Comment[]>;
  onReact: (postId: string, type: ReactionType) => void;
  onAddComment: (postId: string, content: string, parentCommentId?: string) => void;
  onDeletePost?: (postId: string) => void;
  onEditProfile?: () => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({
  user,
  currentUser,
  posts,
  comments,
  onReact,
  onAddComment,
  onDeletePost,
  onEditProfile,
}) => {
  const isSelf = currentUser?.id === user.id;
  const userPosts = posts.filter((p) => p.authorId === user.id);
  const [integrations, setIntegrations] = useState<ExternalIntegrationsState>(getExternalIntegrationsState());
  const [isUpdatingGmaps, setIsUpdatingGmaps] = useState(false);

  useEffect(() => {
    setIntegrations(getExternalIntegrationsState());
  }, []);

  const handleToggleYouTube = () => {
    if (integrations.youtube.connected) {
      const updated = disconnectYouTubeAccount();
      setIntegrations((prev) => ({ ...prev, youtube: updated }));
    } else {
      const updated = connectYouTubeAccount('@DagdushethGanpatiLive');
      setIntegrations((prev) => ({ ...prev, youtube: updated }));
    }
  };

  const handleToggleFacebook = () => {
    if (integrations.facebook.connected) {
      const updated = disconnectFacebookMetaAccount();
      setIntegrations((prev) => ({ ...prev, facebook: updated }));
    } else {
      const updated = connectFacebookMetaAccount('Anant Devotee Community');
      setIntegrations((prev) => ({ ...prev, facebook: updated }));
    }
  };

  const handleToggleGoogleMaps = async () => {
    if (integrations.googleMaps.connected) {
      const updated = disconnectGoogleMapsLocation();
      setIntegrations((prev) => ({ ...prev, googleMaps: updated }));
    } else {
      setIsUpdatingGmaps(true);
      const updated = await connectGoogleMapsLocation();
      setIntegrations((prev) => ({ ...prev, googleMaps: updated }));
      setIsUpdatingGmaps(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Cover and Avatar Banner */}
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 rounded-3xl overflow-hidden shadow-2xs">
        {/* Cover Photo */}
        <div className="h-44 sm:h-60 w-full relative bg-gradient-to-r from-blue-600 via-indigo-600 to-sky-500">
          {user.profile.coverUrl && (
            <img
              src={user.profile.coverUrl}
              alt="Cover backdrop"
              className="w-full h-full object-cover"
            />
          )}
        </div>

        {/* Profile Details Header */}
        <div className="px-5 sm:px-8 pb-6 pt-0 relative">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between -mt-16 sm:-mt-20 gap-4 mb-4">
            <div className="relative">
              <Avatar
                src={user.profile.avatarUrl}
                name={user.profile.displayName}
                size="xl"
                className="ring-4 ring-white dark:ring-zinc-900 shadow-md"
              />
            </div>

            <div className="flex items-center gap-2.5">
              {isSelf ? (
                <Button variant="outline" size="sm" onClick={onEditProfile} className="gap-1.5">
                  <Edit3 className="w-3.5 h-3.5" />
                  Edit Profile
                </Button>
              ) : (
                <Button variant="primary" size="sm">
                  Connect
                </Button>
              )}
            </div>
          </div>

          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
              {user.profile.displayName}
              {user.role === 'VERIFIED_CREATOR' && (
                <span className="w-2 h-2 rounded-full bg-blue-500" />
              )}
            </h2>
            <p className="text-xs sm:text-sm text-zinc-400">@{user.username}</p>

            {user.profile.bio && (
              <p className="text-sm text-zinc-700 dark:text-zinc-300 mt-3 max-w-2xl leading-relaxed">
                {user.profile.bio}
              </p>
            )}

            {/* Meta tags */}
            <div className="flex flex-wrap items-center gap-4 text-xs text-zinc-500 mt-4">
              {user.profile.location && (
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-zinc-400" />
                  {user.profile.location}
                </span>
              )}
              {user.profile.websiteUrl && (
                <a
                  href={user.profile.websiteUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-blue-600 hover:underline"
                >
                  <LinkIcon className="w-3.5 h-3.5" />
                  {new URL(user.profile.websiteUrl).hostname}
                </a>
              )}
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-zinc-400" />
                Joined {new Date(user.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
              </span>
            </div>

            {/* Counters */}
            <div className="flex items-center gap-6 pt-4 mt-4 border-t border-zinc-100 dark:border-zinc-800 text-sm">
              <div>
                <span className="font-bold text-zinc-900 dark:text-zinc-100">{userPosts.length}</span>{' '}
                <span className="text-zinc-400 text-xs">Posts</span>
              </div>
              <div>
                <span className="font-bold text-zinc-900 dark:text-zinc-100">{user.profile.friendsCount}</span>{' '}
                <span className="text-zinc-400 text-xs">Friends</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Connected Services & External Integrations Panel */}
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 rounded-3xl p-5 shadow-2xs space-y-4">
        <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800 pb-3">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-amber-500" />
            <div>
              <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
                Connected Platforms &amp; API Integrations
              </h3>
              <p className="text-xs text-zinc-500">
                Linked external services for live streaming, social broadcasts &amp; 8km temple geofencing
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {/* YouTube Connection Button */}
          <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200/70 dark:border-zinc-800 flex flex-col justify-between space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-red-500/10 text-red-500">
                  <Youtube className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-zinc-900 dark:text-zinc-100">YouTube API</h4>
                  <p className="text-[10px] text-zinc-500">Live Darshan Stream</p>
                </div>
              </div>
              <span
                className={`text-[10px] font-semibold px-2 py-0.5 rounded-full flex items-center gap-1 ${
                  integrations.youtube.connected
                    ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                    : 'bg-zinc-200 dark:bg-zinc-800 text-zinc-500'
                }`}
              >
                {integrations.youtube.connected ? (
                  <>
                    <CheckCircle2 className="w-3 h-3 text-emerald-500" /> Connected
                  </>
                ) : (
                  'Disconnected'
                )}
              </span>
            </div>

            {integrations.youtube.connected && integrations.youtube.handleOrName && (
              <p className="text-[11px] font-mono text-zinc-600 dark:text-zinc-400 truncate bg-zinc-100 dark:bg-zinc-900 px-2 py-1 rounded-lg">
                {integrations.youtube.handleOrName}
              </p>
            )}

            <button
              onClick={handleToggleYouTube}
              className={`w-full py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                integrations.youtube.connected
                  ? 'bg-zinc-200 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-300 dark:hover:bg-zinc-700'
                  : 'bg-red-600 text-white hover:bg-red-700 shadow-xs'
              }`}
            >
              <Youtube className="w-3.5 h-3.5" />
              {integrations.youtube.connected ? 'Disconnect YouTube' : 'Connect YouTube Account'}
            </button>
          </div>

          {/* Facebook / Meta Connection Button */}
          <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200/70 dark:border-zinc-800 flex flex-col justify-between space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-blue-500/10 text-blue-500">
                  <Facebook className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-zinc-900 dark:text-zinc-100">Facebook / Meta</h4>
                  <p className="text-[10px] text-zinc-500">Graph API &amp; Pages</p>
                </div>
              </div>
              <span
                className={`text-[10px] font-semibold px-2 py-0.5 rounded-full flex items-center gap-1 ${
                  integrations.facebook.connected
                    ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                    : 'bg-zinc-200 dark:bg-zinc-800 text-zinc-500'
                }`}
              >
                {integrations.facebook.connected ? (
                  <>
                    <CheckCircle2 className="w-3 h-3 text-emerald-500" /> Connected
                  </>
                ) : (
                  'Disconnected'
                )}
              </span>
            </div>

            {integrations.facebook.connected && integrations.facebook.handleOrName && (
              <p className="text-[11px] font-mono text-zinc-600 dark:text-zinc-400 truncate bg-zinc-100 dark:bg-zinc-900 px-2 py-1 rounded-lg">
                {integrations.facebook.handleOrName}
              </p>
            )}

            <button
              onClick={handleToggleFacebook}
              className={`w-full py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                integrations.facebook.connected
                  ? 'bg-zinc-200 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-300 dark:hover:bg-zinc-700'
                  : 'bg-blue-600 text-white hover:bg-blue-700 shadow-xs'
              }`}
            >
              <Facebook className="w-3.5 h-3.5" />
              {integrations.facebook.connected ? 'Disconnect Meta' : 'Connect Meta Page'}
            </button>
          </div>

          {/* Google Maps Location Services Connection Button */}
          <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200/70 dark:border-zinc-800 flex flex-col justify-between space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-amber-500/10 text-amber-500">
                  <Globe className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-zinc-900 dark:text-zinc-100">Google Maps GPS</h4>
                  <p className="text-[10px] text-zinc-500">8km Temple Geofence</p>
                </div>
              </div>
              <span
                className={`text-[10px] font-semibold px-2 py-0.5 rounded-full flex items-center gap-1 ${
                  integrations.googleMaps.connected
                    ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                    : 'bg-zinc-200 dark:bg-zinc-800 text-zinc-500'
                }`}
              >
                {integrations.googleMaps.connected ? (
                  <>
                    <CheckCircle2 className="w-3 h-3 text-emerald-500" /> Active
                  </>
                ) : (
                  'Disabled'
                )}
              </span>
            </div>

            {integrations.googleMaps.connected && integrations.googleMaps.handleOrName && (
              <p className="text-[11px] font-mono text-zinc-600 dark:text-zinc-400 truncate bg-zinc-100 dark:bg-zinc-900 px-2 py-1 rounded-lg">
                {integrations.googleMaps.handleOrName}
              </p>
            )}

            <button
              onClick={handleToggleGoogleMaps}
              disabled={isUpdatingGmaps}
              className={`w-full py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                integrations.googleMaps.connected
                  ? 'bg-zinc-200 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-300 dark:hover:bg-zinc-700'
                  : 'bg-amber-500 text-slate-950 hover:bg-amber-600 shadow-xs'
              }`}
            >
              {isUpdatingGmaps ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" /> Locating...
                </>
              ) : (
                <>
                  <MapPin className="w-3.5 h-3.5" />
                  {integrations.googleMaps.connected ? 'Disable GPS Alerts' : 'Enable Google Maps GPS'}
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* User Posts Timeline */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-sm text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
            <Grid className="w-4 h-4 text-zinc-400" />
            Timeline Posts
          </h3>
        </div>

        {userPosts.length === 0 ? (
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 rounded-2xl p-8 text-center">
            <p className="text-sm text-zinc-400">No posts shared yet.</p>
          </div>
        ) : (
          userPosts.map((post) => (
            <PostCard
              key={post.id}
              post={post}
              currentUser={currentUser}
              comments={comments[post.id] || []}
              onReact={onReact}
              onAddComment={onAddComment}
              onDeletePost={onDeletePost}
            />
          ))
        )}
      </div>
    </div>
  );
};
