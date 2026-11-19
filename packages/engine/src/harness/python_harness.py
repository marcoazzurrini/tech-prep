"""Run one solution file against JSON test cases.

Reads a request from stdin and writes {"results"} or {"fatal"} to stdout.
The request carries the problem's call shape:
- kind "function": call `function` with converted args (types in `params`).
- kind "design": construct `class`, then call the listed methods in order.
- kind "roundtrip": decode(encode(x)) must give back x.
The learner's own print() output is captured per case.
"""

import __future__
import contextlib
import copy
import importlib.util
import io
import json
import os
import sys
import time
import traceback
from collections import deque


def to_json(value):
    if isinstance(value, (set, frozenset)):
        return sorted(value)
    return repr(value)


class Converter:
    """Turns JSON test values into ListNode/TreeNode/GraphNode objects and back."""

    def __init__(self, ds):
        self.ds = ds
        self.input_graph_nodes = set()
        self.input_random_nodes = set()

    def random_list_in(self, pairs):
        nodes = [self.ds.RandomNode(val) for val, _ in pairs]
        for i, (_, target) in enumerate(pairs):
            nodes[i].next = nodes[i + 1] if i + 1 < len(nodes) else None
            nodes[i].random = None if target is None else nodes[target]
        self.input_random_nodes |= {id(n) for n in nodes}
        return nodes[0] if nodes else None

    def random_list_out(self, head):
        nodes = []
        while head is not None:
            if id(head) in self.input_random_nodes:
                raise ValueError("returned an original node, not a copy")
            nodes.append(head)
            head = head.next
            if len(nodes) > 100_000:
                raise ValueError("the returned list never ends (does it have a cycle?)")
        index = {id(n): i for i, n in enumerate(nodes)}
        out = []
        for node in nodes:
            if node.random is None:
                out.append([node.val, None])
            elif id(node.random) not in index:
                raise ValueError("a random pointer leaves the copied list")
            else:
                out.append([node.val, index[id(node.random)]])
        return out

    def list_in(self, values):
        dummy = self.ds.ListNode()
        tail = dummy
        for value in values:
            tail.next = self.ds.ListNode(value)
            tail = tail.next
        return dummy.next

    def list_out(self, head):
        values = []
        while head is not None:
            values.append(head.val)
            head = head.next
            if len(values) > 100_000:
                raise ValueError("the returned list never ends (does it have a cycle?)")
        return values

    def cycle_list_in(self, arg):
        values, pos = arg
        head = self.list_in(values)
        if pos >= 0:
            nodes = []
            node = head
            while node is not None:
                nodes.append(node)
                node = node.next
            nodes[-1].next = nodes[pos]
        return head

    def tree_in(self, values):
        if not values or values[0] is None:
            return None
        root = self.ds.TreeNode(values[0])
        queue = deque([root])
        i = 1
        while queue and i < len(values):
            node = queue.popleft()
            if i < len(values) and values[i] is not None:
                node.left = self.ds.TreeNode(values[i])
                queue.append(node.left)
            i += 1
            if i < len(values) and values[i] is not None:
                node.right = self.ds.TreeNode(values[i])
                queue.append(node.right)
            i += 1
        return root

    def tree_out(self, root):
        values = []
        queue = deque([root])
        while queue:
            node = queue.popleft()
            if node is None:
                values.append(None)
                continue
            values.append(node.val)
            queue.append(node.left)
            queue.append(node.right)
        while values and values[-1] is None:
            values.pop()
        return values

    def find_in_tree(self, root, val):
        stack = [root]
        while stack:
            node = stack.pop()
            if node is None:
                continue
            if node.val == val:
                return node
            stack += [node.left, node.right]
        raise ValueError(f"value {val} is not in the tree")

    def graph_in(self, adjacency):
        if not adjacency:
            return None
        nodes = [self.ds.GraphNode(i + 1) for i in range(len(adjacency))]
        for node, neighbours in zip(nodes, adjacency):
            node.neighbors = [nodes[j - 1] for j in neighbours]
        self.input_graph_nodes |= {id(n) for n in nodes}
        return nodes[0]

    def graph_out(self, start):
        if start is None:
            return []
        seen = {start.val: start}
        queue = deque([start])
        while queue:
            node = queue.popleft()
            if id(node) in self.input_graph_nodes:
                raise ValueError("returned an original node, not a copy")
            for n in node.neighbors:
                if n.val not in seen:
                    seen[n.val] = n
                    queue.append(n)
        return [[n.val for n in seen[v].neighbors] for v in sorted(seen)]

    def arg_in(self, kind, value, converted):
        if kind == "ListNode":
            return self.list_in(value)
        if kind == "ListNode[]":
            return [self.list_in(v) for v in value]
        if kind == "CycleList":
            return self.cycle_list_in(value)
        if kind == "TreeNode":
            return self.tree_in(value)
        if kind == "TreeNodeRef":
            return self.find_in_tree(converted[0], value)
        if kind == "GraphNode":
            return self.graph_in(value)
        if kind == "RandomList":
            return self.random_list_in(value)
        return copy.deepcopy(value)

    def value_out(self, kind, value):
        if kind == "ListNode":
            return self.list_out(value)
        if kind == "TreeNode":
            return self.tree_out(value)
        if kind == "TreeNodeVal":
            return None if value is None else value.val
        if kind == "GraphNode":
            return self.graph_out(value)
        if kind == "RandomList":
            return self.random_list_out(value)
        if kind == "void":
            return None
        return value


