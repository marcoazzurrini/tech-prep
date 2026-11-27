# RGB Colour (medium)

Write a class `Colour` for RGB colours with channels from `0` to `255`.

- `new Colour(r, g, b)` stores `r`, `g` and `b` on the instance.
- `Colour.BLACK` is a `Colour` with `0, 0, 0`. `Colour.WHITE` is a `Colour` with `255, 255, 255`.
- `Colour.fromHex(hex)` takes a six-digit hex string such as `"#ff8000"` and returns a `Colour`.
- `Colour.mix(a, b)` returns a new `Colour` whose channels are the averages of `a` and `b`, rounded with `Math.round`.
- `toHex()` returns the lowercase hex string `"#rrggbb"`.

Example 1:
  const orange = Colour.fromHex("#ff8000");
  orange.r  ->  255
  orange.g  ->  128
  orange.b  ->  0
  orange.toHex()  ->  "#ff8000"

Example 2:
  Colour.mix(Colour.BLACK, Colour.WHITE).toHex()  ->  "#808080"
