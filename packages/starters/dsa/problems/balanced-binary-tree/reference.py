from ds import TreeNode


def is_balanced(root: TreeNode | None) -> bool:
    def height(node: TreeNode | None) -> int:
        # Returns the height, or -1 when the subtree is not balanced.
        if not node:
            return 0
        left, right = height(node.left), height(node.right)
        # Pass a failure from below straight up.
        if left == -1 or right == -1 or abs(left - right) > 1:
            return -1
        return 1 + max(left, right)

    return height(root) != -1
