---
name: tech-prep
description: A chat-first study app where the tutor talks and opens exercise panels beside the conversation.
colors:
  bg: "#0c0c0e"
  side: "#101013"
  panel: "#16161a"
  raise: "#1d1d22"
  hover: "#222228"
  code: "#111114"
  line: "#26262c"
  line2: "#323239"
  line-focus: "#4a4a55"
  ink: "#ececf1"
  body: "#d4d4db"
  mute: "#9d9da8"
  dim: "#85858f"
  blue: "#7aa2ff"
  blue-bg: "#141a2b"
  blue-line: "#34477a"
  blue-ink: "#b9c9ee"
  green: "#5fd39a"
  green-line: "#244a38"
  amber: "#f0b450"
  amber-line: "#5a4520"
  red: "#ff7a7a"
  red-bg: "#2a1517"
  syntax-keyword: "#c79bff"
  syntax-string: "#9fd59b"
  syntax-number: "#f2b47a"
  syntax-comment: "#8a8a95"
  syntax-function: "#7fc4ff"
typography:
  headline:
    fontFamily: "Atkinson Hyperlegible Next, system-ui, sans-serif"
    fontSize: "18px"
    fontWeight: 600
    lineHeight: 1.6
  title:
    fontFamily: "Atkinson Hyperlegible Next, system-ui, sans-serif"
    fontSize: "15px"
    fontWeight: 600
    lineHeight: 1.6
  body:
    fontFamily: "Atkinson Hyperlegible Next, system-ui, sans-serif"
    fontSize: "16px"
    fontWeight: 400
    lineHeight: 1.6
  body-compact:
    fontFamily: "Atkinson Hyperlegible Next, system-ui, sans-serif"
    fontSize: "15px"
    fontWeight: 400
    lineHeight: 1.6
  ui:
    fontFamily: "Atkinson Hyperlegible Next, system-ui, sans-serif"
    fontSize: "14px"
    fontWeight: 400
    lineHeight: 1.6
  ui-strong:
    fontFamily: "Atkinson Hyperlegible Next, system-ui, sans-serif"
    fontSize: "14px"
    fontWeight: 600
    lineHeight: 1.6
  label:
    fontFamily: "Atkinson Hyperlegible Next, system-ui, sans-serif"
    fontSize: "13px"
    fontWeight: 400
    lineHeight: 1.6
  caption:
    fontFamily: "Atkinson Hyperlegible Next, system-ui, sans-serif"
    fontSize: "12px"
    fontWeight: 400
    lineHeight: 1.6
  code:
    fontFamily: "JetBrains Mono, ui-monospace, monospace"
    fontSize: "15px"
    fontWeight: 400
    lineHeight: 1.75
    fontFeature: "\"calt\" 0, \"liga\" 0"
  code-compact:
    fontFamily: "JetBrains Mono, ui-monospace, monospace"
    fontSize: "14px"
    fontWeight: 400
    lineHeight: 1.7
    fontFeature: "\"calt\" 0, \"liga\" 0"
  code-status:
    fontFamily: "JetBrains Mono, ui-monospace, monospace"
    fontSize: "12px"
    fontWeight: 400
    lineHeight: 1.6
    fontFeature: "\"calt\" 0, \"liga\" 0"
rounded:
  xs: "4px"
  code: "5px"
  sm: "8px"
  md: "9px"
  lg: "10px"
  xl: "12px"
  bubble: "14px"
  composer: "16px"
  pill: "99px"
spacing:
  2xs: "4px"
  xs: "6px"
  sm: "8px"
  md: "10px"
  lg: "12px"
  xl: "14px"
  2xl: "16px"
  3xl: "20px"
  message-gap: "22px"
  panel-inset: "24px"
  thread-inset: "28px"
