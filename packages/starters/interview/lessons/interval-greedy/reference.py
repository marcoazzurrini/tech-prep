def max_bookings_with_break(bookings: list[list[int]], rest: int) -> int:
    count = 0
    free_at = float("-inf")  # the first time the room can be used again
    # The booking that ends first leaves the most room for the rest.
    for start, end in sorted(bookings, key=lambda booking: booking[1]):
        if start >= free_at:
            count += 1
            free_at = end + rest
    return count
