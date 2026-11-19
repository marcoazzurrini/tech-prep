# Fastest Print Job (easy)

An office has several printers. They all start at the same moment and print without a break. Printer `i` finishes one page every `seconds[i]` seconds. So after `t` seconds it has finished `floor(t / seconds[i])` pages.

Return the smallest whole number of seconds after which the printers have finished at least `pages` pages in total.

Example 1: seconds = [2, 3], pages = 5 -> 6 After 6 seconds the printers have finished 3 + 2 = 5 pages. After 5 seconds they have only 2 + 1 = 3. Example 2: seconds = [5], pages = 3 -> 15 Example 3: seconds = [1, 1], pages = 4 -> 2

Constraints: 1 <= len(seconds) <= 100, 1 <= seconds[i] <= 1000, 1 <= pages <= 10^6.
