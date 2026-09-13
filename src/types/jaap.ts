export interface MalaProfile {
  id: string;
  name: string;
  mantraText: string;
  deityName: string;
  deityPhotoUrl: string;
  currentBead: number; // 0 to 107 (108th completes)
  completedMalas: number;
  totalBeadsAllTime: number;
  createdAt: string;
  lastChantedAt: string;
  isCustomMantra: boolean;
}

export type TargetInputMode = 'MALAS' | 'BEADS';
export type TargetPeriod = 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'YEARLY';

export interface SmartTargetCalculation {
  inputMode: TargetInputMode;
  inputPeriod: TargetPeriod;
  inputValue: number;
  totalSankalpTargetMalas?: number;
  
  // Calculated equivalents
  dailyMalas: number;
  dailyBeads: number;
  weeklyMalas: number;
  weeklyBeads: number;
  monthlyMalas: number;
  monthlyBeads: number;
  yearlyMalas: number;
  yearlyBeads: number;
  
  // Date projections
  targetDateFormatted: string;
  targetDayOfWeek: string;
  daysRemaining: number;
}
