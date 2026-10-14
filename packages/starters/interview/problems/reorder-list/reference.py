from ds import ListNode


def reorder_list(head: ListNode | None) -> None:
    if not head:
        return
    # 1. Find the middle.
    slow = fast = head
    while fast.next and fast.next.next:
        slow, fast = slow.next, fast.next.next
    # 2. Reverse the second half.
    prev, cur = None, slow.next
    slow.next = None
    while cur:
        cur.next, prev, cur = prev, cur, cur.next
    # 3. Weave the two halves together.
    first, second = head, prev
    while second:
        first.next, second.next, first, second = second, first.next, first.next, second.next
