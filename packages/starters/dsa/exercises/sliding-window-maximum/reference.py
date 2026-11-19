from collections import deque


def max_sliding_window(nums: list[int], k: int) -> list[int]:
    queue = deque()  # indices; their values decrease from front to back
    result = []
    for i, n in enumerate(nums):
        # A smaller, older value can never be the maximum again.
        while queue and nums[queue[-1]] <= n:
            queue.pop()
        queue.append(i)
        # The front index has left the window.
        if queue[0] <= i - k:
            queue.popleft()
        if i >= k - 1:
            result.append(nums[queue[0]])  # the front is the maximum
    return result
