export function heightFromTraversals(
  preorder: number[],
  inorder: number[]
): number {
  if (preorder.length === 0) return 0;
  // The first preorder value is the root. Its inorder position is the size of the left subtree.
  const mid = inorder.indexOf(preorder[0]);
  const left = heightFromTraversals(
    preorder.slice(1, 1 + mid),
    inorder.slice(0, mid)
  );
  const right = heightFromTraversals(
    preorder.slice(1 + mid),
    inorder.slice(mid + 1)
  );
  return 1 + Math.max(left, right);
}
