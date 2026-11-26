`volumeLabel(level)` describes a volume setting. The level is a number from 0 to 10, or `null` when it was never set.

The code below says `"not set"` for level `0` too. Fix it.

Example 1: volumeLabel(7)  ->  "volume 7"
Example 2: volumeLabel(0)  ->  "volume 0"
Example 3: volumeLabel(null)  ->  "not set"
