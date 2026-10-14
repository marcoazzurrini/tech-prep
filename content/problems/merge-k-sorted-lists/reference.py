import heapq

from ds import ListNode


def merge_k_lists(lists: list[ListNode | None]) -> ListNode | None:
    # Min-heap of the current front of each list; the index breaks ties.
    heap = [(node.val, i, node) for i, node in enumerate(lists) if node]
    heapq.heapify(heap)
    dummy = tail = ListNode()
    while heap:
        _, i, node = heapq.heappop(heap)
        tail.next = node
        tail = node
        if node.next:
            heapq.heappush(heap, (node.next.val, i, node.next))
    return dummy.next
