# Generates the roadmap mockup from the real curriculum plus sample progress.
import json, sys
root = "/Users/marcoazzurrini/dev/tech-prep"
topics = {t["id"]: t for t in json.load(open(f"{root}/content/curriculum/topics.json"))}
problems = json.load(open(f"{root}/content/curriculum/problems.json"))
total = {t: sum(p["topic"] == t for p in problems) for t in topics}

# Sample progress, consistent with the session mockup.
solved = {"arrays-hashing": 4, "two-pointers": 1, "sliding-window": 2}
state = {"arrays-hashing": "progress", "two-pointers": "progress", "sliding-window": "current",
         "stack": "open", "binary-search": "open", "linked-list": "open"}
short = {"dp-1d": "1-D DP", "dp-2d": "2-D DP", "heap": "Heap", "math-geometry": "Math & Geometry"}

W, NW, NH, PITCH = 880, 164, 58, 90
cols5 = [W * (i + .5) / 5 for i in range(5)]
pos = {  # (x centre, row)
    "arrays-hashing": (W / 2, 0),
    "two-pointers": (W * .36, 1), "stack": (W * .64, 1),
    "sliding-window": (cols5[0] + 20, 2), "binary-search": (W * .36, 2), "linked-list": (cols5[3] - 30, 2),
    "trees": (W / 2, 3),
    "tries": (cols5[1] - 40, 4), "backtracking": (W / 2, 4), "heap": (cols5[3] + 40, 4),
    "dp-1d": (cols5[0], 5), "graphs": (cols5[1], 5), "advanced-graphs": (cols5[2], 5),
    "intervals": (cols5[3], 5), "greedy": (cols5[4], 5),
    "bit-manipulation": (cols5[0], 6), "dp-2d": (cols5[1], 6),
    "math-geometry": (cols5[0], 7),
}

def top(t): x, r = pos[t]; return x, r * PITCH
edges = []
for t, info in topics.items():
    for p in info["prereqs"]:
        lit = state.get(t) in ("progress", "current", "open")
        cls = f'e{" lit" if lit else ""}'
        if pos[p][1] == pos[t][1]:  # same row: a side-to-side connector
            (xa, r), xb = pos[p], pos[t][0]
            y = r * PITCH + NH / 2
            a, b = (xa + NW / 2, xb - NW / 2) if xa < xb else (xa - NW / 2, xb + NW / 2)
            edges.append(f'<path class="{cls}" d="M{a:.0f} {y:.0f} H{b:.0f}"/>')
            continue
        x1, y1 = top(p); y1 += NH
        x2, y2 = top(t)
        mid = (y1 + y2) / 2
        edges.append(f'<path class="{cls}" d="M{x1:.0f} {y1:.0f} C{x1:.0f} {mid:.0f} {x2:.0f} {mid:.0f} {x2:.0f} {y2:.0f}"/>')

nodes = []
for t, info in topics.items():
    x, r = pos[t]; s = state.get(t, "locked"); n = solved.get(t, 0)
    name = short.get(t, info["name"])
    pct = 100 * n / total[t]
    meta = (f'<span class="bar"><i style="width:{pct:.0f}%"></i></span><span class="cnt">{n} / {total[t]}</span>'
            if s != "locked" else f'<svg class="i lk"><use href="#lock"/></svg><span class="cnt">{total[t]} problem{"s" if total[t] != 1 else ""}</span>')
    nodes.append(f'<div class="node {s}" style="left:{x - NW / 2:.0f}px;top:{r * PITCH}px"><b>{name}</b><div class="meta">{meta}</div></div>')

html = open(sys.argv[1] if len(sys.argv) > 1 else f"{root}/.impeccable/mocks/src/roadmap.template.html").read().replace("{{EDGES}}", "\n".join(edges)).replace("{{NODES}}", "\n".join(nodes))
open(f"{root}/.impeccable/mocks/roadmap.html", "w").write(html)
