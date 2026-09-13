import { SmartTargetCalculation, TargetInputMode, TargetPeriod } from '../types/jaap.ts';

const BEADS_PER_MALA = 108;
const DAYS_PER_WEEK = 7;
const DAYS_PER_MONTH = 30.4167; // Average solar month length
const DAYS_PER_YEAR = 365;

export function computeSmartTargets(
  inputValue: number,
  inputPeriod: TargetPeriod,
  inputMode: TargetInputMode,
  totalSankalpTargetMalas: number = 365
): SmartTargetCalculation {
  const safeVal = Math.max(0.1, inputValue || 1);

  // Normalize to daily malas and daily beads
  let dailyMalas = 1;
  let dailyBeads = 108;

  if (inputMode === 'MALAS') {
    switch (inputPeriod) {
      case 'DAILY':
        dailyMalas = safeVal;
        break;
      case 'WEEKLY':
        dailyMalas = safeVal / DAYS_PER_WEEK;
        break;
      case 'MONTHLY':
        dailyMalas = safeVal / DAYS_PER_MONTH;
        break;
      case 'YEARLY':
        dailyMalas = safeVal / DAYS_PER_YEAR;
        break;
    }
    dailyBeads = dailyMalas * BEADS_PER_MALA;
  } else {
    // Mode is BEADS/COUNTS
    switch (inputPeriod) {
      case 'DAILY':
        dailyBeads = safeVal;
        break;
      case 'WEEKLY':
        dailyBeads = safeVal / DAYS_PER_WEEK;
        break;
      case 'MONTHLY':
        dailyBeads = safeVal / DAYS_PER_MONTH;
        break;
      case 'YEARLY':
        dailyBeads = safeVal / DAYS_PER_YEAR;
        break;
    }
    dailyMalas = dailyBeads / BEADS_PER_MALA;
  }

  // Calculate equivalents across all 4 timeframes
  const weeklyMalas = dailyMalas * DAYS_PER_WEEK;
  const weeklyBeads = dailyBeads * DAYS_PER_WEEK;

  const monthlyMalas = dailyMalas * DAYS_PER_MONTH;
  const monthlyBeads = dailyBeads * DAYS_PER_MONTH;

  const yearlyMalas = dailyMalas * DAYS_PER_YEAR;
  const yearlyBeads = dailyBeads * DAYS_PER_YEAR;

  // Project Target Date & Day of Week
  const targetMalasGoal = Math.max(1, totalSankalpTargetMalas);
  const daysRemaining = Math.max(1, Math.ceil(targetMalasGoal / Math.max(0.01, dailyMalas)));

  const targetDateObj = new Date(Date.now() + daysRemaining * 86400000);
  const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const targetDayOfWeek = weekdays[targetDateObj.getDay()];
  const targetDateFormatted = `${targetDayOfWeek}, ${targetDateObj.getDate()} ${months[targetDateObj.getMonth()]} ${targetDateObj.getFullYear()}`;

  return {
    inputMode,
    inputPeriod,
    inputValue: safeVal,
    totalSankalpTargetMalas: targetMalasGoal,
    dailyMalas: Number(dailyMalas.toFixed(2)),
    dailyBeads: Math.round(dailyBeads),
    weeklyMalas: Number(weeklyMalas.toFixed(1)),
    weeklyBeads: Math.round(weeklyBeads),
    monthlyMalas: Number(monthlyMalas.toFixed(1)),
    monthlyBeads: Math.round(monthlyBeads),
    yearlyMalas: Math.round(yearlyMalas),
    yearlyBeads: Math.round(yearlyBeads),
    targetDateFormatted,
    targetDayOfWeek,
    daysRemaining,
  };
}
