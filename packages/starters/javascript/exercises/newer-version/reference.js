export function compareVersions(a, b) {
  const partsA = a.split(".").map(Number);
  const partsB = b.split(".").map(Number);
  const length = Math.max(partsA.length, partsB.length);

  for (let i = 0; i < length; i += 1) {
    const partA = partsA[i] ?? 0;
    const partB = partsB[i] ?? 0;

    if (partA !== partB) {
      return partA < partB ? -1 : 1;
    }
  }

  return 0;
}
