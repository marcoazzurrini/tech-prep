Write `createVolume()`. It returns an object with three functions:

- `up()` raises the level by 1.
- `down()` lowers the level by 1.
- `level()` returns the level.

The level starts at 5. It never goes below 0 or above 10. The object has no other properties.

Example 1:
  const volume = createVolume();
  volume.up();
  volume.level()  ->  6
