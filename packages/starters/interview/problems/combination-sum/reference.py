def combination_sum(candidates: list[int], target: int) -> list[list[int]]:
    candidates = sorted(candidates)
    result = []
    combo = []

    def backtrack(start: int, remaining: int) -> None:
        if remaining == 0:
            result.append(combo[:])
            return
        for i in range(start, len(candidates)):
            if candidates[i] > remaining:
                break  # sorted, so every later candidate is too big as well
            combo.append(candidates[i])
            backtrack(i, remaining - candidates[i])  # i, not i + 1: reuse allowed
            combo.pop()

    backtrack(0, target)
    return result
