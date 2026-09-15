import React from 'react';
import { Sparkles, Calendar, User, ArrowLeft, Share2, Bookmark } from 'lucide-react';
import { mockSpiritualBlogs } from '../../../data/anantData.ts';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function BlogPostPage({ params }: PageProps) {
  const resolvedParams = await params;
  const { slug } = resolvedParams;

  const blog = mockSpiritualBlogs.find((b) => b.id === slug || b.titleEn.toLowerCase().replace(/[^a-z0-9]+/g, '-') === slug) || mockSpiritualBlogs[0];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <a
          href="/"
          className="inline-flex items-center gap-2 text-sm text-amber-400 hover:text-amber-300 mb-8 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Anant Sanctum
        </a>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-2xl">
          <div className="flex items-center gap-3 mb-4">
            <span className="px-3 py-1 bg-amber-500/10 text-amber-400 border border-amber-500/20 rounded-full text-xs font-semibold">
              {blog.categoryLabel.en}
            </span>
            <span className="text-xs text-slate-400 flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" />
              {blog.publishedAt} ({blog.readTimeMinutes} min read)
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-6 leading-tight">
            {blog.titleEn}
          </h1>

          <div className="flex items-center justify-between border-y border-slate-800 py-4 mb-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-amber-600/20 text-amber-400 flex items-center justify-center font-bold">
                {blog.authorName.charAt(0)}
              </div>
              <div>
                <h4 className="text-sm font-semibold text-white">{blog.authorName}</h4>
                <p className="text-xs text-slate-400">{blog.authorRole}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl transition">
                <Bookmark className="w-4 h-4" />
              </button>
              <button className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl transition">
                <Share2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          {blog.bannerImageUrl && (
            <div className="mb-8 rounded-xl overflow-hidden border border-slate-800">
              <img src={blog.bannerImageUrl} alt={blog.titleEn} className="w-full h-80 object-cover" />
            </div>
          )}

          <div className="prose prose-invert max-w-none text-slate-300 space-y-6 text-base leading-relaxed">
            <p className="font-medium text-amber-200/90 text-lg">
              {blog.summary}
            </p>
            <p>
              {blog.content}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
