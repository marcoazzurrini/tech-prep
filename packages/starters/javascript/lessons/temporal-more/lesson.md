# More Temporal Types

## An exact moment

**Code**

```js
const launch = Temporal.Instant.from("2024-07-01T12:00:00Z");

console.log(launch.epochMilliseconds);
console.log(Temporal.Instant.fromEpochMilliseconds(0).toString());
console.log(launch.add({ hours: 36 }).toString());
console.log(launch.toZonedDateTimeISO("Asia/Tokyo").toString());
console.log(launch.year);
```

**Output**

```text
1719835200000
1970-01-01T00:00:00Z
2024-07-03T00:00:00Z
2024-07-01T21:00:00+09:00[Asia/Tokyo]
undefined
```

**Rule:** `Temporal.Instant` is one exact moment, with no time zone and no calendar. Like a `Date`, it counts from the start of 1970 in UTC, and `epochMilliseconds` gives that count. To read a year or an hour, place it in a zone with `toZonedDateTimeISO(zone)`.

`date.toTemporalInstant()` turns a `Date` into an `Instant`. `new Date(instant.epochMilliseconds)` turns it back.

`Temporal.Instant.from` needs a `Z` or an offset from UTC, such as `+02:00`, at the end of the string. Without one, it throws a `RangeError`.

**Common mistake:** adding days to an `Instant`.

**Wrong**

```js
const sent = Temporal.Instant.from("2024-11-02T15:00:00Z");

console.log(sent.add({ days: 1 }).toString());
```

**Error**

```text
RangeError: Adding days not supported by Temporal.Instant. Try Temporal.ZonedDateTime instead
```

**Fix**

```js
const sent = Temporal.Instant.from("2024-11-02T15:00:00Z");
const local = sent«.toZonedDateTimeISO("America/New_York")»;

console.log(local.add({ days: 1 }).toInstant().toString());
```

**Output**

```text
2024-11-03T16:00:00Z
```

An `Instant` adds hours and smaller units. It has no time zone, so it cannot know how long a day is. Add the day in a zone, then turn the result back. That New York day had 25 hours.

<!-- task -->

## When clocks change

**Code**

```js
const sunday = Temporal.ZonedDateTime.from("2024-03-31T12:00[Europe/Berlin]");

console.log(sunday.hoursInDay);
console.log(sunday.offset);
console.log(sunday.startOfDay().toString());

const missing = sunday.with({ hour: 2, minute: 30 });
console.log(missing.toString());

const early = sunday.with({ hour: 2, minute: 30 }, { disambiguation: "earlier" });
console.log(early.toString());
```

**Output**

```text
23
+02:00
2024-03-31T00:00:00+01:00[Europe/Berlin]
2024-03-31T03:30:00+02:00[Europe/Berlin]
2024-03-31T01:30:00+01:00[Europe/Berlin]
```

**Rule:** `offset` is the gap between the clock in the zone and UTC. When the clocks change, the offset changes and `hoursInDay` is usually 23 or 25. The `disambiguation` option settles a clock time that is missing or that happens twice.

`disambiguation: "compatible"` is the default, and it does what `Date` does. Berlin clocks jumped from 02:00 to 03:00 that night, so it moved the missing 02:30 forward. For a time that happens twice, it picks the earlier one. `"later"` picks the later one, and `"reject"` throws a `RangeError`.

`startOfDay()` gives the first moment of the day. That is not always midnight.

**Common mistake:** testing for the same moment with `equals`.

**Wrong**

```js
const call = Temporal.ZonedDateTime.from("2024-06-03T09:00[America/New_York]");
const meet = Temporal.ZonedDateTime.from("2024-06-03T14:00[Europe/London]");

console.log(call.equals(meet));
```

**Output**

```text
false
```

**Fix**

```js
const call = Temporal.ZonedDateTime.from("2024-06-03T09:00[America/New_York]");
const meet = Temporal.ZonedDateTime.from("2024-06-03T14:00[Europe/London]");

console.log(«Temporal.ZonedDateTime.compare(call, meet) === 0»);
```

**Output**

```text
true
```

Both are 13:00 in UTC. `equals` also asks for the same time zone, so it said `false`. `compare` looks at the moment alone.

<!-- task -->

## Part of a date

**Code**

