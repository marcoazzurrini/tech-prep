from ds import TreeNode


def bst_floor(root: TreeNode | None, target: int) -> int | None:
    best = None
    node = root
    while node:
        if node.val == target:
            return target
        if node.val < target:
            # A candidate. Only the right subtree can hold a larger one.
            best = node.val
            node = node.right
        else:
            # Too large. Everything on the right is larger still.
            node = node.left
    return best
