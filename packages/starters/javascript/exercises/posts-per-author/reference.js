export function postsPerAuthor(posts) {
  const counts = {};

  for (const post of posts) {
    const { id } = post.author;
    counts[id] = (counts[id] ?? 0) + 1;
  }

  return counts;
}
