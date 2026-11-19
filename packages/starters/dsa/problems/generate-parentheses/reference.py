def generate_parenthesis(n: int) -> list[str]:
    result = []
    current = []

    def build(opened: int, closed: int) -> None:
        if len(current) == 2 * n:
            result.append("".join(current))
            return
        # Rule 1: open a bracket while some are left.
        if opened < n:
            current.append("(")
            build(opened + 1, closed)
            current.pop()
        # Rule 2: close only a bracket that is open.
        if closed < opened:
            current.append(")")
            build(opened, closed + 1)
            current.pop()

    build(0, 0)
    return result
