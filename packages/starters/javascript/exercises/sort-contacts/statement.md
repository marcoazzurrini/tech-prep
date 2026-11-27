# Sort Contacts (medium)

Write `sortContacts(contacts)`. Each contact is an object such as `{ first: "Ada", last: "Byron" }`. Return a new array, sorted by last name and then by first name, in English dictionary order.

Two last names that differ only in case or accents, such as `"Öberg"` and `"oberg"`, count as the same. The first name then decides.

Example 1:
  sortContacts([{ first: "Ali", last: "Zane" }, { first: "Mia", last: "adams" }])
  ->  [{ first: "Mia", last: "adams" }, { first: "Ali", last: "Zane" }]
Example 2:
  sortContacts([{ first: "Lena", last: "Öberg" }, { first: "Bo", last: "oberg" }])
  ->  [{ first: "Bo", last: "oberg" }, { first: "Lena", last: "Öberg" }]
