from collections import deque

from ds import TreeNode


def level_order(root: TreeNode | None) -> list[list[int]]:
    levels, queue = [], deque([root] if root else [])
    while queue:
        level = []
        for _ in range(len(queue)):  # exactly the nodes of the current level
            node = queue.popleft()
            level.append(node.val)
            queue.extend(child for child in (node.left, node.right) if child)
        levels.append(level)
    return levels
