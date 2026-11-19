from ds import TreeNode


def good_nodes(root: TreeNode) -> int:
    def count(node: TreeNode | None, highest: int) -> int:
        # `highest` is the largest value on the path above this node.
        if not node:
            return 0
        good = 1 if node.val >= highest else 0
        # Pass the updated maximum down to both children.
        highest = max(highest, node.val)
        return good + count(node.left, highest) + count(node.right, highest)

    return count(root, root.val)
