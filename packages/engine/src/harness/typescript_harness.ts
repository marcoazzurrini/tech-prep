// Run one solution file against JSON test cases.
//
// Reads a request from stdin and writes {"results"} or {"fatal"} to stdout.
// The request carries the problem's call shape:
// - kind "function": call `function` with converted args (types in `params`).
// - kind "design": construct `class`, then call the listed methods in order.
// - kind "roundtrip": decode(encode(x)) must give back x.
// console.log output is captured per case.

import { dirname, join } from "node:path";

type Request = {
  file: string;
  kind?: "function" | "design" | "roundtrip";
  function?: string;
  class?: string;
  params?: string[];
  returns?: string;
  output?: "return" | "arg0";
  encode?: string;
  decode?: string;
  type?: string;
  cases: { args: unknown[]; ops?: string[] }[];
};

type AnyNode = { val: number; next?: AnyNode | null; left?: AnyNode | null; right?: AnyNode | null; neighbors?: AnyNode[] };

const request = (await Bun.stdin.json()) as Request;

// Keep only the learner's own stack frames, with short file names.
const describe = (error: unknown) =>
  error instanceof Error
    ? (error.stack ?? error.message)
        .split("\n")
        .filter((line) => !line.includes("typescript_harness"))
        .map((line) => line.replace(/\(?\/[^\s()]*\/([^/\s()]+:\d+:\d+)\)?/, "($1)"))
        .join("\n")
    : String(error);

const write = (value: unknown) => process.stdout.write(JSON.stringify(value));
let captured: string[] = [];
const capture = (...args: unknown[]) =>
  captured.push(args.map((a) => (typeof a === "string" ? a : Bun.inspect(a))).join(" "));
console.log = capture;
console.info = capture;
console.debug = capture;

let mod: Record<string, any>;
let ds: Record<string, any>;
try {
  ds = await import(join(dirname(request.file), "ds.ts"));
  mod = await import(request.file);
} catch (error) {
  write({ fatal: describe(error) });
  process.exit(0);
}

class Converter {
  inputGraphNodes = new Set<AnyNode>();

  listIn(values: number[]): AnyNode | null {
    const dummy = new ds.ListNode();
    let tail = dummy;
    for (const v of values) tail = tail.next = new ds.ListNode(v);
    return dummy.next;
  }

  listOut(head: AnyNode | null): number[] {
    const values: number[] = [];
    for (let node = head; node; node = node.next ?? null) {
      values.push(node.val);
      if (values.length > 100_000) throw new Error("the returned list never ends (does it have a cycle?)");
    }
    return values;
  }

  cycleListIn([values, pos]: [number[], number]): AnyNode | null {
    const head = this.listIn(values);
    if (pos >= 0) {
      const nodes: AnyNode[] = [];
      for (let node = head; node; node = node.next ?? null) nodes.push(node);
      nodes.at(-1)!.next = nodes[pos]!;
    }
    return head;
  }

  treeIn(values: (number | null)[]): AnyNode | null {
    if (!values.length || values[0] === null) return null;
    const root = new ds.TreeNode(values[0]);
    const queue: AnyNode[] = [root];
    let i = 1;
    while (queue.length && i < values.length) {
      const node = queue.shift()!;
      if (i < values.length && values[i] !== null) queue.push((node.left = new ds.TreeNode(values[i])));
      i++;
      if (i < values.length && values[i] !== null) queue.push((node.right = new ds.TreeNode(values[i])));
      i++;
    }
    return root;
  }

  treeOut(root: AnyNode | null): (number | null)[] {
    const values: (number | null)[] = [];
    const queue: (AnyNode | null)[] = [root];
    while (queue.length) {
      const node = queue.shift()!;
      if (!node) {
        values.push(null);
        continue;
      }
      values.push(node.val);
      queue.push(node.left ?? null, node.right ?? null);
    }
    while (values.length && values.at(-1) === null) values.pop();
    return values;
  }

  findInTree(root: AnyNode | null, val: number): AnyNode {
    const stack = [root];
    while (stack.length) {
      const node = stack.pop();
      if (!node) continue;
      if (node.val === val) return node;
      stack.push(node.left ?? null, node.right ?? null);
    }
    throw new Error(`value ${val} is not in the tree`);
  }

