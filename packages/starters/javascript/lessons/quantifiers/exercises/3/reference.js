export function quotedPhrases(text) {
  return (text.match(/"[^"]*"/g) ?? []).map((quote) => quote.slice(1, -1));
}
