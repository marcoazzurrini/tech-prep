def trailing_ones_table(n: int) -> list[int]:
    table = [0] * (n + 1)
    for i in range(1, n + 1):
        # An odd i has one more trailing one than i without its last bit.
        if i & 1:
            table[i] = table[i >> 1] + 1
    return table
