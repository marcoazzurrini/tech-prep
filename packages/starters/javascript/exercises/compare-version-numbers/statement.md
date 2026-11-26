# Compare Versions (medium)

Write `compareVersions(a, b)`. Each argument is a version such as `"2.10.1"`: one, two or three whole numbers joined by dots.

A part that is left out counts as `0`, so `"2"` is the same version as `"2.0.0"`.

Return `-1` when `a` is the older version, `1` when `a` is the newer one, and `0` when they are the same.

Example 1: compareVersions("1.2.3", "1.2.4")  ->  -1
Example 2: compareVersions("2.10", "2.9.9")  ->  1
Example 3: compareVersions("2", "2.0.0")  ->  0
