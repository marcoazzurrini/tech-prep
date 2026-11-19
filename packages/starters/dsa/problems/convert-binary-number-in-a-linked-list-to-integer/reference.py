from ds import ListNode


def get_decimal_value(head: ListNode | None) -> int:
    value = 0
    node = head
    while node:
        # Shift the bits read so far one place left, then add the new bit.
        value = value * 2 + node.val
        node = node.next
    return value
