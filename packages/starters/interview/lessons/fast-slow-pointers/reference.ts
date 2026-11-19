import { ListNode } from "./ds.ts";

export function sumFirstHalf(head: ListNode | null): number {
  let total = 0;
  let slow = head;
  let fast = head;
  // Each double step of fast pays for one node of the first half.
  while (fast && fast.next) {
    total += slow!.val;
    slow = slow!.next;
    fast = fast.next.next;
  }
  return total;
}
