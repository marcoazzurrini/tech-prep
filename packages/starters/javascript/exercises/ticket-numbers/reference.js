const counts = new Map();

export function nextTicket(queue) {
  const number = (counts.get(queue) ?? 0) + 1;
  counts.set(queue, number);

  return `${queue}-${number}`;
}

export function reset() {
  counts.clear();
}
