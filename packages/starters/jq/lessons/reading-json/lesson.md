# Reading JSON

## Simple values

- `"Oslo"` is a **string**. It is text, and it always sits in double quotes.
- `36` and `4.5` are **numbers**. They have no quotes.
- `true` and `false` are **booleans**. They have no quotes.
- `null` means "nothing here". It has no quotes.

**Rule:** Quotes make text. `"36"` is a string. `36` is a number.

## Objects: values with names

```json
{"city": "Oslo", "temp": 4}
```

**Rule:** An **object** holds values under names, between curly braces. A name is called a **key**.

- A key is always text in double quotes.
- A colon sits between the key and its value.
- Commas separate the entries.

Here the key `city` holds the string `"Oslo"`, and the key `temp` holds the number `4`.

<!-- task -->

## Quotes are part of the value

```json
{"name": "Ada", "age": 36}
```

- The value under `name` is `"Ada"`, with its quotes.
- The value under `age` is `36`, with no quotes.

**Rule:** When you type text, type its double quotes too.

`Ada` without the quotes is not JSON at all. jq would reject it.

Numbers, `true`, `false` and `null` never have quotes.

<!-- task -->

## Arrays: values in order

```json
["admin", "dev", "oncall"]
```

**Rule:** An **array** is a list of values in order, between square brackets.

- Commas separate the items.
- The items can be any kind of value.
- The whole array is one value. An object can hold it under a key: `{"roles": ["admin", "dev"]}`.

<!-- task -->

## Values inside values

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

**Rule:** Values hold other values. Read them from the outside in.

- The whole thing is an object with three keys: `id`, `customer` and `items`.
- `customer` holds an object with two keys.
- `items` holds an array of two objects.

To find a value, name the steps: inside `customer`, the value under `city` is `"Bergen"`.

<!-- task -->

## Remember

- JSON has six kinds of value: string, number, boolean, null, array and object.
- A string always has double quotes. Nothing else does.
- An object holds values under keys: `{"key": value}`. An array holds values in order: `[value, value]`.
- Values nest. Read them from the outside in.
