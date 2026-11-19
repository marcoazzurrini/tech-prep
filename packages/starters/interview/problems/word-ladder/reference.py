def ladder_length(begin_word: str, end_word: str, word_list: list[str]) -> int:
    # Words not used yet. Taking a word out marks it as visited.
    unused = set(word_list)
    unused.discard(begin_word)
    level = [begin_word]
    length = 1
    # BFS by levels: every word of `level` ends a ladder of `length` words.
    while level:
        next_level = []
        for word in level:
            if word == end_word:
                return length
            # The neighbours are the unused words with one letter changed.
            for i in range(len(word)):
                for letter in "abcdefghijklmnopqrstuvwxyz":
                    candidate = word[:i] + letter + word[i + 1:]
                    if candidate in unused:
                        unused.remove(candidate)
                        next_level.append(candidate)
        level = next_level
        length += 1
    return 0
