export function Wallet(start) {
  let balance = start;

  this.deposit = (amount) => {
    balance += amount;
    return balance;
  };

  this.withdraw = (amount) => {
    if (amount > balance) {
      throw new RangeError("Not enough money");
    }

    balance -= amount;
    return balance;
  };

  this.balance = () => balance;
}
