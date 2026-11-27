# Dates to ISO Format (medium)

Write `toIsoDates(text)`. The text may hold dates written as `DD/MM/YYYY`, such as `05/09/2026`: two digits, `/`, two digits, `/`, four digits. A date must not touch another letter or digit.

Return the text with each such date written as `YYYY-MM-DD`. A date whose day is not 01 to 31, or whose month is not 01 to 12, stays as it is.

Example 1: toIsoDates("Due 05/09/2026, paid 12/10/2026.")  ->  "Due 2026-09-05, paid 2026-10-12."
Example 2: toIsoDates("Bad 31/13/2026 date")  ->  "Bad 31/13/2026 date"
Example 3: toIsoDates("1/2/2026")  ->  "1/2/2026"
