# Borrow a Name (medium)

Some old code reads its settings as bare names, such as `locale`, that every part of the program can see.

Write `withSetting(name, value, task)`. It makes `value` readable under the bare name `name` everywhere in the program, calls `task()` and returns what `task` returned.

Afterwards the name must be as it was before: back to its old value, or gone if it had none. That holds even when `task` throws, and the error must still reach the caller.

Example 1: withSetting("locale", "fr", () => locale)  ->  "fr", and afterwards `typeof locale` is "undefined"
Example 2: with `locale` already "en", the same call  ->  "fr", and afterwards `locale` is "en" again
