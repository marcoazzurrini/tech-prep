from collections import deque

from ds import TreeNode


def right_side_view(root: TreeNode | None) -> list[int]:
    view: list[int] = []
    queue = deque([root] if root else [])
    while queue:
        # The queue holds exactly one level. Its last node is the one you see.
        view.append(queue[-1].val)
        for _ in range(len(queue)):
            node = queue.popleft()
            if node.left:
                queue.append(node.left)
            if node.right:
                queue.append(node.right)
    return view
