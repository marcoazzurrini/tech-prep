# Your Own Filters

## Give a filter a name

**Input**

```json
{"lead": {"name": "Ada", "email": "ada@example.com", "age": 36, "city": "Oslo"}}
```

**Filter**

```jq
def contact: {name, email}; .lead | contact
```

**Output**

```json
{"name": "Ada", "email": "ada@example.com"}
```

```steps
def contact: {name, email}; .lead => {"name": "Ada", "email": "ada@example.com", "age": 36, "city": "Oslo"}
def contact: {name, email}; .lead «| contact» => {"name": "Ada", "email": "ada@example.com"}
```

**Rule:** `def name: body;` makes a new filter and prints nothing. The program after the `;` is what runs.

`def contact: {name, email};` reads as: from now on, `contact` means `{name, email}`. You choose the name. The body comes after the colon, and the `;` ends it.

`contact` works like `length`. It takes its input from the pipe. In the body, the dot is that input.

<!-- task -->

## Use it in more than one place

**Input**

```json
{"lead": {"name": "Ada", "email": "ada@example.com", "age": 36}, "backup": {"name": "Bo", "email": "bo@example.com", "age": 41}}
```

**Filter**

```jq
def contact: {name, email}; {lead: .lead | contact, backup: .backup | contact}
```

**Output**

```json
{"lead": {"name": "Ada", "email": "ada@example.com"}, "backup": {"name": "Bo", "email": "bo@example.com"}}
```

**Rule:** Write a step once, then use its name in every place that needs it. To change the step, you change one place.

`lead: .lead | contact` takes `lead`, hands it to `contact`, and stores the result under `lead`. The comma ends the chain.

`def mail: .email;` works too. The body can be any filter, such as a path or a `map`.

<!-- task -->

## Inside map, and what goes wrong

**Input**

```json
{"owner": {"name": "Cy", "email": "cy@example.com", "age": 29}, "guests": [{"name": "Dee", "email": "dee@example.com", "age": 52}]}
```

**Filter**

```jq
def contact: {name, email}; {owner: .owner | contact, guests: .guests | map(contact)}
```

**Output**

```json
{"owner": {"name": "Cy", "email": "cy@example.com"}, "guests": [{"name": "Dee", "email": "dee@example.com"}]}
```

**Rule:** Your filter works in every place where a filter works. Inside `map`, it runs on every item.

**Common mistake:** A name that jq does not know.

**Wrong**

```jq
def contact: {name, email}; .owner | «contat»
```

**Error**

```text
jq: error: contat/0 is not defined at <top-level>, line 1:
```

**Fix**

```jq
def contact: {name, email}; .owner | «contact»
```

It means there is no filter called `contat`. Ignore the `/0`. The definition is missing, or the name is spelled in two ways.

**Common mistake:** No `;` after the definition.

**Wrong**

```jq
def contact: {name, email} .owner | contact
```

**Error**

```text
jq: error: syntax error, unexpected end of file (Unix shell quoting issues?) at <top-level>, line 1:
```

**Fix**

```jq
def contact: {name, email}«;» .owner | contact
```

Without the `;`, jq cannot tell where the body ends. The words after `syntax error` differ from case to case. In a filter with a `def`, check the `;` first. Ignore the note about shell quoting.

<!-- task -->

## Remember

- `def name: body;` makes a new filter. It comes before the program that uses it, and it ends with `;`.
- Use the name like `length`: hand it a value with a pipe. In the body, `.` is that value.
- Write a step once, and use it in many places, also inside `map`.
- `name/0 is not defined` means the definition is missing or the name is spelled wrong.
