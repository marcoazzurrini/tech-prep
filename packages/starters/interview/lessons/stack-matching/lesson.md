# Stack Matching

Some items come in pairs: one opens, a later one closes. Push each opener on a stack. When a closer arrives, pop. The opener you pop is the most recent one that is still open, so it is the partner.

## Worked example

Tasks start and end, and one task can run inside another. Find the order in which the tasks end.

```ts
const events = ["start load", "start parse", "end", "start draw", "end", "end"];
const open: string[] = [];
const ended: string[] = [];

for (const event of events) {
  if (event.startsWith("start ")) {
    open.push(event.slice(6));
  } else {
    ended.push(open.pop()!);
  }
}

// ended: ["parse", "draw", "load"]
```

## Why it works

- `open.push` remembers a task that has started and not ended.
- An `end` always belongs to the newest open task. That task is on top, so `open.pop()` returns it.
- After the pop, the task that was open before it is on top again.

## When to use it

- Items come in pairs that open and close, such as brackets or tags.
- Pairs can sit inside other pairs. The last one opened must close first.
- You need the partner of each closer, or you need to know if anything is left open at the end.
