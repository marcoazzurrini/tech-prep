Write `Array.prototype.myFlat(depth)`. It works like the real `flat`: it returns a new array, with the items of inner arrays taken up `depth` levels. The default depth is `1`.

Example 1: [1, [2, [3, [4]]]].myFlat()  ->  [1, 2, [3, [4]]]
Example 2: [1, [2, [3, [4]]]].myFlat(2)  ->  [1, 2, 3, [4]]
Example 3: [[1], [2]].myFlat(0)  ->  [[1], [2]]
