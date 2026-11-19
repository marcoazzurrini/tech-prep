def power_mod(base: int, exponent: int, mod: int) -> int:
    if exponent == 0:
        return 1 % mod
    # base^exponent = (base * base)^(exponent // 2), with one extra base when exponent is odd.
    half = power_mod(base * base % mod, exponent // 2, mod)
    return half * base % mod if exponent % 2 == 1 else half
