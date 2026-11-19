# Gas Station (medium)

Gas stations stand in a circle. Station `i` gives you `gas[i]` units of fuel. Driving from station `i` to the next station uses `cost[i]` units. After the last station comes station 0 again.

You start at one station with an empty tank. The tank has no size limit. Return the index of the station where you can start and drive once around the whole circle. Return -1 if no station works. The tests have at most one station that works.

Example 1: gas = [1, 2, 3, 4, 5], cost = [3, 4, 5, 1, 2]  ->  3
Example 2: gas = [2, 3, 4], cost = [3, 4, 3]  ->  -1

Constraints: 1 <= len(gas) = len(cost) <= 10^5, 0 <= gas[i], cost[i] <= 10^4.
Follow-up: can you do it in one pass?
