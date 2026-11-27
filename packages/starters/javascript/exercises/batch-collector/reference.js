export function* batcher(size, onFlush) {
  let batch = [];

  try {
    while (true) {
      batch.push(yield);

      if (batch.length === size) {
        onFlush(batch);
        batch = [];
      }
    }
  } finally {
    if (batch.length > 0) onFlush(batch);
  }
}
