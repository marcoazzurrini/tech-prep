export function mostFrequent(text) {
  const counts = {};

  for (const char of text) {
    if (char !== " ") {
      counts[char] = (counts[char] ?? 0) + 1;
    }
  }

  let best = "";

  for (const char of text) {
    if (char !== " " && (best === "" || counts[char] > counts[best])) {
      best = char;
    }
  }

  return best;
}
