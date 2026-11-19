def check_inclusion(s1: str, s2: str) -> bool:
    k = len(s1)
    if k > len(s2):
        return False
    need = [0] * 26  # letter counts of s1
    window = [0] * 26  # letter counts of the current window of s2
    for c in s1:
        need[ord(c) - 97] += 1
    for i, c in enumerate(s2):
        window[ord(c) - 97] += 1  # enters on the right
        if i >= k:
            window[ord(s2[i - k]) - 97] -= 1  # leaves on the left
        # Same counts means the window is a rearrangement of s1.
        if window == need:
            return True
    return False
