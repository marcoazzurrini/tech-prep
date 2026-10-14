# Find Median from Data Stream (hard)

Implement a class `MedianFinder` that receives numbers one at a time and can report the median of everything seen so far. With an odd count the median is the middle value; with an even count it is the average of the two middle values (so it may end in .5).
- `MedianFinder()`: creates an empty finder.
- `addNum(num)`: adds an integer to the stream.
- `findMedian()`: returns the current median.

Example:
  ops  = ["MedianFinder", "addNum", "addNum", "findMedian", "addNum", "findMedian"]
  args = [[], [1], [2], [], [3], []]
  ->     [null, null, null, 1.5, null, 2]

Constraints: -10^5 <= num <= 10^5, `findMedian` is only called after at least one `addNum`, at most 5 * 10^4 calls.
Follow-up: make `addNum` O(log n) and `findMedian` O(1).
