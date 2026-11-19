// Data structures shared by solutions and the test harness.
// Solutions import them with `import { ListNode, TreeNode, GraphNode, RandomNode, Heap } from "./ds.ts";`

// oxlint-disable-next-line max-classes-per-file -- solutions import every data structure from this one file
export class ListNode {
  val: number;
  next: ListNode | null;

  constructor(val = 0, next: ListNode | null = null) {
    this.val = val;
    this.next = next;
  }
}

export class TreeNode {
  val: number;
  left: TreeNode | null;
  right: TreeNode | null;

  constructor(
    val = 0,
    left: TreeNode | null = null,
    right: TreeNode | null = null
  ) {
    this.val = val;
    this.left = left;
    this.right = right;
  }
}

export class GraphNode {
  val: number;
  neighbors: GraphNode[];

  constructor(val = 0, neighbors: GraphNode[] = []) {
    this.val = val;
    this.neighbors = neighbors;
  }
}

/** A list node with an extra pointer to any node in the list, or null. */
export class RandomNode {
  val: number;
  next: RandomNode | null;
  random: RandomNode | null;

  constructor(
    val = 0,
    next: RandomNode | null = null,
    random: RandomNode | null = null
  ) {
    this.val = val;
    this.next = next;
    this.random = random;
  }
}

/**
 * A binary heap, because JavaScript has none built in. `compare(a, b) < 0` means `a` comes
 * out first, so the default is a min-heap of numbers and `(a, b) => b - a` gives a max-heap.
 */
export class Heap<T = number> {
  private readonly items: T[] = [];
  private readonly compare: (a: T, b: T) => number;

  constructor(
    // SAFETY: the default only runs for a heap of numbers, where T is number.
    compare: (a: T, b: T) => number = (a, b) => (a as number) - (b as number)
  ) {
    this.compare = compare;
  }

  get size(): number {
    return this.items.length;
  }

  /** The item that would come out next, without removing it. */
  peek(): T | undefined {
    return this.items[0];
  }

  push(item: T): void {
    this.items.push(item);
    let i = this.items.length - 1;

    while (i > 0) {
      const parent = Math.floor((i - 1) / 2);

      if (!this.before(i, parent)) {
        break;
      }

      this.swap(i, parent);
      i = parent;
    }
  }

  /** Remove and return the first item, or undefined when the heap is empty. */
  pop(): T | undefined {
    const [top] = this.items;
    const last = this.items.pop();

    if (this.items.length === 0 || last === undefined) {
      return top;
    }

    this.items[0] = last;
    let i = 0;

    for (;;) {
      const left = 2 * i + 1;
      const right = left + 1;
      let best = i;

      if (left < this.items.length && this.before(left, best)) {
        best = left;
      }

      if (right < this.items.length && this.before(right, best)) {
        best = right;
      }

      if (best === i) {
        return top;
      }

      this.swap(i, best);
      i = best;
    }
  }

  /** The item at an index that is known to be inside the heap. */
  private at(i: number): T {
    const item = this.items[i];

    if (item === undefined) {
      throw new Error(`The heap has no item at ${i}.`);
    }

    return item;
  }

  /** True when the item at `i` comes out before the item at `j`. */
  private before(i: number, j: number): boolean {
    return this.compare(this.at(i), this.at(j)) < 0;
  }

  private swap(i: number, j: number): void {
    const held = this.at(i);
    this.items[i] = this.at(j);
    this.items[j] = held;
  }
}
