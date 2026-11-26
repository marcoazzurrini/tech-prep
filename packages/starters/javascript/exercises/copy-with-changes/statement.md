# Copy With Changes (medium)

Write `copyWith(changes)`. It is used as a method: the tests put it on an object, then call it on that object.

It returns a new object. The new object has every property of the object it was called on, with the properties of `changes` on top. The object it was called on stays as it was.

The new object holds `copyWith` too, so calls can follow each other.

Example 1:
  const point = { x: 1, y: 2, copyWith };
  const moved = point.copyWith({ y: 9 });
  moved.x  ->  1
  moved.y  ->  9
  point.y  ->  2
  moved.copyWith({ x: 0 }).x  ->  0
