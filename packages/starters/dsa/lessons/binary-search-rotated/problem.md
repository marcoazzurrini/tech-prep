# Where the Playlist Wraps (easy)

A playlist holds songs with different ID numbers. It plays them in increasing order of ID, but it may start in the middle. After the song with the largest ID, it wraps around to the smallest ID and goes on.

The array `ids` lists the songs in the order they play. Return the index of the song with the largest ID. Your solution must run in O(log n) time.

Example 1: ids = [40, 50, 60, 10, 20, 30] -> 2 The largest ID is 60, at index 2. The playlist wraps after it. Example 2: ids = [1, 2, 3] -> 2 The playlist starts at the smallest ID, so the largest is last. Example 3: ids = [5, 1, 2, 3, 4] -> 0

Constraints: 1 <= len(ids) <= 10^4, 1 <= ids[i] <= 10^6. All IDs are different.
