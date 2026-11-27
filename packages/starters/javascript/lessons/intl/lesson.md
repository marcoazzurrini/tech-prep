# Intl

## Formatting numbers

**Code**

```js
const usd = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" });
const yen = new Intl.NumberFormat("en-US", { style: "currency", currency: "JPY" });
const share = new Intl.NumberFormat("en-US", { style: "percent" });
const short = new Intl.NumberFormat("en-US", { notation: "compact" });

console.log(usd.format(1234.5));
console.log(yen.format(1234.5));
console.log(share.format(0.256));
console.log(short.format(1_234_567));
console.log(new Intl.NumberFormat("de-DE").format(1234.5));
```

**Output**

```text
$1,234.50
¥1,235
26%
1.2M
1.234,5
```

**Rule:** `new Intl.NumberFormat(locale, options)` makes a **formatter**: an object whose `format` method turns a number into text for that locale. `style: "currency"` needs a `currency` code, and the currency decides the decimals. `style: "percent"` multiplies by 100. `notation: "compact"` shortens large numbers.

`{ style: "unit", unit: "kilometer-per-hour" }` formats `50` as `"50 km/h"`.

`(1234.5).toLocaleString("de-DE")` gives `"1.234,5"`. `toLocaleString` is a shortcut that takes the same locale and options.

**Common mistake:** comparing with text that has a plain space.

**Wrong**

```js
const eur = new Intl.NumberFormat("de-DE", { style: "currency", currency: "EUR" });
const label = eur.format(5);

console.log(label === "5,00 €");
```

**Output**

```text
false
```

**Fix**

```js
const eur = new Intl.NumberFormat("de-DE", { style: "currency", currency: "EUR" });
const label = eur.format(5);

console.log(label === «"5,00 €"»);
```

**Output**

```text
true
```

In `de-DE`, the space before `€` is a **no-break space**, ` `: a space that never breaks a line. It looks the same, but it is a different character.

<!-- task -->

## Formatting dates

**Code**

```js
const launch = new Date(Date.UTC(2024, 0, 15, 14, 5));

const us = new Intl.DateTimeFormat("en-US", { dateStyle: "long", timeZone: "UTC" });
const uk = new Intl.DateTimeFormat("en-GB", { dateStyle: "full", timeZone: "UTC" });
const de = new Intl.DateTimeFormat("de-DE", { dateStyle: "short", timeZone: "UTC" });
const tokyo = new Intl.DateTimeFormat("en-GB", { timeStyle: "short", timeZone: "Asia/Tokyo" });

console.log(us.format(launch));
console.log(uk.format(launch));
console.log(de.format(launch));
console.log(tokyo.format(launch));
```

**Output**

```text
January 15, 2024
Monday, 15 January 2024
15.01.24
23:05
```

**Rule:** `Intl.DateTimeFormat` formats a `Date` for a locale. `dateStyle` and `timeStyle` pick a ready format: `"short"`, `"medium"`, `"long"` or `"full"`. `timeZone` says in which zone to show the moment.

You can name the parts instead, such as `{ weekday: "long", day: "numeric", month: "long" }`. Mixing them with `dateStyle` throws a `TypeError`.

**Common mistake:** showing a date in the wrong time zone.

**Wrong**

```js
const due = new Date("2024-01-15");
const format = new Intl.DateTimeFormat("en-US", {
  dateStyle: "medium",
  timeZone: "America/Los_Angeles",
});

console.log(format.format(due));
```

**Output**

```text
Jan 14, 2024
```

**Fix**

```js
const due = new Date("2024-01-15");
const format = new Intl.DateTimeFormat("en-US", {
  dateStyle: "medium",
  timeZone: «"UTC"»,
});

console.log(format.format(due));
```

**Output**

```text
Jan 15, 2024
```

`new Date("2024-01-15")` is midnight UTC. In Los Angeles that moment is still 14 January. With no `timeZone`, a formatter uses the zone of the computer, so it fails the same way there. Show a date-only value in `"UTC"`.

