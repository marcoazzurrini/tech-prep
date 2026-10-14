def longest_palindrome(s: str) -> str:
    def expand(lo: int, hi: int) -> tuple[int, int]:
        while lo >= 0 and hi < len(s) and s[lo] == s[hi]:
            lo -= 1
            hi += 1
        return lo + 1, hi

    start, end = 0, 1
    # Every palindrome has a center: a character (odd length) or a gap (even length).
    for i in range(len(s)):
        for lo, hi in (expand(i, i), expand(i, i + 1)):
            if hi - lo > end - start:
                start, end = lo, hi
    return s[start:end]
