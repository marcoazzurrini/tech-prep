`drain(tank, times)` should open the tank's valve `times` times, then return the litres that are left.

`tank` is an object with a number `litres` and a method `open()`, which lets some litres out.

The code below throws a `TypeError`. Fix it, and leave `repeat` as it is.

Example 1:
  const tank = { litres: 10, open() { this.litres -= 2; } };
  drain(tank, 3)  ->  4
