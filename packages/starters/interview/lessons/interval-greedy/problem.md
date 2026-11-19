# Bookings With a Break (easy)

One room has a list of `bookings`, each `[start, end]`, in no particular order. The room holds one booking at a time. After a booking ends, the room must stay empty for `rest` minutes. So the next booking may start at `end + rest` or later. Return the largest number of bookings you can accept.

Example 1: bookings = [[1, 3], [3, 5], [5, 7]], rest = 0  ->  3
Example 2: bookings = [[1, 3], [3, 5], [5, 7]], rest = 1  ->  2 (accept [1, 3] and [5, 7])
Example 3: bookings = [[1, 10], [2, 3], [4, 5]], rest = 1  ->  2 (accept [2, 3] and [4, 5])

Constraints: 0 <= len(bookings) <= 1000, 0 <= start < end <= 10^6, 0 <= rest <= 1000.
