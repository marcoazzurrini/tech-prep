export function inputsChanged(before, after) {
  if (before.length !== after.length) {
    return true;
  }

  for (let i = 0; i < before.length; i++) {
    if (!Object.is(before[i], after[i])) {
      return true;
    }
  }

  return false;
}
