'use client';

import React from 'react';

interface ProgressCircleProps {
  count: number; // Current count (0 to 108)
}

export function JaapMalaCircle({ count }: ProgressCircleProps) {
  const radius = 80;
  const circumference = 2 * Math.PI * radius; // ≈ 502.65
  const strokeDashoffset = circumference - (count / 108) * circumference;

  return (
    <div className="relative flex items-center justify-center w-56 h-56">
      <svg className="w-full h-full transform -rotate-90" viewBox="0 0 200 200">
        {/* Background Track Circle */}
        <circle
          cx="100"
          cy="100"
          r={radius}
          className="stroke-slate-800"
          strokeWidth="12"
          fill="transparent"
        />
        {/* Animated Progress Ring */}
        <circle
          cx="100"
          cy="100"
          r={radius}
          className="stroke-amber-500 transition-all duration-150 ease-out"
          strokeWidth="12"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          fill="transparent"
        />
      </svg>
      
      {/* Center Number Display */}
      <div className="absolute flex flex-col items-center justify-center text-center">
        <span className="text-4xl font-bold text-amber-500">{count}</span>
        <span className="text-xs text-slate-400 font-medium mt-1">/ 108</span>
      </div>
    </div>
  );
}
