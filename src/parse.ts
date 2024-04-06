import { dayCodeToNumber } from './constants';
import { fromParts, isValidWeeklyTimeParts } from './parts';
import { Interval, WeeklyTime } from './types';

/**
 * @param time String in format eHH:mm
 * @returns A parsed weekly time
 * @example parseDayTime("T09:30") === 2010 // minutes since start of week
 */
export function parseWeeklyTime(daytime: string): WeeklyTime {
  const match = daytime.match(/^(?<day>[MTWRFSU])(?<hour>[0-2]\d):(?<minute>[0-5]\d)$/);
  if (!match) {
    throw new Error(`Invalid daytime string: ${daytime}`);
  }
  if (!(match.groups!.day! in dayCodeToNumber)) {
    // This shouldn't happen because the regex above should be aligned
    throw new Error(`Internal error - bad day string: ${daytime}`);
  }

  const wt = {
    day: dayCodeToNumber[match.groups!.day! as keyof typeof dayCodeToNumber],
    hour: parseInt(match.groups!.hour!),
    minute: parseInt(match.groups!.minute!),
  };
  if (!isValidWeeklyTimeParts(wt)) {
    throw new Error(`Invalid daytime string: ${daytime}`);
  }

  return fromParts(wt);
}

/**
 * @param interval String in format eHH:mm eHH:mm
 * @returns Pair of weekly times representing start and end
 * @example parseInterval("M14:00 T09:30") === [{ day: 0, hour: 14, minute: 0 }, { day: 2, hour: 9, minute: 30 }]
 */
function parseInterval(interval: string): Interval {
  if (!/^[MTWRFSU]\d\d:\d\d [MTWRFSU]\d\d:\d\d$/.test(interval)) {
    throw new Error(`Invalid interval string: ${interval}`);
  }
  const [daytime1, daytime2] = interval.split(' ');
  const beginning = parseWeeklyTime(daytime1!);
  let end = parseWeeklyTime(daytime2!);

  // If beginning > end, we have looped around the week
  // e.g. U23:00 M00:00
  // So the end of the interval should be the end of the week
  if (beginning > end) {
    if (end === 0) {
      // We handle this edge case because it is used to represent wrapping around to the end of the week, e.g. U23:00 M00:00
      // NB: we don't allow U23:00 M01:00 - this should be input as U23:00 M00:00, M00:00 M01:00
      end = 10080 as WeeklyTime;
    } else {
      throw new Error(`Invalid interval string (end before beginning): ${interval}`);
    }
  }
  return [beginning, end];
}

export function parseIntervals(intervals: string): Interval[] {
  if (!intervals) return [];
  return intervals.split(',').map((ts) => parseInterval(ts.trim()));
}
