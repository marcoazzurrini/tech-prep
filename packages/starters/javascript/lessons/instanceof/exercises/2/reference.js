export function Coupon(code) {
  this.code = code;
}

Coupon.prototype.describe = function () {
  return "Coupon " + this.code;
};

export const welcome = new Coupon("HELLO");
