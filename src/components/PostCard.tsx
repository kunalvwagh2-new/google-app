import React from 'react';
import {
  Heart,
  MessageSquare,
  Share2,
  MoreHorizontal,
  Lock,
  Globe,
  Users,
  Send,
  CornerDownRight,
  ShieldAlert,
} from 'lucide-react';
import { Post, Comment, ReactionType, User } from '../types.ts';
import { Avatar } from './ui/Avatar.tsx';
import { Button } from './ui/Button.tsx';
import { formatTimeAgo } from '../lib/utils.ts';

interface PostCardProps {
  post: Post;
  currentUser: User | null;
  comments: Comment[];
  onReact: (postId: string, type: ReactionType) => void;
  onAddComment: (postId: string, content: string, parentCommentId?: string) => void;
  onDeletePost?: (postId: string) => void;
  onReportPost?: (postId: string) => void;
}

export const PostCard: React.FC<PostCardProps> = ({
  post,
  currentUser,
  comments,
  onReact,
  onAddComment,
  onDeletePost,
  onReportPost,
}) => {
  const [showComments, setShowComments] = React.useState(false);
  const [commentText, setCommentText] = React.useState('');
  const [replyingToId, setReplyingToId] = React.useState<string | null>(null);
  const [showReactionPicker, setShowReactionPicker] = React.useState(false);
  const [showMenu, setShowMenu] = React.useState(false);

  const reactionEmojis: Record<ReactionType, { emoji: string; label: string; color: string }> = {
    LIKE: { emoji: '👍', label: 'Like', color: 'text-blue-600' },
    LOVE: { emoji: '❤️', label: 'Love', color: 'text-rose-500' },
    HAHA: { emoji: '😆', label: 'Haha', color: 'text-amber-500' },
    WOW: { emoji: '😮', label: 'Wow', color: 'text-amber-500' },
    SAD: { emoji: '😢', label: 'Sad', color: 'text-amber-500' },
    ANGRY: { emoji: '😡', label: 'Angry', color: 'text-orange-600' },
  };

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    onAddComment(post.id, commentText, replyingToId || undefined);
    setCommentText('');
    setReplyingToId(null);
  };

  const isAuthor = currentUser?.id === post.authorId;
  const isAdmin = currentUser?.role === 'ADMIN' || currentUser?.role === 'MODERATOR';

  return (
    <article className="bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 rounded-2xl shadow-2xs overflow-hidden transition-all">
      {/* Post Header */}
      <div className="p-4 sm:p-5 flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <Avatar
            src={post.author.avatarUrl}
            name={post.author.displayName}
            size="md"
          />
          <div>
            <div className="flex items-center gap-1.5 flex-wrap">
              <h4 className="font-semibold text-sm text-zinc-900 dark:text-zinc-100 hover:underline cursor-pointer">
                {post.author.displayName}
              </h4>
              {post.author.role === 'VERIFIED_CREATOR' && (
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500 inline-block" />
              )}
            </div>
            <div className="flex items-center gap-2 text-xs text-zinc-400">
              <span>{formatTimeAgo(post.createdAt)}</span>
              <span>•</span>
              <span className="flex items-center gap-1">
                {post.visibility === 'PUBLIC' && <Globe className="w-3 h-3" />}
                {post.visibility === 'FRIENDS_ONLY' && <Users className="w-3 h-3" />}
                {post.visibility === 'PRIVATE' && <Lock className="w-3 h-3" />}
                <span className="capitalize text-[11px]">{post.visibility.replace('_', ' ').toLowerCase()}</span>
              </span>
            </div>
          </div>
        </div>

        {/* Action Menu */}
        <div className="relative">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setShowMenu(!showMenu)}
            className="text-zinc-400 hover:text-zinc-600 rounded-full"
            aria-label="Post Options"
          >
            <MoreHorizontal className="w-4 h-4" />
          </Button>

          {showMenu && (
            <div className="absolute right-0 mt-1 w-44 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-lg p-1.5 z-20 animate-in fade-in">
              {(isAuthor || isAdmin) && onDeletePost && (
                <button
                  onClick={() => {
                    onDeletePost(post.id);
                    setShowMenu(false);
                  }}
                  className="w-full text-left px-3 py-2 text-xs font-medium text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-lg transition-colors cursor-pointer"
                >
                  Delete Post
                </button>
              )}
              {onReportPost && (
                <button
                  onClick={() => {
                    onReportPost(post.id);
                    setShowMenu(false);
                  }}
                  className="w-full text-left px-3 py-2 text-xs font-medium text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors flex items-center gap-2 cursor-pointer"
                >
                  <ShieldAlert className="w-3.5 h-3.5" />
                  Report Content
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Post Text Body */}
      {post.content && (
        <div className="px-4 sm:px-5 pb-3">
          <p className="text-zinc-800 dark:text-zinc-200 text-sm sm:text-base leading-relaxed whitespace-pre-line">
            {post.content}
          </p>
        </div>
      )}

      {/* Media Gallery Carousel */}
      {post.mediaUrls && post.mediaUrls.length > 0 && (
        <div className="border-y border-zinc-100 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950/50">
          <div
            className={`grid gap-1 ${
              post.mediaUrls.length === 1 ? 'grid-cols-1' : 'grid-cols-2'
            }`}
          >
            {post.mediaUrls.map((url, idx) => (
              <div key={idx} className="relative aspect-video overflow-hidden bg-zinc-200 dark:bg-zinc-800">
                <img
                  src={url}
                  alt={`Media attachment ${idx + 1}`}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Link Preview Card */}
      {post.linkPreview && (
        <div className="px-4 sm:px-5 pb-4">
          <a
            href={post.linkPreview.url}
            target="_blank"
            rel="noopener noreferrer"
            className="block border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden hover:bg-zinc-50 dark:hover:bg-zinc-800/40 transition-colors"
          >
            {post.linkPreview.image && (
              <img
                src={post.linkPreview.image}
                alt={post.linkPreview.title}
                referrerPolicy="no-referrer"
                className="w-full h-44 object-cover"
              />
            )}
            <div className="p-3">
              <span className="text-[10px] font-bold tracking-wider text-blue-600 uppercase">
                {new URL(post.linkPreview.url).hostname}
              </span>
              <h5 className="font-semibold text-sm text-zinc-900 dark:text-zinc-100 mt-0.5 line-clamp-1">
                {post.linkPreview.title}
              </h5>
              <p className="text-xs text-zinc-500 mt-1 line-clamp-2">
                {post.linkPreview.description}
              </p>
            </div>
          </a>
        </div>
      )}

      {/* Counts Header */}
      <div className="px-4 sm:px-5 py-2 flex items-center justify-between text-xs text-zinc-400 border-t border-zinc-100 dark:border-zinc-800">
        <div className="flex items-center gap-1.5">
          {post.reactionsCount > 0 && (
            <span className="inline-flex items-center gap-1 font-medium text-zinc-600 dark:text-zinc-300">
              <span className="w-5 h-5 rounded-full bg-blue-500 text-white text-[10px] flex items-center justify-center">
                👍
              </span>
              {post.reactionsCount}
            </span>
          )}
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowComments(!showComments)}
            className="hover:underline cursor-pointer"
          >
            {post.commentsCount} {post.commentsCount === 1 ? 'comment' : 'comments'}
          </button>
          <span>•</span>
          <span>{post.sharesCount} shares</span>
        </div>
      </div>

      {/* Engagement Action Bar */}
      <div className="px-2 py-1 flex items-center justify-around border-t border-zinc-100 dark:border-zinc-800 relative">
        {/* Floating Multi-Reaction Picker */}
        {showReactionPicker && (
          <div className="absolute bottom-11 left-2 sm:left-4 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-full shadow-2xl p-1.5 flex items-center gap-2 z-30 animate-in fade-in slide-in-from-bottom-2">
            {(Object.keys(reactionEmojis) as ReactionType[]).map((type) => (
              <button
                key={type}
                onClick={() => {
                  onReact(post.id, type);
                  setShowReactionPicker(false);
                }}
                className="w-9 h-9 rounded-full hover:scale-125 transition-transform flex items-center justify-center text-lg active:scale-95 cursor-pointer"
                title={reactionEmojis[type].label}
              >
                {reactionEmojis[type].emoji}
              </button>
            ))}
          </div>
        )}

        <button
          onClick={() => {
            if (post.currentUserReaction) {
              onReact(post.id, post.currentUserReaction);
            } else {
              onReact(post.id, 'LIKE');
            }
          }}
          onMouseEnter={() => setShowReactionPicker(true)}
          className={`flex-1 flex items-center justify-center gap-2 py-2 text-xs font-semibold rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800/80 transition-colors cursor-pointer ${
            post.currentUserReaction
              ? reactionEmojis[post.currentUserReaction].color
              : 'text-zinc-600 dark:text-zinc-400'
          }`}
        >
          {post.currentUserReaction ? (
            <span className="text-base">{reactionEmojis[post.currentUserReaction].emoji}</span>
          ) : (
            <Heart className="w-4 h-4" />
          )}
          <span>{post.currentUserReaction ? reactionEmojis[post.currentUserReaction].label : 'React'}</span>
        </button>

        <button
          onClick={() => setShowComments(!showComments)}
          className="flex-1 flex items-center justify-center gap-2 py-2 text-xs font-semibold text-zinc-600 dark:text-zinc-400 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800/80 transition-colors cursor-pointer"
        >
          <MessageSquare className="w-4 h-4" />
          <span>Comment</span>
        </button>

        <button className="flex-1 flex items-center justify-center gap-2 py-2 text-xs font-semibold text-zinc-600 dark:text-zinc-400 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800/80 transition-colors cursor-pointer">
          <Share2 className="w-4 h-4" />
          <span>Share</span>
        </button>
      </div>

      {/* Expandable Threaded Comments Section */}
      {showComments && (
        <div className="px-4 sm:px-5 py-4 bg-zinc-50/70 dark:bg-zinc-950/40 border-t border-zinc-100 dark:border-zinc-800 space-y-4">
          {/* Add Comment Input */}
          <form onSubmit={handleCommentSubmit} className="flex gap-2.5 items-start">
            <Avatar
              src={currentUser?.profile.avatarUrl}
              name={currentUser?.profile.displayName || 'Me'}
              size="sm"
            />
            <div className="flex-1 flex gap-2">
              <input
                type="text"
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder={
                  replyingToId ? 'Write a threaded reply...' : 'Write a constructive comment...'
                }
                className="w-full text-xs sm:text-sm px-3.5 py-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-600/30"
              />
              <Button type="submit" size="sm" variant="primary" disabled={!commentText.trim()}>
                <Send className="w-3.5 h-3.5" />
              </Button>
            </div>
          </form>

          {replyingToId && (
            <div className="flex items-center justify-between text-[11px] text-blue-600 pl-9">
              <span>Replying to nested comment</span>
              <button
                onClick={() => setReplyingToId(null)}
                className="hover:underline text-zinc-400 cursor-pointer"
              >
                Cancel reply
              </button>
            </div>
          )}

          {/* Render Comments List */}
          <div className="space-y-3 pt-2">
            {comments.length === 0 ? (
              <p className="text-xs text-zinc-400 italic text-center py-2">
                No comments yet. Start the conversation!
              </p>
            ) : (
              comments.map((comment) => (
                <div key={comment.id} className="space-y-2">
                  <div className="flex items-start gap-2.5">
                    <Avatar
                      src={comment.author.avatarUrl}
                      name={comment.author.displayName}
                      size="sm"
                    />
                    <div className="flex-1 bg-white dark:bg-zinc-900 border border-zinc-200/60 dark:border-zinc-800 rounded-xl p-3 shadow-2xs">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-xs text-zinc-900 dark:text-zinc-100">
                          {comment.author.displayName}
                        </span>
                        <span className="text-[10px] text-zinc-400">
                          {formatTimeAgo(comment.createdAt)}
                        </span>
                      </div>
                      <p className="text-xs text-zinc-700 dark:text-zinc-300 mt-1">
                        {comment.content}
                      </p>
                      <div className="flex items-center gap-3 mt-2 text-[10px] font-semibold text-zinc-500">
                        <button
                          onClick={() => setReplyingToId(comment.id)}
                          className="hover:text-blue-600 flex items-center gap-1 cursor-pointer"
                        >
                          <CornerDownRight className="w-3 h-3" /> Reply
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Threaded Nested Child Replies */}
                  {comment.replies &&
                    comment.replies.map((reply) => (
                      <div key={reply.id} className="pl-8 flex items-start gap-2.5">
                        <Avatar
                          src={reply.author.avatarUrl}
                          name={reply.author.displayName}
                          size="sm"
                        />
                        <div className="flex-1 bg-white dark:bg-zinc-900 border border-zinc-200/60 dark:border-zinc-800 rounded-xl p-2.5 shadow-2xs">
                          <div className="flex items-center justify-between">
                            <span className="font-semibold text-xs text-zinc-900 dark:text-zinc-100">
                              {reply.author.displayName}
                            </span>
                            <span className="text-[10px] text-zinc-400">
                              {formatTimeAgo(reply.createdAt)}
                            </span>
                          </div>
                          <p className="text-xs text-zinc-700 dark:text-zinc-300 mt-1">
                            {reply.content}
                          </p>
                        </div>
                      </div>
                    ))}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </article>
  );
};
