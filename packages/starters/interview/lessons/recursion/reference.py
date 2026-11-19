def digit_sum(n: int) -> int:
    # Base case: one digit is its own sum.
    if n < 10:
        return n
    # The last digit, plus the same question for the other digits.
    return n % 10 + digit_sum(n // 10)
