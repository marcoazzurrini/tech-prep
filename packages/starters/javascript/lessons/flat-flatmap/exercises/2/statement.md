Write `expandTags(posts)`. Each post is `{ title, tags }`, where `tags` is an array of strings.

Return a single array of `"title:tag"` strings for every tag across all posts, in order.

Example 1:
  expandTags([{ title: "news", tags: ["js", "web"] }, { title: "note", tags: [] }])  ->  ["news:js", "news:web"]
Example 2:
  expandTags([])  ->  []
