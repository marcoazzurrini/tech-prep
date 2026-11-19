def codes_without_repeats(digits: list[int], length: int) -> list[list[int]]:
    result = []
    code = []
    used = [False] * len(digits)

    def backtrack() -> None:
        if len(code) == length:
            result.append(code[:])
            return
        for i in range(len(digits)):
            if used[i]:
                continue  # already in this code
            used[i] = True
            code.append(digits[i])
            backtrack()
            code.pop()
            used[i] = False  # release

    backtrack()
    return result
