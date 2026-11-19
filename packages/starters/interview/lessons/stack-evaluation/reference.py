def eval_min_max(tokens: list[str]) -> int:
    stack = []
    for token in tokens:
        if token == "neg":
            # One value in, one value out.
            stack.append(-stack.pop())
        elif token == "max":
            stack.append(max(stack.pop(), stack.pop()))
        elif token == "min":
            stack.append(min(stack.pop(), stack.pop()))
        else:
            stack.append(int(token))
    return stack[0]
