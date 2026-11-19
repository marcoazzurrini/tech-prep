def max_letter_in_window(s: str, k: int, letter: str) -> int:
    count = 0  # how often letter is in the current window
    best = 0
    for i, c in enumerate(s):
        if c == letter:
            count += 1  # enters on the right
        if i >= k and s[i - k] == letter:
            count -= 1  # leaves on the left
        if i >= k - 1:
            best = max(best, count)  # the window is full
    return best
