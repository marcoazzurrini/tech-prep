def min_distance(word1: str, word2: str) -> int:
    # prev[j] = edits to turn the previous prefix of word1 into word2[:j].
    prev = list(range(len(word2) + 1))
    for i, a in enumerate(word1, 1):
        cur = [i]  # delete all i chars to reach the empty prefix
        for j, b in enumerate(word2, 1):
            if a == b:
                cur.append(prev[j - 1])  # same char: no edit
            else:
                # replace, delete from word1, or insert into word1
                cur.append(1 + min(prev[j - 1], prev[j], cur[j - 1]))
        prev = cur
    return prev[len(word2)]
