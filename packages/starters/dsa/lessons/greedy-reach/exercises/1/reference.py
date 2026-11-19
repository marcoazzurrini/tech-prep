def highest_climb(ladders: list[list[int]]) -> int:
    reach = 0  # highest height reached so far
    for bottom, top in ladders:
        # This ladder starts above the reach. So do all later ones.
        if bottom > reach:
            break
        reach = max(reach, top)
    return reach
