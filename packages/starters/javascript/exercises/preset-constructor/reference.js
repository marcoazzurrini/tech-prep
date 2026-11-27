export function preset(fn, context, ...presets) {
  return function (...args) {
    if (new.target) {
      return new fn(...presets, ...args);
    }
    return fn.apply(context, [...presets, ...args]);
  };
}
