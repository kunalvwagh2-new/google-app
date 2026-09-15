'use client';

import React, { useState, useEffect } from 'react';
import { Home, Film, Plus, Users, Landmark } from 'lucide-react';
import { SupportedLanguage } from '../../types/anant.ts';

interface AnantBottomNavProps {
  activeTab: string;
  onSelectTab: (tab: string) => void;
  onOpenCreatePost: () => void;
  language: SupportedLanguage;
}

export function AnantBottomNav({
  activeTab,
  onSelectTab,
  onOpenCreatePost,
  language,
}: AnantBottomNavProps) {
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > lastScrollY && currentScrollY > 80) {
        setIsVisible(false); // Hide on scroll down
      } else {
        setIsVisible(true); // Show on scroll up
      }
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  return (
    <nav
      id="anant-bottom-navigation"
      aria-label="Bottom Navigation"
      className={`fixed bottom-0 left-0 right-0 z-40 bg-slate-950/90 backdrop-blur-md border-t border-slate-800/80 px-2 sm:px-6 py-2 transition-transform duration-300 shadow-2xl ${
        isVisible ? 'translate-y-0' : 'translate-y-full'
      }`}
    >
      <div className="max-w-xl mx-auto flex items-center justify-between gap-1">
        {/* 1. Home */}
        <button
          id="anant-bottom-nav-home"
          onClick={() => onSelectTab('feed')}
          className={`flex-1 flex flex-col items-center justify-center py-1 rounded-2xl transition-all cursor-pointer ${
            activeTab === 'feed'
              ? 'text-amber-400 font-bold scale-105'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Home className="w-5 h-5 mb-0.5" />
          <span className="text-[10px] leading-tight">
            {language === 'MR' ? 'मुखपृष्ठ' : language === 'HI' ? 'होम' : 'Home'}
          </span>
        </button>

        {/* 2. Shorts / Reels */}
        <button
          id="anant-bottom-nav-shorts"
          onClick={() => onSelectTab('shorts')}
          className={`flex-1 flex flex-col items-center justify-center py-1 rounded-2xl transition-all cursor-pointer ${
            activeTab === 'shorts'
              ? 'text-amber-400 font-bold scale-105'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Film className="w-5 h-5 mb-0.5" />
          <span className="text-[10px] leading-tight">
            {language === 'MR' ? 'रील्स' : language === 'HI' ? 'रील्स' : 'Shorts'}
          </span>
        </button>

        {/* 3. Center Create Post */}
        <div className="flex-1 flex items-center justify-center">
          <button
            id="anant-bottom-nav-create-post"
            onClick={onOpenCreatePost}
            title="Create Post / Upload Photo / Video"
            className="w-12 h-12 rounded-full bg-gradient-to-tr from-amber-600 via-orange-500 to-amber-400 text-slate-950 flex items-center justify-center shadow-lg shadow-amber-950/60 hover:scale-105 active:scale-95 transition-all cursor-pointer -mt-4 border-2 border-slate-950"
          >
            <Plus className="w-6 h-6 stroke-[2.5]" />
          </button>
        </div>

        {/* 4. Friends */}
        <button
          id="anant-bottom-nav-friends"
          onClick={() => onSelectTab('friends')}
          className={`flex-1 flex flex-col items-center justify-center py-1 rounded-2xl transition-all cursor-pointer ${
            activeTab === 'friends'
              ? 'text-amber-400 font-bold scale-105'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Users className="w-5 h-5 mb-0.5" />
          <span className="text-[10px] leading-tight">
            {language === 'MR' ? 'मित्रपरिवार' : language === 'HI' ? 'मित्र' : 'Friends'}
          </span>
        </button>

        {/* 5. Temples */}
        <button
          id="anant-bottom-nav-temples"
          onClick={() => onSelectTab('temples')}
          className={`flex-1 flex flex-col items-center justify-center py-1 rounded-2xl transition-all cursor-pointer ${
            activeTab === 'temples'
              ? 'text-amber-400 font-bold scale-105'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Landmark className="w-5 h-5 mb-0.5" />
          <span className="text-[10px] leading-tight">
            {language === 'MR' ? 'मंदिरे' : language === 'HI' ? 'मंदिर' : 'Temples'}
          </span>
        </button>
      </div>
    </nav>
  );
}
