def my_pow(x: float, n: int) -> float:
    # A negative exponent is the same power of 1 / x.
    if n < 0:
        return my_pow(1 / x, -n)
    if n == 0:
        return 1.0
    # x^n = (x * x)^(n // 2), with one extra x when n is odd.
    half = my_pow(x * x, n // 2)
    return half * x if n % 2 == 1 else half
