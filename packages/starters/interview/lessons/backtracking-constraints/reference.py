def smooth_sequences(length: int, max_value: int) -> list[list[int]]:
    result = []
    seq = []

    def backtrack() -> None:
        if len(seq) == length:
            result.append(seq[:])
            return
        for value in range(1, max_value + 1):
            # Check the rule before the choice.
            if seq and abs(value - seq[-1]) > 1:
                continue
            seq.append(value)
            backtrack()
            seq.pop()

    backtrack()
    return result
