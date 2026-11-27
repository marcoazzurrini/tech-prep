Function.prototype.myApply = function (thisArg, args) {
  const key = Symbol("fn");
  thisArg[key] = this;
  const result = thisArg[key](...(args ?? []));
  delete thisArg[key];
  return result;
};
