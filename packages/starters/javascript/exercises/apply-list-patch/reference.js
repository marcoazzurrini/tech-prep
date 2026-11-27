export function applyPatch(list, patch) {
  const result = [...list];

  for (let i = 0; i < patch.length; i++) {
    if (i in patch) {
      result[i] = patch[i];
    }
  }

  return result;
}
