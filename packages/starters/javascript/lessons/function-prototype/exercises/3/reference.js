export function Track(title) {
  this.title = title;
}

Track.prototype.label = function () {
  return "Track: " + this.title;
};

export function copyWithTitle(item, title) {
  return new item.constructor(title);
}