components:
  sidebar:
    backgroundColor: "{colors.side}"
    width: "232px"
    padding: "44px 10px 12px"
  sidebar-new-session:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    typography: "{typography.ui}"
    rounded: "{rounded.md}"
    height: "36px"
    padding: "0 10px"
  sidebar-group-label:
    textColor: "{colors.dim}"
    typography: "{typography.caption}"
    padding: "12px 10px 6px"
  session-row:
    backgroundColor: "transparent"
    textColor: "{colors.mute}"
    typography: "{typography.ui}"
    rounded: "{rounded.sm}"
    height: "34px"
    padding: "0 10px"
  session-row-hover:
    backgroundColor: "{colors.hover}"
    textColor: "{colors.ink}"
  session-row-active:
    backgroundColor: "{colors.raise}"
    textColor: "{colors.ink}"
  chat-header:
    backgroundColor: "{colors.bg}"
    textColor: "{colors.ink}"
    typography: "{typography.title}"
    height: "52px"
    padding: "0 24px"
  icon-button:
    backgroundColor: "transparent"
    textColor: "{colors.mute}"
    rounded: "{rounded.sm}"
    size: "32px"
  message-tutor:
    textColor: "{colors.body}"
    typography: "{typography.body}"
    width: "62ch"
  message-tutor-author:
    textColor: "{colors.dim}"
    typography: "{typography.label}"
  message-learner:
    backgroundColor: "{colors.raise}"
    textColor: "{colors.ink}"
    typography: "{typography.body-compact}"
    rounded: "14px 14px 4px 14px"
    padding: "9px 14px"
  tool-line:
    textColor: "{colors.dim}"
    typography: "{typography.label}"
  panel-chip:
    backgroundColor: "transparent"
    textColor: "{colors.mute}"
    typography: "{typography.ui}"
    rounded: "{rounded.lg}"
    height: "38px"
    padding: "0 12px"
  panel-chip-hover:
    backgroundColor: "{colors.hover}"
  panel-chip-active:
    backgroundColor: "{colors.blue-bg}"
    textColor: "{colors.blue-ink}"
  code-inline:
    backgroundColor: "{colors.raise}"
    textColor: "{colors.ink}"
    rounded: "{rounded.code}"
    padding: "0 5px"
  code-block-chat:
    backgroundColor: "{colors.code}"
    textColor: "{colors.ink}"
    typography: "{typography.code-compact}"
    rounded: "{rounded.lg}"
    padding: "12px 16px"
  composer:
    backgroundColor: "{colors.panel}"
    textColor: "{colors.ink}"
    typography: "{typography.body}"
    rounded: "{rounded.composer}"
    padding: "12px 14px 10px"
    width: "min(680px, 100% - 56px)"
  composer-model-pill:
    backgroundColor: "transparent"
    textColor: "{colors.mute}"
    typography: "{typography.label}"
    rounded: "{rounded.sm}"
    height: "28px"
    padding: "0 10px"
  composer-send:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.bg}"
    rounded: "{rounded.md}"
    size: "32px"
  composer-send-disabled:
    backgroundColor: "{colors.raise}"
    textColor: "{colors.dim}"
  panel:
    backgroundColor: "{colors.panel}"
    width: "clamp(460px, 44vw, 680px)"
  panel-tab-strip:
    backgroundColor: "{colors.side}"
    height: "52px"
    padding: "0 10px"
  panel-tab:
    backgroundColor: "transparent"
    textColor: "{colors.mute}"
    typography: "{typography.ui}"
    rounded: "9px 9px 0 0"
    height: "40px"
    padding: "0 12px"
  panel-tab-active:
    backgroundColor: "{colors.panel}"
    textColor: "{colors.ink}"
    height: "41px"
  task-header:
    textColor: "{colors.ink}"
    typography: "{typography.headline}"
    padding: "20px 24px 18px"
  tag:
    backgroundColor: "transparent"
    textColor: "{colors.mute}"
    typography: "{typography.label}"
    rounded: "{rounded.pill}"
    height: "24px"
    padding: "0 8px"
  tag-learning:
    textColor: "{colors.amber}"
  tag-passed:
    textColor: "{colors.green}"
  editor:
    backgroundColor: "{colors.code}"
    textColor: "{colors.ink}"
    typography: "{typography.code}"
    padding: "14px 0"
  editor-current-line:
    backgroundColor: "#ffffff07"
  vim-status:
    backgroundColor: "{colors.side}"
    textColor: "{colors.mute}"
    typography: "{typography.code-status}"
    height: "28px"
    padding: "0 14px"
  vim-mode-normal:
    backgroundColor: "{colors.green}"
    textColor: "{colors.bg}"
    rounded: "{rounded.xs}"
    padding: "0 7px"
  tests:
    backgroundColor: "{colors.panel}"
    padding: "14px 24px 16px"
  test-row:
    textColor: "{colors.mute}"
    typography: "{typography.ui}"
    padding: "4px 0"
  test-row-failing:
    textColor: "{colors.ink}"
  button-primary:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.bg}"
    typography: "{typography.ui-strong}"
    rounded: "{rounded.md}"
    height: "36px"
    padding: "0 14px"
  button-primary-hover:
    backgroundColor: "#ffffff"
  button-ghost:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    typography: "{typography.ui-strong}"
    rounded: "{rounded.md}"
    height: "36px"
    padding: "0 14px"
  button-ghost-hover:
    backgroundColor: "{colors.hover}"
  answer-input:
    backgroundColor: "{colors.code}"
    textColor: "{colors.ink}"
    rounded: "{rounded.md}"
    height: "44px"
    width: "110px"
    padding: "0 14px"
  answer-input-wrong:
    backgroundColor: "{colors.red-bg}"
  result-callout:
    backgroundColor: "{colors.bg}"
    textColor: "{colors.body}"
    typography: "{typography.body-compact}"
    rounded: "{rounded.xl}"
    padding: "14px 16px"
  parsons-line:
    backgroundColor: "{colors.code}"
    textColor: "{colors.ink}"
    typography: "{typography.code-compact}"
    rounded: "{rounded.lg}"
    height: "46px"
    padding: "0 12px"
  concept-row:
    textColor: "{colors.ink}"
    typography: "{typography.body-compact}"
    padding: "14px 0"
