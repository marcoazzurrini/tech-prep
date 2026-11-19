def partition_labels(s: str) -> list[int]:
    last = {ch: i for i, ch in enumerate(s)}  # letter -> its last index
    sizes = []
    start = 0
    end = 0  # the current part must reach at least this index
    for i, ch in enumerate(s):
        end = max(end, last[ch])
        # No letter of this part appears later: cut here.
        if i == end:
            sizes.append(i - start + 1)
            start = i + 1
    return sizes
