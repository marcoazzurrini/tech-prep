import { ListNode } from "./ds.ts";

export function getDecimalValue(head: ListNode | null): number {
  let value = 0;
  let node = head;
  while (node) {
    // Shift the bits read so far one place left, then add the new bit.
    value = value * 2 + node.val;
    node = node.next;
  }
  return value;
}
