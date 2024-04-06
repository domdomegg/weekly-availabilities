import { describe, expect, test } from 'vitest';
import { fromDate, mostRecentMondayStartUtc, toDate } from './date';
import { WeeklyTime } from './parse';

describe('mostRecentMondayStartUtc', () => {
  test.each([
    ['2023-02-25T12:34:56-08:00', '2023-02-20T00:00:00.000Z'],
    ['2023-02-26T00:00:00-08:00', '2023-02-20T00:00:00.000Z'],
    ['2023-02-26T15:59:59-08:00', '2023-02-20T00:00:00.000Z'],
    ['2023-02-26T16:00:00-08:00', '2023-02-27T00:00:00.000Z'],
    ['2023-02-26T18:00:00-08:00', '2023-02-27T00:00:00.000Z'],
    ['2023-02-27T00:00:00-08:00', '2023-02-27T00:00:00.000Z'],
    ['2023-02-27T12:34:56-08:00', '2023-02-27T00:00:00.000Z'],
    ['2023-02-27T00:00:00.000Z', '2023-02-27T00:00:00.000Z'],
  ])('%s -> %s', (input: string, expected: string) => {
    expect(mostRecentMondayStartUtc(new Date(input)).toISOString()).toBe(expected);
  });
});

describe('toDate', () => {
  test.each([
    [540, '2023-02-25T12:34:56-08:00', '2023-02-20T09:00:00.000Z'],
    [1440, '2023-02-25T12:34:56-08:00', '2023-02-21T00:00:00.000Z'],
    [600, '2023-02-27T00:00:00.000Z', '2023-02-27T10:00:00.000Z'],
  ])('%s, %s -> %s', (weeklyTime: number, utcWeekDate: string, expected: string) => {
    expect(toDate(weeklyTime as WeeklyTime, new Date(utcWeekDate)).toISOString()).toBe(expected);
  });
});

describe('fromDate', () => {
  test.each([
    ['2023-02-20T09:00:00.000Z', 540],
    ['2023-02-21T00:00:00.000Z', 1440],
    ['2023-02-27T10:00:00.000Z', 600],
  ])('%s -> %s', (date: string, weeklyTime: number) => {
    expect(fromDate(new Date(date))).toBe(weeklyTime);
  });

  test('throws error if would require unspecified rounding', () => {
    expect(() => fromDate(new Date('2023-02-20T09:00:01.000Z'))).toThrow();
  });

  test('rounds when enabled', () => {
    expect(fromDate(new Date('2023-02-20T09:00:01.000Z'), true)).toBe(540);
  });
});