def load(request):
    sys.path.insert(0, os.path.dirname(os.path.abspath(request["file"])))
    import ds  # noqa: E402  (next to the solution file)

    spec = importlib.util.spec_from_file_location("solution", request["file"])
    module = importlib.util.module_from_spec(spec)
    # Compile with postponed annotations, so `int | None` in a signature also loads on an
    # older Python that cannot evaluate it.
    with open(request["file"], encoding="utf-8") as f:
        code = compile(f.read(), request["file"], "exec", flags=__future__.annotations.compiler_flag, dont_inherit=True)
    with contextlib.redirect_stdout(io.StringIO()):
        exec(code, module.__dict__)
    return ds, module


def lookup(module, name):
    fn = getattr(module, name, None)
    if fn is None and hasattr(module, "Solution"):
        fn = getattr(module.Solution(), name, None)
    if fn is None:
        raise LookupError(f"No function '{name}' (or Solution.{name}) in the file")
    return fn


def run_case(request, module, conv, case):
    kind = request.get("kind", "function")
    if kind == "design":
        cls = getattr(module, request["class"])
        ops, args = case["ops"], case["args"]
        obj = cls(*args[0])
        return [None] + [getattr(obj, op)(*copy.deepcopy(a)) for op, a in zip(ops[1:], args[1:])]

    if kind == "roundtrip":
        owner = getattr(module, request["class"])() if request.get("class") else module
        value = conv.arg_in(request.get("type", "json"), case["args"][0], [])
        encoded = getattr(owner, request["encode"])(value)
        if not isinstance(encoded, str):
            raise TypeError(f"{request['encode']} must return a string, got {type(encoded).__name__}")
        return conv.value_out(request.get("type", "json"), getattr(owner, request["decode"])(encoded))

    fn = lookup(module, request["function"])
    params = request.get("params") or []
    args = []
    for i, value in enumerate(case["args"]):
        args.append(conv.arg_in(params[i] if i < len(params) else "json", value, args))
    result = fn(*args)
    if request.get("output") == "arg0":
        return conv.value_out(params[0] if params else "json", args[0])
    return conv.value_out(request.get("returns", "json"), result)


def main():
    request = json.load(sys.stdin)
    try:
        ds, module = load(request)
    except Exception:
        print(json.dumps({"fatal": traceback.format_exc(limit=-3)}))
        return

    results = []
    for case in request["cases"]:
        out = io.StringIO()
        start = time.perf_counter()
        conv = Converter(ds)
        try:
            with contextlib.redirect_stdout(out):
                actual = run_case(request, module, conv, case)
            results.append({"actual": actual})
        except Exception:
            results.append({"error": traceback.format_exc(limit=-2)})
        results[-1]["stdout"] = out.getvalue()
        results[-1]["ms"] = round((time.perf_counter() - start) * 1000, 2)

    print(json.dumps({"results": results}, default=to_json))


if __name__ == "__main__":
    main()
