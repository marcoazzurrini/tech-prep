export function firstAlphabetically(words) {
  let first = "";

  for (const word of words) {
    if (first === "" || word.toLowerCase() < first.toLowerCase()) {
      first = word;
    }
  }

  return first;
}
