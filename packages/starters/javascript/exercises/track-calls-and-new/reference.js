export function track(fn, log) {
  return new Proxy(fn, {
    apply(target, thisArg, args) {
      log.push("call");
      return Reflect.apply(target, thisArg, args);
    },
    construct(target, args, newTarget) {
      log.push("new");
      return Reflect.construct(target, args, newTarget);
    },
  });
}
