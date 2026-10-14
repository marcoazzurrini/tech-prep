class Heap {
  private items: number[] = [];
  constructor(private before: (a: number, b: number) => boolean) {}

  get size(): number {
    return this.items.length;
  }

  peek(): number {
    return this.items[0]!;
  }

  push(x: number): void {
    const a = this.items;
    a.push(x);
    let i = a.length - 1;
    while (i > 0) {
      const p = (i - 1) >> 1;
      if (!this.before(a[i]!, a[p]!)) break;
      [a[i], a[p]] = [a[p]!, a[i]!];
      i = p;
    }
  }

  pop(): number {
    const a = this.items;
    const top = a[0]!;
    const last = a.pop()!;
    if (a.length > 0) {
      a[0] = last;
      let i = 0;
      for (;;) {
        const l = 2 * i + 1;
        const r = l + 1;
        let best = i;
        if (l < a.length && this.before(a[l]!, a[best]!)) best = l;
        if (r < a.length && this.before(a[r]!, a[best]!)) best = r;
        if (best === i) break;
        [a[i], a[best]] = [a[best]!, a[i]!];
        i = best;
      }
    }
    return top;
  }
}

export class MedianFinder {
  private low = new Heap((a, b) => a > b); // max-heap: smaller half
  private high = new Heap((a, b) => a < b); // min-heap: larger half

  addNum(num: number): void {
    this.low.push(num);
    this.high.push(this.low.pop());
    if (this.high.size > this.low.size) this.low.push(this.high.pop());
  }

  findMedian(): number {
    if (this.low.size > this.high.size) return this.low.peek();
    return (this.low.peek() + this.high.peek()) / 2;
  }
}
