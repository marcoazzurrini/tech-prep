# Rooms Never Booked (medium)

Write `freeRooms(rooms, bookings)`. `rooms` lists the numbers of the hotel's rooms. `bookings` has one array per day, with the numbers of the rooms booked that day.

Return the numbers of the rooms that were never booked on any day, from lowest to highest. A booking can name a room the hotel does not have. Ignore it.

Example 1: freeRooms([101, 102, 103, 104], [[101], [103, 101], []])  ->  [102, 104]
Example 2: freeRooms([7, 3, 5], [[9], [5]])  ->  [3, 7]
Example 3: freeRooms([1, 2], [])  ->  [1, 2]
