const segmenter = new Intl.Segmenter("en", { granularity: "grapheme" });

export function lastCharacter(text) {
  const graphemes = [...segmenter.segment(text)];

  return graphemes.at(-1)?.segment ?? "";
}
