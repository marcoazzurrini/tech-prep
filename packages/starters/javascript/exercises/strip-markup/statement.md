# Strip Markup (medium)

Write `stripMarkup(html)`. It returns the text of `html` with every tag removed. A tag starts with `<`, ends with the next `>`, and has no `<` or `>` inside.

Then every run of whitespace becomes one space, and there is no space at the start or the end.

Example 1: stripMarkup("<p>Hi <b>Ada</b></p>")  ->  "Hi Ada"
Example 2: stripMarkup("  <p>  spaced   out </p> ")  ->  "spaced out"
Example 3: stripMarkup("a<br>b")  ->  "ab"
