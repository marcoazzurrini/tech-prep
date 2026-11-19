def height_from_traversals(preorder: list[int], inorder: list[int]) -> int:
    if not preorder:
        return 0
    # The first preorder value is the root. Its inorder position is the size of the left subtree.
    mid = inorder.index(preorder[0])
    left = height_from_traversals(preorder[1 : 1 + mid], inorder[:mid])
    right = height_from_traversals(preorder[1 + mid :], inorder[mid + 1 :])
    return 1 + max(left, right)
