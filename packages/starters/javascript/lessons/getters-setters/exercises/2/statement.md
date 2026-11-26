Write `createThermometer()`. It returns an object with two properties:

- `celsius` is a plain property that starts at `0`.
- `fahrenheit` reads as the same temperature in Fahrenheit: `celsius * 9 / 5 + 32`. Assigning to it sets `celsius` to the matching value: `(fahrenheit - 32) * 5 / 9`.

Example 1:
  const t = createThermometer();
  t.fahrenheit  ->  32
  t.celsius = 100;
  t.fahrenheit  ->  212
  t.fahrenheit = 50;
  t.celsius  ->  10
