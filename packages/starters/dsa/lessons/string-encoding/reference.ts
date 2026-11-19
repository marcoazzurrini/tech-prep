export function unpackGroups(data: number[]): number[][] {
  const groups: number[][] = [];
  let i = 0;
  while (i < data.length) {
    // data[i] is a length. The group is the next `length` numbers.
    const length = data[i];
    groups.push(data.slice(i + 1, i + 1 + length));
    // Jump to the length of the next group.
    i += 1 + length;
  }
  return groups;
}
