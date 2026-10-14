def num_decodings(s: str) -> int:
    # prev, cur = ways to decode s[:i - 1] and s[:i].
    prev, cur = 1, 0 if s[0] == "0" else 1
    for i in range(1, len(s)):
        ways = cur if s[i] != "0" else 0
        if 10 <= int(s[i - 1 : i + 1]) <= 26:
            ways += prev
        prev, cur = cur, ways
    return cur
