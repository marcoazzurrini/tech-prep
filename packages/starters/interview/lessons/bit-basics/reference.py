def set_bit_positions(n: int) -> list[int]:
    positions = []
    position = 0
    while n > 0:
        # n & 1 reads the lowest bit. n >> 1 drops it.
        if n & 1:
            positions.append(position)
        n >>= 1
        position += 1
    return positions
