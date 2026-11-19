import { ListNode } from "./ds.ts";

export function stepsBeforeCycle(head: ListNode | null): number {
  let slow = head;
  let fast = head;
  while (fast && fast.next) {
    slow = slow!.next;
    fast = fast.next.next;
    if (slow === fast) {
      // Restart one pointer at the head. Count its steps to the cycle start.
      let steps = 0;
      let start = head;
      while (start !== slow) {
        start = start!.next;
        slow = slow!.next;
        steps++;
      }
      return steps;
    }
  }
  return -1; // fast reached the end: no cycle
}
