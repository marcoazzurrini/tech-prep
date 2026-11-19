def is_interleave(s1: str, s2: str, s3: str) -> bool:
    if len(s1) + len(s2) != len(s3):
        return False
    # ok[j] = the first i chars of s1 and the first j chars of s2 can build the first i + j chars of s3.
    ok = [False] * (len(s2) + 1)
    for i in range(len(s1) + 1):
        for j in range(len(s2) + 1):
            if i == 0 and j == 0:
                ok[j] = True
                continue
            # The last char of the prefix of s3 comes from s1 (ok[j] is still row i - 1) or from s2.
            from_s1 = i > 0 and ok[j] and s1[i - 1] == s3[i + j - 1]
            from_s2 = j > 0 and ok[j - 1] and s2[j - 1] == s3[i + j - 1]
            ok[j] = from_s1 or from_s2
    return ok[len(s2)]
