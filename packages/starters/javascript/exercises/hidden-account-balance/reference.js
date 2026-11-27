const balances = new WeakMap();

export class Account {
  constructor() {
    balances.set(this, 0);
  }

  deposit(amount) {
    balances.set(this, balances.get(this) + amount);
  }

  withdraw(amount) {
    const current = balances.get(this);

    if (amount > current) {
      throw new RangeError("Not enough money");
    }

    balances.set(this, current - amount);
  }

  balance() {
    return balances.get(this);
  }
}
