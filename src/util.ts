import { Interval, WeeklyTime } from './types';

/**
 * Checks whether a time falls within an interval
 * @param interval a left-closed interval
 * @example isInInterval('M09:00 M09:30', 'M09:00') == true
 * @example isInInterval('M09:00 M09:30', 'M09:15') == true
 * @example isInInterval('M09:00 M09:30', 'M09:29') == true
 * @example isInInterval('M09:00 M09:30', 'M09:30') == false
 */
export function isInInterval(interval: Interval | Interval[], time: WeeklyTime): boolean {
  if (typeof interval[0] === 'number' && typeof interval[1] === 'number') {
    return interval[0] <= time && time < interval[1];
  }

  return interval.some((i) => isInInterval(i as Interval, time));
}

function simplifyOrderedSchedule(orderedSchedule: Interval[]): Interval[] {
  // Merge adjacent intervals
  const result: Interval[] = [];
  for (let i = 0; i < orderedSchedule.length; i++) {
    const interval = orderedSchedule[i]!;
    const lastResult = result[result.length - 1];
    if (lastResult?.[1] === interval[0]) {
      // eslint-disable-next-line prefer-destructuring
      lastResult[1] = interval[1];
    } else {
      result.push(interval);
    }
  }
  return result;
}

export function unionSchedules(intervals: Interval[] | Interval[][]): Interval[] {
  if (intervals.length > 0 && Array.isArray(intervals[0]) && Array.isArray(intervals[0][0])) {
    return unionSchedules((intervals as Interval[][]).flat(1));
  }

  const unioned = calculateIntervalOverlap(intervals as Interval[]).map((ci) => ci.interval);
  return simplifyOrderedSchedule(unioned);
}

export function intersectSchedules(schedules: Interval[][]): Interval[] {
  const overlaps = calculateScheduleOverlap(schedules);
  const intersecting = overlaps.filter((overlap) => overlap.count === schedules.length).map((overlap) => overlap.interval);
  return simplifyOrderedSchedule(intersecting);
}

export interface IntervalOverlapResult {
  count: number,
  interval: Interval,
}

export function calculateScheduleOverlap(schedules: Interval[][]): IntervalOverlapResult[] {
  // Ensure each person's intervals don't overlap with themselves
  const intervals = schedules.map(unionSchedules).flat();

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