  graphIn(adjacency: number[][]): AnyNode | null {
    if (!adjacency.length) return null;
    const nodes: AnyNode[] = adjacency.map((_, i) => new ds.GraphNode(i + 1));
    adjacency.forEach((neighbours, i) => (nodes[i]!.neighbors = neighbours.map((j) => nodes[j - 1]!)));
    for (const n of nodes) this.inputGraphNodes.add(n);
    return nodes[0]!;
  }

  graphOut(start: AnyNode | null): number[][] {
    if (!start) return [];
    const seen = new Map<number, AnyNode>([[start.val, start]]);
    const queue = [start];
    while (queue.length) {
      const node = queue.shift()!;
      if (this.inputGraphNodes.has(node)) throw new Error("returned an original node, not a copy");
      for (const n of node.neighbors ?? []) {
        if (!seen.has(n.val)) {
          seen.set(n.val, n);
          queue.push(n);
        }
      }
    }
    return [...seen.keys()].sort((a, b) => a - b).map((v) => seen.get(v)!.neighbors!.map((n) => n.val));
  }

  argIn(kind: string, value: any, converted: unknown[]): unknown {
    switch (kind) {
      case "ListNode":
        return this.listIn(value);
      case "ListNode[]":
        return value.map((v: number[]) => this.listIn(v));
      case "CycleList":
        return this.cycleListIn(value);
      case "TreeNode":
        return this.treeIn(value);
      case "TreeNodeRef":
        return this.findInTree(converted[0] as AnyNode | null, value);
      case "GraphNode":
        return this.graphIn(value);
      default:
        return structuredClone(value);
    }
  }

  valueOut(kind: string, value: any): unknown {
    switch (kind) {
      case "ListNode":
        return this.listOut(value);
      case "TreeNode":
        return this.treeOut(value);
      case "TreeNodeVal":
        return value ? value.val : null;
      case "GraphNode":
        return this.graphOut(value);
      case "void":
        return null;
      default:
        return value instanceof Set ? [...value] : value;
    }
  }
}

async function runCase(testCase: Request["cases"][number], conv: Converter): Promise<unknown> {
  const kind = request.kind ?? "function";
  if (kind === "design") {
    const Cls = mod[request.class!];
    if (typeof Cls !== "function") throw new Error(`No exported class '${request.class}' in the file`);
    const [first, ...rest] = testCase.args as unknown[][];
    const obj = new Cls(...(first ?? []));
    const out: unknown[] = [null];
    for (const [i, op] of testCase.ops!.slice(1).entries()) {
      const value = await obj[op](...structuredClone(rest[i] ?? []));
      out.push(value === undefined ? null : value);
    }
    return out;
  }

  if (kind === "roundtrip") {
    const owner = request.class ? new mod[request.class]() : mod;
    const type = request.type ?? "json";
    const encoded = await owner[request.encode!](conv.argIn(type, testCase.args[0], []));
    if (typeof encoded !== "string") throw new Error(`${request.encode} must return a string, got ${typeof encoded}`);
    return conv.valueOut(type, await owner[request.decode!](encoded));
  }

  const fn = mod[request.function!] ?? mod.default;
  if (typeof fn !== "function") throw new Error(`No exported function '${request.function}' in the file`);
  const params = request.params ?? [];
  const args: unknown[] = [];
  testCase.args.forEach((value, i) => args.push(conv.argIn(params[i] ?? "json", value, args)));
  const result = await fn(...args);
  if (request.output === "arg0") return conv.valueOut(params[0] ?? "json", args[0]);
  return conv.valueOut(request.returns ?? "json", result);
}

const results: Record<string, unknown>[] = [];
for (const testCase of request.cases) {
  captured = [];
  const start = performance.now();
  try {
    const actual = await runCase(testCase, new Converter());
    results.push({ actual: actual === undefined ? null : actual });
  } catch (error) {
    results.push({ error: describe(error) });
  }
  results.at(-1)!.stdout = captured.join("\n");
  results.at(-1)!.ms = Math.round((performance.now() - start) * 100) / 100;
}

write({ results });
