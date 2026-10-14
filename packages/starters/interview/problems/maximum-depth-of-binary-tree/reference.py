from collections import deque

from ds import TreeNode


def max_depth(root: TreeNode | None) -> int:
    # Count levels with a BFS (no recursion limit to worry about).
    depth, queue = 0, deque([root] if root else [])
    while queue:
        depth += 1
        for _ in range(len(queue)):
            node = queue.popleft()
            queue.extend(child for child in (node.left, node.right) if child)
    return depth
