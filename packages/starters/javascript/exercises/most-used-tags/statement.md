# Most Used Tags (medium)

Write `topTags(posts, n)`. Each post is an object with a `tags` array of strings. A post never lists the same tag twice.

Return the `n` tags used by the most posts, most used first. When two tags are used equally often, the one that appeared first in `posts` comes first. If there are fewer than `n` tags, return them all.

Example 1:
  topTags([{ tags: ["js", "css"] }, { tags: ["css"] }, { tags: ["html", "js", "css"] }], 2)  ->  ["css", "js"]

Example 2:
  topTags([{ tags: ["b", "a"] }, { tags: ["a", "b"] }], 1)  ->  ["b"]

Note: Any string can be a tag, such as "10" or "constructor".
