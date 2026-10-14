"""Data structures shared by solutions and the test harness.

Solutions import them with `from ds import ListNode, TreeNode, GraphNode`.
"""

from __future__ import annotations


class ListNode:
    def __init__(self, val: int = 0, next: ListNode | None = None):
        self.val = val
        self.next = next

    def __repr__(self) -> str:
        return f"ListNode({self.val})"


class TreeNode:
    def __init__(self, val: int = 0, left: TreeNode | None = None, right: TreeNode | None = None):
        self.val = val
        self.left = left
        self.right = right

    def __repr__(self) -> str:
        return f"TreeNode({self.val})"


class GraphNode:
    def __init__(self, val: int = 0, neighbors: list[GraphNode] | None = None):
        self.val = val
        self.neighbors = neighbors if neighbors is not None else []

    def __repr__(self) -> str:
        return f"GraphNode({self.val})"
