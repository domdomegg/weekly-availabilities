import { describe, expect, test } from 'vitest';
import { format } from './format';
import { Interval, WeeklyTime } from './types';

describe('format', () => {
  test.each([
    [540 as WeeklyTime, 'M09:00'],
    [1440 as WeeklyTime, 'T00:00'],
    [4321 as WeeklyTime, 'R00:01'],
    [[540, 1440] as Interval, 'M09:00 T00:00'],
    [[[540, 1440]] as Interval[], 'M09:00 T00:00'],
    [[[540, 1440], [4321, 4322]] as Interval[], 'M09:00 T00:00, R00:01 R00:02'],
  ])('%s -> %s', (weeklyTime, parts) => {
    expect(format(weeklyTime)).toEqual(parts);
  });
});
