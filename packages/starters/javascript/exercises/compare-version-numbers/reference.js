const parse = (version) => {
  const [major = 0, minor = 0, patch = 0] = version.split(".").map(Number);

  return [major, minor, patch];
};

export function compareVersions(a, b) {
  const left = parse(a);
  const right = parse(b);

  for (const [index, part] of left.entries()) {
    if (part !== right[index]) {
      return part < right[index] ? -1 : 1;
    }
  }

  return 0;
}
