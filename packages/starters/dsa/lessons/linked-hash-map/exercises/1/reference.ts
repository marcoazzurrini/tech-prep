class LineNode {
  person: number;
  prev: LineNode | null = null;
  next: LineNode | null = null;

  constructor(person = 0) {
    this.person = person;
  }
}

export class WaitingLine {
  private nodes = new Map<number, LineNode>(); // person -> node
  // Dummy nodes at both ends: the front is after head, the back is before tail.
  private head = new LineNode();
  private tail = new LineNode();

  constructor() {
    this.head.next = this.tail;
    this.tail.prev = this.head;
  }

  join(person: number): void {
    const node = new LineNode(person);
    const last = this.tail.prev!;
    last.next = node;
    node.prev = last;
    node.next = this.tail;
    this.tail.prev = node;
    this.nodes.set(person, node);
  }

  leave(person: number): void {
    // The map finds the node. The list cuts it out. Both are O(1).
    const node = this.nodes.get(person);
    if (!node) return;
    node.prev!.next = node.next;
    node.next!.prev = node.prev;
    this.nodes.delete(person);
  }

  serve(): number {
    const first = this.head.next!;
    if (first === this.tail) return -1;
    this.leave(first.person);
    return first.person;
  }
}
