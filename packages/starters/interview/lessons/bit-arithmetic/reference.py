def subtract_without_minus(a: int, b: int) -> int:
    while b != 0:
        # A column borrows when a has 0 and b has 1. The borrow moves one column left.
        borrow = (~a & b) << 1
        # XOR subtracts each column without borrowing.
        a = a ^ b
        b = borrow
    return a
