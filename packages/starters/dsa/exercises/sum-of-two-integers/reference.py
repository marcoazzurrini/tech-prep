def get_sum(a: int, b: int) -> int:
    mask = 0xFFFFFFFF
    a, b = a & mask, b & mask
    while b:
        # XOR adds without carrying; AND shifted left is the carry.
        a, b = (a ^ b) & mask, ((a & b) << 1) & mask
    # Reinterpret the 32-bit pattern as a signed number.
    return a if a <= 0x7FFFFFFF else ~(a ^ mask)
