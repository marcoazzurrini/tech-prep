# Rows for a Spreadsheet

## One row from an array

**Input**

```json
{"name": "Ada", "age": 36, "city": "Oslo"}
```

**Command**

```sh
jq -r '[.name, .age] | @csv' data.json
```

**Output**

```text
"Ada",36
```

```steps
jq -r '[.name, .age]' data.json => ["Ada", 36]
jq -r '[.name, .age] «| @csv»' data.json => "Ada",36
```

**Rule:** A row is an array. `@csv` turns it into one line: the values, joined by commas.

`[.name, .age]` builds the row: the values you want, in order, with a comma between them.

`@csv` puts double quotes around a string and none around a number. That is how CSV, "comma-separated values", is written. A spreadsheet reads each line as one row.

**Common mistake:** No `-r` flag.

**Wrong**

```sh
jq '[.name, .age] | @csv' data.json
```

**Output**

```text
"\"Ada\",36"
```

**Fix**

```sh
jq «-r» '[.name, .age] | @csv' data.json
```

Without `-r`, jq prints the row as a JSON string, which no spreadsheet can read. Use `-r` in every task of this lesson.

<!-- task -->

## One row for each item

**Input**

```json
[
  {"name": "Ada", "age": 36, "city": "Oslo"},
  {"name": "Bo", "age": 29, "city": "Bergen"}
]
```

**Command**

```sh
jq -r '.[] | [.name, .age, .city] | @csv' data.json
```

**Output**

```text
"Ada",36,"Oslo"
"Bo",29,"Bergen"
```

```steps
jq -r '.[]' data.json => {"name": "Ada", "age": 36, "city": "Oslo"} ;; {"name": "Bo", "age": 29, "city": "Bergen"}
jq -r '.[] «| [.name, .age, .city]»' data.json => ["Ada", 36, "Oslo"] ;; ["Bo", 29, "Bergen"]
jq -r '.[] | [.name, .age, .city] «| @csv»' data.json => "Ada",36,"Oslo" ;; "Bo",29,"Bergen"
```

**Rule:** Take every item, build a row from each, then hand each row to `@csv`. The order in the brackets is the order of the columns.

`@csv` makes one line from one row. Give it a whole list of rows, and jq stops with `is not valid in a csv row`. `@tsv` gives the same message, with the word `csv` in it. Take the list apart with `.[]` first.

**Common mistake:** Giving `@csv` an object.

**Wrong**

```sh
jq -r '.[] | @csv' data.json
```

**Error**

```text
jq: error: object ({"name":"Ad...) cannot be csv-formatted, only array
```

**Fix**

```sh
jq -r '.[] | «[.name, .age, .city] | »@csv' data.json
```

`@csv` takes an array only. Build the row first.

<!-- task -->

## Tabs with @tsv

**Input**

```json
[
  {"name": "Ada", "age": 36, "city": "Oslo"},
  {"name": "Bo", "age": 29, "city": "Bergen"}
]
```

**Command**

```sh
jq -r '.[] | [.name, .age, .city] | @tsv' data.json
```

**Output**

```text
Ada	36	Oslo
Bo	29	Bergen
```

```steps
jq -r '.[] | [.name, .age, .city]' data.json => ["Ada", 36, "Oslo"] ;; ["Bo", 29, "Bergen"]
jq -r '.[] | [.name, .age, .city] «| @tsv»' data.json => Ada	36	Oslo ;; Bo	29	Bergen
```

**Rule:** `@tsv` works like `@csv`, but it puts a tab between the values, and no quotes around strings.

`@csv` is for a `.csv` file. The quotes keep a value such as `"Oslo, Norway"` in one piece, even with a comma inside it.

`@tsv` is for rows you paste into a spreadsheet, and for terminal tools that split a line at tabs. TSV stands for "tab-separated values". The gaps in its output are tabs, not spaces.

<!-- task -->

## Remember

- A row is an array: `[.name, .age]`. The order in the brackets is the order of the columns.
- `@csv` makes one line with commas, and strings get quotes. `@tsv` makes one line with tabs, and strings get none.
- For one row for each item: `.[] | [.name, .age] | @csv`.
- Both take one array only, and both need `-r`.