---

# Design System: tech-prep

## Overview

**Creative North Star: "The Tutor's Workbench"**

The conversation is the spine and the tutor drives the workbench. Every exercise opens as a panel the tutor placed beside the chat, and every panel stays linked to the message that opened it. The world is a quiet near-black room with three surfaces in it: a session sidebar on the left, the thread in the middle, and a tabbed panel on the right that holds whatever the tutor has opened. Nothing competes with the words; the learner reads a lot of tutor prose, so prose gets the best seat.

Density is calm rather than compact. Text sits on near-black at a comfortable 16px with generous line height, messages are short blocks separated by clear gaps, and every surface is separated by a hairline rather than a shadow or a colour block. Colour is almost absent: one calm blue says "the tutor opened this, and it is here", and green, amber and red appear only when there is a result or a concept stage to report. The world rejects the fixed three-panel IDE, where the editor dominates and the tutor is a sidebar.

The family is t3code and assistant-ui: dark, sleek, minimal, standard desktop controls, no ornament. What makes it this product is the panel chip: the line in the thread and the tab in the panel are one object, and they light up together.

**Key Characteristics:**
- Near-black neutral ground with two raised greys for sidebar and panels, separated by 1px hairlines.
- One accent, a calm blue, reserved for tutor-opened objects, the current tab and focus.
- Green, amber and red only for results and concept stages; amber, never red, for "still learning".
- Atkinson Hyperlegible Next for every word of prose and UI; JetBrains Mono only for code, with ligatures off.
- Rounded but restrained corners (8 to 16px), flat surfaces, one floating shadow under the composer.
- A signature link between chat chip and panel tab, animated with a single soft slide.

## Colors

A neutral, faintly cool near-black stack with one blue accent and three result colours that never decorate.

### Primary
- **Tutor Blue** (`blue`): the colour of "the tutor opened this". It marks the dot before every "Tutor" author line, the icon of the active panel tab, the text caret in the composer, the Parsons drop target, text selection (at 25% alpha) and every focus ring.
- **Tutor Blue Wash** (`blue-bg`) with **Tutor Blue Line** (`blue-line`) and **Tutor Blue Ink** (`blue-ink`): the active panel chip in the thread, a dark blue fill with a blue hairline and soft blue-white text. This is the only filled blue surface in the world.

### Tertiary
- **Pass Green** (`green`) with **Pass Green Line** (`green-line`): passed tests, correct Parsons lines, "right first time" chip status, the "Passed" concept tag, the passed-panel tab dot, and the Vim NORMAL mode badge.
- **Learning Amber** (`amber`) with **Learning Amber Line** (`amber-line`): concepts at the Learning stage, a missed prediction ("4, it was 5"), a partial test summary ("3 of 4 passed"), due counts in the sidebar, and the result callout's warning icon.
- **Fail Red** (`red`) with **Fail Red Wash** (`red-bg`): a failing test line, a wrong answer field, and the tab dot of a panel whose tests fail. Nowhere else.

