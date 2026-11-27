# Safe HTML (medium)

Write `html`, to be written right before a template literal, as in html`<p>${name}</p>`. It returns the finished string, with each value made safe for HTML before it goes in:

- `&` becomes `&amp;`, `<` becomes `&lt;`, `>` becomes `&gt;`, `"` becomes `&quot;` and `'` becomes `&#39;`.
- `null` and `undefined` become `""`.
- An array becomes its items, each made safe, with nothing between them.

The fixed text written in the template never changes.

Example 1: html`<p>${"Tom & Jerry"}</p>`  ->  "<p>Tom &amp; Jerry</p>"
Example 2: html`<b>${"<script>"}</b>`  ->  "<b>&lt;script&gt;</b>"
Example 3: html`<p>${null}</p>`  ->  "<p></p>"
