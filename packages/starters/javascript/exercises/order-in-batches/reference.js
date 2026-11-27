export function findOrder(batches, id) {
  const order = Iterator.from(batches)
    .flatMap((batch) => batch)
    .find((candidate) => candidate.id === id);

  return order ?? null;
}
