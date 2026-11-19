# Fields with .name

`.` is the whole input. `.name` reads one field of an object. `.a.b` goes one level deeper: it reads `a`, then reads `b` inside it.

## Worked example

Give the kind of pet that Mia has.

**Input**

```json
{
  "name": "Mia",
  "pet": {"kind": "cat", "age": 3}
}
```

**Filter**

```jq
.pet.kind
```

**Output**

```json
"cat"
```

## Why it works

- `.pet` reads the `pet` field. It gives the inner object.
- `.kind` then reads the `kind` field of that inner object.
- A field that is missing gives `null`, not an error. Here `.pet.color` gives `null`.

## When to use it

- The task asks for one value of an object: "the name", "the city of the address".
- The value sits inside another object: write one `.field` for each level.
- You get `null` and did not expect it: check the spelling of each field name. You get the error `Cannot index string with string "kind"`: you went one level too deep. The value before `.kind` is text, not an object.
