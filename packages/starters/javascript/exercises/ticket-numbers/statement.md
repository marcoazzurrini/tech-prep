# Ticket Numbers (medium)

Write a file that hands out ticket numbers for the queues of a shop. It exports two functions, and nothing else.

`nextTicket(queue)` takes the name of a queue and returns the next ticket of that queue: the name, a dash and a number. Each queue counts from 1 on its own.

`reset()` starts every queue from 1 again.

Example 1:
  nextTicket("A")  ->  "A-1"
  nextTicket("A")  ->  "A-2"
  nextTicket("B")  ->  "B-1"
  reset()
  nextTicket("A")  ->  "A-1"

Note: a queue can have any name, such as "toString".
