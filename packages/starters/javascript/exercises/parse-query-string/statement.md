# Parse a Query String (medium)

Write `parseQuery(query)`. It takes the query part of a web address, such as `"?page=2&sort=name"`. It returns an object with one property for each `key=value` pair. The pairs are separated by `&`.

- The `?` at the start is optional.
- A value may itself hold `=`. Everything after the first `=` is the value.
- A pair with no `=` gets the value `""`.
- Skip empty pairs. When a key comes twice, the last value wins.

Example 1: parseQuery("?page=2&sort=name")  ->  { page: "2", sort: "name" }
Example 2: parseQuery("?token=a=b&debug")  ->  { token: "a=b", debug: "" }
Example 3: parseQuery("")  ->  {}
