import React from 'react';
import {
  Image as ImageIcon,
  Link2,
  Globe,
  Users,
  Lock,
  Sparkles,
  Send,
} from 'lucide-react';
import { User, PostVisibility } from '../types.ts';
import { Avatar } from './ui/Avatar.tsx';
import { Button } from './ui/Button.tsx';

interface PostComposerProps {
  currentUser: User;
  onCreatePost: (postData: {
    content: string;
    mediaUrls: string[];
    visibility: PostVisibility;
    linkPreview?: { title: string; description: string; url: string; image?: string };
  }) => void;
}

export const PostComposer: React.FC<PostComposerProps> = ({ currentUser, onCreatePost }) => {
  const [content, setContent] = React.useState('');
  const [visibility, setVisibility] = React.useState<PostVisibility>('PUBLIC');
  const [mediaUrls, setMediaUrls] = React.useState<string[]>([]);
  const [linkInput, setLinkInput] = React.useState('');
  const [showMediaInput, setShowMediaInput] = React.useState(false);
  const [showLinkInput, setShowLinkInput] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const sampleImages = [
    'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=1000&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1518770660439-4636190af475?w=1000&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1000&auto=format&fit=crop&q=80',
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() && mediaUrls.length === 0) return;

    setIsSubmitting(true);
    let linkPreview;
    if (linkInput.trim()) {
      try {
        const domain = new URL(linkInput).hostname;
        linkPreview = {
          title: `Resource on ${domain}`,
          description: `Shared link bookmark curated by @${currentUser.username}`,
          url: linkInput,
          image: sampleImages[0],
        };
      } catch {
        // Fallback for non-URL inputs
      }
    }

    onCreatePost({
      content,
      mediaUrls,
      visibility,
      linkPreview,
    });

    setContent('');
    setMediaUrls([]);
    setLinkInput('');
    setShowMediaInput(false);
    setShowLinkInput(false);
    setIsSubmitting(false);
  };

  const handleAddSampleImage = (url: string) => {
    if (mediaUrls.includes(url)) {
      setMediaUrls(mediaUrls.filter((u) => u !== url));
    } else {
      setMediaUrls([...mediaUrls, url]);
    }
  };

  return (
    <div className="bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 rounded-2xl p-4 sm:p-5 shadow-2xs">
      <form onSubmit={handleSubmit} className="space-y-3">
        {/* Top: User info and Privacy Selector */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Avatar
              src={currentUser.profile.avatarUrl}
              name={currentUser.profile.displayName}
              size="sm"
            />
            <span className="font-semibold text-xs text-zinc-900 dark:text-zinc-100">
              {currentUser.profile.displayName}
            </span>
          </div>

          {/* Granular Audience Selector */}
          <div className="flex items-center gap-1 bg-zinc-100 dark:bg-zinc-800 px-2.5 py-1 rounded-full text-xs text-zinc-700 dark:text-zinc-300">
            {visibility === 'PUBLIC' && <Globe className="w-3 h-3 text-blue-500" />}
            {visibility === 'FRIENDS_ONLY' && <Users className="w-3 h-3 text-emerald-500" />}
            {visibility === 'PRIVATE' && <Lock className="w-3 h-3 text-amber-500" />}
            <select
              value={visibility}
              onChange={(e) => setVisibility(e.target.value as PostVisibility)}
              className="bg-transparent text-xs font-medium focus:outline-none cursor-pointer"
            >
              <option value="PUBLIC">Public</option>
              <option value="FRIENDS_ONLY">Friends Only</option>
              <option value="PRIVATE">Only Me</option>
            </select>
          </div>
        </div>

        {/* Text Area */}
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder={`What is on your mind, ${currentUser.profile.displayName.split(' ')[0]}?`}
          rows={3}
          className="w-full text-sm bg-transparent border-none text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-none resize-none"
        />

        {/* Selected Media Attachments Preview */}
        {mediaUrls.length > 0 && (
          <div className="flex gap-2 overflow-x-auto py-2">
            {mediaUrls.map((url, idx) => (
              <div key={idx} className="relative w-24 h-20 rounded-xl overflow-hidden flex-shrink-0 group">
                <img src={url} alt="Uploaded preview" className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => setMediaUrls(mediaUrls.filter((u) => u !== url))}
                  className="absolute top-1 right-1 bg-black/60 text-white rounded-full p-1 text-[10px] hover:bg-rose-600 transition-colors"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Sample Media Picker Tray */}
        {showMediaInput && (
          <div className="p-3 bg-zinc-50 dark:bg-zinc-800/50 rounded-xl space-y-2 border border-zinc-200 dark:border-zinc-800">
            <p className="text-[11px] font-semibold text-zinc-500 uppercase tracking-wider">
              Attach High-Res Demo Images:
            </p>
            <div className="flex gap-2">
              {sampleImages.map((img, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => handleAddSampleImage(img)}
                  className={`relative w-16 h-12 rounded-lg overflow-hidden border-2 transition-all cursor-pointer ${
                    mediaUrls.includes(img) ? 'border-blue-600 scale-105' : 'border-transparent opacity-80'
                  }`}
                >
                  <img src={img} alt="sample option" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Link Input Tray */}
        {showLinkInput && (
          <div className="flex gap-2">
            <input
              type="url"
              value={linkInput}
              onChange={(e) => setLinkInput(e.target.value)}
              placeholder="https://example.com/article"
              className="flex-1 text-xs px-3 py-1.5 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg text-zinc-900 dark:text-zinc-100"
            />
            <Button
              type="button"
              size="sm"
              variant="secondary"
              onClick={() => setShowLinkInput(false)}
            >
              Done
            </Button>
          </div>
        )}

        {/* Actions Bar */}
        <div className="pt-2 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
          <div className="flex items-center gap-1 text-zinc-500">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setShowMediaInput(!showMediaInput)}
              className="text-xs text-zinc-600 dark:text-zinc-400 flex items-center gap-1.5 rounded-lg"
            >
              <ImageIcon className="w-4 h-4 text-emerald-500" />
              <span className="hidden sm:inline">Photo</span>
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setShowLinkInput(!showLinkInput)}
              className="text-xs text-zinc-600 dark:text-zinc-400 flex items-center gap-1.5 rounded-lg"
            >
              <Link2 className="w-4 h-4 text-blue-500" />
              <span className="hidden sm:inline">Link</span>
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() =>
                setContent(
                  (prev) =>
                    prev + (prev ? ' ' : '') + '💡 Exploring new architectures for low-latency state synchronization!'
                )
              }
              className="text-xs text-zinc-600 dark:text-zinc-400 flex items-center gap-1.5 rounded-lg"
            >
              <Sparkles className="w-4 h-4 text-purple-500" />
              <span className="hidden sm:inline">Inspire</span>
            </Button>
          </div>

          <Button
            type="submit"
            size="sm"
            variant="primary"
            isLoading={isSubmitting}
            disabled={!content.trim() && mediaUrls.length === 0}
            className="px-5 font-semibold"
          >
            <Send className="w-3.5 h-3.5 mr-1" />
            Publish
          </Button>
        </div>
      </form>
    </div>
  );
};
