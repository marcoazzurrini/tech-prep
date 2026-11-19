import { ListNode } from "./ds.ts";

export function removeNthFromEnd(head: ListNode | null, n: number): ListNode | null {
  const dummy = new ListNode(0, head);
  // Keep `fast` exactly n + 1 nodes ahead of `slow`.
  let slow: ListNode = dummy;
  let fast: ListNode | null = dummy;
  for (let i = 0; i <= n; i++) fast = fast!.next;
  while (fast) {
    slow = slow.next!;
    fast = fast.next;
  }
  slow.next = slow.next!.next;
  return dummy.next;
}
