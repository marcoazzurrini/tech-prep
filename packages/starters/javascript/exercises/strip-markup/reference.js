export function stripMarkup(html) {
  return html.replace(/<[^<>]*>/g, "").replace(/\s+/g, " ").trim();
}
