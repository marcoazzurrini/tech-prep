def sorted_after_each_op(ops: list[int]) -> list[bool]:
    result = []
    stack = []  # (value, is the stack in order from here down?)
    for op in ops:
        if op == 0:
            stack.pop()
        elif not stack:
            stack.append((op, True))
        else:
            # In order here: in order below, and not smaller than the value below.
            below, ok = stack[-1]
            stack.append((op, ok and op >= below))
        result.append(stack[-1][1] if stack else True)
    return result
