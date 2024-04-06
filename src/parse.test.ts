import { describe, expect, test } from 'vitest';
import { parseWeeklyTime, parseIntervals } from './parse';

describe('parseWeeklyTime', () => {
  test.each([
    ['M00:00', 0],
    ['M01:00', 1],
    ['M12:34', 12.566666666666666],
    ['M15:00', 15],
    ['T00:00', 24],
    ['T01:00', 25],
    ['U23:30', 167.5],
  ])('%s -> %s', (daytime, value) => {
    expect(parseWeeklyTime(daytime)).toEqual(value * 60);
  });
});

describe('parseIntervals', () => {
  describe('single intervals', () => {
    test.each([
      ['M00:00 M00:00', [0, 0]],
      ['M00:00 M01:00', [0, 1]],
      ['M10:00 M15:00', [10, 15]],
      ['T00:00 R12:00', [24, 84]],
      ['U23:30 M00:00', [167.5, 168]],
    ])('%s -> %s', (interval, value) => {
      expect(parseIntervals(interval)).toEqual([value.map((v) => v * 60)]);
    });

    test.each([
      ['U23:30 M01:00'],
      ['Q10:30 T01:00'],
      ['M00:00 M24:00'],
      ['M00:00 M09:60'],
      ['R00:00 T12:00'],
    ])('%s -> error', (interval) => {
      expect(() => parseIntervals(interval)).toThrowError();
    });
  });

  describe('multiple intervals', () => {
    test.each([
      ['M10:00 M15:00, T00:00 R12:00', [[10, 15], [24, 84]]],
      ['M10:00 M15:00 , T00:00 R12:00', [[10, 15], [24, 84]]],
      ['M10:00 M15:00 ,T00:00 R12:00', [[10, 15], [24, 84]]],
      ['M10:00 M15:00,T00:00 R12:00', [[10, 15], [24, 84]]],
      ['M10:00 M15:00, M00:00 M18:00', [[10, 15], [0, 18]]],
      ['M10:00 M15:00, U23:30 M00:00', [[10, 15], [167.5, 168]]],
    ])('%s -> %s', (interval, value) => {
      expect(parseIntervals(interval)).toEqual(value.map((vs) => vs.map((v) => v * 60)));
    });

    test.each([
      ['M10:00 M15:00 T00:00 R12:00'],
      ['M10:00 M15:00, T00:00 M12:00'],
      ['M10:00 M15:00, M00:00 Q12:00'],
      ['M10:00 M15:00, U23:30 M01:00'],
    ])('%s -> error', (interval) => {
      expect(() => parseIntervals(interval)).toThrowError();
    });
  });
});
