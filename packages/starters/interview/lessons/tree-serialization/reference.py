def encoded_tree_depth(tokens: list[str]) -> int:
    position = 0

    def read() -> int:
        # Reads one whole subtree and returns its depth.
        nonlocal position
        token = tokens[position]
        position += 1
        # A null mark is an empty subtree. Stop here.
        if token == "#":
            return 0
        # Same order as the writer: left subtree first, then right.
        left = read()
        right = read()
        return 1 + max(left, right)

    return read()
