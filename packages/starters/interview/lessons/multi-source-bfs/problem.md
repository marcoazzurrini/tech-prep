# Distance to the Nearest Hub (easy)

There are `n` towns, labelled `0` to `n - 1`. Each pair `[a, b]` in `roads` is a road between two towns. It can be used in both directions. The towns listed in `hubs` have a delivery hub.

For every town, find the fewest roads to travel to reach a hub. Return a list `dist` where `dist[t]` is the answer for town `t`. A town with a hub gets `0`. A town that cannot reach a hub gets `-1`.

Example 1: n = 5, roads = [[0, 1], [1, 2], [2, 3], [3, 4]], hubs = [0, 4]  ->  [0, 1, 2, 1, 0]
Example 2: n = 4, roads = [[0, 1], [1, 2]], hubs = [0]  ->  [0, 1, 2, -1]

Constraints: 1 <= n <= 1000, 0 <= roads.length <= 5000, a != b, 1 <= hubs.length <= n, the hubs are distinct.
