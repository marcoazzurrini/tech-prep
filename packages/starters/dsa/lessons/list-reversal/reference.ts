import { ListNode } from "./ds.ts";

export function reverseFirstK(
  head: ListNode | null,
  k: number
): ListNode | null {
  let prev: ListNode | null = null;
  let current = head;
  for (let i = 0; i < k; i++) {
    // Turn one link around, then move forward.
    const next: ListNode | null = current!.next;
    current!.next = prev;
    prev = current;
    current = next;
  }
  // The old head is now the last reversed node. Join it to the rest.
  head!.next = current;
  return prev;
}
