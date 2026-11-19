class DetectSquares:
    def __init__(self):
        # counts[(x, y)] = how many times this point was added.
        self.counts = {}

    def add(self, point: list[int]) -> None:
        key = (point[0], point[1])
        self.counts[key] = self.counts.get(key, 0) + 1

    def count(self, point: list[int]) -> int:
        x, y = point
        total = 0
        # Try every stored point as the opposite corner of the square.
        for (px, py), diagonal in list(self.counts.items()):
            if px == x or abs(px - x) != abs(py - y):
                continue
            # The other two corners are fixed. Multiply the counts of the three corners.
            total += diagonal * self.counts.get((x, py), 0) * self.counts.get((px, y), 0)
        return total
