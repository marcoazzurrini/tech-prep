# Kth Largest Element in a Stream (easy)

Implement a class `KthLargest` that receives numbers one at a time and reports the `k`th largest number seen so far. This is the `k`th value in sorted order from the top, so equal values count separately.
- `KthLargest(k, nums)`: stores `k` and starts with the numbers in `nums`.
- `add(val)`: adds `val` to the stream, then returns the `k`th largest number.

Example:
  ops  = ["KthLargest", "add", "add", "add", "add", "add"]
  args = [[3, [4, 5, 8, 2]], [3], [5], [10], [9], [4]]
  ->     [null, 4, 5, 5, 8, 8]

Constraints: 1 <= k <= 10^4, 0 <= len(nums) <= 10^4, -10^4 <= nums[i], val <= 10^4, at most 10^4 calls to `add`. When `add` returns, the stream has at least `k` numbers.
