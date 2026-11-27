# Watch for Changes (medium)

Write `watch(obj, onChange)`. It returns an object that works like `obj`. Reads and writes reach `obj` itself.

After each assignment through it that changes a value, it calls `onChange(key, oldValue, newValue)`. A key that was missing has the old value `undefined`.

An assignment of the same value again does not call `onChange`. `NaN` counts as the same as `NaN`, and `0` is not the same as `-0`.

Example 1:
  const user = watch({ name: "Ada" }, (key, from, to) => console.log(key, from, to));
  user.name = "Bo";  // prints name Ada Bo
  user.name = "Bo";  // prints nothing
