from ds import ListNode


def reverse_k_group(head: ListNode | None, k: int) -> ListNode | None:
    dummy = ListNode(0, head)
    group_prev = dummy  # the node just before the current group
    while True:
        # Find the k-th node of the group. Stop when fewer than k are left.
        kth = group_prev
        for _ in range(k):
            kth = kth.next
            if not kth:
                return dummy.next
        group_next = kth.next
        # Reverse the group. Its first node ends up pointing at group_next.
        prev, cur = group_next, group_prev.next
        while cur is not group_next:
            cur.next, prev, cur = prev, cur, cur.next
        # Hook the group back in. Its old first node is now its last node.
        first = group_prev.next
        group_prev.next = kth
        group_prev = first