```js
const billing = Temporal.PlainYearMonth.from("2024-02");

console.log(billing.daysInMonth);
console.log(billing.add({ months: 1 }).toString());
console.log(billing.toPlainDate({ day: 31 }).toString());

const birthday = Temporal.PlainMonthDay.from("02-29");

console.log(birthday.toPlainDate({ year: 2028 }).toString());
console.log(birthday.toPlainDate({ year: 2027 }).toString());
```

**Output**

```text
29
2024-03
2024-02-29
2028-02-29
2027-02-28
```

**Rule:** `PlainYearMonth` is one month of one year, such as a billing month. `PlainMonthDay` is a day that comes back every year, such as a birthday. `toPlainDate` adds the missing part. A day that does not exist becomes the last day of the month.

`Temporal.PlainMonthDay.from({ month: 2, day: 30 })` gives `02-29`. The `overflow` option decides this: its default, `"constrain"`, moves the day into range, and `"reject"` throws a `RangeError`.

`birthday.monthCode` gives `"M02"`. A `PlainMonthDay` has no `month`, no `add` and no `compare`.

**Common mistake:** passing a bare year to `toPlainDate`.

**Wrong**

```js
const birthday = Temporal.PlainMonthDay.from("07-14");

console.log(birthday.toPlainDate(2025).toString());
```

**Error**

```text
TypeError: Temporal.PlainMonthDay.prototype.toPlainDate: item is not an object
```

**Fix**

```js
const birthday = Temporal.PlainMonthDay.from("07-14");

console.log(birthday.toPlainDate(«{ year: 2025 }»).toString());
```

**Output**

```text
2025-07-14
```

`toPlainDate` takes an object with the missing fields, so a number throws a `TypeError`. Name the field: `{ year: 2025 }`, or `{ day: 1 }` for a `PlainYearMonth`.

<!-- task -->

## Units and rounding

**Code**

```js
const start = Temporal.Instant.from("2024-05-01T08:00:00Z");
const end = Temporal.Instant.from("2024-05-03T10:20:40Z");

console.log(start.until(end).toString());
console.log(start.until(end, { largestUnit: "hours" }).toString());
console.log(start.until(end, { largestUnit: "hours", smallestUnit: "hours" }).toString());

const month = Temporal.Duration.from({ months: 1 });
console.log(month.total({ unit: "days", relativeTo: "2024-02-01" }));
```

**Output**

```text
PT181240S
PT50H20M40S
PT50H
29
```

**Rule:** `until` and `since` take `largestUnit` and `smallestUnit`. Between two instants the default largest unit is seconds, and between two `ZonedDateTime`s it is hours. `relativeTo` is the date a duration starts from. `total` needs it for months, because a month has no fixed length.

`duration.round({ smallestUnit: "hours" })` rounds a duration. `roundingMode` says how: the default `"halfExpand"` rounds a half away from zero, `"floor"` rounds down and `"ceil"` rounds up.

An `Instant` throws a `RangeError` for `largestUnit: "days"`, because it has no time zone.

**Common mistake:** rounding to the nearest unit when every started unit counts.

**Wrong**

```js
const call = Temporal.Duration.from({ minutes: 4, seconds: 5 });
const charged = call.round({ smallestUnit: "minutes" });

console.log(charged.minutes);
```

**Output**

```text
4
```

**Fix**

```js
const call = Temporal.Duration.from({ minutes: 4, seconds: 5 });
const charged = call.round({ smallestUnit: "minutes"«, roundingMode: "ceil"» });

console.log(charged.minutes);
```

**Output**

```text
5
```

The phone plan charges for every minute that has started. The default mode rounds to the nearest minute, so 5 seconds were dropped. `"ceil"` always rounds up.

<!-- task -->

## Remember

- An `Instant` is an exact moment with no zone. It adds hours, not days. Use `toZonedDateTimeISO(zone)` to read its date.
- A zoned day can have 23 or 25 hours. `disambiguation` settles a clock time that is missing or doubled. `equals` also compares the zone.
- `PlainYearMonth` and `PlainMonthDay` hold part of a date. `toPlainDate` adds the rest. A day that does not exist becomes the last day of the month.
- `until` takes `largestUnit` and `smallestUnit`. `round` takes `roundingMode`, and `total` needs `relativeTo` for months.
