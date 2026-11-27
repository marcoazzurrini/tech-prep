# Date

## A date is a number

**Code**

```js
const start = new Date(0);
const later = new Date(86_400_000);

console.log(start.getTime());
console.log(start.toISOString());
console.log(later.toISOString());
console.log(later - start);
```

**Output**

```text
0
1970-01-01T00:00:00.000Z
1970-01-02T00:00:00.000Z
86400000
```

**Rule:** A `Date` holds one number: the milliseconds since the start of 1970, in UTC. `getTime()` gives that number. `toISOString()` writes it as text in UTC, and the `Z` at the end means UTC.

`later - start` turns both dates into numbers, so it gives the milliseconds between them. One day is `24 * 60 * 60 * 1000`, which is `86400000`.

`new Date()` holds the current moment, and `Date.now()` gives its number. Both change on every run.

**Common mistake:** comparing two dates with `===`.

**Wrong**

```js
const booked = new Date("2024-05-01");
const paid = new Date("2024-05-01");

console.log(booked === paid);
```

**Output**

```text
false
```

**Fix**

```js
const booked = new Date("2024-05-01");
const paid = new Date("2024-05-01");

console.log(booked«.getTime()» === paid«.getTime()»);
```

**Output**

```text
true
```

Each `new Date` is a separate object, and `===` compares objects by identity. Compare their numbers instead. `<` and `>` do work on dates, because they turn both sides into numbers.

<!-- task -->

## Months count from 0

**Code**

```js
const ms = Date.UTC(2024, 1, 29, 18, 30);
const leapDay = new Date(ms);

console.log(leapDay.toISOString());
console.log(leapDay.getUTCFullYear());
console.log(leapDay.getUTCMonth());
console.log(leapDay.getUTCDate());
console.log(leapDay.getUTCDay());
```

**Output**

```text
2024-02-29T18:30:00.000Z
2024
1
29
4
```

**Rule:** `Date.UTC(year, month, day, hours, minutes)` gives the milliseconds of a moment in UTC. Months count from 0, so `1` is February. The `getUTC` methods read the parts back. `getUTCDate` gives the day of the month, and `getUTCDay` the day of the week, from `0` for Sunday.

`getMonth`, `getDate` and `new Date(2024, 1, 29)` use the time zone of the computer. Use the UTC versions to get the same result everywhere.

`Date.UTC(99, 0, 1)` is in 1999. A year from 0 to 99 means 1900 plus that year.

**Common mistake:** writing the month as people do.

**Wrong**

```js
const christmas = new Date(Date.UTC(2024, 12, 25));

console.log(christmas.toISOString());
```

**Output**

```text
2025-01-25T00:00:00.000Z
```

**Fix**

```js
const christmas = new Date(Date.UTC(2024, «11», 25));

console.log(christmas.toISOString());
```

**Output**

```text
2024-12-25T00:00:00.000Z
```

Month `12` is the thirteenth month, so it rolled over into January of the next year. December is `11`.

<!-- task -->

## Out of range rolls over

**Code**

```js
const due = new Date(Date.UTC(2024, 0, 30));

due.setUTCDate(due.getUTCDate() + 3);
console.log(due.toISOString());

console.log(new Date(Date.UTC(2024, 1, 30)).toISOString());
console.log(new Date(Date.UTC(2024, 2, 0)).toISOString());
```

**Output**

```text
2024-02-02T00:00:00.000Z
2024-03-01T00:00:00.000Z
2024-02-29T00:00:00.000Z
```

**Rule:** A part that is out of range rolls over into the next one. Day 33 of January is 2 February, and day 0 is the last day of the month before. `setUTCDate` changes the date in place, and it rolls over too.

Adding `3 * 86_400_000` to `getTime()` gives the same result. In UTC, every day has exactly 24 hours.

**Common mistake:** changing a date that another name also points at.

**Wrong**

```js
const start = new Date(Date.UTC(2024, 4, 1));
const end = start;

end.setUTCDate(end.getUTCDate() + 7);
console.log(start.toISOString().slice(0, 10));
console.log(end.toISOString().slice(0, 10));
```

**Output**

```text
2024-05-08
2024-05-08
```

**Fix**

```js
const start = new Date(Date.UTC(2024, 4, 1));
const end = «new Date(start)»;

end.setUTCDate(end.getUTCDate() + 7);
console.log(start.toISOString().slice(0, 10));
console.log(end.toISOString().slice(0, 10));
```

**Output**

```text
2024-05-01
2024-05-08
```

A `Date` is an object, so `end = start` copies a reference. `setUTCDate` then changed the one date both names share. `new Date(start)` makes a copy that holds the same number.

<!-- task -->

## Reading date text

**Code**

```js
const day = new Date("2024-01-15");
const exact = new Date("2024-01-15T10:00:00Z");
const bad = new Date("15/01/2024");

console.log(day.toISOString());
console.log(exact.toISOString());
console.log(bad.getTime());
console.log(Number.isNaN(bad.getTime()));
```

**Output**

```text
2024-01-15T00:00:00.000Z
2024-01-15T10:00:00.000Z
NaN
true
```

**Rule:** `new Date(text)` reads the ISO form `YYYY-MM-DD`, with an optional time such as `T10:00:00Z`. A date alone is read as midnight UTC. Text it cannot read gives an **invalid date**: a `Date` whose number is `NaN`.

A time without the `Z`, such as `"2024-01-15T10:00"`, is read in the time zone of the computer. End a time with `Z`, or with an offset such as `+02:00`.

Text in any other form is read differently by each engine. Do not rely on it.

**Common mistake:** formatting a date without checking it.

**Wrong**

```js
const input = { due: "next friday" };
const due = new Date(input.due);

console.log(due.toISOString());
```

**Error**

```text
RangeError: Invalid Date
```

**Fix**

```js
const input = { due: "next friday" };
const due = new Date(input.due);

console.log(«Number.isNaN(due.getTime()) ? "no date" :» due.toISOString());
```

`new Date` does not throw on bad text. It gives an invalid date, and `toISOString` throws a `RangeError` on it. Test `getTime()` for `NaN` first. Node words the error as `Invalid time value`.

<!-- task -->

## Remember

- A `Date` holds the milliseconds since 1970, in UTC. Subtract two dates to get the milliseconds between them.
- Months count from 0. Use `Date.UTC` and the `getUTC` methods, so the time zone of the computer does not matter.
- A part out of range rolls over: day 0 is the last day of the month before. `setUTCDate` changes the date in place.
- `new Date("2024-01-15")` is midnight UTC. Bad text gives an invalid date, whose `getTime()` is `NaN`.
