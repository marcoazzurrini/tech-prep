const GAP = Symbol("gap");

export function interleave(...sources) {
  const padding = sources.map(() => GAP);

  return Iterator.zip(sources, { mode: "longest", padding }).flatMap((row) =>
    row.filter((value) => value !== GAP),
  );
}
