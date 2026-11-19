from ds import ListNode


def steps_before_cycle(head: ListNode | None) -> int:
    slow = fast = head
    while fast and fast.next:
        slow, fast = slow.next, fast.next.next
        if slow is fast:
            # Restart one pointer at the head. Count its steps to the cycle start.
            steps = 0
            start = head
            while start is not slow:
                start, slow = start.next, slow.next
                steps += 1
            return steps
    return -1  # fast reached the end: no cycle
