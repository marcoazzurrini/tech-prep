const LETTERS: Record<string, string> = {
  "2": "abc", "3": "def", "4": "ghi", "5": "jkl",
  "6": "mno", "7": "pqrs", "8": "tuv", "9": "wxyz",
};

export function letterCombinations(digits: string): string[] {
  if (digits.length === 0) return [];
  const result: string[] = [];
  const letters: string[] = [];

  const backtrack = (i: number): void => {
    if (i === digits.length) {
      result.push(letters.join(""));
      return;
    }
    for (const letter of LETTERS[digits[i]!]!) {
      letters.push(letter); // choose a letter for digit i
      backtrack(i + 1);
      letters.pop(); // undo
    }
  };

  backtrack(0);
  return result;
}
