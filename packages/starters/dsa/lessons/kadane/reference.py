def worst_stretch(changes: list[int]) -> int:
    current = worst = changes[0]
    for change in changes[1:]:
        # Extend the stretch that ends here, or restart at this day.
        current = min(change, current + change)
        worst = min(worst, current)
    return worst
