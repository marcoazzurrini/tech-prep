export function addLong(a, b) {
  let result = "";
  let carry = 0;
  let i = a.length - 1;
  let j = b.length - 1;

  while (i >= 0 || j >= 0 || carry > 0) {
    const digitA = i >= 0 ? Number(a[i]) : 0;
    const digitB = j >= 0 ? Number(b[j]) : 0;
    const sum = digitA + digitB + carry;

    result = String(sum % 10) + result;
    carry = Math.floor(sum / 10);
    i -= 1;
    j -= 1;
  }

  return result;
}
