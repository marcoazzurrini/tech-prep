from collections import defaultdict


def group_anagrams(strs: list[str]) -> list[list[str]]:
    groups = defaultdict(list)
    for s in strs:
        groups["".join(sorted(s))].append(s)  # sorted letters identify the group
    return list(groups.values())
