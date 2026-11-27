export function reporting(fn) {
  return function (...args) {
    try {
      return { ok: true, value: fn.apply(this, args) };
    } catch (error) {
      const reason = error instanceof Error ? error.message : String(error);

      return { ok: false, reason };
    }
  };
}
