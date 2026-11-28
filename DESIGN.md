---
name: tech-prep
description: A study app where each subject is a course of lessons and reviews, with a tutor in a pane beside the work.
colors:
  canvas: "#08090A"
  sidebar: "#121314"
  surface: "#17181A"
  panel: "#121314"
  hover: "#1D1E1F"
  card: "#1C1C1D"
  raised: "#232426"
  border: "#2A2B2D"
  border-strong: "#3A3B3C"
  ink: "#F7F8F8"
  body: "#D0D6E0"
  mute: "#8A8F98"
  dim: "#62666D"
  light: "#E5E5E6"
  on-light: "#08090A"
  accent: "#7C8CFF"
  accent-bg: "#1A1D33"
  accent-line: "#363E73"
  green: "#4CB782"
  amber: "#F2C94C"
  red: "#EB5757"
  syntax-keyword: "#C79BFF"
  syntax-string: "#9FD59B"
  syntax-number: "#F2B47A"
  syntax-comment: "#8A8F98"
  syntax-function: "#7FC4FF"
typography:
  display:
    fontFamily: "Atkinson Hyperlegible Next, system-ui, sans-serif"
    fontSize: "56px"
    fontWeight: 600
    lineHeight: "60px"
    letterSpacing: "-0.03em"
  heading:
    fontFamily: "Atkinson Hyperlegible Next, system-ui, sans-serif"
    fontSize: "32px"
    fontWeight: 600
    lineHeight: "40px"
    letterSpacing: "-0.02em"
  title:
    fontFamily: "Atkinson Hyperlegible Next, system-ui, sans-serif"
    fontSize: "20px"
    fontWeight: 600
    lineHeight: "28px"
    letterSpacing: "-0.01em"
  body:
    fontFamily: "Atkinson Hyperlegible Next, system-ui, sans-serif"
    fontSize: "16px"
    fontWeight: 400
    lineHeight: "26px"
  ui:
    fontFamily: "Atkinson Hyperlegible Next, system-ui, sans-serif"
    fontSize: "14px"
    fontWeight: 500
    lineHeight: "20px"
  meta:
    fontFamily: "Atkinson Hyperlegible Next, system-ui, sans-serif"
    fontSize: "13px"
    fontWeight: 400
    lineHeight: "18px"
  lesson-title:
    fontFamily: "Libron, Georgia, serif"
    fontSize: "36px"
    fontWeight: 700
    lineHeight: "46px"
  lesson:
    fontFamily: "Libron, Georgia, serif"
    fontSize: "22px"
    fontWeight: 400
    lineHeight: "34px"
  code:
    fontFamily: "JetBrains Mono, ui-monospace, monospace"
    fontSize: "14px"
    fontWeight: 400
    lineHeight: "22px"
    fontFeature: '"calt" 0, "liga" 0'
rounded:
  sm: "4px"
  md: "6px"
  lg: "8px"
  xl: "12px"
  full: "999px"
spacing:
  "1": "4px"
  "2": "8px"
  "3": "12px"
  "4": "16px"
  "6": "24px"
  "8": "32px"
  "12": "48px"
  "16": "64px"
---

# Design System: tech-prep

The penna design in `.penna/` is the source of truth. This file mirrors its tokens for code and states the rules behind them. The components are built in `packages/ui` and shown in Storybook (`bun run storybook`).

## Look

Calm, layered dark surfaces in the family of Linear. One accent for what the tutor opens. Colour for results only. Every screen must be easy to read at a glance.

## Rules

**App layout.** An icon rail on the left switches courses; a course's badge shows how many concepts are due. The main pane shows one screen of a session. The tutor pane sits on the right; it is closed until the learner opens it. There is no course outline beside the work, so nothing names the topic of a task. In the desktop window, a title strip above the rail holds the window buttons, so nothing sits behind them.

