const isAlnum = (c: string): boolean => /[a-zA-Z0-9]/.test(c);

export function isPalindrome(s: string): boolean {
  let i = 0;
  let j = s.length - 1;
  while (i < j) {
    if (!isAlnum(s[i])) i++;
    else if (!isAlnum(s[j])) j--;
    else if (s[i].toLowerCase() !== s[j].toLowerCase()) return false;
    else {
      i++;
      j--;
    }
  }
  return true;
}
