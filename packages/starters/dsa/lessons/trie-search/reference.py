def count_spellable(words: list[str], choices: list[str]) -> int:
    root: dict = {}
    for word in words:
        node = root
        for ch in word:
            node = node.setdefault(ch, {})
        node["$"] = True

    def dfs(node: dict, i: int) -> int:
        if i == len(choices):
            return 1 if "$" in node else 0
        # Follow a letter only when some word continues with it.
        return sum(dfs(node[ch], i + 1) for ch in choices[i] if ch in node)

    return dfs(root, 0)
