# Room Bookings by Day (medium)

Write `bookingPlan(bookings)`. Each booking is an array `[day, room, name]`, where `day` is a number.

Return a `Map` from each day to a `Map` from each room to the names booked in it. Keep days, rooms and names in the order they first appear. Days stay numbers.

Example 1:
  bookingPlan([[1, "A", "Ada"], [1, "B", "Bo"], [1, "A", "Cy"]])
  ->  Map { 1 => Map { "A" => ["Ada", "Cy"], "B" => ["Bo"] } }
Example 2: bookingPlan([])  ->  an empty Map
