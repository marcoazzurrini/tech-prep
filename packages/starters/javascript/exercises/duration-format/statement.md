# Duration Format (easy)

Finish this file. It works with the length of a song.

- The default export is `formatDuration(seconds)`. It returns minutes and seconds as text, with two digits for the seconds.
- `parseDuration(text)` is a named export. It does the reverse and returns the seconds.
- `parseDuration` is also exported under a second name, `toSeconds`.

Example 1: exports.default(65)  ->  "1:05"
Example 2: parseDuration("1:05")  ->  65
Example 3: toSeconds("0:30")  ->  30
