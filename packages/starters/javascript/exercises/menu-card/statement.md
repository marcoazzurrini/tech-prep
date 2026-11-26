# Menu Card (medium)

`menuCard(dishes, symbol)` takes a list of dishes and a currency symbol. It should return an object with a `title` and one line of text for each dish. A price is shown with two decimals.

The code below throws. Fix it.

Example 1: menuCard([{ name: "Soup", price: 4.5 }], "£")  ->  { title: "Menu (£)", lines: ["Soup: £4.50"] }
Example 2: menuCard([], "$")  ->  { title: "Menu ($)", lines: [] }
