def rotate_half_turn(matrix: list[list[int]]) -> None:
    # Reverse the order of the rows: r goes to rows - 1 - r.
    matrix.reverse()
    # Reverse each row: c goes to cols - 1 - c.
    for row in matrix:
        row.reverse()
