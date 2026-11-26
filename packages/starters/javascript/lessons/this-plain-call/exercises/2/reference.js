export function makeParcel(weight, pricePerKilo) {
  return {
    weight,
    pricePerKilo,
    label() {
      const parcel = this;

      function price() {
        return parcel.weight * parcel.pricePerKilo;
      }

      return `${this.weight} kg, ${price()} euros`;
    },
  };
}
