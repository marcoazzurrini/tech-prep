def best_common_score(a: str, b: str) -> int:
    # best[i][j] = best score for the prefixes a[:i] and b[:j].
    best = [[0] * (len(b) + 1) for _ in range(len(a) + 1)]
    for i in range(1, len(a) + 1):
        for j in range(1, len(b) + 1):
            # Skip the last letter of a, or the last letter of b.
            best[i][j] = max(best[i - 1][j], best[i][j - 1])
            if a[i - 1] == b[j - 1]:
                # Or match the two last letters and add the score.
                score = ord(a[i - 1]) - ord("a") + 1
                best[i][j] = max(best[i][j], best[i - 1][j - 1] + score)
    return best[len(a)][len(b)]
