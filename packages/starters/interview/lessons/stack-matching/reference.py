def bracket_pairs(s: str) -> list[list[int]]:
    pairs = []
    stack = []  # indexes of the brackets that are still open
    for i, c in enumerate(s):
        if c == "(":
            stack.append(i)
        elif c == ")":
            # The newest open bracket is the partner.
            pairs.append([stack.pop(), i])
    return pairs
