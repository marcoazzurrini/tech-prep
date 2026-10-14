// Run one solution file against JSON test cases.
//
// Reads a request from stdin and writes {"results"} or {"fatal"} to stdout.
// The request carries the problem's call shape:
// - kind "function": call `function` with converted args (types in `params`).
// - kind "design": construct `class`, then call the listed methods in order.
// - kind "roundtrip": decode(encode(x)) must give back x.
// console.log output is captured per case.

import path from "node:path";

import type * as DataStructures from "./ds.ts";

interface Request {
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
}

interface AnyNode {
  val: number;
  next?: AnyNode | null;
  left?: AnyNode | null;
  right?: AnyNode | null;
  neighbors?: AnyNode[];
}

interface CaseOutcome {
  actual?: unknown;
  error?: string;
  stdout?: string;
  ms?: number;
}

// SAFETY: runner.ts builds the request from a Problem, with these fields.
const request = (await Bun.stdin.json()) as Request;

// Keep only the learner's own stack frames, with short file names.
const describe = (cause: unknown) =>
  cause instanceof Error
    ? (cause.stack ?? cause.message)
        .split("\n")
        .filter((line) => !line.includes("typescript-harness"))
        .map((line) =>
          line.replace(
            /\(?\/[^\s()]*\/(?<location>[^/\s()]+:\d+:\d+)\)?/u,
            "($<location>)"
          )
        )
        .join("\n")
    : String(cause);

const write = (output: { fatal: string } | { results: CaseOutcome[] }) =>
  process.stdout.write(JSON.stringify(output));

let captured: string[] = [];

const capture = (...args: unknown[]) =>
  captured.push(
    args
      // oxlint-disable-next-line anti-slop/no-runtime-typeof -- console.log prints strings as they are and inspects anything else
      .map((a) => (typeof a === "string" ? a : Bun.inspect(a)))
      .join(" ")
  );

console.log = capture;

console.info = capture;

console.debug = capture;

// oxlint-disable-next-line typescript/no-explicit-any, anti-slop/no-unsafe-dictionary-type -- the learner's exports: unknown until runCase checks them
let mod: Record<string, any>;
let ds: typeof DataStructures;

try {
  ds = await import(path.join(path.dirname(request.file), "ds.ts"));
  mod = await import(request.file);
} catch (error) {
  write({ fatal: describe(error) });
  process.exit(0);
}

const listIn = (values: number[]): AnyNode | null => {
  const dummy = new ds.ListNode();
  let tail: AnyNode = dummy;

  for (const v of values) {
    const node = new ds.ListNode(v);
    tail.next = node;
    tail = node;
  }

  return dummy.next;
};

const listOut = (head: AnyNode | null): number[] => {
  const values: number[] = [];

  for (let node = head; node; node = node.next ?? null) {
    values.push(node.val);

    if (values.length > 100_000) {
      throw new Error("the returned list never ends (does it have a cycle?)");
    }
  }

  return values;
};

const cycleListIn = ([values, pos]: [number[], number]): AnyNode | null => {
  const head = listIn(values);

  if (pos >= 0) {
    const nodes: AnyNode[] = [];

    for (let node = head; node; node = node.next ?? null) {
      nodes.push(node);
    }

    const last = nodes.at(-1);
    const target = nodes[pos];

    if (!(last && target)) {
      throw new Error(`cycle position ${pos} is outside the list`);
    }

    last.next = target;
  }

  return head;
};

const treeIn = (values: (number | null)[]): AnyNode | null => {
  if (!values.length || values[0] === null) {
    return null;
  }

  const root = new ds.TreeNode(values[0]);
  const queue: AnyNode[] = [root];
  let i = 1;

  while (i < values.length) {
    const node = queue.shift();

    if (!node) {
      break;
    }

    if (i < values.length && values[i] !== null) {
      queue.push((node.left = new ds.TreeNode(values[i])));
    }

    i += 1;

    if (i < values.length && values[i] !== null) {
      queue.push((node.right = new ds.TreeNode(values[i])));
    }

    i += 1;
  }

  return root;
};

const treeOut = (root: AnyNode | null): (number | null)[] => {
  const values: (number | null)[] = [];
  const queue: (AnyNode | null)[] = [root];

  while (queue.length) {
    const node = queue.shift();

    if (!node) {
      values.push(null);
      continue;
    }

    values.push(node.val);
    queue.push(node.left ?? null, node.right ?? null);
  }

  while (values.length && values.at(-1) === null) {
    values.pop();
  }

  return values;
};

const findInTree = (root: AnyNode | null, val: number): AnyNode => {
  const stack = [root];

  while (stack.length) {
    const node = stack.pop();

    if (!node) {
      continue;
    }

    if (node.val === val) {
      return node;
    }

    stack.push(node.left ?? null, node.right ?? null);
  }

  throw new Error(`value ${val} is not in the tree`);
};

class Converter {
  inputGraphNodes = new Set<AnyNode>();

  graphIn(adjacency: number[][]): AnyNode | null {
    if (!adjacency.length) {
      return null;
    }

    const nodes: AnyNode[] = adjacency.map((_, i) => new ds.GraphNode(i + 1));

    const nodeAt = (label: number) => {
      const node = nodes[label - 1];

      if (!node) {
        throw new Error(`the graph has no node ${label}`);
      }

      return node;
    };

    for (const [i, neighbours] of adjacency.entries()) {
      nodeAt(i + 1).neighbors = neighbours.map((j) => nodeAt(j));
    }

    for (const n of nodes) {
      this.inputGraphNodes.add(n);
    }

    return nodeAt(1);
  }