<!-- task -->

## Plural forms

**Code**

```js
const count = new Intl.PluralRules("en-US");
const place = new Intl.PluralRules("en-US", { type: "ordinal" });

console.log(count.select(1));
console.log(count.select(0));
console.log(count.select(2));
console.log([1, 2, 3, 4, 11, 22].map((n) => place.select(n)).join(" "));
```

**Output**

```text
one
other
other
one two few other other two
```

**Rule:** `Intl.PluralRules` tells which plural form a number takes in a language. `select(n)` returns the name of that form, its **category**: `"zero"`, `"one"`, `"two"`, `"few"`, `"many"` or `"other"`. With `type: "ordinal"`, the categories are for places such as 1st and 2nd. Map each category to your own words.

`new Intl.PluralRules("pl").select(2)` gives `"few"`, and `select(5)` gives `"many"`. Polish needs three forms where English needs two.

**Common mistake:** picking a suffix from the last digit.

**Wrong**

```js
const suffix = (n) => (n % 10 === 1 ? "st" : n % 10 === 2 ? "nd" : n % 10 === 3 ? "rd" : "th");

console.log([1, 11, 12, 21].map((n) => n + suffix(n)).join(" "));
```

**Output**

```text
1st 11st 12nd 21st
```

**Fix**

```js
const place = new Intl.PluralRules("en-US", { type: "ordinal" });
const words = { one: "st", two: "nd", few: "rd", other: "th" };
const suffix = (n) => «words[place.select(n)]»;

console.log([1, 11, 12, 21].map((n) => n + suffix(n)).join(" "));
```

**Output**

```text
1st 11th 12th 21st
```

`11`, `12` and `13` end in 1, 2 and 3, but they take `th`. The ordinal rules know these cases.

<!-- task -->

## Lists and relative time

**Code**

```js
const and = new Intl.ListFormat("en-US", { type: "conjunction" });
const or = new Intl.ListFormat("en-GB", { type: "disjunction" });
const when = new Intl.RelativeTimeFormat("en-US", { numeric: "auto" });

console.log(and.format(["tea", "cake", "jam"]));
console.log(or.format(["tea", "cake", "jam"]));
console.log(when.format(-1, "day"));
console.log(when.format(3, "week"));
console.log(when.format(-2, "month"));
```

**Output**

```text
tea, cake, and jam
tea, cake or jam
yesterday
in 3 weeks
2 months ago
```

**Rule:** `Intl.ListFormat` joins a list of strings with commas and a word: "and" for `"conjunction"`, "or" for `"disjunction"`. `Intl.RelativeTimeFormat` writes a time from now, and a negative number is in the past. `numeric: "auto"` uses words such as "yesterday" where the language has them.

`en-US` puts a comma before "and", and `en-GB` does not.

Without `numeric: "auto"`, `format(-1, "day")` gives `"1 day ago"`.

**Common mistake:** joining a list by hand.

**Wrong**

```js
const join = (items) => items.slice(0, -1).join(", ") + " and " + items.at(-1);

console.log(join(["tea", "cake"]));
console.log(join(["tea"]));
```

**Output**

```text
tea and cake
 and tea
```

**Fix**

```js
const list = new Intl.ListFormat("en-GB");
const join = (items) => «list.format(items)»;

console.log(join(["tea", "cake"]));
console.log(join(["tea"]));
```

**Output**

```text
tea and cake
tea
```

With one item, the hand-made version still added " and ". `Intl.ListFormat` handles one item, two items and many.

<!-- task -->

## Remember

- `new Intl.NumberFormat(locale, options).format(n)` writes currency, percent, compact numbers and units. `toLocaleString` is the shortcut.
- Give `Intl.DateTimeFormat` a `timeZone`, or it uses the zone of the computer.
- `Intl.PluralRules` gives a category such as `"one"` or `"few"`. Map it to your own words.
- `Intl.ListFormat` joins lists, and `Intl.RelativeTimeFormat` writes "yesterday" or "in 3 weeks". Always pass a locale.
