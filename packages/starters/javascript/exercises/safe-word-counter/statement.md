# Safe Word Counter (medium)

Write `countWords(words)`. It takes an array of strings and returns an object mapping each word to how many times it appears.

Words may include names like `"toString"`, `"constructor"` and `"__proto__"`. Any word that was not in the input must not exist on the returned object, even with `in`.

Example 1: countWords(["cat", "dog", "cat"])  ->  { cat: 2, dog: 1 } (with no inherited keys)
Example 2: countWords(["toString", "__proto__", "toString"])  ->  { toString: 2, "__proto__": 1 }
