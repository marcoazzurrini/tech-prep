export class Doorbell {
  listeners = [];

  ring = (who) => {
    for (const listener of this.listeners) {
      listener(who);
    }

    return this.listeners.length;
  };

  onRing(listener) {
    this.listeners.push(listener);

    return () => {
      this.listeners = this.listeners.filter((other) => other !== listener);
    };
  }
}
