# Encode and Decode Strings (medium)

Write two functions:
- `encode(strs)`: packs a list of strings into one single string.
- `decode(s)`: unpacks that string back into the original list.

Any format works, as long as `decode(encode(strs))` returns exactly `strs`. The strings may contain any character, including digits, `#`, `,` and spaces, and may be empty.

Example 1: strs = ["neet", "code", "love", "you"]  ->  decode(encode(strs)) == ["neet", "code", "love", "you"]
Example 2: strs = ["", "a#b", "3,4"]  ->  decode(encode(strs)) == ["", "a#b", "3,4"]
Example 3: strs = []  ->  decode(encode(strs)) == [] (must be told apart from [""])

Constraints: 0 <= len(strs) <= 200, 0 <= len(strs[i]) <= 200, any characters.
Follow-up: can you avoid relying on a delimiter that might appear inside the strings?
