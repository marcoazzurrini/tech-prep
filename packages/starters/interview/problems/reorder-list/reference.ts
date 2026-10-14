import { ListNode } from "./ds.ts";

export function reorderList(head: ListNode | null): void {
  if (!head) return;
  // 1. Find the middle.
  let slow: ListNode = head;
  let fast: ListNode = head;
  while (fast.next && fast.next.next) {
    slow = slow.next!;
    fast = fast.next.next;
  }
  // 2. Reverse the second half.
  let prev: ListNode | null = null;
  let cur = slow.next;
  slow.next = null;
  while (cur) {
    const next: ListNode | null = cur.next;
    cur.next = prev;
    prev = cur;
    cur = next;
  }
  // 3. Weave the two halves together.
  let first: ListNode | null = head;
  let second = prev;
  while (first && second) {
    const firstNext: ListNode | null = first.next;
    const secondNext: ListNode | null = second.next;
    first.next = second;
    second.next = firstNext;
    first = firstNext;
    second = secondNext;
  }
}
