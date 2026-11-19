# Remove a Value

You have a document, and one part of it must go: a password, a token, a field nobody needs. You want everything else to stay.

Like `|=`, this keeps the whole document. jq does not change your file. It prints a copy without that part.

## del removes one key

Write `del`, and put the path of the value in round brackets:

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
{
  "name": "Ada",
  "email": "ada@example.com"
}
```

Read `del(.password)` as "the input, without `password`". `del` is short for "delete". The key and its value are both gone.

Notice the difference with a plain path:

- `.password` gives **only** the password.
- `del(.password)` gives everything **except** the password.

If the key is not there, nothing happens. `del(.phone)` prints the input unchanged, with no error. So an output that did not change often means a spelling mistake in the key.

<!-- task -->

## Any path works

Inside the brackets you can write any path you know. The value at the end of the path is removed. The rest stays.

**Input**

```json
{"user": {"name": "Ada", "token": "t-81"}, "roles": ["admin", "dev", "guest"]}
```

- `del(.user.token)` removes `token` from inside `user`. The user keeps the name.
- `del(.roles[0])` removes the first item of `roles`. The array is now `["dev", "guest"]`.
- `del(.roles[-1])` removes the last item of `roles`.

When you remove an item from an array, the items after it move up. The array gets shorter. No gap is left.

To remove two things at once, write both paths with a comma between them:

**Filter**

```jq
del(.user.token, .roles[-1])
```

**Output**

```json
{
  "user": {
    "name": "Ada"
  },
  "roles": [
    "admin",
    "dev"
  ]
}
```

<!-- task -->

## Remove a key from every item

Often the input is an array of objects, and one key must go from each of them. `del(.pin)` does not work on the array itself:

```text
jq: error: Cannot index array with string "pin"
```

An array has no key `pin`. The objects inside it have. So run `del` on every item, with `map`:

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
[
  {
    "name": "Ada"
  },
  {
    "name": "Bo"
  }
]
```

When the array sits inside an object, use `|=` so that the rest of the object stays: `.members |= map(del(.pin))`.

<!-- task -->

## Remember

- `del(path)` gives the input without the value at that path.
- `.key` gives only that value. `del(.key)` gives everything except it.
- Any path works: `del(.user.token)`, `del(.roles[0])`.
- A comma removes several things: `del(.a, .b)`.
- For an array of objects, use `map(del(.key))`.
