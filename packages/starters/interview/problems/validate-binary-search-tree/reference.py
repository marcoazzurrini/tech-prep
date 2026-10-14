from ds import TreeNode


def is_valid_bst(root: TreeNode | None) -> bool:
    # Each node must fit inside the (low, high) window set by its ancestors.
    stack = [(root, float("-inf"), float("inf"))]
    while stack:
        node, low, high = stack.pop()
        if not node:
            continue
        if not low < node.val < high:
            return False
        stack.append((node.left, low, node.val))
        stack.append((node.right, node.val, high))
    return True
