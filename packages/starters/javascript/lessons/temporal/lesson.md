# Temporal

## Plain dates

**Code**

```js
const start = Temporal.PlainDate.from("2024-01-31");
const next = start.add({ months: 1 });

console.log(start.month);
console.log(start.dayOfWeek);
console.log(next.toString());
console.log(start.toString());
```

**Output**

```text
1
3
2024-02-29
2024-01-31
```

**Rule:** `Temporal.PlainDate` is a calendar date with no time and no time zone. Unlike `Date`, months count from 1, and `dayOfWeek` runs from 1 for Monday to 7 for Sunday. A Temporal object never changes: `add` returns a new one. When the day does not exist in the new month, `add` uses the last day.

`Temporal.PlainDate.from("2024-02-30")` throws a `RangeError`. `Date` would quietly roll over into March.

`start.with({ day: 1 })` gives `2024-01-01`: a copy with the fields you name changed. Like `add`, it uses the last day of the month when the day does not exist.

**Common mistake:** calling `add` and dropping its result.

**Wrong**

```js
const due = Temporal.PlainDate.from("2024-05-01");

due.add({ days: 7 });
console.log(due.toString());
```

**Output**

```text
2024-05-01
```

**Fix**

```js
const due = Temporal.PlainDate.from("2024-05-01");

const later = «due.add({ days: 7 })»;
console.log(later.toString());
```

**Output**

```text
2024-05-08
```

`add` does not change `due`. It returns a new date, and the code threw it away. Keep the result in a variable.

<!-- task -->

## Times and time zones

**Code**

```js
const time = Temporal.PlainTime.from("23:30");
console.log(time.add({ minutes: 45 }).toString());

const meeting = Temporal.PlainDateTime.from("2024-03-14T09:00");
console.log(meeting.add({ days: 1 }).toString());

const call = Temporal.ZonedDateTime.from("2024-03-14T09:00[America/New_York]");
console.log(call.toString());
console.log(call.withTimeZone("Europe/Paris").toString());
console.log(call.toInstant().toString());
```

**Output**

```text
00:15:00
2024-03-15T09:00:00
2024-03-14T09:00:00-04:00[America/New_York]
2024-03-14T14:00:00+01:00[Europe/Paris]
2024-03-14T13:00:00Z
```

**Rule:** Each type holds only what its name says. `PlainTime` is a time of day, and `PlainDateTime` is a date with a time. Neither has a time zone. `ZonedDateTime` is an exact moment in a named time zone, such as `America/New_York`. `Instant` is an exact moment with no zone, shown in UTC.

`PlainTime` wraps past midnight, so `23:30` plus 45 minutes is `00:15`.

**Common mistake:** adding 24 hours to move one day.

**Wrong**

```js
const start = Temporal.ZonedDateTime.from("2024-10-27T00:30[Europe/London]");

console.log(start.add({ hours: 24 }).toString());
```

**Output**

```text
2024-10-27T23:30:00+00:00[Europe/London]
```

**Fix**

```js
const start = Temporal.ZonedDateTime.from("2024-10-27T00:30[Europe/London]");

console.log(start.add({ «days: 1» }).toString());
```

**Output**

```text
2024-10-28T00:30:00+00:00[Europe/London]
```

On 27 October 2024 the clocks in London went back one hour, so that day had 25 hours. `hours: 24` counts exact time. `days: 1` keeps the same time on the clock.

<!-- task -->

## Durations

**Code**

```js
const signup = Temporal.PlainDate.from("2024-01-15");
const renewal = Temporal.PlainDate.from("2024-03-01");

const gap = signup.until(renewal);
console.log(gap.toString());
console.log(gap.days);
console.log(signup.until(renewal, { largestUnit: "months" }).toString());
console.log(renewal.since(signup).days);

const film = Temporal.Duration.from({ hours: 2, minutes: 15 });
console.log(film.total("minutes"));
```

**Output**

```text
P46D
46
P1M15D
46
135
```

**Rule:** `a.until(b)` gives a `Temporal.Duration`: the time from `a` to `b`. `b.since(a)` gives the same. Between two dates, the result counts in days, unless `largestUnit` asks for months or years. `total(unit)` gives the whole duration as one number.

A duration prints in ISO form. `P1M15D` is 1 month and 15 days. `PT2H15M` is 2 hours and 15 minutes: the `T` comes before the time part.

**Common mistake:** reading months from a duration counted in days.

**Wrong**

```js
const start = Temporal.PlainDate.from("2024-01-10");
const end = Temporal.PlainDate.from("2024-04-20");

console.log(start.until(end).months);
```

**Output**

```text
0
```

**Fix**

```js
const start = Temporal.PlainDate.from("2024-01-10");
const end = Temporal.PlainDate.from("2024-04-20");

console.log(start.until(end«, { largestUnit: "months" }»).months);
```

**Output**

```text
3
```

`until` counted 101 days, so the months field was empty. Ask for months with `largestUnit`.

<!-- task -->

## Comparing

**Code**

```js
const may = Temporal.PlainDate.from("2024-05-01");
const march = Temporal.PlainDate.from("2024-03-15");
const mayAgain = Temporal.PlainDate.from("2024-05-01");

console.log(Temporal.PlainDate.compare(may, march));
console.log(Temporal.PlainDate.compare(march, may));
console.log(Temporal.PlainDate.compare(may, mayAgain));
console.log(may.equals(mayAgain));
console.log(may === mayAgain);
```

**Output**

```text
1
-1
0
true
false
```

**Rule:** `Temporal.PlainDate.compare(a, b)` gives `-1` when `a` comes first, `1` when `b` comes first, and `0` for the same day. It works as a compare function as it is. `a.equals(b)` tests for the same value, and `===` still compares identity.

Each type has its own `compare`, such as `Temporal.PlainTime.compare` and `Temporal.ZonedDateTime.compare`.

**Common mistake:** comparing with `-` or `<`.

**Wrong**

```js
const days = [Temporal.PlainDate.from("2024-03-01"), Temporal.PlainDate.from("2023-12-25")];
const sorted = days.toSorted((a, b) => a - b);

console.log(sorted.join(" "));
```

**Error**

```text
TypeError: Temporal.PlainDate.prototype.valueOf must not be called. To compare PlainDate values, use Temporal.PlainDate.compare
```

**Fix**

```js
const days = [Temporal.PlainDate.from("2024-03-01"), Temporal.PlainDate.from("2023-12-25")];
const sorted = days.toSorted(«Temporal.PlainDate.compare»);

console.log(sorted.join(" "));
```

**Output**

```text
2023-12-25 2024-03-01
```

A Temporal object refuses to become a number, so `-`, `<` and `>` throw a `TypeError`. That stops a comparison that would be quietly wrong. Use `compare`.

<!-- task -->

## Remember

- A Temporal object never changes: `add`, `subtract` and `with` return a new one. Months count from 1.
- `PlainDate`, `PlainTime` and `PlainDateTime` have no time zone. `ZonedDateTime` is a moment in a named zone, and `Instant` is an exact moment.
- `a.until(b)` and `b.since(a)` give a `Duration`. Pass `largestUnit` to count in months or years.
- Compare with `compare` or `equals`. `<` and `-` throw, and `===` compares identity.
