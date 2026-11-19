def group_by_length(words: list[str]) -> list[list[str]]:
    # The key is the length: words of one group share it.
    groups: dict[int, list[str]] = {}
    for word in words:
        groups.setdefault(len(word), []).append(word)
    return list(groups.values())
