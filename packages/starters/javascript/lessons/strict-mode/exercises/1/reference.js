export function countVowels(text) {
  let count = 0;

  for (const letter of text) {
    if ("aeiou".includes(letter)) {
      count += 1;
    }
  }

  return count;
}