### Neutral
- **Ground** (`bg`): the window background and the chat column; also the inset fill of the result callout inside a panel.
- **Sidebar Grey** (`side`): session sidebar, panel tab strip, Vim status line.
- **Panel Grey** (`panel`): the body of an open panel, the active tab, and the composer.
- **Raised Grey** (`raise`): the learner's message bubble, the active session row, inline code chips.
- **Hover Grey** (`hover`): hover fill for every quiet control (session rows, chips, ghost buttons, icon buttons, pills).
- **Code Well** (`code`): the fill behind every block of code: editor, chat code blocks, predict snippets, Parsons lines, the answer field.
- **Hairline** (`line`), **Strong Hairline** (`line2`), **Focus Hairline** (`line-focus`): the 1px borders that separate everything. `line` is the default; `line2` outlines interactive edges (composer, ghost buttons, tags, the answer field); `line-focus` is the composer border while typing.
- **Ink** (`ink`): headings, names, active labels, code text, and the fill of primary buttons.
- **Prose** (`body`): tutor messages and panel instructions; slightly softer than ink so long reading stays easy.
- **Muted** (`mute`): secondary labels, inactive tabs and sessions, passed test names.
- **Dim** (`dim`): author lines, group labels, timestamps, notes, line numbers, placeholders. Every text grey passes AA on every surface it sits on (dim is the lowest, at about 4.9:1 on the panel grey).

### Code Syntax
- **Keyword Violet** (`syntax-keyword`), **String Green** (`syntax-string`), **Number Orange** (`syntax-number`), **Comment Grey** (`syntax-comment`), **Function Blue** (`syntax-function`): the five syntax colours, used only inside code wells and chat code blocks.

### Named Rules
**The One Blue Rule.** Blue means only "the tutor placed this here", "this is the one you are on", or focus. Never use it for links, decoration, headings or a primary button.

**The Results-Only Rule.** Green, amber and red report outcomes and concept stages, nothing else. The single exception is the Vim NORMAL badge, which borrows green from editor convention.

**The No Failure Mark Rule.** A concept is never red. Missed predictions and Learning stages are amber; red is reserved for a concrete failing test or a wrong value in an answer field.

## Typography

**Display Font:** none. The largest type is the 18px panel headline.
**Body Font:** Atkinson Hyperlegible Next (with system-ui, sans-serif)
**Label/Mono Font:** JetBrains Mono (with ui-monospace, monospace)

**Character:** A hyperlegible humanist sans carries every word the learner reads, chosen because easy reading is a hard requirement; a plain, ligature-free mono carries code, so `=>` and `!==` read exactly as typed.

### Hierarchy
- **Headline** (600, 18px, 1.6): the title of an open panel ("Write uniqueBy").
- **Title** (600, 15px, 1.6): the chat header topic name; the brand name uses the same size at 700.
- **Body** (400, 16px, 1.6): tutor prose and the composer. Tutor paragraphs cap at 62ch.
- **Body Compact** (400, 15px, 1.6): panel instructions, result callouts, the learner bubble, concept names.
- **UI** (400, 14px) and **UI Strong** (600, 14px): session rows, tabs, chip labels and test names; buttons and chip titles use the strong weight.
- **Label** (400, 13px): author lines, tool lines, tags, notes, concept stage text.
- **Caption** (400, 12px): sidebar group labels and due counts.
- **Code** (400, 15px, 1.75, mono): the editor and the predict snippet (the snippet runs at 1.8).
- **Code Compact** (400, 14px, 1.7, mono): chat code blocks and Parsons lines. Inline code inside prose drops to 0.86em on a raised chip.
- **Code Status** (400, 12px, mono): the Vim status line; test failure reasons use the same mono at 13px.

### Named Rules
**The Two Voices Rule.** Atkinson Hyperlegible Next for all prose and UI; JetBrains Mono only for code, file names, key hints and the Vim status line. Code always has `calt` and `liga` off.

**The Sentence Case Rule.** Every label is sentence case at normal tracking. The only capitals in the interface are the Vim mode name.

## Layout

