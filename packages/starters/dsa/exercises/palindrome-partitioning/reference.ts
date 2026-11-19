export function partition(s: string): string[][] {
  const result: string[][] = [];
  const pieces: string[] = [];

  // Two pointers move inward from both ends.
  const isPalindrome = (left: number, right: number): boolean => {
    while (left < right) {
      if (s[left] !== s[right]) return false;
      left++;
      right--;
    }
    return true;
  };

  const backtrack = (start: number): void => {
    if (start === s.length) {
      result.push([...pieces]);
      return;
    }
    for (let end = start; end < s.length; end++) {
      if (!isPalindrome(start, end)) continue; // only cut after a palindrome
      pieces.push(s.slice(start, end + 1));
      backtrack(end + 1);
      pieces.pop();
    }
  };

  backtrack(0);
  return result;
}
