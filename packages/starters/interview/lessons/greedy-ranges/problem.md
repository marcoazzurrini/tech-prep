# Room Count Range (easy)

A room starts empty. A sensor at the door writes one letter per event to `log`:

- `E`: one person entered.
- `L`: one person left.
- `?`: the sensor is not sure. One person entered, or nobody did.

Nobody can leave an empty room. Return `[fewest, most]`: the fewest and the most people that can be in the room at the end. Return `[]` if the log is impossible.

Example 1: log = "E?L" -> [0, 1] Example 2: log = "?LL" -> [] (at most one person entered, but two left) Example 3: log = "" -> [0, 0]

Constraints: 0 <= len(log) <= 1000, only the characters `E`, `L` and `?`.
