def find_lost_ticket(issued: list[int], returned: list[int]) -> int:
    lost = 0
    # Every returned number appears in both lists, so it cancels itself.
    for number in issued:
        lost ^= number
    for number in returned:
        lost ^= number
    return lost
