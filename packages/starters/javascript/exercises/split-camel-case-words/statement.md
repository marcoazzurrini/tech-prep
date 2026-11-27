# Split an Identifier (medium)

Write `identifierWords(name)`. The name is made of letters only and is written in camelCase or PascalCase, such as `userId` or `HttpClient`. Return its words, with their case kept.

A new word starts at a capital that follows a small letter. A run of capitals is one word, such as `HTTP`. When a capital in a run is followed by a small letter, that capital starts the next word.

Example 1: identifierWords("userId")  ->  ["user", "Id"]
Example 2: identifierWords("parseHTTPResponse")  ->  ["parse", "HTTP", "Response"]
Example 3: identifierWords("XMLParser")  ->  ["XML", "Parser"]
Example 4: identifierWords("simple")  ->  ["simple"]
