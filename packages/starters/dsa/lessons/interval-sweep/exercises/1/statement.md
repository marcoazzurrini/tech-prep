# Cars Turned Away (easy)

A car park has `spaces` parking spaces. Each item of `visits` is one car, `[arrive, leave]`, in no particular order. A car parks if a space is free when it arrives, and stays until `leave`. If all spaces are taken, the car drives away and does not come back. A space that frees up at time `t` can be used by a car that arrives at `t`. No two cars arrive at the same time. Return the number of cars that drive away.

Example 1: visits = [[1, 5], [2, 6], [3, 7]], spaces = 2  ->  1
Example 2: visits = [[1, 5], [5, 9]], spaces = 1  ->  0
Example 3: visits = [[1, 10], [2, 3], [4, 5]], spaces = 1  ->  2

Constraints: 0 <= len(visits) <= 1000, 0 <= arrive < leave <= 10^6, 1 <= spaces <= 1000.
