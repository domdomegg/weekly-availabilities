import { expect, test } from 'vitest';
import * as wt from './index';

test('readme example', () => {
  const meetingStart = wt.parseWeeklyTime('M13:30');
  expect(meetingStart).toBe(810);

  const asJsDate = wt.toDate(meetingStart, new Date('2024-04-05'));
  expect(asJsDate.toISOString()).toBe('2024-04-01T13:30:00.000Z');

  const lunch = wt.parseIntervals('M13:00 M14:00');
  const meetingStartsInLunch = wt.isInInterval(lunch, meetingStart);
  expect(meetingStartsInLunch).toBe(true);

  const p1 = wt.parseIntervals('W09:00 W17:00, F08:00 F10:00');
  const p2 = wt.parseIntervals('F07:00 F09:00');
  const p3 = wt.parseIntervals('W16:00 R03:00, F07:30 F14:00');

  const someoneIsAvailable = wt.unionSchedules([p1, p2, p3]);
  expect(wt.format(someoneIsAvailable)).toBe('W09:00 R03:00, F07:00 F14:00');

  const everyoneIsAvailable = wt.intersectSchedules([p1, p2, p3]);
  expect(wt.format(everyoneIsAvailable)).toBe('F08:00 F09:00');

  const howManyPeopleAreAvailable = wt.calculateScheduleOverlap([p1, p2, p3]);
  expect(howManyPeopleAreAvailable.map((r) => `${wt.format(r.interval)} - ${r.count}`)).toEqual([
    'W09:00 W16:00 - 1',
    'W16:00 W17:00 - 2',
    'W17:00 R03:00 - 1',
    'F07:00 F07:30 - 1',
    'F07:30 F08:00 - 2',
    'F08:00 F09:00 - 3',
    'F09:00 F10:00 - 2',
    'F10:00 F14:00 - 1',
  ]);
});
