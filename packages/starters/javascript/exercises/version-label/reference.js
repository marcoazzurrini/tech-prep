export function makeVersion(major, minor) {
  return {
    [Symbol.toPrimitive](hint) {
      return hint === "number" ? major * 100 + minor : `${major}.${minor}`;
    },
  };
}
