def count_substrings(s: str) -> int:
    count = 0
    # Grow outwards from each of the 2n - 1 centers; every step that still matches is one palindrome.
    for center in range(2 * len(s) - 1):
        lo, hi = center // 2, center // 2 + center % 2
        while lo >= 0 and hi < len(s) and s[lo] == s[hi]:
            count += 1
            lo -= 1
            hi += 1
    return count
