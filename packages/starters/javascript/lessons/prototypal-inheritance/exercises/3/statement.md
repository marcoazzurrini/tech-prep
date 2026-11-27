Write constructor functions `Shape(colour)` and `Circle(colour, radius)`.

- `Shape(colour)` sets `this.colour = colour`. `Shape.prototype.label()` returns `"shape:" + this.colour`.
- `Circle(colour, radius)` calls `Shape` to set `colour`, sets `this.radius = radius`, inherits from `Shape`, and overrides `label()` to reuse `Shape.prototype.label` and return `"shape:<colour>:<radius>"`.

Example 1: new Shape("blue").label()  ->  "shape:blue"
Example 2: new Circle("red", 5).label()  ->  "shape:red:5"

Note: Solve it without `class`.
