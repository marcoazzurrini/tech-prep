def distinct_top_scores(scores: list[int], k: int) -> list[int]:
    ordered = sorted(scores, reverse=True)  # equal scores are now neighbours
    result = []
    i = 0
    while i < len(ordered) and len(result) < k:
        result.append(ordered[i])
        i += 1
        # Move past every copy of the score just used.
        while i < len(ordered) and ordered[i] == ordered[i - 1]:
            i += 1
    return result
