import { describe, expect, test } from 'vitest';
import { dayCodeToNumber, dayNumberToCode } from './constants';

describe('day number and code mappings', () => {
  test('are inverse', () => {
    expect(Object.fromEntries(Object.entries(dayCodeToNumber).map(([k, v]) => [v, k]))).toEqual(dayNumberToCode);
  });
});
