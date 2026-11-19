from collections import deque

from ds import GraphNode


def clone_graph(node: GraphNode | None) -> GraphNode | None:
    if node is None:
        return None
    copies = {node: GraphNode(node.val)}  # original -> clone
    queue = deque([node])
    while queue:
        current = queue.popleft()
        for neighbor in current.neighbors:
            if neighbor not in copies:
                copies[neighbor] = GraphNode(neighbor.val)
                queue.append(neighbor)
            copies[current].neighbors.append(copies[neighbor])
    return copies[node]
