from ds import TreeNode


def longest_even_path(root: TreeNode | None) -> int:
    best = 0

    def arm(node: TreeNode | None) -> int:
        # Longest even chain that starts at `node` and goes down.
        nonlocal best
        if not node:
            return 0
        left, right = arm(node.left), arm(node.right)
        if node.val % 2 != 0:
            return 0
        # Two-sided: the path that bends at this node.
        best = max(best, left + 1 + right)
        # One-sided: the parent can extend only one arm.
        return 1 + max(left, right)

    arm(root)
    return best
