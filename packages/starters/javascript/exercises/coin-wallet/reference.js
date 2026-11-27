export class Wallet {
  constructor(owner) {
    this.owner = owner;
    this.coins = 0;
  }

  add(amount) {
    this.coins += amount;

    return this.coins;
  }

  spend(amount) {
    if (amount > this.coins) {
      return false;
    }

    this.coins -= amount;

    return true;
  }

  transferTo(other, amount) {
    if (!this.spend(amount)) {
      return false;
    }

    other.add(amount);

    return true;
  }
}
