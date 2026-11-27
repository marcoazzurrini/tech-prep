# Order in Batches (medium)

Write `findOrder(batches, id)`. `batches` is an iterable of arrays of orders, such as `[{ id: 7, item: "tea" }]`. Return the first order with that `id`, or `null` if there is none.

`batches` can be an endless generator. When the order is there, stop reading as soon as you find it, and let the generator finish its clean-up.

Example 1: findOrder([[{ id: 1, item: "tea" }], [{ id: 2, item: "jam" }]], 2)  ->  { id: 2, item: "jam" }
Example 2: findOrder([[{ id: 1, item: "tea" }]], 9)  ->  null
