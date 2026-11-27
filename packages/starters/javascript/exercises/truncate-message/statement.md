# Shorten a Message (medium)

Write `truncateMessage(text, max)`. When the text has at most `max` characters, return it as it is. Otherwise return its first `max` characters, followed by `…`.

Count characters as a reader sees them. A character outside the 16-bit range, such as `𝒳`, counts as one. A whole emoji counts as one, even when it is built from several parts: `👍🏽`, a flag such as `🇮🇹`, or a family such as `👨‍👩‍👧`.

Example 1: truncateMessage("Hello world", 5)  ->  "Hello…"
Example 2: truncateMessage("Hi 👍🏽 there", 4)  ->  "Hi 👍🏽…"
Example 3: truncateMessage("🇮🇹🇫🇷🇩🇪", 2)  ->  "🇮🇹🇫🇷…"
Example 4: truncateMessage("short", 10)  ->  "short"

Note: solve it without `Intl.Segmenter`.
