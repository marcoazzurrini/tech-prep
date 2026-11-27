export function Rect(width, height) {
  this.width = width;
  this.height = height;
}

Rect.prototype.area = function () {
  return this.width * this.height;
};
