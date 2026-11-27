export function expandTags(posts) {
  return posts.flatMap((post) => post.tags.map((tag) => `${post.title}:${tag}`));
}
