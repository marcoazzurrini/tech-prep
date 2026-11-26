# Final Address (medium)

A website keeps its redirects in an object. Each key is an old path, and its value is the path that it now leads to.

Write `finalPath(redirects, path)`. It follows the redirects from `path` until it reaches a path with no redirect, and returns that path.

Return `null` when the redirects go round in a circle.

Example 1: finalPath({ "/old": "/new", "/new": "/home" }, "/old")  ->  "/home"
Example 2: finalPath({ "/old": "/new" }, "/about")  ->  "/about"
Example 3: finalPath({ "/a": "/b", "/b": "/a" }, "/a")  ->  null
