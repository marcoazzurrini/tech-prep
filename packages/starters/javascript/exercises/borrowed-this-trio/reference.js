Function.prototype.myCall = function (thisArg, ...args) {
  const key = Symbol("fn");
  thisArg[key] = this;
  const result = thisArg[key](...args);
  delete thisArg[key];
  return result;
};

Function.prototype.myApply = function (thisArg, args) {
  return this.myCall(thisArg, ...(args ?? []));
};

Function.prototype.myBind = function (thisArg, ...early) {
  const fn = this;
  return function (...later) {
    if (new.target) {
      return new fn(...early, ...later);
    }
    return fn.myCall(thisArg, ...early, ...later);
  };
};
