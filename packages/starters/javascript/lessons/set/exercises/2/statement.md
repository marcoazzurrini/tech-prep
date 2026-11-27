Write `distinctSizes(boxes)`. Each box is an object `{ w, h }` with a width and a height. Return how many different sizes the boxes have.

A box can be turned, so a box 2 wide and 3 high has the same size as one 3 wide and 2 high.

Example 1: distinctSizes([{ w: 2, h: 3 }, { w: 3, h: 2 }, { w: 2, h: 2 }])  ->  2
Example 2: distinctSizes([{ w: 1, h: 1 }, { w: 1, h: 1 }])  ->  1
Example 3: distinctSizes([])  ->  0
