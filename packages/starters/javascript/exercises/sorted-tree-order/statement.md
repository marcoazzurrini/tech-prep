# Sorted Tree (medium)

A `SortedTree` keeps numbers in a binary search tree. Each node has a `value`, a `left` node and a `right` node, or `null` where there is none. Every value on the left of a node is smaller than its value. Every value on the right is the same or larger.

Make a `SortedTree` work with `for...of` and spread. A loop over the tree gives its numbers from the smallest to the largest. It can be looped over many times.

Example 1: [...new SortedTree().add(5).add(2).add(8).add(1)]  ->  [1, 2, 5, 8]
Example 2: [...new SortedTree()]  ->  []
