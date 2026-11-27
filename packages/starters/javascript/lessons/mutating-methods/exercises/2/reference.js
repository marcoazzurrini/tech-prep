export function takeBatch(queue, size) {
  return queue.splice(0, size);
}
