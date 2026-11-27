# Request Layers (medium)

A server answers a request with a handler: a function that takes a request and returns a response. A layer is a function that takes a handler and returns a new handler. The new handler can do work before and after it calls the handler it was given.

Write `withLayers(handler, layers)`. It returns one handler, with every layer of the list around `handler`. The first layer in the list is the outermost: it sees the request first and the response last. Build the new handler once, when `withLayers` is called, not at every request.

The file also exports `layer`, for the tests. `layer(log, name)` makes a layer that pushes `"name in"` to `log`, calls the handler, then pushes `"name out"`.

Example 1:
  withLayers(handler, [layer(log, "a"), layer(log, "b")])(request)
  log becomes ["a in", "b in", "b out", "a out"]
Example 2: withLayers(handler, [])  ->  works like handler
