def encode(strs: list[str]) -> str:
    # Prefix each string with its length and a '#', e.g. "4#neet".
    return "".join(f"{len(s)}#{s}" for s in strs)


def decode(s: str) -> list[str]:
    result = []
    i = 0
    while i < len(s):
        j = s.index("#", i)  # end of the length header
        length = int(s[i:j])
        result.append(s[j + 1 : j + 1 + length])
        i = j + 1 + length
    return result
