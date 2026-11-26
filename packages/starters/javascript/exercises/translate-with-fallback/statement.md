# Translate with Fallback (easy)

Write `translate(dictionary, language, key)`. The dictionary maps a language code to an object of texts.

Return the text for `key` in that language. If there is none, return the English text, which is under `en`. If there is none either, return the key itself.

A language may be missing from the dictionary. An empty text `""` is still a text.

Example 1: translate({ en: { hi: "Hello" }, fr: { hi: "Salut" } }, "fr", "hi")  ->  "Salut"
Example 2: translate({ en: { hi: "Hello" }, fr: {} }, "fr", "hi")  ->  "Hello"
Example 3: translate({ en: { hi: "Hello" } }, "de", "bye")  ->  "bye"
