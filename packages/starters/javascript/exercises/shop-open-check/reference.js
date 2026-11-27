export function isShopOpen(moment, shop) {
  const clock = new Date(moment).toLocaleTimeString("en-GB", {
    timeZone: shop.location,
    hour: "2-digit",
    minute: "2-digit",
  });

  return shop.opens <= clock && clock < shop.closes;
}
