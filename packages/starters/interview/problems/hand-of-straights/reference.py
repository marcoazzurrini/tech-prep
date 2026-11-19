from collections import Counter


def is_n_straight_hand(hand: list[int], groupSize: int) -> bool:
    if len(hand) % groupSize != 0:
        return False
    count = Counter(hand)
    # The smallest card left must start a group. Go through values in order.
    for card in sorted(count):
        starts = count[card]
        if starts == 0:
            continue
        # Every group that starts here needs the next groupSize values.
        for value in range(card, card + groupSize):
            if count[value] < starts:
                return False
            count[value] -= starts
    return True
