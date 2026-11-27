`containsText(text, part)` should return `true` when `part` appears in `text`.

An accented letter counts as one letter, however it is written. So `"Zoe\u0308"`, which shows `Zoë`, does not contain `"e"`.

The code below is wrong for the first two examples. Fix it.

Example 1: containsText("cafe\u0301 au lait", "caf\u00e9")  ->  true
Example 2: containsText("Zoe\u0308", "e")  ->  false
Example 3: containsText("menu", "nu")  ->  true
