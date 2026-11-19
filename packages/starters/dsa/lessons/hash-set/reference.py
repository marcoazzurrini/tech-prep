def count_absent(roster: list[str], present: list[str]) -> int:
    # A set makes each "did this student come?" check O(1).
    came = set(present)
    absent = 0
    for name in roster:
        if name not in came:
            absent += 1
    return absent
