export function changedTags(before, after) {
  const was = new Set(before);
  const now = new Set(after);

  return {
    added: after.filter((tag) => !was.has(tag)),
    removed: before.filter((tag) => !now.has(tag)),
  };
}
