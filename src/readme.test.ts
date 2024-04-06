import { expect, test } from 'vitest';
import * as wa from './index';

test('readme example', () => {
  const meetingStart = wa.parseWeeklyTime('M13:30');
  expect(meetingStart).toBe(810);

  const asJsDate = wa.toDate(meetingStart, new Date('2024-04-05'));
  expect(asJsDate.toISOString()).toBe('2024-04-01T13:30:00.000Z');

  const lunch = wa.parseIntervals('M13:00 M14:00');
  const meetingStartsInLunch = wa.isInInterval(lunch, meetingStart);
  expect(meetingStartsInLunch).toBe(true);

  const p1 = wa.parseIntervals('W09:00 W17:00, F08:00 F10:00');
  const p2 = wa.parseIntervals('F07:00 F09:00');
  const p3 = wa.parseIntervals('W16:00 R03:00, F07:30 F14:00');

  const someoneIsAvailable = wa.unionSchedules([p1, p2, p3]);
  expect(wa.format(someoneIsAvailable)).toBe('W09:00 R03:00, F07:00 F14:00');

  const everyoneIsAvailable = wa.intersectSchedules([p1, p2, p3]);
  expect(wa.format(everyoneIsAvailable)).toBe('F08:00 F09:00');

  const howManyPeopleAreAvailable = wa.calculateScheduleOverlap([p1, p2, p3]);
  expect(howManyPeopleAreAvailable.map((r) => `${wa.format(r.interval)} - ${r.count}`)).toEqual([
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
