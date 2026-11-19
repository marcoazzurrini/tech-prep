def centre_palindrome_lengths(s: str) -> list[int]:
    lengths = []
    for centre in range(2 * len(s) - 1):
        # Even centres are letters. Odd centres are gaps.
        left = centre // 2
        right = left + centre % 2
        while left >= 0 and right < len(s) and s[left] == s[right]:
            left -= 1
            right += 1
        # The loop stops one step too far on both sides.
        lengths.append(right - left - 1)
    return lengths
