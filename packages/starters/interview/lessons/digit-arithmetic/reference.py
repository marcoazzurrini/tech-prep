def multiply_by_digit(digits: list[int], factor: int) -> list[int]:
    result = []
    carry = 0
    # Start at the last digit, as on paper.
    for digit in reversed(digits):
        total = digit * factor + carry
        result.append(total % 10)
        carry = total // 10
    # A last carry becomes a new first digit.
    if carry > 0:
        result.append(carry)
    return result[::-1]
