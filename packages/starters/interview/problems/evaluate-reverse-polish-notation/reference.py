def eval_rpn(tokens: list[str]) -> int:
    stack = []
    for token in tokens:
        if token in ("+", "-", "*", "/"):
            # The first pop is the right operand.
            right = stack.pop()
            left = stack.pop()
            if token == "+":
                stack.append(left + right)
            elif token == "-":
                stack.append(left - right)
            elif token == "*":
                stack.append(left * right)
            else:
                # int() rounds toward zero; // would round down.
                stack.append(int(left / right))
        else:
            stack.append(int(token))
    return stack[0]
