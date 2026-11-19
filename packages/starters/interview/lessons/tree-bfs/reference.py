from collections import deque

from ds import TreeNode


def widest_level(root: TreeNode | None) -> int:
    widest = 0
    queue = deque([root] if root else [])
    while queue:
        # At the start of a level, the queue holds exactly that level.
        size = len(queue)
        widest = max(widest, size)
        for _ in range(size):
            node = queue.popleft()
            if node.left:
                queue.append(node.left)
            if node.right:
                queue.append(node.right)
    return widest
