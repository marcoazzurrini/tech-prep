Write `touch(visits, page)`. `visits` maps a page name to its number of visits.

Add one to the count of `page`, and make `page` the last key of the object. A page that is not there yet starts at 1. Return the same object.

Example 1: touch({ home: 2, blog: 5, shop: 1 }, "home")  ->  { blog: 5, shop: 1, home: 3 }
Example 2: touch({ home: 2 }, "faq")  ->  { home: 2, faq: 1 }

Note: A page name is a word, never a number.
