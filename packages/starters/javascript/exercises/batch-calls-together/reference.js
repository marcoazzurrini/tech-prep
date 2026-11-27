export function batchCalls(handler) {
  let items = [];

  return (item) => {
    if (items.length === 0) {
      queueMicrotask(() => {
        const batch = items;
        items = [];
        handler(batch);
      });
    }
    items.push(item);
  };
}
