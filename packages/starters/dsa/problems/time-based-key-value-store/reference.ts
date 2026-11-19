export class TimeMap {
  // key -> list of [timestamp, value], in increasing timestamp order
  private entries = new Map<string, [number, string][]>();

  set(key: string, value: string, timestamp: number): void {
    const list = this.entries.get(key) ?? [];
    list.push([timestamp, value]);
    this.entries.set(key, list);
  }

  get(key: string, timestamp: number): string {
    const list = this.entries.get(key) ?? [];
    // Find the first entry that is too late. The answer sits just before it.
    let lo = 0;
    let hi = list.length;
    while (lo < hi) {
      const mid = (lo + hi) >> 1;
      if (list[mid]![0] > timestamp) hi = mid;
      else lo = mid + 1;
    }
    return lo > 0 ? list[lo - 1]![1] : "";
  }
}
