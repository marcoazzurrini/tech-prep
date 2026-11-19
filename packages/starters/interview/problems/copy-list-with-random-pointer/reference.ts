import { RandomNode } from "./ds.ts";

export function copyRandomList(head: RandomNode | null): RandomNode | null {
  // First pass: one copy per node, found again through a map.
  const copies = new Map<RandomNode, RandomNode>();
  for (let node = head; node; node = node.next) copies.set(node, new RandomNode(node.val));

  // Second pass: wire the copies to each other.
  for (let node = head; node; node = node.next) {
    const copy = copies.get(node)!;
    copy.next = node.next ? copies.get(node.next)! : null;
    copy.random = node.random ? copies.get(node.random)! : null;
  }

  return head ? copies.get(head)! : null;
}
