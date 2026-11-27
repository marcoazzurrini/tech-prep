export function installMyMap(proto) {
  if (proto.myMap) {
    return;
  }

  proto.myMap = function (fn) {
    const out = [];

    for (let i = 0; i < this.length; i += 1) {
      out.push(fn(this[i], i, this));
    }

    return out;
  };
}
