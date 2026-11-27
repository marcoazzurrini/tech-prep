export class Shipment {
  constructor(weight) {
    this.weight = weight;
  }

  baseFee() {
    return 5;
  }

  ratePerKg() {
    return 4;
  }

  cost() {
    return this.baseFee() + this.weight * this.ratePerKg();
  }
}

export class ExpressShipment extends Shipment {
  baseFee() {
    return 12;
  }

  ratePerKg() {
    return 9;
  }
}

export class FreeBaseShipment extends Shipment {
  baseFee() {
    return 0;
  }
}
