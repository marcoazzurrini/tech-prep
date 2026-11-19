def can_complete_circuit(gas: list[int], cost: list[int]) -> int:
    # Less fuel than cost in total: no start can work.
    if sum(gas) < sum(cost):
        return -1
    start = 0
    tank = 0
    for i in range(len(gas)):
        tank += gas[i] - cost[i]
        # The run from `start` fails here, and so does every start inside it.
        # Restart at the next station.
        if tank < 0:
            start = i + 1
            tank = 0
    return start
