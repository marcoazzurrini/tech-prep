export function numDecodings(s: string): number {
  // prev, cur = ways to decode s[:i - 1] and s[:i].
  let prev = 1;
  let cur = s[0] === "0" ? 0 : 1;
  for (let i = 1; i < s.length; i++) {
    let ways = s[i] !== "0" ? cur : 0;
    const pair = Number(s.slice(i - 1, i + 1));
    if (pair >= 10 && pair <= 26) ways += prev;
    [prev, cur] = [cur, ways];
  }
  return cur;
}
