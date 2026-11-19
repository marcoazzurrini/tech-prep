def reverse(x: int) -> int:
    sign = -1 if x < 0 else 1
    rest = abs(x)
    result = 0
    while rest > 0:
        # Take the last digit of rest and put it at the end of result.
        result = result * 10 + rest % 10
        rest //= 10
    result *= sign
    # Outside the signed 32-bit range, the answer is 0.
    return result if -(2**31) <= result <= 2**31 - 1 else 0
