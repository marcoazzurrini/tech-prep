def find_duplicate(nums: list[int]) -> int:
    # Read nums as a linked list: index i points to index nums[i].
    # Two indexes point to the duplicate, so it is where a cycle begins.
    slow = fast = 0
    while True:
        slow = nums[slow]
        fast = nums[nums[fast]]
        if slow == fast:
            break
    # Restart one pointer at the head. They meet at the cycle start.
    start = 0
    while start != slow:
        start = nums[start]
        slow = nums[slow]
    return start
