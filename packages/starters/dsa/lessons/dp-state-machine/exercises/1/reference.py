def max_pay_with_rest(pay: list[int]) -> int:
    # States at the end of a day: rested, worked 1 day in a row, worked 2 days in a row.
    rest, one, two = 0, float("-inf"), float("-inf")
    for p in pay:
        # A first work day follows a rest day. A second work day follows a first one.
        rest, one, two = max(rest, one, two), rest + p, one + p
    return max(rest, one, two)
