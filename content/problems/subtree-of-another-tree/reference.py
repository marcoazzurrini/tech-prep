from ds import TreeNode


def same(a: TreeNode | None, b: TreeNode | None) -> bool:
    if not a or not b:
        return a is b
    return a.val == b.val and same(a.left, b.left) and same(a.right, b.right)


def is_subtree(root: TreeNode | None, sub_root: TreeNode | None) -> bool:
    if not root:
        return sub_root is None
    return same(root, sub_root) or is_subtree(root.left, sub_root) or is_subtree(root.right, sub_root)
