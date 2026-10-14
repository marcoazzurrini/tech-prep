# Pacific Atlantic Water Flow (medium)

`heights` is a grid of land heights. The Pacific Ocean touches the top and left edges, the Atlantic touches the bottom and right edges. Rain can flow from a cell to a horizontally or vertically adjacent cell whose height is less than or equal to it, and from any edge cell into the ocean it touches. Return the coordinates `[r, c]` of every cell from which water can reach both oceans, in any order.

Example 1: heights = [[1,2,2,3,5],[3,2,3,4,4],[2,4,5,3,1],[6,7,1,4,5],[5,1,1,2,4]]  ->  [[0,4],[1,3],[1,4],[2,2],[3,0],[3,1],[4,0]]
Example 2: heights = [[1]]  ->  [[0,0]]

Constraints: 1 <= rows, cols <= 200, 0 <= heights[r][c] <= 10^5.
