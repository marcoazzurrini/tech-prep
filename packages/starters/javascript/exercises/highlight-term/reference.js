export function highlightTerm(text, term) {
  const wanted = term.trim();

  if (wanted === "") {
    return text;
  }

  return text.replace(new RegExp(RegExp.escape(wanted), "gi"), "[$&]");
}
