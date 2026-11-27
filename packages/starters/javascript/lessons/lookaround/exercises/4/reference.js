export function addSeparators(text) {
  return text.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
