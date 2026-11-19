def count_distinct_prefixes(words: list[str]) -> int:
    root: dict = {}
    count = 0
    for word in words:
        node = root
        for ch in word:
            # Each trie node is one prefix. A new node is a new prefix.
            if ch not in node:
                node[ch] = {}
                count += 1
            node = node[ch]
    return count
