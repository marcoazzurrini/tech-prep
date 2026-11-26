export function byFirstLetter(words) {
  const groups = {};

  for (const word of words) {
    (groups[word[0]] ??= []).push(word);
  }

  return groups;
}
