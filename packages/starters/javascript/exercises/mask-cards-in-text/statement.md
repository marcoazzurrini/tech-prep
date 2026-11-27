# Hide Card Numbers in a Message (medium)

Write `maskCards(text)`. A card number is 12 to 19 digits in a row. One space or one dash may sit between two of its digits.

Return the text with every digit of each card number replaced by `*`, except its last four digits. Keep the spaces and dashes. Leave every other number as it is, including longer ones.

Example 1: maskCards("Paid with 4111 1111 1111 1234.")  ->  "Paid with **** **** **** 1234."
Example 2: maskCards("Order 12345, card 5500-0000-0000-0004")  ->  "Order 12345, card ****-****-****-0004"
Example 3: maskCards("Call 555-0100 today")  ->  "Call 555-0100 today"
