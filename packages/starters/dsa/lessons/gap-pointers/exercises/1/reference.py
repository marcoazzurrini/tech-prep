from ds import ListNode


def count_echoes(head: ListNode | None, n: int) -> int:
    # Put lead n steps ahead of the head.
    lead = head
    for _ in range(n):
        if not lead:
            return 0
        lead = lead.next
    # Move both. They always stay n nodes apart.
    trail = head
    count = 0
    while lead:
        if lead.val == trail.val:
            count += 1
        lead = lead.next
        trail = trail.next
    return count
