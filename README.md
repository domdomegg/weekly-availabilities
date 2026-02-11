# weekly-availabilities

TypeScript library for handling recurring weekly time availabilities, like `M07:30 M12:30, M22:00 T01:00, F07:30 F12:30`

## Usage

Install with `npm install weekly-availabilities`, then use it in your code like this:

```ts
import * as wa from 'weekly-availabilities';

const meetingStart = wa.parseWeeklyTime('M13:30');
// 810 (minutes since start of the week)
// Format anything with wa.format() - the other examples shown formatted

const asJsDate = wa.toDate(meetingStart);
// 'Mon Apr 01 2024 14:30:00 GMT+0100 (British Summer Time)'

const lunch = wa.parseIntervals('M13:00 M14:00');
const meetingStartsInLunch = wa.isInInterval(lunch, meetingStart);
// true

const p1 = wa.parseIntervals('W09:00 W17:00, F08:00 F10:00');
const p2 = wa.parseIntervals('F07:00 F09:00');
const p3 = wa.parseIntervals('W17:00 R03:00, F07:30 F14:00');

const someoneIsAvailable = wa.unionSchedules([p1, p2, p3]);
// W09:00 R03:00, F07:00 F14:00

const everyoneIsAvailable = wa.intersectSchedules([p1, p2, p3]);
// F08:00 F09:00

const howManyPeopleAreAvailable = wa.calculateScheduleOverlap([p1, p2, p3]);
// W09:00 W16:00 - 1
// W16:00 W17:00 - 2
// W17:00 R03:00 - 1
// F07:00 F07:30 - 1
// F07:30 F08:00 - 2
// F08:00 F09:00 - 3
// F09:00 F10:00 - 2
// F10:00 F14:00 - 1

const availability = wa.parseIntervals('M09:00 M17:00');
const blocked = wa.parseIntervals('M11:00 M13:00');
const remaining = wa.subtractIntervals(availability, blocked);
// M09:00 M11:00, M13:00 M17:00
```

## Contributing

Pull requests are welcomed on GitHub! To get started:

1. Install Git and Node.js
2. Clone the repository
3. Install dependencies with `npm install`
4. Run `npm run test` to run tests
5. Build with `npm run build`

## Releases

Versions follow the [semantic versioning spec](https://semver.org/).

To release:

1. Use `npm version <major | minor | patch>` to bump the version
2. Run `git push --follow-tags` to push with tags
3. Wait for GitHub Actions to publish to the NPM registry.
