# Min Max Machine (easy)

The array `tokens` is a program for a small machine. Read the tokens from left to right. Each token is an integer or one of three commands:

- `max` takes the two newest values and gives back the larger one,
- `min` takes the two newest values and gives back the smaller one,
- `neg` takes the newest value and gives back its negative. For example `5` becomes `-5`.

A command removes the values it takes. Its result becomes the newest value. Return the one value that is left at the end.

Example 1: tokens = ["3", "5", "max"] -> 5 Example 2: tokens = ["2", "9", "max", "4", "min"] -> 4 `max` gives 9. Then `min` of 9 and 4 gives 4. Example 3: tokens = ["4", "neg"] -> -4

Constraints: 1 <= len(tokens) <= 1000. The program is always valid, and exactly one value is left at the end.