A fixed three-column desktop grid: a 232px session sidebar, a fluid chat column (minimum 420px), and an exercise panel of `clamp(460px, 44vw, 680px)`. The app needs at least 1180px of width; below that it scrolls rather than reflowing. Columns are separated by 1px hairlines, never by gaps or gutters.

The chat header and the panel tab strip share one 52px band across the top, so the two halves read as one window. Inside the thread, content sits in a centred column of at most 680px with 28px side insets; messages are spaced 22px apart, and paragraphs, code and chips within a message 12px apart. The composer floats at the bottom of the chat column, matching the thread column's width and 20px off the bottom edge. A short gradient under the chat header fades scrolled messages instead of cutting them.

Panels use a 24px horizontal inset throughout (task header, answers, tests, actions), with a header block on top and an actions bar on the bottom, each split off by a hairline. The editor fills the remaining height between task header and the Vim status line.

Spacing moves in 2px steps from 4px to 28px; controls use 6 to 14px internally, sections use 16 to 24px.

## Elevation & Depth

Flat by default. Depth comes from stepping the grey stack (ground, sidebar, panel, raised, hover) and from 1px hairlines. The composer is the only element that floats: it carries a soft, diffuse shadow so it reads as sitting above the thread it writes into.

### Shadow Vocabulary
- **Composer float** (`box-shadow: 0 10px 30px #00000066`): only under the chat composer.

### Named Rules
**The One Shadow Rule.** Only the composer casts a shadow. Panels, chips, bubbles, tabs and buttons are flat and separated by hairlines.

## Shapes

Gently rounded, never pill-shaped except for tags. Corners scale with the object: 4 to 5px for tiny chips (Vim mode, inline code), 8 to 9px for controls (session rows, buttons, inputs, icon buttons, the top of tabs), 10 to 12px for containers in the thread and panel (chips, code blocks, Parsons lines, result callouts), 14px for the learner bubble and 16px for the composer. The learner bubble keeps one small 4px corner at its bottom right, pointing toward the learner's side. Tags are fully rounded capsules. Every edge is a 1px hairline; there are no thick borders, no inner strokes and no dividers heavier than `line`.

## Components

### Session Sidebar
Quiet list, no chrome.
- **Shape:** 232px column on the sidebar grey, a hairline on the right, 44px top inset to clear the window controls.
- **Contents:** brand row (a small ink square holding the code glyph, then the name at title size, 700), a "New session" button with a hairline border and a mono key hint, sentence-case group labels in caption dim ("Today", "This week"), session rows, and a footer (Roadmap, Settings) split off by a hairline.
- **Rows:** 34px tall, muted text, ellipsis on overflow. Hover fills with hover grey and turns ink; the current session sits on raised grey in ink. A due count sits right-aligned in amber caption.

### Chat Messages
Tutor speaks in prose; the learner speaks in bubbles.
- **Tutor:** no container. A dim author line ("Tutor") led by a 6px blue dot, then paragraphs in prose grey at body size, capped at 62ch. Code blocks sit in a code well with a hairline and 10px corners; inline code is a small raised chip.
- **Learner:** right-aligned bubble, at most 78% wide, raised grey with a hairline, 14px corners with a 4px tail corner at the bottom right, body-compact text in ink.
- **Tool line:** a single dim label row with a play icon and a muted bold verb ("Ran the tests · 3 of 4 passed"); the tutor's actions are reported, not boxed.

### Panel Chips (signature)
The line in the thread that a panel hangs from.
- **Style:** 38px tall, hairline border, 10px corners, a 16px stroke icon, the panel name in ink at 600, then a status in muted text: green with a tick when right, amber with a warning when missed, plain muted when in progress.
- **State:** hover fills with hover grey. Active (the panel currently shown) switches to the blue wash, blue line and blue-white text.

### Panel Tabs
- **Strip:** 52px band on the sidebar grey, tabs aligned to its bottom edge, a hairline underneath, scrolls sideways when full.
- **Tab:** 40px, muted text with a stroke icon and an optional 7px result dot (green passed, amber missed, red failing). Hover turns ink.
- **Active:** fills with panel grey, gains a hairline on three sides and 9px top corners, and drops 1px to merge with the panel body; its icon turns blue.

