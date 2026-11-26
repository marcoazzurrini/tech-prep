export function makeTill(taxPercent) {
  return {
    setTax(percent) {
      taxPercent = percent;
    },
    priceOf(amount) {
      return (amount * (100 + taxPercent)) / 100;
    },
  };
}
