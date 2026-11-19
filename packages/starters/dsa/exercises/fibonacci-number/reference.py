def fib(n: int) -> int:
    memo: dict[int, int] = {}

    def go(k: int) -> int:
        # Base case first: fib(0) = 0 and fib(1) = 1.
        if k < 2:
            return k
        # Trust the same function on the two smaller inputs. Store each answer once.
        if k not in memo:
            memo[k] = go(k - 1) + go(k - 2)
        return memo[k]

    return go(n)
