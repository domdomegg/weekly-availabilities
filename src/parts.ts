import { dayNumberToCode } from './constants';
import { WeeklyTime } from './types';

export type DayValueNumber = keyof typeof dayNumberToCode;
export type HourValue = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15 | 16 | 17 | 18 | 19 | 20 | 21 | 22 | 23;
export type MinuteValue = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15 | 16 | 17 | 18 | 19 | 20 | 21 | 22 | 23 | 24 | 25 | 26 | 27 | 28 | 29 | 30 | 31 | 32 | 33 | 34 | 35 | 36 | 37 | 38 | 39 | 40 | 41 | 42 | 43 | 44 | 45 | 46 | 47 | 48 | 49 | 50 | 51 | 52 | 53 | 54 | 55 | 56 | 57 | 58 | 59;

export type WeeklyTimeParts = {
  day: DayValueNumber,
  hour: HourValue,
  minute: MinuteValue
};

export function toParts(minutesSinceStartOfWeek: WeeklyTime | number): WeeklyTimeParts {
  // Special case for U24:00
  if (minutesSinceStartOfWeek === 10080) {
    return toParts(0);
  }

  let x = minutesSinceStartOfWeek;
  const day = Math.floor(x / 1440);
  x -= day * 1440;
  const hour = Math.floor(x / 60);
  x -= hour * 60;
  const minute = x;
  const wt = {
    day,
    hour,
    minute,
  };
  if (!isValidWeeklyTimeParts(wt)) {
    throw new Error(`Invalid weekly time value: ${minutesSinceStartOfWeek}`);
  }
  return wt;
}

export function fromParts(parts: WeeklyTimeParts): WeeklyTime {
  return (((parts.day * 24) + parts.hour) * 60) + parts.minute as WeeklyTime;
}

export const isValidWeeklyTimeParts = (wt: { day: number, hour: number, minute: number }): wt is WeeklyTimeParts => {
  if (Number.isNaN(wt.day) || Number.isNaN(wt.hour) || Number.isNaN(wt.minute)) return false;
  if (!(wt.day in dayNumberToCode)) return false;
  if (wt.hour < 0 || wt.hour > 23) return false;
  if (wt.minute < 0 || wt.minute > 59) return false;
  return true;
};
