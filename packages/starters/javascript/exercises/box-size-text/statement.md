# Box Size (medium)

Write `createBox(width, height)`. It returns an object with four properties. None of them is a method: each is read without a call.

- `width` and `height` are plain numbers that can be assigned.
- `area` is always the width times the height. It cannot be assigned: after `box.area = 99`, the area is what it was.
- `size` is a text such as `"3x4"`: the width, an `x`, the height. Assigning a text of that form sets the width and the height, as numbers.

Example 1:
  const box = createBox(3, 4);
  box.area  ->  12
  box.size  ->  "3x4"
  box.size = "10x2";
  box.width  ->  10
  box.area  ->  20
