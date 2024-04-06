import { describe, expect, test } from 'vitest';
import {
  calculateScheduleOverlap, intersectSchedules, isInInterval, unionSchedules,
} from './util';
import { Interval, WeeklyTime } from './types';

describe('calculateScheduleOverlap', () => {
  test('handles empty input', () => {
    expect(calculateScheduleOverlap([])).toEqual([]);
    expect(calculateScheduleOverlap([[]])).toEqual([]);
    expect(calculateScheduleOverlap([[], []])).toEqual([]);
  });

  test('handles disjoint input', () => {
    expect(calculateScheduleOverlap([[[1, 2]], [[3, 4], [5, 6]]] as Interval[][])).toEqual([
      { count: 1, interval: [1, 2] },
      { count: 1, interval: [3, 4] },
      { count: 1, interval: [5, 6] },
    ]);
  });

  test('handles two-overlapping input', () => {
    expect(calculateScheduleOverlap([[[1, 5]], [[2, 4], [6, 7]]] as Interval[][])).toEqual([
      { count: 1, interval: [1, 2] },
      { count: 2, interval: [2, 4] },
      { count: 1, interval: [4, 5] },
      { count: 1, interval: [6, 7] },
    ]);
  });

  test('handles three-overlapping input', () => {
    expect(calculateScheduleOverlap([[[1, 5]], [[2, 6]], [[3, 4]]] as Interval[][])).toEqual([
      { count: 1, interval: [1, 2] },
      { count: 2, interval: [2, 3] },
      { count: 3, interval: [3, 4] },
      { count: 2, interval: [4, 5] },
      { count: 1, interval: [5, 6] },
    ]);
  });
});

describe('unionSchedules', () => {
  test('handles empty input', () => {
    expect(unionSchedules([])).toEqual([]);
  });

  test('handles non-overlapping input', () => {
    expect(unionSchedules([[1, 2], [3, 4]] as Interval[])).toEqual([[1, 2], [3, 4]]);
    expect(unionSchedules([[1, 2], [6, 14], [30, 44]] as Interval[])).toEqual([[1, 2], [6, 14], [30, 44]]);
    expect(unionSchedules([[5, 6], [1, 2]] as Interval[])).toEqual([[1, 2], [5, 6]]);
  });

  test('handles overlapping input', () => {
    expect(unionSchedules([[1, 3], [2, 4]] as Interval[])).toEqual([[1, 4]]);
    expect(unionSchedules([[1, 2], [2, 3]] as Interval[])).toEqual([[1, 3]]);
    expect(unionSchedules([[1, 6], [2, 3]] as Interval[])).toEqual([[1, 6]]);
    expect(unionSchedules([[2, 3], [1, 5]] as Interval[])).toEqual([[1, 5]]);
    expect(unionSchedules([[1, 5], [2, 8], [7, 11]] as Interval[])).toEqual([[1, 11]]);
    expect(unionSchedules([[1, 5], [2, 8], [9, 11]] as Interval[])).toEqual([[1, 8], [9, 11]]);
  });
});

describe('intersectSchedules', () => {
  test('handles empty input', () => {
    expect(intersectSchedules([])).toEqual([]);
    expect(intersectSchedules([[]])).toEqual([]);
    expect(intersectSchedules([[], []])).toEqual([]);
  });

  test('handles non-overlapping input', () => {
    expect(intersectSchedules([[[1, 2]], [[[3, 4]]]] as Interval[][])).toEqual([]);
    expect(intersectSchedules([[[3, 4]], [[6, 14]]] as Interval[][])).toEqual([]);
    expect(intersectSchedules([[[5, 6]], [[1, 2]]] as Interval[][])).toEqual([]);
    expect(intersectSchedules([[[1, 5]], [[2, 8]], [7, 11]] as Interval[][])).toEqual([]);
  });

  test('handles overlapping input', () => {
    expect(intersectSchedules([[[1, 3], [2, 4]]] as Interval[][])).toEqual([[1, 4]]);
    expect(intersectSchedules([[[1, 3], [5, 6]]] as Interval[][])).toEqual([[1, 3], [5, 6]]);
    expect(intersectSchedules([[[1, 3]], [[2, 4]]] as Interval[][])).toEqual([[2, 3]]);
    expect(intersectSchedules([[[1, 6]], [[2, 3]]] as Interval[][])).toEqual([[2, 3]]);
    expect(intersectSchedules([[[2, 3]], [[1, 6]]] as Interval[][])).toEqual([[2, 3]]);
    expect(intersectSchedules([[[1, 5]], [[2, 8]], [[4, 11]]] as Interval[][])).toEqual([[4, 5]]);
  });
});

describe('isInInterval', () => {
  test('inside', () => {
    expect(isInInterval([1, 5] as Interval, 3 as WeeklyTime)).toBe(true);
    expect(isInInterval([1, 5] as Interval, 1 as WeeklyTime)).toBe(true);
    expect(isInInterval([1, 5] as Interval, 4 as WeeklyTime)).toBe(true);
    expect(isInInterval([[1, 5]] as Interval[], 4 as WeeklyTime)).toBe(true);
    expect(isInInterval([[1, 3], [5, 8]] as Interval[], 5 as WeeklyTime)).toBe(true);
    expect(isInInterval([[1, 3], [5, 8]] as Interval[], 7 as WeeklyTime)).toBe(true);
  });

  test('outside', () => {
    // NB: intervals are left-closed
    expect(isInInterval([1, 5] as Interval, 5 as WeeklyTime)).toBe(false);
    expect(isInInterval([1, 5] as Interval, 6 as WeeklyTime)).toBe(false);
    expect(isInInterval([1, 5] as Interval, 0 as WeeklyTime)).toBe(false);
    expect(isInInterval([1, 5] as Interval, -1 as WeeklyTime)).toBe(false);
    expect(isInInterval([1, 5] as Interval, 0.999 as WeeklyTime)).toBe(false);
    expect(isInInterval([[1, 3], [5, 8]] as Interval[], 4 as WeeklyTime)).toBe(false);
    expect(isInInterval([[1, 3], [5, 8]] as Interval[], 9 as WeeklyTime)).toBe(false);
  });
});
