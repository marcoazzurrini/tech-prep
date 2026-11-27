Array.prototype.myEvery = function (test, thisArg) {
  for (let i = 0; i < this.length; i++) {
    if (i in this && !test.call(thisArg, this[i], i, this)) {
      return false;
    }
  }
  return true;
};

Array.prototype.mySome = function (test, thisArg) {
  for (let i = 0; i < this.length; i++) {
    if (i in this && test.call(thisArg, this[i], i, this)) {
      return true;
    }
  }
  return false;
};
