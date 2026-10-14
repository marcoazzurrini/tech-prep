from ds import TreeNode


def build_tree(preorder: list[int], inorder: list[int]) -> TreeNode | None:
    index = {val: i for i, val in enumerate(inorder)}
    next_root = iter(preorder)

    def build(lo: int, hi: int) -> TreeNode | None:
        # Build the subtree whose values are inorder[lo..hi].
        if lo > hi:
            return None
        node = TreeNode(next(next_root))
        mid = index[node.val]
        node.left = build(lo, mid - 1)
        node.right = build(mid + 1, hi)
        return node

    return build(0, len(inorder) - 1)
