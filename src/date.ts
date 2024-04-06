import { WeeklyTime } from './types';

/**
 * Returns the most recent M00:00 (in UTC) before the provided date
 * @VisibleForTesting
 */
export function mostRecentMondayStartUtc(utcWeekDate = new Date()) {
  const day = utcWeekDate.getUTCDay();
  const diff = ((day + 6) % 7) * 24 * 60 * 60 * 1000;
  const newDate = new Date(utcWeekDate.getTime() - diff);
  newDate.setUTCHours(0);
  newDate.setUTCMinutes(0);
  newDate.setUTCSeconds(0);
  newDate.setUTCMilliseconds(0);
  return newDate;
}

/**
 * Converts a weekly time to an actual JavaScript date
 * @example toDate(600, new Date('2023-02-25T12:34:56-08:00')) == new Date()
 */
export function toDate(weeklyTime: WeeklyTime, utcWeekDate: Date = new Date()): Date {
  const anchor = mostRecentMondayStartUtc(utcWeekDate);
  const ms = weeklyTime * 60_000;
  return new Date(anchor.getTime() + ms);
}

export function fromDate(date: Date, round: boolean = false): WeeklyTime {
  const anchor = mostRecentMondayStartUtc(date);
  const ms = date.getTime() - anchor.getTime();
  const minutes = ms / 60_000;
  if (round) {
    return Math.round(minutes) as WeeklyTime;
  }
  if (Math.round(minutes) !== minutes) {
    throw new Error('Date is not a fixed number of minutes, use round = true if you want it rounded to the nearest minute.');
  }
  return minutes as WeeklyTime;
}