**Session.** A session shows one thing at a time, in one centred column 880px wide. The top bar holds only the block in the middle ("Review", "New concept", "On your own", "Done"), the time left as a thin meter, and the tutor toggle. A part of a lesson is read alone, with "Continue" at the foot. A task has its strip on `accent-bg` at the head, small help buttons under it, what it shows in one box of panels, and the answer at the foot. After the answer, the same screen shows how it went and a card of the concepts it practised. Enter goes on.

**Answer editor.** The answer is always the editor, as a rounded card on `surface` with a `border-strong` line. Its status strip holds the Vim mode, the file, the cursor, a short note on how the answer runs, and the round send button. A short answer is a few lines tall and sits at the foot. A long answer takes the room the task leaves, and the help buttons and the test results stay just above it.

**Today and Done.** Both open with a large centred title. Today names the next concept, with the session length beside the start button, then a card of the session's blocks and cards for progress and memory. Done shows four figures, each in a card. All concepts are one tap away from Today, as a plain list in one centred column.

**Lesson text.** Lesson text is set in Libron, larger than the rest of the app, with prose lines about 65 characters long. Code and the fixed blocks use the full column. Code in a lesson is 16px. Nothing sits above the title. A lesson part is built from fixed blocks, always in this order, so the eye knows where to go:

- **Example**: the input, the filter and the output, each under a small `mute` label, then the filter one step at a time with the value each step gives. A blue label and a blue line in the left margin mark it.
- **Rule**: one line in a box on `accent-bg`.
- **Notes**: at most two short lines of plain text, with no colour.
- **Common mistake**: a red label, then the wrong command and its error with a red border, then the fix with a green border. "Wrong" has a cross and "Fix" has a tick, so colour never speaks alone.

One spot in a line of code can be tinted: the step that is new, or what the fix adds.

**Short task.** A short task, such as a jq command, has no name on screen: its heading is the first sentence of its statement, which says what to do. The learner types the whole command, as in a terminal. The panels show the input, the learner's output and the wanted output on the canvas colour. The output updates as the learner types and says "Matches" in green, "Differs" in amber or "Error" in red, with the program's own error text. A "what comes out?" task shows the input and the command, and no output panels.

**When something fails.** If the app cannot go on, the whole window shows one centred message: "Something went wrong", the reason in plain words, and a Reload button in the footer. It never stays blank.

**Reviews name nothing.** A review looks like any other task. It has no button for the lesson, and its concepts appear only in the card after the answer.

**Large displays.** The UI keeps its size on every display: nothing scales up. A wider window leaves the column as it is. On windows 2200px wide or more, the tutor pane also widens, from 380px to 576px, for longer chat lines.

**Surfaces step up.** The rail sits on `sidebar`, the session on `panel`, and the tutor on `canvas`, the darkest surface. Content inside steps up again: `surface`, then `raised`. A light grey covers small cards only, never a whole region. Separate surfaces with a 1px `border` hairline, not with gaps or colour blocks.

**One blue.** `accent` marks what the tutor opened, the current item, focus, and the example and the rule of a lesson. Never use it for decoration or headings.

**Colour reports results.** Green means correct, amber means partial, red means wrong. Show status as a coloured dot next to words, never as coloured text alone.

**No red for concepts.** A concept or learning stage is never red. "Still learning" is amber or neutral. Red is only for a concrete wrong answer or failing test.

**Three fonts.** Atkinson Hyperlegible Next for the UI, task statements and the tutor. Libron for lesson text only. JetBrains Mono only for code, with ligatures off. Text is never smaller than 13px. Subject badges are icons, so their initials can be smaller.

**Text greys have jobs.** `ink` for titles, `body` for prose, `mute` for metadata and icons, `dim` only for placeholders and disabled text.

**One shadow.** Only floating panels cast a shadow. Everything else is flat.

**One bright shape.** The primary button and the send button are the only light fills: a `light` pill with `on-light` text.

**Syntax colours stay in code.** The `syntax-*` colours appear only inside code.

**Chat.** Messages use the `body` style. The learner speaks in a right-aligned bubble on `raised`. The tutor replies in plain `body` text with no container, so long answers stay easy to read.
