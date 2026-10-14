---
version: 1
slug: "impeccable-mocks-study-html"
primary_target: ".impeccable/mocks/study.html"
related_targets: []
---

## Scope

The main study screen of the chat-first desktop app, shown at the moment of learning a language feature (JavaScript `Set`). Visitor mode: Operate.

## Audience and task

The owner, studying alone at a desk. They talk to the tutor, and the tutor opens exercise panels beside the chat: predict the output, arrange the lines, write code in a mini editor with Vim keys, and the topic's progress. Content is real lesson material; progress numbers are synthetic.

## Constraints

Dark, sleek, minimal, in the family of t3code and assistant-ui (brand commitment). Easy reading is a hard requirement. Standard desktop-app controls only.

## Direction contract

THESIS: The conversation is the spine and the tutor drives the workbench: every exercise opens as a panel the tutor placed there, linked back to the message that opened it. It refuses the fixed three-panel IDE layout, where the editor dominates and the tutor is a sidebar.

OWN-WORLD: Near-black neutral ground (#0c0c0e), two raised greys for sidebar and panels, hairline borders, one calm blue for "tutor-opened" and focus, green, amber and red only for results and concept states. Atkinson Hyperlegible Next for all prose and UI, JetBrains Mono only for code. Rounded 10 to 14px corners, no shadows except the composer.

STORY: The learner reads a short explanation, answers in a panel, sees exactly which concept the mistake shows, and moves on without leaving the chat.

FIRST VIEWPORT: Left, a 232px session sidebar. Centre, the chat column with tutor messages, panel chips and the composer at the bottom. Right, a 640px panel with tabs for every panel the tutor opened; the active one is "Write uniqueBy": task, editor with Vim status line, tests with one failure.

FORM: Chat with side panel, third on the ordered list of seven; seed key 81a40f48.

SIGNATURE: A panel chip in the thread and its panel tab are one object: clicking either focuses both, and a newly opened panel slides in with the chip lighting up in the same blue.

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance
