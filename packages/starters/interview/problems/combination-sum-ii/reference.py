def combination_sum2(candidates: list[int], target: int) -> list[list[int]]:
    candidates = sorted(candidates)  # equal values become neighbours
    result = []
    combo = []

    def backtrack(start: int, remaining: int) -> None:
        if remaining == 0:
            result.append(combo[:])
            return
        for i in range(start, len(candidates)):
            if candidates[i] > remaining:
                break  # sorted, so every later candidate is too big as well
            if i > start and candidates[i] == candidates[i - 1]:
                continue  # this value already started a branch at this depth
            combo.append(candidates[i])
            backtrack(i + 1, remaining - candidates[i])  # i + 1: each item once
            combo.pop()

    backtrack(0, target)
    return result
