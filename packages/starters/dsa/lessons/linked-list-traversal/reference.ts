import { ListNode } from "./ds.ts";

export function lastEvenValue(head: ListNode | null): number {
  let lastEven = -1;
  let node = head;
  while (node) {
    // A later even value replaces the one saved before.
    if (node.val % 2 === 0) lastEven = node.val;
    node = node.next;
  }
  return lastEven;
}
