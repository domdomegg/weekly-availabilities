import { dayNumberToCode } from './constants';
import { WeeklyTimeParts, toParts } from './parts';
import { Interval, WeeklyTime } from './types';

/** Format a weekly time (M09:30), interval (M09:30 M11:30) or set of intervals (M09:30 M11:30, T09:30 T11:30) as a corresponding string */
export function format(input: WeeklyTime | WeeklyTimeParts | Interval | Interval[]): string {
  // WeeklyTime
  if (typeof input === 'number') {
    return format(toParts(input));
  }

  // Empty array
  if (Array.isArray(input) && input.length === 0) {
    return '';
  }

  // Interval[]
  if (Array.isArray(input) && Array.isArray(input[0])) {
    return (input as Interval[]).map((i) => format(i)).join(', ');
  }

  // Interval
  if (Array.isArray(input)) {
    return input.map((wt) => format(wt)).join(' ');
  }

  // WeeklyTimeParts
  return `${dayNumberToCode[input.day]}${input.hour.toString().padStart(2, '0')}:${input.minute.toString().padStart(2, '0')}`;
}
