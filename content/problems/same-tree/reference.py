from ds import TreeNode


def is_same_tree(p: TreeNode | None, q: TreeNode | None) -> bool:
    if not p or not q:
        return p is q  # both empty, or exactly one missing
    return p.val == q.val and is_same_tree(p.left, q.left) and is_same_tree(p.right, q.right)
