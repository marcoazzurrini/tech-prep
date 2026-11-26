`makeParcel(weight, pricePerKilo)` returns a parcel. Its method `label()` should return a text with the weight and the price, from the values the parcel holds when it is called.

The code below throws a `TypeError`. Fix it.

Example 1: makeParcel(2, 5).label()  ->  "2 kg, 10 euros"
Example 2:
  const parcel = makeParcel(2, 5);
  parcel.weight = 3;
  parcel.label()  ->  "3 kg, 15 euros"
