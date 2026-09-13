import React, { useState } from 'react';
import { X, Image, Video, Landmark, Sparkles, Send, UploadCloud } from 'lucide-react';
import { mockDeities, mockTemples } from '../../data/anantData.ts';
import { User, PostVisibility } from '../../types.ts';

interface CreatePostModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: User;
  onPostCreated?: (postData: {
    content: string;
    mediaUrl?: string;
    mediaType?: 'image' | 'video';
    deityTag?: string;
    templeTag?: string;
    visibility: PostVisibility;
  }) => void;
  onCreatePost?: (postData: {
    content: string;
    mediaUrls: string[];
    visibility: PostVisibility;
    templeTag?: string;
    deityTag?: string;
  }) => void;
}

export function CreatePostModal({
  isOpen,
  onClose,
  currentUser,
  onPostCreated,
  onCreatePost,
}: CreatePostModalProps) {
  const [content, setContent] = useState('');
  const [selectedDeity, setSelectedDeity] = useState('');
  const [selectedTemple, setSelectedTemple] = useState('');
  const [visibility, setVisibility] = useState<PostVisibility>('PUBLIC');
  const [mediaType, setMediaType] = useState<'image' | 'video' | 'none'>('none');
  const [mediaPreview, setMediaPreview] = useState<string>('');
  const [isUploading, setIsUploading] = useState(false);

  if (!isOpen) return null;

  const handleSimulatedMediaSelect = (type: 'image' | 'video') => {
    setIsUploading(true);
    setTimeout(() => {
      setMediaType(type);
      if (type === 'image') {
        setMediaPreview(
          'https://images.unsplash.com/photo-1567591370504-20a2d2188849?w=800&auto=format&fit=crop&q=80'
        );
      } else {
        setMediaPreview(
          'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4'
        );
      }
      setIsUploading(false);
    }, 400);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() && !mediaPreview) return;

    if (onCreatePost) {
      onCreatePost({
        content: content.trim(),
        mediaUrls: mediaPreview ? [mediaPreview] : [],
        visibility,
        deityTag: selectedDeity || undefined,
        templeTag: selectedTemple || undefined,
      });
    } else if (onPostCreated) {
      onPostCreated({
        content: content.trim(),
        mediaUrl: mediaPreview || undefined,
        mediaType: mediaType !== 'none' ? mediaType : undefined,
        deityTag: selectedDeity || undefined,
        templeTag: selectedTemple || undefined,
        visibility,
      });
    }

    setContent('');
    setMediaPreview('');
    setMediaType('none');
    setSelectedDeity('');
    setSelectedTemple('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
      <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-4 text-slate-100">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
            <h3 className="font-bold text-base text-slate-100">
              Create Devotional Post / दर्शन सामायिक करा
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* User Author Header */}
        <div className="flex items-center gap-3">
          <img
            src={currentUser.profile.avatarUrl}
            alt={currentUser.profile.displayName}
            className="w-10 h-10 rounded-full object-cover border border-slate-700"
          />
          <div>
            <p className="font-bold text-xs text-slate-200">{currentUser.profile.displayName}</p>
            <select
              value={visibility}
              onChange={(e) => setVisibility(e.target.value as PostVisibility)}
              className="mt-0.5 text-[10px] bg-slate-950 border border-slate-800 rounded-lg px-2 py-0.5 text-slate-400"
            >
              <option value="PUBLIC">Public (सर्व भाविकांसाठी)</option>
              <option value="FRIENDS_ONLY">Friends Only (फक्त मित्रपरिवार)</option>
            </select>
          </div>
        </div>

        {/* Post Text Area */}
        <textarea
          rows={4}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Share your spiritual thoughts, temple darshan experience, prayer, or shloka..."
          className="w-full p-3 bg-slate-950 border border-slate-800 rounded-2xl text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500"
        />

        {/* Media Preview Box */}
        {mediaPreview && (
          <div className="relative rounded-2xl overflow-hidden border border-slate-800 bg-slate-950 max-h-48 flex items-center justify-center">
            {mediaType === 'image' ? (
              <img src={mediaPreview} alt="Upload preview" className="w-full h-48 object-cover" />
            ) : (
              <video src={mediaPreview} controls className="w-full h-48 object-cover" />
            )}
            <button
              onClick={() => {
                setMediaPreview('');
                setMediaType('none');
              }}
              className="absolute top-2 right-2 p-1 rounded-full bg-slate-950/80 text-white hover:bg-rose-900 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Tag Deity / Temple Selectors */}
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div>
            <label className="text-[10px] font-semibold text-slate-400 mb-1 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-amber-400" /> Deity Focus
            </label>
            <select
              value={selectedDeity}
              onChange={(e) => setSelectedDeity(e.target.value)}
              className="w-full h-9 px-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 text-xs"
            >
              <option value="">Select Deity (Optional)</option>
              {mockDeities.map((d) => (
                <option key={d.id} value={d.nameEn}>
                  {d.nameEn}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-[10px] font-semibold text-slate-400 mb-1 flex items-center gap-1">
              <Landmark className="w-3 h-3 text-orange-400" /> Tag Temple
            </label>
            <select
              value={selectedTemple}
              onChange={(e) => setSelectedTemple(e.target.value)}
              className="w-full h-9 px-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 text-xs"
            >
              <option value="">Select Temple (Optional)</option>
              {mockTemples.map((t) => (
                <option key={t.id} value={t.name}>
                  {t.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Upload Buttons & Submit */}
        <div className="flex items-center justify-between pt-3 border-t border-slate-800">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => handleSimulatedMediaSelect('image')}
              className="p-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 hover:text-amber-400 hover:border-amber-500/40 text-xs flex items-center gap-1.5 cursor-pointer"
            >
              <Image className="w-4 h-4 text-emerald-400" />
              <span className="hidden sm:inline">Photo</span>
            </button>

            <button
              type="button"
              onClick={() => handleSimulatedMediaSelect('video')}
              className="p-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 hover:text-amber-400 hover:border-amber-500/40 text-xs flex items-center gap-1.5 cursor-pointer"
            >
              <Video className="w-4 h-4 text-sky-400" />
              <span className="hidden sm:inline">Video Clip</span>
            </button>
          </div>

          <button
            onClick={handleSubmit}
            disabled={!content.trim() && !mediaPreview}
            className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 disabled:opacity-40 disabled:pointer-events-none text-slate-950 font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-lg shadow-amber-950/40"
          >
            <Send className="w-3.5 h-3.5" /> Publish Post
          </button>
        </div>
      </div>
    </div>
  );
}
