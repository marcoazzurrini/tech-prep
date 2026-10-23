# Product

<!-- impeccable:product-schema 1 -->

## Platform

Desktop app.

## Users

One person: the owner, a TypeScript developer who studies in focused sessions at their desk and needs text that is easy to read. Three jobs, in their words:

- prepare for coding challenges (Blind 75 first);
- learn to answer conceptual interview questions;
- learn new libraries and languages (for example JavaScript `Set`, `jq`).

## Product Purpose

A study app for deliberate practice, "a gym for coding" now that AI writes most code. Each subject has its own permanent tutor agent, for example a TypeScript agent or a jq agent, with its own environment. There are no throwaway chats. Each subject is a course with chapters and lessons, laid out like a programming course. The lesson fills the screen, and the tutor sits in a pane beside it. The tutor teaches, writes the exercises and decides what to practise next from a learning model. Success is durable skill: concepts recalled and applied weeks later without being told the topic.

## Positioning

The agent does as much of the work as possible. The app is a harness the agent drives: it shows exercises and takes the learner's input, stores the learner's state (such as review schedules) and stores each subject's curriculum. Skills hold the teaching method. When a high-quality source exists, such as Blind 75 or NeetCode 150 for algorithms, the curriculum and exercises come from it. Otherwise the agent writes them.

The engine schedules **concepts**, not questions, with spaced repetition (FSRS). One exercise can refresh several due concepts, and practising an advanced concept partly refreshes its prerequisites (fractional implicit repetition, as in Math Academy).

## Operating Context

- Structure: topic (a group, not scheduled), concept (the smallest rule you could get wrong on its own; scheduled), exercise (generated fresh; can cover several concepts). Concepts link to prerequisites, forming a graph.
- Content and exercise types are independent. Interview prep is one fixed content set (Blind 75), not a separate mode. A curriculum can also be built from a body of knowledge (docs, man pages).
- Target skill for a library or language: read first (predict the output), write second.
- Exercise ladder, based on PRIMM: predict the output; fix or modify working code; arrange given lines in order (Parsons problem); write code from a need. Conceptual questions are answered in the learner's own words.
- Cycle for one concept: probe (a short test first if there is prior knowledge), teach on failure (short explanation and one worked example built around the exact mistake), retry with a new surface, schedule. A completely new concept starts with a worked example.
- Review: when concepts are due, the agent writes one new exercise covering as many as possible; on failure it names which concept the mistake shows and fails only that one.
- Progress: the lessons column shows each chapter and lesson with its status. Concepts have the stages locked, available, learning, passed and mastered, and a recall score.

## Capabilities and Constraints

- The tutor is Claude, running through Claude Code on the user's subscription. It never writes the learner's solution during practice.
- Lesson types: explanation with worked example, predict the output, Parsons (arrange lines), mini code editor with Vim keys and runnable tests, conceptual answer.
- Writing tasks use a light in-app editor with Vim keybindings.
- Coding tasks have Run, which only runs the tests, and Submit, which hands in the answer. Predict and arrange have Submit only: the first answer is the evidence, so there is no trial run.
- Default language TypeScript; Python is supported.
- No failure state while learning. Help or giving up only delays a retry.

## Brand Commitments

Dark, sleek and minimal, in the family of Linear, t3code and assistant-ui. The look is defined in `DESIGN.md` and the OpenPencil file `design/tech-prep.fig`.

## Evidence on Hand

- The real curriculum and problem statements live in `packages/starters/`.

## Product Principles

1. The curriculum is the spine. The learner works through chapters and lessons, one lesson at a time in the main pane. The tutor sits beside the lesson: it explains, hints and chooses what comes next. The learner can close it.
2. Teach, never hand over answers during practice.
3. Show where the learner stands and what comes next, without pressure or failure marks.
4. Every screen must be easy to read at a glance.

## Accessibility & Inclusion

Easy reading is a hard requirement: short text blocks, generous spacing, highly readable fonts, clear hierarchy, low clutter, and no dense walls of text. The learner reads a lot of tutor prose, so prose readability matters as much as code readability.
