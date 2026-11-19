# Fixed-Gap Pointers

You cannot count back from the end of a list. Use two pointers with a fixed gap. First move `lead` n steps ahead. Then move both pointers one step at a time. When `lead` passes the last node, `trail` is n nodes from the end.

## Worked example

Find the value of the 2nd node from the end.

```ts
// head: 10 -> 20 -> 30 -> 40 -> 50
let lead: ListNode | null = head;
for (let i = 0; i < 2; i++) lead = lead!.next;

let trail = head;
while (lead) {
  lead = lead.next;
  trail = trail.next!;
}

// trail.val is 40
```

## Why it works

- The `for` loop sets the gap. Both pointers then move together, so the gap never changes.
- `lead` ends on `null`, one step past the last node. `trail` is 2 nodes behind that.
- To remove a node, you need the node before it. Start both pointers at a dummy node, and `trail` stops one node early.

## When to use it

- The task counts from the end: "the nth node from the end", "the last k nodes".
- You must do it in one pass, or the length is not known.
- You compare two nodes that are always the same distance apart.
