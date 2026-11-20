# Remove a Value

## del removes one key

**Input**

```json
{"name": "Ada", "email": "ada@example.com", "password": "x9!k"}
```

**Filter**

```jq
del(.password)
```

**Output**

```json
{"name": "Ada", "email": "ada@example.com"}
```

**Rule:** `del(path)` gives a copy of the input without the value at that path. Your file stays as it is.

`.password` gives only the password. `del(.password)` gives everything except the password.

`del(.phone)` gives the input unchanged, with no error. An output that did not change often means a spelling mistake in the key.

<!-- task -->

## Any path works

**Input**

```json
{"user": {"name": "Ada", "token": "t-81"}, "roles": ["admin", "dev", "guest"]}
```

**Filter**

```jq
del(.roles[0])
```

**Output**

```json
{"user": {"name": "Ada", "token": "t-81"}, "roles": ["dev", "guest"]}
```

**Filter**

```jq
del(.user.token, .roles[-1])
```

**Output**

```json
{"user": {"name": "Ada"}, "roles": ["admin", "dev"]}
```

**Rule:** Any path works inside `del`. The value at the end of the path is removed. A comma between two paths removes both.

`del(.roles[0])` leaves no gap. The items after it move up, and the array gets shorter.

`del(.user.token) | .user` gives `{"name": "Ada"}`. `del` is a step, so a pipe can follow it.

<!-- task -->

## Remove a key from every item

**Input**

```json
[{"name": "Ada", "pin": 1234}, {"name": "Bo", "pin": 9876}]
```

**Filter**

```jq
map(del(.pin))
```

**Output**

```json
[{"name": "Ada"}, {"name": "Bo"}]
```

**Rule:** For an array of objects, run `del` on every item with `map`.

`.members |= map(del(.pin))` is for an array under the key `members`. With `|=`, the rest of the object stays.

**Common mistake:** `del` on the array itself.

**Wrong**

```jq
del(.pin)
```

**Error**

```text
jq: error: Cannot index array with string "pin"
```

**Fix**

```jq
«map(»del(.pin)«)»
```

An array has no key `pin`. The objects inside it have.

<!-- task -->

## Remember

- `del(path)` gives the input without the value at that path.
- `.key` gives only that value. `del(.key)` gives everything except it.
- Any path works, and a comma removes several things: `del(.user.token, .roles[0])`.
- For an array of objects, use `map(del(.key))`.
