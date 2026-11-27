Write `toFahrenheit(text)`. The text may hold temperatures in Celsius, such as `20C` or `-5C`: a whole number, maybe with a minus sign, then `C`.

Return the text with each one turned into Fahrenheit, such as `68F`. Use `celsius * 9 / 5 + 32` and round it with `Math.round`. Leave the rest of the text as it is.

Example 1: toFahrenheit("It was 20C, then -5C.")  ->  "It was 68F, then 23F."
Example 2: toFahrenheit("Body: 37C")  ->  "Body: 99F"
Example 3: toFahrenheit("No data")  ->  "No data"
