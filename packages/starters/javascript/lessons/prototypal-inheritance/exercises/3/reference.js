export function Shape(colour) {
  this.colour = colour;
}
Shape.prototype.label = function () {
  return "shape:" + this.colour;
};

export function Circle(colour, radius) {
  Shape.call(this, colour);
  this.radius = radius;
}
Circle.prototype = Object.create(Shape.prototype);
Circle.prototype.constructor = Circle;
Circle.prototype.label = function () {
  return Shape.prototype.label.call(this) + ":" + this.radius;
};
