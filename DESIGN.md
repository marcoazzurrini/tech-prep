---
name: tech-prep
description: A study app where each subject has a tutor that talks and opens exercise panels beside the conversation.
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

The OpenPencil file `design/tech-prep.fig` is the source of truth. This file mirrors its tokens for code and states the rules behind them. The components are built in `packages/ui` and shown in Storybook (`bun run storybook`).

## Look

Calm, layered dark surfaces in the family of Linear. One accent for what the tutor opens. Colour for results only. Every screen must be easy to read at a glance.

## Rules

**Course layout.** An icon rail on the left opens Today and switches subjects. The lessons column lists chapters and lessons. The lesson fills the main pane. The tutor pane sits on the right, and the learner can close it.

**Surfaces step up.** The rail and the lessons column sit on `sidebar`, the lesson on `panel`, and the tutor on `canvas`, the darkest surface. Content inside steps up again: `surface`, then `raised`. A light grey covers small cards only, never a whole region. Separate surfaces with a 1px `border` hairline, not with gaps or colour blocks.

**One blue.** `accent` marks only what the tutor opened, the current item, and focus. Never use it for decoration or headings.

**Colour reports results.** Green means correct, amber means partial, red means wrong. Show status as a coloured dot next to words, never as coloured text alone.

**No red for concepts.** A concept or learning stage is never red. "Still learning" is amber or neutral. Red is only for a concrete wrong answer or failing test.

**Two fonts.** Atkinson Hyperlegible Next for all prose and UI. JetBrains Mono only for code, with ligatures off. Text is never smaller than 13px. Subject badges are icons, so their initials can be smaller.

**Text greys have jobs.** `ink` for titles, `body` for prose, `mute` for metadata and icons, `dim` only for placeholders and disabled text.

**One shadow.** Only floating panels cast a shadow. Everything else is flat.

**One bright shape.** The primary button and the send button are the only light fills: a `light` pill with `on-light` text.

**Syntax colours stay in code.** The `syntax-*` colours appear only inside code.

**Chat.** Messages use the `body` style. The learner speaks in a right-aligned bubble on `raised`. The tutor replies in plain `body` text with no container, so long answers stay easy to read.
