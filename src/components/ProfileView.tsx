import React from 'react';
import {
  MapPin,
  Link as LinkIcon,
  Calendar,
  Grid,
  Users,
  Edit3,
} from 'lucide-react';
import { User, Post, Comment, ReactionType } from '../types.ts';
import { Avatar } from './ui/Avatar.tsx';
import { Button } from './ui/Button.tsx';
import { PostCard } from './PostCard.tsx';

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
