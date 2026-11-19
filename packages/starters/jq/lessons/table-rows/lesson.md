# Rows for a Spreadsheet

A spreadsheet reads a file where each line is one row. In a CSV file, commas separate the values of a row. In a TSV file, tabs do. jq can print such lines from JSON.

## One row from an array

A row starts as an array: the values of the row, in order. To build it, write the values you want inside square brackets, with a comma between them. `[.name, .age]` gives `["Ada", 36]`.

Then hand the array to `@csv`:

**Input**

```json
{"name": "Ada", "age": 36, "city": "Oslo"}
```

**Filter**

```jq
[.name, .age] | @csv
```

**Output**

```text
"Ada",36
```

`@csv` turns an array into one string: the values, joined by commas. A string gets double quotes and a number does not. That is the way CSV is written. CSV stands for "comma-separated values".

Use the `-r` flag in every task of this lesson: `jq -r '[.name, .age] | @csv' data.json`. Without `-r`, jq would print the row as a JSON string, which no spreadsheet can read:

```text
"\"Ada\",36"
```

<!-- task -->

## One row for each item

A table has many rows. Start from an array of objects. Take every item with `.[]`, and build a row from each one:

**Input**

```json
[
  {"name": "Ada", "age": 36, "city": "Oslo"},
  {"name": "Bo", "age": 29, "city": "Bergen"}
]
```

**Filter**

```jq
.[] | [.name, .age, .city] | @csv
```

**Output**

```text
"Ada",36,"Oslo"
"Bo",29,"Bergen"
```

- `.[]` gives each person as its own output.
- `[.name, .age, .city]` builds the row for that person. The order in the brackets is the order of the columns.
- `@csv` turns each row into one line.

Do not skip the middle step. `@csv` takes an array only. Give it an object, as in `.[] | @csv`, and jq stops:

```text
jq: error: object ({"name":"Ad...) cannot be csv-formatted, only array
```

Read it as: "this is an object, and I can only make a row from an array".

<!-- task -->

## Tabs with @tsv

`@tsv` works like `@csv`, with two differences. It puts a tab between the values. And it puts no quotes around strings. TSV stands for "tab-separated values".

On the same input as before:

**Filter**

```jq
.[] | [.name, .age, .city] | @tsv
```

**Output**

```text
Ada	36	Oslo
Bo	29	Bergen
```

The gaps between the values are tabs, not spaces.

Which one to use?

- Use `@csv` to make a `.csv` file. The quotes keep a value such as `"Oslo, Norway"` in one piece, even with a comma inside it.
- Use `@tsv` to paste rows into a spreadsheet, or for terminal tools that split a line at tabs.

<!-- task -->

## Remember

- A row is an array: `[.name, .age]`. The order in the brackets is the order of the columns.
- `@csv` turns an array into one line with commas. Strings get quotes.
- `@tsv` turns an array into one line with tabs. Strings get no quotes.
- For one row for each item: `.[] | [.name, .age] | @csv`.
- Both take an array only, and both need `-r`.
