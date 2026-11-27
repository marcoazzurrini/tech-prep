# Blocked Word Filter (medium)

`makeWordFilter(words)` takes a list of blocked words, made of letters only. It returns an object with two functions:

- `isBlocked(text)` says whether the text holds one of the words as a whole word, in any case.
- `censor(text)` replaces each blocked word with as many `*` as it has letters.

Some calls to `isBlocked` give the wrong answer. Fix it.

Example 1:
  const f = makeWordFilter(["spam", "scam"])
  [f.isBlocked("Spam here"), f.isBlocked("spam")]  ->  [true, true]
Example 2: makeWordFilter(["bad"]).censor("badge bad")  ->  "badge ***"
