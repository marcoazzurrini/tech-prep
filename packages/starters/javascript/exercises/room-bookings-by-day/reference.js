export function bookingPlan(bookings) {
  const plan = new Map();

  for (const [day, room, name] of bookings) {
    plan.getOrInsertComputed(day, () => new Map()).getOrInsert(room, []).push(name);
  }

  return plan;
}