  graphOut(start: AnyNode | null): number[][] {
    if (!start) {
      return [];
    }

    const seen = new Map<number, AnyNode>([[start.val, start]]);
    const queue = [start];

    while (queue.length) {
      const node = queue.shift();

      if (!node) {
        break;
      }

      if (this.inputGraphNodes.has(node)) {
        throw new Error("returned an original node, not a copy");
      }

      for (const n of node.neighbors ?? []) {
        if (!seen.has(n.val)) {
          seen.set(n.val, n);
          queue.push(n);
        }
      }
    }

    return [...seen.entries()]
      .toSorted(([a], [b]) => a - b)
      .map(([v, node]) => {
        if (!node.neighbors) {
          throw new Error(`node ${v} has no neighbors list`);
        }

        return node.neighbors.map((n) => n.val);
      });
  }

  // oxlint-disable-next-line typescript/no-explicit-any -- a JSON test value whose layout `kind` names
  argIn(kind: string, value: any, converted: unknown[]) {
    switch (kind) {
      case "ListNode": {
        return listIn(value);
      }

      case "ListNode[]": {
        return value.map((v: number[]) => listIn(v));
      }

      case "CycleList": {
        return cycleListIn(value);
      }

      case "TreeNode": {
        return treeIn(value);
      }

      case "TreeNodeRef": {
        // SAFETY: a TreeNodeRef names a value in the tree passed as the first argument.
        return findInTree(converted[0] as AnyNode | null, value);
      }

      case "GraphNode": {
        return this.graphIn(value);
      }

      default: {
        return structuredClone(value);
      }
    }
  }

  // oxlint-disable-next-line typescript/no-explicit-any -- whatever the learner's code returned
  valueOut(kind: string, value: any) {
    switch (kind) {
      case "ListNode": {
        return listOut(value);
      }

      case "TreeNode": {
        return treeOut(value);
      }

      case "TreeNodeVal": {
        return value ? value.val : null;
      }

      case "GraphNode": {
        return this.graphOut(value);
      }

      case "void": {
        return null;
      }

      default: {
        return value instanceof Set ? [...value] : value;
      }
    }
  }
}

type Case = Request["cases"][number];

/** Construct `class`, then call the listed methods in order. */
const runDesign = async (testCase: Case) => {
  const Cls = request.class ? mod[request.class] : undefined;

  // oxlint-disable-next-line anti-slop/no-runtime-typeof -- the learner's exports are only known at runtime
  if (typeof Cls !== "function") {
    // oxlint-disable-next-line unicorn/prefer-type-error -- the error name is shown to the learner; keep "Error"
    throw new Error(`No exported class '${request.class}' in the file`);
  }

  // SAFETY: a design case passes one argument list per op.
  const [first, ...rest] = testCase.args as unknown[][];
  const { ops } = testCase;

  if (!ops) {
    throw new Error("a design case needs `ops`");
  }

  const obj = new Cls(...(first ?? []));
  const out: unknown[] = [null];

  for (const [i, op] of ops.slice(1).entries()) {
    // oxlint-disable-next-line no-await-in-loop -- the operations run in order on one object
    const value = await obj[op](...structuredClone(rest[i] ?? []));
    out.push(value === undefined ? null : value);
  }

  return out;
};

/** decode(encode(x)) must give back x. */
const runRoundtrip = async (testCase: Case, conv: Converter) => {
  const owner = request.class ? new mod[request.class]() : mod;
  const type = request.type ?? "json";
  const { encode, decode } = request;

  if (!(encode && decode)) {
    throw new Error("a roundtrip problem needs `encode` and `decode`");
  }

  const encoded = await owner[encode](conv.argIn(type, testCase.args[0], []));

  // oxlint-disable-next-line anti-slop/no-runtime-typeof -- checks what the learner's encode returned
  const encodedType = typeof encoded;

  if (encodedType !== "string") {
    throw new Error(`${encode} must return a string, got ${encodedType}`);
  }

  return conv.valueOut(type, await owner[decode](encoded));
};

/** Call `function` with converted args. */
const runFunction = async (testCase: Case, conv: Converter) => {
  const fn =
    (request.function ? mod[request.function] : undefined) ?? mod.default;

  // oxlint-disable-next-line anti-slop/no-runtime-typeof -- the learner's exports are only known at runtime
  if (typeof fn !== "function") {
    // oxlint-disable-next-line unicorn/prefer-type-error -- the error name is shown to the learner; keep "Error"
    throw new Error(`No exported function '${request.function}' in the file`);
  }

  const params = request.params ?? [];
  const args: unknown[] = [];

  for (const [i, value] of testCase.args.entries()) {
    args.push(conv.argIn(params[i] ?? "json", value, args));
  }

  const result = await fn(...args);

  if (request.output === "arg0") {
    return conv.valueOut(params[0] ?? "json", args[0]);
  }

  return conv.valueOut(request.returns ?? "json", result);
};

const runCase = (testCase: Case, conv: Converter) => {
  const kind = request.kind ?? "function";

  if (kind === "design") {
    return runDesign(testCase);
  }

  if (kind === "roundtrip") {
    return runRoundtrip(testCase, conv);
  }

  return runFunction(testCase, conv);
};

const results: CaseOutcome[] = [];

for (const testCase of request.cases) {
  captured = [];
  const start = performance.now();
  let outcome: CaseOutcome;

  try {
    // oxlint-disable-next-line no-await-in-loop -- cases run one at a time so console output is captured per case
    const actual = await runCase(testCase, new Converter());
    outcome = { actual: actual === undefined ? null : actual };
  } catch (error) {
    outcome = { error: describe(error) };
  }

  outcome.stdout = captured.join("\n");
  outcome.ms = Math.round((performance.now() - start) * 100) / 100;
  results.push(outcome);
}

write({ results });
