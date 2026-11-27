Array.prototype.myFlat = function (depth = 1) {
  const result = [];
  for (const item of this) {
    if (Array.isArray(item) && depth > 0) {
      result.push(...item.myFlat(depth - 1));
    } else {
      result.push(item);
    }
  }
  return result;
};
