# Remote Control (easy)

`createRemote(tv)` should return the two buttons of a remote control:

- `louder()` raises the volume of the TV by 1.
- `mute()` sets the volume of the TV to 0.

Each button returns the new volume. A button must work however it is called.

In the code below, the buttons do not change the TV. Fix `createRemote`. Leave `createTv` as it is.

Example 1:
  const tv = createTv();
  const remote = createRemote(tv);
  remote.louder()  ->  6
  remote.mute()  ->  0
  tv.volume  ->  0
