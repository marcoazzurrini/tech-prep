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

A study app for deliberate practice, "a gym for coding" now that AI writes most code. Each subject has its own permanent tutor agent, for example a TypeScript agent or a jq agent, with its own environment. There are no throwaway chats. The tutor teaches, opens small interactive panels beside the conversation for each exercise, and decides what to practise next from a learning model. Success is durable skill: concepts recalled and applied weeks later without being told the topic.

## Positioning

The agent does as much of the work as possible. The app is a harness the agent drives: it renders exercise panels on demand, while skills hold the teaching method and the engine holds the tracking data. Exercises are generated fresh, never stored as the unit.

The engine schedules **concepts**, not questions, with spaced repetition (FSRS). One exercise can refresh several due concepts, and practising an advanced concept partly refreshes its prerequisites (fractional implicit repetition, as in Math Academy).

## Operating Context

- Structure: topic (a group, not scheduled), concept (the smallest rule you could get wrong on its own; scheduled), exercise (generated fresh; can cover several concepts). Concepts link to prerequisites, forming a graph.
- Content and exercise types are independent. Interview prep is one fixed content set (Blind 75), not a separate mode. A curriculum can also be built from a body of knowledge (docs, man pages).
- Target skill for a library or language: read first (predict the output), write second.
- Exercise ladder, based on PRIMM: predict the output; fix or modify working code; arrange given lines in order (Parsons problem); write code from a need. Conceptual questions are answered in the learner's own words.
- Cycle for one concept: probe (a short test first if there is prior knowledge), teach on failure (short explanation and one worked example built around the exact mistake), retry with a new surface, schedule. A completely new concept starts with a worked example.
- Review: when concepts are due, the agent writes one new exercise covering as many as possible; on failure it names which concept the mistake shows and fails only that one.
- Progress: a roadmap of topics and concepts with stages locked, available, learning, passed, mastered, and recall per concept.

## Capabilities and Constraints

- The tutor is Claude, running through Claude Code on the user's subscription. It never writes the learner's solution during practice.
- Panels the tutor can open: explanation with worked example, predict the output, Parsons (arrange lines), mini code editor with Vim keys and runnable tests, conceptual answer, roadmap or progress.
- Writing tasks use a light in-app editor with Vim keybindings.
- Default language TypeScript; Python is supported.
- No failure state while learning. Help or giving up only delays a retry.

## Brand Commitments

Dark, sleek and minimal, in the family of Linear, t3code and assistant-ui. The look is defined in `DESIGN.md` and the Paper file.

## Evidence on Hand

- The real curriculum and problem statements live in `packages/starters/`.
- Sample progress numbers in designs must be labelled as sample data.

## Product Principles

1. The conversation is the spine; panels appear when an exercise needs them and get out of the way.
2. Teach, never hand over answers during practice.
3. Show where the learner stands and what comes next, without pressure or failure marks.
4. Every screen must be easy to read at a glance.

## Accessibility & Inclusion

Easy reading is a hard requirement: short text blocks, generous spacing, highly readable fonts, clear hierarchy, low clutter, and no dense walls of text. The learner reads a lot of tutor prose, so prose readability matters as much as code readability.
