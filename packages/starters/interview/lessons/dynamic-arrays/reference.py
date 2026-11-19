def first_and_last_letters(words: list[str]) -> list[str]:
    ends = []
    for word in words:
        # Index 0 is the first letter. Index -1 is the last one.
        ends.append(word[0] + word[-1])
    return ends
