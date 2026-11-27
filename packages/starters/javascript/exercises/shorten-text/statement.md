# Shorten Text (medium)

Write `shorten(text, max)`. When the text has more than `max` code points, it returns the first `max` code points followed by `"…"`. Otherwise it returns the text as it is.

An emoji such as `🍕` is one code point, and must never be cut in half.

Example 1: shorten("I love 🍕 a lot", 8)  ->  "I love 🍕…"
Example 2: shorten("🍕🍕🍕", 2)  ->  "🍕🍕…"
Example 3: shorten("hi", 5)  ->  "hi"
