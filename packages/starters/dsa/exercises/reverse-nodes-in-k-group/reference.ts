import { ListNode } from "./ds.ts";

export function reverseKGroup(head: ListNode | null, k: number): ListNode | null {
  const dummy = new ListNode(0, head);
  let groupPrev = dummy; // the node just before the current group
  while (true) {
    // Find the k-th node of the group. Stop when fewer than k are left.
    let kth: ListNode | null = groupPrev;
    for (let i = 0; i < k; i++) {
      kth = kth.next;
      if (!kth) return dummy.next;
    }
    const groupNext: ListNode | null = kth.next;
    // Reverse the group. Its first node ends up pointing at groupNext.
    let prev = groupNext;
    let cur = groupPrev.next;
    while (cur && cur !== groupNext) {
      const next: ListNode | null = cur.next;
      cur.next = prev;
      prev = cur;
      cur = next;
    }
    // Hook the group back in. Its old first node is now its last node.
    const first = groupPrev.next!;
    groupPrev.next = kth;
    groupPrev = first;
  }
}
