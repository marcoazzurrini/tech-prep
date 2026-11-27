export class OutOfStockError extends Error {}
export class PaymentError extends Error {}

function later(value, ms) {
  return new Promise((resolve) => setTimeout(() => resolve(value), ms));
}

export function reserve(order) {
  return later(order, 10).then((o) => {
    if (!o.item) {
      throw new Error("no item");
    }
    if (o.quantity > 5) {
      throw new OutOfStockError(o.item);
    }
    return o;
  });
}

export function charge(order) {
  return later(order, 10).then((o) => {
    if (o.card === "expired") {
      throw new PaymentError(o.card);
    }
    if (o.card === undefined) {
      throw new TypeError("card is undefined");
    }
    return "paid " + o.quantity + " " + o.item;
  });
}

export function placeOrder(order) {
  return reserve(order)
    .then((reserved) => charge(reserved))
    .then(() => "shipped " + order.item)
    .catch((error) => {
      if (error instanceof OutOfStockError) {
        return "sold out";
      }
      if (error instanceof PaymentError) {
        return "payment failed";
      }
      throw error;
    });
}
