# Duration Units (medium)

Write a class `Duration`. `new Duration(seconds)` holds a length of time as a whole number of seconds.

- `seconds` is a getter and a setter. The setter accepts only a whole number that is `0` or more. For anything else it throws a `RangeError` and keeps the old value. The constructor checks its argument the same way.
- `minutes` is a getter and a setter. It reads the time in minutes, which may be a fraction. Assigning minutes sets the seconds, with the same check.
- `label` is a getter only. It gives the time as `"M:SS"`: the whole minutes, a colon, then the seconds left over, always with two digits.

A duration has no own properties: `Object.keys` gives `[]`.

Example 1:
  const d = new Duration(150);
  d.minutes  ->  2.5
  d.label  ->  "2:30"

Example 2:
  const d = new Duration(0);
  d.minutes = 1.5;
  d.seconds  ->  90

Example 3: new Duration(3605).label  ->  "60:05"
