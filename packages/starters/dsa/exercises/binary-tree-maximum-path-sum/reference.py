from ds import TreeNode


def max_path_sum(root: TreeNode | None) -> int:
    best = float("-inf")

    def gain(node: TreeNode | None) -> int:
        # Best sum of a path that starts at `node` and goes down one side.
        nonlocal best
        if not node:
            return 0
        left = max(gain(node.left), 0)
        right = max(gain(node.right), 0)
        best = max(best, node.val + left + right)  # path that bends at this node
        return node.val + max(left, right)

    gain(root)
    return best
