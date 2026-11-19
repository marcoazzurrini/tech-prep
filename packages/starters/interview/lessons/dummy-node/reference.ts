import { ListNode } from "./ds.ts";

export function insertSorted(
  head: ListNode | null,
  val: number
): ListNode | null {
  const dummy = new ListNode(0, head);
  // Stop at the node that the new node comes after. It may be the dummy.
  let node = dummy;
  while (node.next && node.next.val < val) node = node.next;
  node.next = new ListNode(val, node.next);
  return dummy.next;
}
