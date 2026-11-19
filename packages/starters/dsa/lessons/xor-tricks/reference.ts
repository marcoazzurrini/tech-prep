export function findLostTicket(issued: number[], returned: number[]): number {
  let lost = 0;
  // Every returned number appears in both lists, so it cancels itself.
  for (const ticket of issued) lost ^= ticket;
  for (const ticket of returned) lost ^= ticket;
  return lost;
}