### The Signature: chip and tab are one object
A panel chip in the thread and its panel tab are the same thing. Clicking either selects both: the tab becomes active and the chip lights up in blue. Opening a panel from the chat replays its arrival: the panel body slides in from 18px right while fading up from 35% opacity over 0.45s on `cubic-bezier(.16,1,.3,1)`, and the chip's border, fill and text cross-fade to blue over 0.3s on the same curve. Switching by tab changes the view without the slide. Reduced-motion turns every animation and transition off.

### Task Header and Tags
- **Header:** headline title, one line of body-compact instruction, then a row of tags; a hairline below.
- **Tags:** 24px capsules with a strong hairline, muted label text. Learning tags turn amber with an amber line; passed tags turn green with a green line; Available and Locked stay muted.

### Editor with Vim Status Line
- **Editor:** a code well filling the panel, 15px mono at 1.75, a 52px gutter of dim right-aligned line numbers. The current line has a barely-there white wash and a muted line number; the cursor is a light block.
- **Vim status line:** 28px strip on the sidebar grey with a hairline above, 12px mono in muted text: the mode badge (NORMAL in ground-coloured text on green, 4px corners), the file name, and the cursor position right-aligned.

### Tests List
- **Header:** "Tests" in 600, the summary in amber when partial, and a primary "Run tests" button right-aligned with a mono key hint at reduced opacity. While running, the summary reads "Running…" in muted and the button disables.
- **Rows:** 14px stroke icons (green tick, red cross) with test names in muted text. A failing row turns ink and adds the reason underneath in 13px mono.

### Buttons
- **Shape:** 36px tall, 9px corners, 14px horizontal padding, UI-strong label, optional leading icon.
- **Primary:** ink fill with ground-coloured text; hover goes to pure white.
- **Ghost:** transparent with a strong hairline and ink text; hover fills with hover grey.
- **Disabled:** 50% opacity.
- **Icon button:** 32px square, muted icon, hover grey fill and ink icon.

### Composer
- **Style:** panel grey, strong hairline, 16px corners, the one floating shadow. A borderless auto-growing textarea at body size (28px to 160px tall) with a blue caret and dim placeholder.
- **Bar:** a model pill (spark icon, label size, hover grey on hover), a muted account note, and a 32px send button: ink with an up-arrow when there is text, raised grey and dim when empty.
- **Focus:** the border lifts to the focus hairline; no glow.

### Answer Field and Result Callout
- **Answer field:** 110px by 44px code-well input with a strong hairline, 16px mono at 500. A wrong answer turns the border red and the fill red wash.
- **Result callout:** an inset block in ground colour with a hairline and 12px corners, an amber warning icon, a bold one-line verdict, a short explanation, and a muted line naming the concept the mistake shows.

### Parsons Lines
- **Line:** 46px code-well rows with a hairline and 10px corners, a dim grip icon, 14px mono code, grab cursor. Hover strengthens the hairline; the drop target takes the blue line and nudges down 2px; the dragged line fades to 40%.
- **Result:** correct lines take the green line; the spare line goes muted under a dim "Not needed" label.

### Concept Rows (progress)
- **Row:** concept name in 600, a one-line rule in muted below, and a right-aligned stage tag with its next review in label size; rows split by hairlines.

## Do's and Don'ts

### Do:
- **Do** separate every surface with a 1px hairline and a step in the grey stack, not with gaps or shadows.
- **Do** keep tutor prose at 16px with 1.6 line height in the prose grey, capped at 62ch.
- **Do** make every exercise a panel that has a chip in the thread and a tab in the panel, and keep the two in sync.
- **Do** report outcomes with icon plus colour plus words ("4, it was 5", "3 of 4 passed"), never colour alone.
- **Do** turn code ligatures off everywhere code appears.
- **Do** honour reduced motion by removing every transition and animation.

### Don't:
- **Don't** build the fixed three-panel IDE layout where the editor dominates and the tutor is a sidebar; the conversation stays the spine.
- **Don't** use blue for anything that is not tutor-opened, current or focused.
- **Don't** mark a concept, stage or learner in red; "still learning" is amber.
- **Don't** add shadows to panels, chips, bubbles or buttons; only the composer floats.
- **Don't** set prose or UI labels in JetBrains Mono, or code in Atkinson.
- **Don't** use all-caps or letter-spaced labels; the Vim mode name is the only capitalised word.
