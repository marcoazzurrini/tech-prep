export function sendToBack(queue) {
  if (queue.length === 0) {
    return [];
  }

  const [first, ...others] = queue;

  return [...others, first];
}
