Write `formatMoney` as a curried function. It takes a currency symbol, then a number of decimals, then an amount, one per call. The last call returns the symbol followed by the amount with that many decimals.

Example 1: formatMoney("£")(2)(3.5)  ->  "£3.50"
Example 2:
  const euros = formatMoney("€");
  euros(0)(7.4)  ->  "€7"
