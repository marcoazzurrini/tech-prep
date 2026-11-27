# Local Time and Time Zones

## Local and UTC parts

**Code**

```js
const meeting = new Date(2024, 6, 4, 9, 30);

console.log(meeting.getFullYear(), meeting.getMonth(), meeting.getDate());
console.log(meeting.getHours(), meeting.getMinutes());

meeting.setHours(meeting.getHours() + 20);
console.log(meeting.getDate(), meeting.getHours());

const call = new Date(Date.UTC(2024, 6, 4, 9, 30));
console.log(call.getUTCHours(), call.getUTCMinutes());
```

**Output**

```text
2024 6 4
9 30
5 5
9 30
```

**Rule:** `new Date(year, month, day, hours, minutes)` reads its parts as **local time**: the clock time in the time zone of the computer that runs the code. `getHours`, `setHours`, `getDate` and the other methods without `UTC` in their name use local time too. So they give back what the constructor took. `Date.UTC` and the `getUTC` and `setUTC` methods use UTC.

`toISOString()` always writes UTC. On a computer in Rome, `new Date(2024, 0, 15).toISOString()` gives `"2024-01-14T23:00:00.000Z"`. Local midnight there is 23:00 UTC the day before.

**Common mistake:** using what a setter returns as a date.

**Wrong**

```js
const reminder = new Date(2024, 6, 4, 9, 30);
const later = reminder.setHours(18);

console.log(later.getHours());
```

**Error**

```text
TypeError: later.getHours is not a function. (In 'later.getHours()', 'later.getHours' is undefined)
```

**Fix**

```js
const reminder = new Date(2024, 6, 4, 9, 30);
const later = «new Date(reminder.setHours(18))»;

console.log(later.getHours());
```

**Output**

```text
18
```

A setter changes the date in place and returns its new number of milliseconds. So `later` was a number, not a date. `new Date(ms)` turns the number back into a date. Node words the error as `later.getHours is not a function`.

<!-- task -->

## Reading date strings

**Code**

```js
const dateOnly = new Date("2024-05-01");
const withTime = new Date("2024-05-01T00:00");
const withOffset = new Date("2024-05-01T02:00:00+02:00");

console.log(dateOnly.getTime() === Date.UTC(2024, 4, 1));
console.log(withTime.getTime() === new Date(2024, 4, 1).getTime());
console.log(withOffset.toISOString());
console.log(withOffset.getTime() === dateOnly.getTime());
```

**Output**

```text
true
true
2024-05-01T00:00:00.000Z
true
```

**Rule:** A date alone, such as `"2024-05-01"`, is read as midnight UTC. A date with a time and nothing after it, such as `"2024-05-01T00:00"`, is read as local time. A `Z` or an **offset** such as `+02:00` fixes the exact moment. The offset is how far that clock is ahead of UTC, so 02:00 at `+02:00` is 00:00 UTC. A minus sign means behind UTC.

`new Date("2024-05-01").getDate()` gives `30` on a computer in New York. Midnight UTC is still 30 April there. Read a date alone with the `getUTC` methods.

A time from another system needs a `Z` or an offset. Without one, each computer reads it in its own zone.

<!-- task -->

## Days of 23 hours

**Code**

```js
const rome = { timeZone: "Europe/Rome" };
const before = new Date("2024-03-31T00:30:00Z");
const after = new Date("2024-03-31T01:30:00Z");

console.log(before.toLocaleTimeString("en-GB", rome));
console.log(after.toLocaleTimeString("en-GB", rome));
console.log((after - before) / 3_600_000);

const noon = new Date("2024-03-30T12:00:00+01:00");
const plus24h = new Date(noon.getTime() + 86_400_000);
console.log(plus24h.toLocaleString("en-GB", rome));
```

**Output**

```text
01:30:00
03:30:00
1
31/03/2024, 13:00:00
```

