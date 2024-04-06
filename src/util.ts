import { Interval, WeeklyTime } from './types';

/**
 * Checks whether a time falls within an interval
 * @param interval a left-closed interval
 * @example isInInterval('M09:00 M09:30', 'M09:00') == true
 * @example isInInterval('M09:00 M09:30', 'M09:15') == true
 * @example isInInterval('M09:00 M09:30', 'M09:29') == true
 * @example isInInterval('M09:00 M09:30', 'M09:30') == false
 */
export function isInInterval(interval: Interval, time: WeeklyTime): boolean {
  return interval[0] <= time && time < interval[1];
}

export function unionIntervals(intervals: Interval[]): Interval[] {
  const overlaps = calculateIntervalOverlap(intervals).map((ci) => ci.interval);

  // Merge adjacent intervals
  const result: Interval[] = [];
  for (let i = 0; i < overlaps.length; i++) {
    const overlap = overlaps[i]!;
    const lastResult = result[result.length - 1];
    if (lastResult?.[1] === overlap[0]) {
      // eslint-disable-next-line prefer-destructuring
      lastResult[1] = overlap[1];
    } else {
      result.push(overlap);
    }
  }

  return result;
}

export interface IntervalOverlapResult {
  count: number,
  interval: Interval,
}

export function calculateScheduleIntervalOverlap(schedules: Interval[][]): IntervalOverlapResult[] {
  // Ensure each person's intervals don't overlap with themselves
  const intervals = schedules.map(unionIntervals).flat();

  return calculateIntervalOverlap(intervals);
}

const calculateIntervalOverlap = (intervals: Interval[]): IntervalOverlapResult[] => {
  const intervalEvents = intervals.flatMap((interval) => [
    { type: 'start', at: interval[0] },
    { type: 'end', at: interval[1] },
  ]).sort((a, b) => a.at - b.at);

  const result: { count: number, interval: [WeeklyTime, WeeklyTime | undefined] }[] = [];
  for (let i = 0; i < intervalEvents.length; i++) {
    const event = intervalEvents[i]!;
    // Close the last interval
    const lastInterval = result[result.length - 1];
    if (lastInterval) {
      lastInterval.interval[1] = event.at;
    }

    result.push({
      count: (lastInterval?.count ?? 0) + (event.type === 'start' ? 1 : -1),
      interval: [event.at, undefined],
    });
  }

  return (result as IntervalOverlapResult[]).filter((i) => i.count > 0 && i.interval[1] > i.interval[0]);
};
