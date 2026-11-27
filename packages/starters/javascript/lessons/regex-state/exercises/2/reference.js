const vowel = /[aeiou]/i;

export function countWithVowel(words) {
  let count = 0;

  for (const word of words) {
    if (vowel.test(word)) {
      count++;
    }
  }

  return count;
}
