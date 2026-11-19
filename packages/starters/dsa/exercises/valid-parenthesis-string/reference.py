def check_valid_string(s: str) -> bool:
    low = 0  # fewest open brackets possible so far
    high = 0  # most open brackets possible so far
    for ch in s:
        if ch == "(":
            low += 1
            high += 1
        elif ch == ")":
            low -= 1
            high -= 1
        else:  # "*": one fewer, the same, or one more
            low -= 1
            high += 1
        # Even with every `*` as "(", there is a ")" too many.
        if high < 0:
            return False
        # An open count can never be negative.
        low = max(low, 0)
    return low == 0
