LETTERS = {
    "2": "abc", "3": "def", "4": "ghi", "5": "jkl",
    "6": "mno", "7": "pqrs", "8": "tuv", "9": "wxyz",
}


def letter_combinations(digits: str) -> list[str]:
    if not digits:
        return []
    result = []
    letters = []

    def backtrack(i: int) -> None:
        if i == len(digits):
            result.append("".join(letters))
            return
        for letter in LETTERS[digits[i]]:
            letters.append(letter)  # choose a letter for digit i
            backtrack(i + 1)
            letters.pop()  # undo

    backtrack(0)
    return result
