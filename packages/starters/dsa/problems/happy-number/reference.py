def is_happy(n: int) -> bool:
    seen = set()
    # A number that comes back means a loop: 1 will never be reached.
    while n != 1 and n not in seen:
        seen.add(n)
        n = sum(int(digit) ** 2 for digit in str(n))
    return n == 1
