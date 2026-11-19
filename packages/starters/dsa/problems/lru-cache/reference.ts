class CacheNode {
  key: number;
  value: number;
  prev: CacheNode | null = null;
  next: CacheNode | null = null;

  constructor(key = 0, value = 0) {
    this.key = key;
    this.value = value;
  }
}

export class LRUCache {
  private capacity: number;
  private nodes = new Map<number, CacheNode>();
  // Dummy nodes at both ends: the oldest key is after head, the newest before tail.
  private head = new CacheNode();
  private tail = new CacheNode();

  constructor(capacity: number) {
    this.capacity = capacity;
    this.head.next = this.tail;
    this.tail.prev = this.head;
  }

  private unlink(node: CacheNode): void {
    node.prev!.next = node.next;
    node.next!.prev = node.prev;
  }

  private addNewest(node: CacheNode): void {
    const last = this.tail.prev!;
    last.next = node;
    node.prev = last;
    node.next = this.tail;
    this.tail.prev = node;
  }

  get(key: number): number {
    const node = this.nodes.get(key);
    if (!node) return -1;
    // A read is a use: move the node to the newest end.
    this.unlink(node);
    this.addNewest(node);
    return node.value;
  }

  put(key: number, value: number): void {
    const old = this.nodes.get(key);
    if (old) this.unlink(old);
    const node = new CacheNode(key, value);
    this.nodes.set(key, node);
    this.addNewest(node);
    if (this.nodes.size > this.capacity) {
      // The node after head is the least recently used.
      const oldest = this.head.next!;
      this.unlink(oldest);
      this.nodes.delete(oldest.key);
    }
  }
}
