Write a class `Slider`. `new Slider(min, max)` makes a slider whose value starts at `min`.

- `value` is a getter and a setter. The setter throws a `RangeError` when the new value is below `min` or above `max`, and keeps the old value.
- `percent` is a getter. It gives how far the value is from `min` to `max`, from `0` to `100`.

Keep the value in a private field. `value` and `percent` must be accessors on the prototype, not own properties.

Example 1:
  const slider = new Slider(0, 50);
  slider.value = 25;
  slider.value  ->  25
  slider.percent  ->  50

Example 2: new Slider(10, 20).percent  ->  0
