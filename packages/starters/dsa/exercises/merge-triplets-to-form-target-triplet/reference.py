def merge_triplets(triplets: list[list[int]], target: list[int]) -> bool:
    best = [0, 0, 0]  # largest value seen at each position
    for triplet in triplets:
        # A triplet with a value above the target can never be merged in.
        if all(triplet[i] <= target[i] for i in range(3)):
            best = [max(best[i], triplet[i]) for i in range(3)]
    # Merging every usable triplet gives `best`.
    return best == target
