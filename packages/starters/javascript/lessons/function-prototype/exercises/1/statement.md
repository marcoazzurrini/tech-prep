`new Rect(width, height)` makes a rectangle. Add a method `area()` that returns the width times the height.

All rectangles must share one `area` function. It must not be an own property of each rectangle.

Example 1: new Rect(2, 3).area()  ->  6
Example 2: Object.hasOwn(new Rect(1, 1), "area")  ->  false
