def unpack_groups(data: list[int]) -> list[list[int]]:
    groups = []
    i = 0
    while i < len(data):
        # data[i] is a length. The group is the next `length` numbers.
        length = data[i]
        groups.append(data[i + 1 : i + 1 + length])
        # Jump to the length of the next group.
        i += 1 + length
    return groups
