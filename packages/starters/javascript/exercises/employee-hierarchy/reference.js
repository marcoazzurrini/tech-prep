export function Employee(name, basePay) {
  this.name = name;
  this.basePay = basePay;
}
Employee.prototype.totalPay = function () {
  return this.basePay;
};

export function Manager(name, basePay, bonus) {
  Employee.call(this, name, basePay);
  this.bonus = bonus;
}
Manager.prototype = Object.create(Employee.prototype);
Manager.prototype.constructor = Manager;
Manager.prototype.totalPay = function () {
  return Employee.prototype.totalPay.call(this) + this.bonus;
};
