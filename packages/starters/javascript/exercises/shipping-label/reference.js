export function shippingLabel(order) {
  const {
    express = false,
    customer: {
      name,
      address: { city, country = "Italy" },
    },
  } = order;
  const label = `${name}, ${city}, ${country}`;

  return express ? `${label} (express)` : label;
}
