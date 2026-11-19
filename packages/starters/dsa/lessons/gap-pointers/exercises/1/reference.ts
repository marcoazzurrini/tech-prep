import { ListNode } from "./ds.ts";

export function countEchoes(head: ListNode | null, n: number): number {
  // Put lead n steps ahead of the head.
  let lead = head;
  for (let i = 0; i < n; i++) {
    if (!lead) return 0;
    lead = lead.next;
  }
  // Move both. They always stay n nodes apart.
  let trail = head;
  let count = 0;
  while (lead) {
    if (lead.val === trail!.val) count++;
    lead = lead.next;
    trail = trail!.next;
  }
  return count;
}
