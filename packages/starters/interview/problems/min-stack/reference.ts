export class MinStack {
  // Each entry is [value, smallest value from here down].
  private stack: [number, number][] = [];

  push(val: number): void {
    const below = this.stack[this.stack.length - 1];
    const smallest = below === undefined ? val : Math.min(val, below[1]);
    this.stack.push([val, smallest]);
  }

  pop(): void {
    // The entry below still holds the right minimum for what is left.
    this.stack.pop();
  }

  top(): number {
    return this.stack[this.stack.length - 1]![0];
  }

  getMin(): number {
    return this.stack[this.stack.length - 1]![1];
  }
}
