import React from 'react';
import { useFontSize } from '../../contexts/FontSizeContext.tsx';
import { Type, ZoomIn, ZoomOut } from 'lucide-react';

interface AccessibilityControlsProps {
  className?: string;
}

export const AccessibilityControls: React.FC<AccessibilityControlsProps> = ({ className = '' }) => {
  const { fontSize, increaseFontSize, decreaseFontSize, resetFontSize, label } = useFontSize();

  return (
    <div
      className={`inline-flex items-center bg-slate-900 border border-slate-800 rounded-2xl p-1 gap-1 shadow-sm ${className}`}
      role="group"
      aria-label="Senior accessibility and font size controls"
      title={`Current text size: ${label}. Click A- or A+ to adjust for senior-friendly readability.`}
    >
      {/* Decrease Font Size A- */}
      <button
        id="font-size-decrease-btn"
        onClick={decreaseFontSize}
        disabled={fontSize === 'small'}
        aria-label="Decrease text size (A-)"
        className="w-7 h-7 flex items-center justify-center rounded-xl text-xs font-black text-slate-300 hover:text-amber-400 hover:bg-slate-800 disabled:opacity-30 disabled:pointer-events-none transition-colors cursor-pointer"
        title="Decrease font size (A-)"
      >
        <span className="text-[11px] font-bold">A<span className="text-[9px] align-super">-</span></span>
      </button>

      {/* Font Size Indicator & Reset Button */}
      <button
        id="font-size-reset-btn"
        onClick={resetFontSize}
        aria-label={`Reset text size to standard (Current: ${label})`}
        className={`px-2 h-7 flex items-center gap-1 rounded-xl text-[10px] font-bold transition-all cursor-pointer ${
          fontSize !== 'normal'
            ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
            : 'text-slate-400 hover:text-slate-200'
        }`}
        title={`Current scale: ${label}. Click to reset to standard.`}
      >
        <Type className="w-3.5 h-3.5 text-amber-400" />
        <span className="font-mono">{fontSize === 'normal' ? '100%' : fontSize === 'large' ? '115%' : fontSize === 'xlarge' ? '130%' : '90%'}</span>
      </button>

      {/* Increase Font Size A+ */}
      <button
        id="font-size-increase-btn"
        onClick={increaseFontSize}
        disabled={fontSize === 'xlarge'}
        aria-label="Increase text size for senior readability (A+)"
        className="w-7 h-7 flex items-center justify-center rounded-xl text-xs font-black text-slate-300 hover:text-amber-400 hover:bg-slate-800 disabled:opacity-30 disabled:pointer-events-none transition-colors cursor-pointer"
        title="Increase font size for senior readability (A+)"
      >
        <span className="text-[12px] font-bold">A<span className="text-[10px] align-super font-black text-amber-400">+</span></span>
      </button>
    </div>
  );
};

export default AccessibilityControls;
