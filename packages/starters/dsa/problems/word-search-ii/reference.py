def find_words(board: list[list[str]], words: list[str]) -> list[str]:
    # Build a trie of the words; "$" holds the full word at its last node.
    root = {}
    for w in words:
        node = root
        for ch in w:
            node = node.setdefault(ch, {})
        node["$"] = w

    rows, cols = len(board), len(board[0])
    found = []

    def dfs(r: int, c: int, parent: dict) -> None:
        ch = board[r][c]
        node = parent[ch]
        if "$" in node:
            found.append(node.pop("$"))  # pop so each word is reported once
        board[r][c] = "#"
        for nr, nc in ((r + 1, c), (r - 1, c), (r, c + 1), (r, c - 1)):
            if 0 <= nr < rows and 0 <= nc < cols and board[nr][nc] in node:
                dfs(nr, nc, node)
        board[r][c] = ch
        if not node:
            parent.pop(ch)  # prune exhausted branches

    for r in range(rows):
        for c in range(cols):
            if board[r][c] in root:
                dfs(r, c, root)
    return found
