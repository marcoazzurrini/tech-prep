Function.prototype.myBind = function (thisArg, ...early) {
  const fn = this;
  return function (...later) {
    if (new.target) {
      return new fn(...early, ...later);
    }
    return fn.apply(thisArg, [...early, ...later]);
  };
};
