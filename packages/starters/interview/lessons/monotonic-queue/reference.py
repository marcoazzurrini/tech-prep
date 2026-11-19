from collections import deque


def largest_window_minimum(nums: list[int], k: int) -> int:
    queue = deque()  # indices; their values increase from front to back
    best = float("-inf")
    for i, n in enumerate(nums):
        # A larger, older value can never be the minimum again.
        while queue and nums[queue[-1]] >= n:
            queue.pop()
        queue.append(i)
        if queue[0] <= i - k:
            queue.popleft()  # the front index has left the window
        if i >= k - 1:
            best = max(best, nums[queue[0]])  # the front is the minimum
    return best
