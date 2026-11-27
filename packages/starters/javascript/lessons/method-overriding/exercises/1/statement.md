Write `class Formatter` and `class TagFormatter extends Formatter`.

`Formatter` has `open()` returning `"["`, `close()` returning `"]"`, and `wrap(text)` returning `this.open() + text + this.close()`.

`TagFormatter` takes `tag` in its constructor, stores `this.tag`, and overrides `open()` to return `"<tag>"` and `close()` to return `"</tag>"`. Do not override `wrap`.

Example 1: new Formatter().wrap("hi")  ->  "[hi]"
Example 2: new TagFormatter("b").wrap("hi")  ->  "<b>hi</b>"
