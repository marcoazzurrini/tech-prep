def word_break(s: str, word_dict: list[str]) -> bool:
    words = set(word_dict)
    lengths = {len(w) for w in words}
    # ok[i] is True when s[:i] splits into dictionary words.
    ok = [True] + [False] * len(s)
    for i in range(1, len(s) + 1):
        ok[i] = any(n <= i and ok[i - n] and s[i - n : i] in words for n in lengths)
    return ok[len(s)]