**Rule:** Many zones use **daylight saving time** (DST): the clocks jump forward one hour in spring and back one hour in autumn. In Rome on 31 March 2024, they jumped from 02:00 to 03:00. The day of a change has 23 or 25 hours. So adding `86_400_000` milliseconds does not always keep the clock time. To move one local day, use `date.setDate(date.getDate() + 1)`. It keeps the clock time in the zone of the computer.

`date.getTimezoneOffset()` gives UTC minus local time, in minutes, at that date. It is positive where the clocks are behind UTC. New York gives `300` in winter and `240` in summer. Rome gives `-60` and `-120`.

**Common mistake:** counting days by rounding down.

**Wrong**

```js
const stay = {
  checkIn: "2024-03-30T00:00:00+01:00",
  checkOut: "2024-04-01T00:00:00+02:00",
};
const ms = new Date(stay.checkOut) - new Date(stay.checkIn);

console.log(Math.floor(ms / 86_400_000));
```

**Output**

```text
1
```

**Fix**

```js
const stay = {
  checkIn: "2024-03-30T00:00:00+01:00",
  checkOut: "2024-04-01T00:00:00+02:00",
};
const ms = new Date(stay.checkOut) - new Date(stay.checkIn);

console.log(«Math.round»(ms / 86_400_000));
```

**Output**

```text
2
```

The two midnights in Rome are 47 hours apart, because the clocks jumped forward. That is just under 2 days of 24 hours. `Math.floor` cut it to 1. `Math.round` gives the 2 nights of the stay.

<!-- task -->

## A day in another zone

**Code**

```js
const kickoff = new Date("2024-07-14T23:00:00Z");
const options = { weekday: "short", hour: "2-digit", minute: "2-digit" };
const show = (timeZone) => kickoff.toLocaleString("en-GB", { ...options, timeZone });

console.log(show("UTC"));
console.log(show("America/New_York"));
console.log(show("Asia/Tokyo"));
console.log(kickoff.toLocaleString("en-GB", { ...options, timeZone: "Asia/Tokyo", timeZoneName: "short" }));
```

**Output**

```text
Sun 23:00
Sun 19:00
Mon 08:00
Mon, 08:00 GMT+9
```

**Rule:** One moment has a different clock time, and sometimes a different day, in each zone. `toLocaleString`, `toLocaleDateString` and `toLocaleTimeString` take the same locale and options as `Intl.DateTimeFormat`. The `timeZone` option names the zone, such as `"Asia/Tokyo"`. Without it, they use the zone of the computer.

`timeZoneName: "short"` adds the zone to the text, such as `GMT+9`.

**Common mistake:** taking the day from `toISOString`.

**Wrong**

```js
const order = { placedAt: "2024-03-10T00:30:00+01:00" };
const placed = new Date(order.placedAt);

console.log(placed.toISOString().slice(0, 10));
```

**Output**

```text
2024-03-09
```

**Fix**

```js
const order = { placedAt: "2024-03-10T00:30:00+01:00" };
const placed = new Date(order.placedAt);

console.log(placed.«toLocaleDateString("en-GB", { timeZone: "Europe/Rome" })»);
```

**Output**

```text
10/03/2024
```

The order came in just after midnight in Rome. In UTC it was still 9 March, and `toISOString` always writes UTC. Ask for the day in the zone where it matters.

<!-- task -->

## Remember

- `new Date(y, m, d)`, `getHours` and `setDate` use the zone of the computer. `Date.UTC` and the `getUTC` methods do not. `toISOString` is always UTC.
- `"2024-05-01"` is midnight UTC. `"2024-05-01T09:00"` is local time. A `Z` or `+02:00` fixes the moment.
- With DST a local day can have 23 or 25 hours. Move a day with `setDate(getDate() + 1)`, not `86_400_000`.
- Show a moment in a zone with the `timeZone` option. `getTimezoneOffset` is UTC minus local, in minutes.
