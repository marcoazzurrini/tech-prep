# Shipping Rates (easy)

Write `class Shipment`, `class ExpressShipment extends Shipment`, and `class FreeBaseShipment extends Shipment`.

`Shipment` takes `weight` (a number) in its constructor and stores `this.weight`. It has `baseFee()` returning `5`, `ratePerKg()` returning `4`, and `cost()` returning `this.baseFee() + this.weight * this.ratePerKg()`.

`ExpressShipment` changes `baseFee()` to `12` and `ratePerKg()` to `9`. `FreeBaseShipment` changes `baseFee()` to `0`. Neither subclass defines its own `cost()`.

Example 1: new Shipment(3).cost()  ->  17
Example 2: new ExpressShipment(3).cost()  ->  39
Example 3: new FreeBaseShipment(3).cost()  ->  12
