import { ListNode } from "./ds.ts";

function mergeTwo(a: ListNode | null, b: ListNode | null): ListNode | null {
  const dummy = new ListNode();
  let tail = dummy;
  while (a && b) {
    if (a.val <= b.val) {
      tail.next = a;
      a = a.next;
    } else {
      tail.next = b;
      b = b.next;
    }
    tail = tail.next;
  }
  tail.next = a ?? b;
  return dummy.next;
}

export function mergeKLists(lists: (ListNode | null)[]): ListNode | null {
  // Merge pairs round by round: log k rounds, each touching all N nodes.
  if (lists.length === 0) return null;
  let round = lists;
  while (round.length > 1) {
    const next: (ListNode | null)[] = [];
    for (let i = 0; i < round.length; i += 2) next.push(mergeTwo(round[i] ?? null, round[i + 1] ?? null));
    round = next;
  }
  return round[0] ?? null;
}
