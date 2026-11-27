# Preset Arguments (medium)

A form library makes many fields from one function, with some arguments set ahead of time. Write `preset(fn, context, ...presets)`. It returns a new function.

- A plain call of the new function calls `fn` with `this` set to `context`, the `presets` first and its own arguments after them. It returns what `fn` returns.
- A call with `new` works like `new fn(...presets, ...args)`. It ignores `context`, and gives back an instance of `fn`.

Example 1:
  function Field(type, name) { this.type = type; this.name = name; }
  const TextField = preset(Field, null, "text");
  const field = new TextField("email");
  field.type  ->  "text"
  field instanceof Field  ->  true

Note: solve it without `bind`.
