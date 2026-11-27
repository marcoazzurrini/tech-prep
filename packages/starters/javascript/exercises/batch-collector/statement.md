# Batch Collector (medium)

Write the generator function `batcher(size, onFlush)`. The caller starts it with `next()`, then sends items in, one per call, with `next(item)`.

Each time `size` items have arrived, `batcher` calls `onFlush(batch)` with an array of them, and starts a new batch. When the caller ends it with `return()`, it flushes the items that are left. It never flushes an empty batch.

Example 1:
  const b = batcher(2, (batch) => console.log(batch));
  b.next();
  b.next("a"); b.next("b");  ->  logs ["a", "b"]
  b.next("c"); b.return();  ->  logs ["c"]
