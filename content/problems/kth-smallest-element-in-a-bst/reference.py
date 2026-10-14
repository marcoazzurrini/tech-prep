from ds import TreeNode


def kth_smallest(root: TreeNode | None, k: int) -> int:
    # Iterative in-order walk: values come out sorted, stop at the k-th.
    stack, node = [], root
    while True:
        while node:
            stack.append(node)
            node = node.left
        node = stack.pop()
        k -= 1
        if k == 0:
            return node.val
        node = node.right
