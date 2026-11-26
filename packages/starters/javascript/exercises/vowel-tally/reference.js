const VOWELS = "aeiou";

export function countVowels(text) {
  let count = 0;

  for (const letter of text.toLowerCase()) {
    if (VOWELS.includes(letter)) {
      count += 1;
    }
  }

  return count;
}
