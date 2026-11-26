export function toSlug(title) {
  const parts = words(title);
  const slug = join(parts);

  function words(text) {
    return text.toLowerCase().split(" ");
  }

  function join(list) {
    return list.join("-");
  }

  return slug;
}
