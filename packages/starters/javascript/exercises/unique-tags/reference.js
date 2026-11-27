const sameTag = (a, b) => a.localeCompare(b, "en", { sensitivity: "base" }) === 0;

export function uniqueTags(tags) {
  const kept = [];

  for (const tag of tags) {
    if (!kept.some((seen) => sameTag(seen, tag))) {
      kept.push(tag);
    }
  }

  return kept.toSorted((a, b) => a.localeCompare(b, "en"));
}
