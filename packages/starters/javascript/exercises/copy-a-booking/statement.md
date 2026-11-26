# Copy a Booking (easy)

`copyBooking(booking)` should return a copy of a booking that shares nothing with the original, at any depth.

A booking holds dates, and some of its properties may hold `undefined`. The copy must hold the same: a date stays a date, and a property that holds `undefined` is still there.

The code below loses both. Fix it.

Example 1:
  const copy = copyBooking({ guest: "Ada", from: new Date(5000), note: undefined });
  copy.from.getTime()  ->  5000
  "note" in copy  ->  true
