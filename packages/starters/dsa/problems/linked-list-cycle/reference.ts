import { ListNode } from "./ds.ts";

export function hasCycle(head: ListNode | null): boolean {
  // Floyd: the fast pointer laps the slow one only if there is a loop.
  let slow = head;
  let fast = head;
  while (fast && fast.next) {
    slow = slow!.next;
    fast = fast.next.next;
    if (slow === fast) return true;
  }
  return false;
}
