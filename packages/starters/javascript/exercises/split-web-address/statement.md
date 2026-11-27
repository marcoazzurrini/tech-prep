# Split a Web Address (medium)

Write `splitAddress(url)`. A web address here has four parts, in this order:

- the protocol, `http` or `https`, followed by `://`;
- the host: one or more letters, digits, dots or dashes;
- an optional port: a colon and one or more digits;
- an optional path: a `/` and everything after it.

Return `{ protocol, host, port, path }`. The port is a number, or `null` when there is none. The path is `"/"` when there is none. Return `null` when `url` does not have this shape.

Example 1:
  splitAddress("https://shop.example.com:8080/cart")
  ->  { protocol: "https", host: "shop.example.com", port: 8080, path: "/cart" }
Example 2: splitAddress("http://localhost")  ->  { protocol: "http", host: "localhost", port: null, path: "/" }
Example 3: splitAddress("ftp://files.org")  ->  null
