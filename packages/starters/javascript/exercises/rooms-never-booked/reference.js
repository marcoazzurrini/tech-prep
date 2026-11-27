export function freeRooms(rooms, bookings) {
  let booked = new Set();

  for (const day of bookings) {
    booked = booked.union(new Set(day));
  }

  return [...new Set(rooms).difference(booked)].sort((a, b) => a - b);
}
