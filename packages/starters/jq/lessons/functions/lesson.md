# Your Own Filters

`length` and `keys` are filters with names. You can make your own. Then a step that you need more than once is written only once.

## Give a filter a name

A user object has many fields. You want a short form of it: only the name and the email.

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

The filter has two halves.

The first half is the **definition**. It makes a new filter and prints nothing:

- `def` starts it.
- `contact` is the name you choose.
- After the colon comes the **body**: what the filter does. Here it is `{name, email}`.
- The semicolon `;` ends it.

The second half is the program that runs: `.lead | contact`. Here `contact` works like `length`. It takes its input from the pipe. In the body, the dot is that input.

Read `def contact: {name, email};` as "from now on, `contact` means `{name, email}`".

<!-- task -->

## Use it in more than one place

A name is most useful when you need the same step twice. Here the lead and the backup both need the short form.

**Input**

```json
{
  "lead": {"name": "Ada", "email": "ada@example.com", "age": 36},
  "backup": {"name": "Bo", "email": "bo@example.com", "age": 41}
}
```

**Filter**

```jq
def contact: {name, email}; {lead: .lead | contact, backup: .backup | contact}
```

**Output**

```json
{
  "lead": {"name": "Ada", "email": "ada@example.com"},
  "backup": {"name": "Bo", "email": "bo@example.com"}
}
```

In a new object, the value of a key can be a short chain. `lead: .lead | contact` means: take `lead`, hand it to `contact`, and store the result under `lead`. The comma ends the chain.

Without the name, you would write `{name, email}` twice. With the name, you write it once. If you want the city too, you change one place.

<!-- task -->

## Inside map, and what goes wrong

Your filter works in every place where a filter works. Inside `map`, it runs on every item:

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

Two mistakes are common.

**The name is not known.** You forgot the definition, or you spelled the name in two ways:

```text
jq: error: contact/0 is not defined
```

Read it as "there is no filter called `contact`". You can ignore the `/0`.

**The semicolon is missing.** Then jq cannot tell where the body ends:

```text
jq: error: syntax error, unexpected end of file
```

The definition always comes first, and it always ends with `;`.

<!-- task -->

## Remember

- `def name: body;` makes a new filter. It comes before the program that uses it.
- Use the name like `length`: hand it a value with a pipe.
- In the body, `.` is the value the filter was handed.
- Write a step once, and use it in many places, also inside `map`.
- `name/0 is not defined` means the definition is missing or the name is spelled wrong.
