import { describe, expect, test } from 'vitest';
import { fromParts, isValidWeeklyTimeParts, toParts } from './parts';

describe('toParts', () => {
  test.each([
    [540, { day: 0, hour: 9, minute: 0 }],
    [1440, { day: 1, hour: 0, minute: 0 }],
    [4321, { day: 3, hour: 0, minute: 1 }],
  ])('%s -> %s', (weeklyTime, parts) => {
    expect(toParts(weeklyTime)).toEqual(parts);
  });
});

describe('fromParts', () => {
  test.each([
    [{ day: 0, hour: 9, minute: 0 }, 540],
    [{ day: 1, hour: 0, minute: 0 }, 1440],
    [{ day: 3, hour: 0, minute: 1 }, 4321],
  ] as const)('%s -> %s', (parts, weeklyTime) => {
    expect(fromParts(parts)).toEqual(weeklyTime);
  });
});

describe('isValidWeeklyTimeParts', () => {
  test.each([
    [{ day: 0, hour: 9, minute: 0 }, true],
    [{ day: 1, hour: 0, minute: 0 }, true],
    [{ day: 3, hour: 0, minute: 1 }, true],

    [{ day: 7, hour: 0, minute: 0 }, false],
    [{ day: 0, hour: -1, minute: 0 }, false],
    [{ day: 0, hour: 24, minute: 0 }, false],
    [{ day: 0, hour: 24, minute: -1 }, false],
    [{ day: 0, hour: 45, minute: 0 }, false],
  ] as const)('%s -> %s', (parts, isValid) => {
    expect(isValidWeeklyTimeParts(parts)).toEqual(isValid);
  });
});
