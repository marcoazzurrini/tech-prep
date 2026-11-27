# Issued Tokens (medium)

Write a class `Token`. The only way to get a token is `Token.issue(owner)`. It returns a new token whose `owner` property is `owner`. Calling `new Token(...)` from outside the class throws a `TypeError`.

- `Token.verify(value)` returns `true` only for a token made by `Token.issue`. For any other value it returns `false` and never throws. That includes a look-alike such as `{ owner: "Ada" }`, a string and `null`.
- `Token.count()` returns how many tokens have been issued so far.

No code outside the class may change the count or make a token pass `verify`. `Object.keys(Token)` gives `[]`.

Example 1:
  const token = Token.issue("Ada");
  token.owner  ->  "Ada"
  Token.verify(token)  ->  true
  Token.verify({ owner: "Ada" })  ->  false

Example 2: new Token("Ada")  ->  throws a TypeError
