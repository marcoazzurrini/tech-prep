# Reading JSON

jq works on JSON, so you need to read JSON with ease. JSON has only six kinds of value. This lesson shows each one.

## Simple values

Four kinds of value are simple. Each is one thing.

- Text, called a **string**. It always sits in double quotes: `"Oslo"`.
- A **number**, with no quotes: `36` or `4.5`.
- `true` or `false`, with no quotes. This kind is called a **boolean**.
- `null`. It means "nothing here".

Quotes matter. `"36"` is text. `36` is a number.

## Objects: values with names

An **object** holds values under names. It is written with curly braces:

```json
{"city": "Oslo", "temp": 4}
```

- Each entry has a name and a value, with a colon between them. The name is called a **key**.
- Keys are always text in double quotes.
- Commas separate the entries.

Here the key `city` holds the text `"Oslo"`, and the key `temp` holds the number `4`.

In this lesson you do not write filters. You read the input and type a value from it, exactly as JSON writes it.

<!-- task -->

## Quotes are part of the value

When you type text, type its double quotes too. `"web-1"` is JSON. Without the quotes, `web-1` is not JSON at all, and jq would reject it.

Numbers, `true`, `false` and `null` never have quotes.

<!-- task -->

## Arrays: values in order

An **array** is a list of values in order. It is written with square brackets:

```json
["admin", "dev", "oncall"]
```

- Commas separate the items.
- The items can be any kind of value.
- The whole array is one value. An object can hold it under a key, like any other value.

<!-- task -->

## Values inside values

An object can hold another object, or an array. An array can hold objects. Real JSON is built this way, layer on layer:

```json
{
  "id": 801,
  "customer": {"name": "Ada", "city": "Bergen"},
  "items": [
    {"name": "pen", "price": 2},
    {"name": "pad", "price": 5}
  ]
}
```

Read it from the outside in:

- The whole thing is an object with three keys: `id`, `customer` and `items`.
- `customer` holds an object with two keys.
- `items` holds an array of two objects.

To find a value, name the steps: "inside `customer`, the value under `city`".

<!-- task -->

## Remember

- JSON has six kinds of value: string, number, boolean, null, array and object.
- A string always has double quotes. Nothing else does.
- An object holds values under keys: `{"key": value}`.
- An array holds values in order: `[value, value]`.
- Values nest. Read them from the outside in.
