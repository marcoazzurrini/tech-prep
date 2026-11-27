# Upcoming Birthdays (hard)

Write `upcomingBirthdays(people, today)`. Each person is an object with a `name` and a `birthday`, and `today` is a date. All dates are written as `"YYYY-MM-DD"`.

Return the names, ordered by whose next birthday comes soonest. A birthday on `today` comes first. Someone born on 29 February has their birthday on 28 February in a year that has no 29 February. When two people share the next birthday, keep them in the order given.

Example 1:
  upcomingBirthdays([{ name: "Ada", birthday: "1990-12-10" }, { name: "Cy", birthday: "2001-07-20" }], "2024-07-01")
  ->  ["Cy", "Ada"]
Example 2:
  upcomingBirthdays([{ name: "Max", birthday: "1999-03-01" }, { name: "Lea", birthday: "2000-02-29" }], "2025-02-28")
  ->  ["Lea", "Max"]
