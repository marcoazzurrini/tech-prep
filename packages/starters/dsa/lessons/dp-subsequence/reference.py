def longest_letter_chain(words: list[str]) -> int:
    # best[i] = longest chain that ends with words[i].
    best = [1] * len(words)
    for i in range(len(words)):
        for j in range(i):
            # words[j] can come just before words[i] when the letters match.
            if words[j][-1] == words[i][0]:
                best[i] = max(best[i], best[j] + 1)
    return max(best, default=0)
