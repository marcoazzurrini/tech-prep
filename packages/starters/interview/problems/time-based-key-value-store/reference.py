class TimeMap:
    def __init__(self):
        # key -> list of (timestamp, value), in increasing timestamp order
        self.entries = {}

    def set(self, key: str, value: str, timestamp: int) -> None:
        self.entries.setdefault(key, []).append((timestamp, value))

    def get(self, key: str, timestamp: int) -> str:
        entries = self.entries.get(key, [])
        # Find the first entry that is too late. The answer sits just before it.
        lo, hi = 0, len(entries)
        while lo < hi:
            mid = (lo + hi) // 2
            if entries[mid][0] > timestamp:
                hi = mid
            else:
                lo = mid + 1
        return entries[lo - 1][1] if lo > 0 else ""
