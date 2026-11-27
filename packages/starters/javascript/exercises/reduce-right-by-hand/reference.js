Array.prototype.myReduceRight = function (callback, ...start) {
  let index = this.length - 1;
  let total;

  if (start.length > 0) {
    total = start[0];
  } else {
    while (index >= 0 && !(index in this)) {
      index--;
    }
    if (index < 0) {
      throw new TypeError("Reduce of empty array with no initial value");
    }
    total = this[index];
    index--;
  }

  for (; index >= 0; index--) {
    if (index in this) {
      total = callback(total, this[index], index, this);
    }
  }
  return total;
};
