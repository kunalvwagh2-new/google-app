import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type FontSizeLevel = 'small' | 'normal' | 'large' | 'xlarge';

interface FontSizeContextType {
  fontSize: FontSizeLevel;
  scaleMultiplier: number;
  increaseFontSize: () => void;
  decreaseFontSize: () => void;
  resetFontSize: () => void;
  setFontSize: (size: FontSizeLevel) => void;
  label: string;
}

const SCALE_MAP: Record<FontSizeLevel, { multiplier: number; rootPx: string; label: string }> = {
  small: { multiplier: 0.9, rootPx: '14.5px', label: 'Compact' },
  normal: { multiplier: 1.0, rootPx: '16px', label: 'Normal' },
  large: { multiplier: 1.15, rootPx: '18px', label: 'Large (Senior)' },
  xlarge: { multiplier: 1.3, rootPx: '20px', label: 'Extra Large' },
};

const FontSizeContext = createContext<FontSizeContextType | undefined>(undefined);

const STORAGE_KEY = 'anant_font_size_preference';

export const FontSizeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [fontSize, setFontSizeState] = useState<FontSizeLevel>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(STORAGE_KEY) as FontSizeLevel;
      if (saved && SCALE_MAP[saved]) return saved;
    }
    return 'normal';
  });

  useEffect(() => {
    if (typeof document !== 'undefined') {
      const config = SCALE_MAP[fontSize];
      document.documentElement.style.fontSize = config.rootPx;
      document.documentElement.setAttribute('data-font-size', fontSize);
      document.documentElement.style.setProperty('--app-font-scale', `${config.multiplier}`);
    }
    try {
      localStorage.setItem(STORAGE_KEY, fontSize);
    } catch {
      // Ignore storage errors
    }
  }, [fontSize]);

  const increaseFontSize = () => {
    setFontSizeState((current) => {
      if (current === 'small') return 'normal';
      if (current === 'normal') return 'large';
      if (current === 'large') return 'xlarge';
      return 'xlarge';
    });
  };

  const decreaseFontSize = () => {
    setFontSizeState((current) => {
      if (current === 'xlarge') return 'large';
      if (current === 'large') return 'normal';
      if (current === 'normal') return 'small';
      return 'small';
    });
  };

  const resetFontSize = () => {
    setFontSizeState('normal');
  };

  const setFontSize = (size: FontSizeLevel) => {
    if (SCALE_MAP[size]) {
      setFontSizeState(size);
    }
  };

  return (
    <FontSizeContext.Provider
      value={{
        fontSize,
        scaleMultiplier: SCALE_MAP[fontSize].multiplier,
        increaseFontSize,
        decreaseFontSize,
        resetFontSize,
        setFontSize,
        label: SCALE_MAP[fontSize].label,
      }}
    >
      {children}
    </FontSizeContext.Provider>
  );
};

export function useFontSize(): FontSizeContextType {
  const context = useContext(FontSizeContext);
  if (!context) {
    throw new Error('useFontSize must be used within a FontSizeProvider');
  }
  return context;
}
