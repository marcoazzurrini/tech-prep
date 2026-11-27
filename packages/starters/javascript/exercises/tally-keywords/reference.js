export function tallyKeywords(text, keywords) {
  const counts = {};

  for (const keyword of keywords) {
    const pattern = new RegExp(RegExp.escape(keyword), "gi");
    counts[keyword] = (text.match(pattern) ?? []).length;
  }

  return counts;
}
