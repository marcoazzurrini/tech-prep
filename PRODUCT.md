# Product

<!-- impeccable:product-schema 1 -->

## Platform

Desktop app.

## Users

One person: the owner, a TypeScript developer who studies in focused sessions at their desk and needs text that is easy to read. Three jobs, in their words:

- prepare for coding challenges (NeetCode 150 first);
- learn to answer conceptual interview questions;
- learn new libraries and languages (for example JavaScript `Set`, `jq`).

## Product Purpose

A study app for deliberate practice, "a gym for coding" now that AI writes most code. Each subject is a course with chapters and lessons, laid out like a programming course. A lesson teaches one concept: a short written lesson with a worked example, a small problem solved with the lesson beside it, then a problem solved alone. Spaced reviews bring each concept back as a full problem that does not say what it tests. Each subject has its own permanent tutor agent, which sits in a pane beside the work and helps when asked. Success is durable skill: concepts recalled and applied weeks later without being told the topic.

## Positioning

The app leads the course. It shows the lessons, opens the problems, runs the tests, grades what the learner hands in and schedules the reviews. The learner never has to ask what comes next. The tutor is a helper: it answers questions, gives hints one step at a time and explains mistakes. Skills hold its teaching method.

When a high-quality source exists, such as NeetCode 150 for algorithms, the curriculum and problems come from it. Lessons and statements are written for the app, in plain words.

The engine schedules **concepts**, not questions, with spaced repetition (FSRS). One problem can refresh up to three due concepts, and practising an advanced concept partly refreshes its prerequisites (fractional implicit repetition, as in Math Academy). The rules are in `docs/learning-model.md`.

## Operating Context

- Structure: topic (a chapter, not scheduled), concept (the smallest rule you could get wrong on its own; scheduled; one lesson each), problem (targets one to three concepts). Concepts link to prerequisites, forming a graph. A subject's curriculum is built once, not as the learner goes.
- A lesson has two steps. Step 1: the lesson text beside a small guided problem. Step 2: the lesson closes and the learner solves a problem from the source list alone. Only step 2 decides whether the concept is learned. Opening the lesson again during step 2 counts as help.
- Each concept's lesson ends on one problem. The other problems of the list are kept for reviews, so a review is usually a problem the learner has not seen.
- Review: when concepts are due, the learner solves a full problem that covers as many as possible. The screen shows no lesson, no chapter and no lessons column, so nothing names the approach. Choosing the approach is the skill being tested. Each concept is pass or fail.
- The reviews screen lists what is due per subject. The learner starts one subject, or all of them mixed.
- Progress: the lessons column shows each chapter and lesson with its status. Concepts have the stages locked, available, learning, passed and mastered, and a recall score.

## Capabilities and Constraints

- The tutor is Claude, running through Claude Code on the user's subscription. It never writes the learner's solution during practice. Hints go one small step at a time, and a hint that names the approach makes the solve count as "with help".
- The tutor can put an extra exercise on screen when the learner asks for more practice: a worked example, predict the output, arrange the lines, or an open question.
- Writing tasks use a light in-app editor with Vim keybindings.
- A problem has Run, which only runs the tests, and Submit, which hands in the answer once the tests pass. The learner can give up to see a solution.
- Default language TypeScript; Python is supported.
- No failure state while learning. Help or giving up only delays a retry.

## Brand Commitments

Dark, sleek and minimal, in the family of Linear, t3code and assistant-ui. The look is defined in `DESIGN.md` and the penna design in `.penna/`.

## Evidence on Hand

- The real curriculum and problem statements live in `packages/starters/`.

## Product Principles

1. The curriculum is the spine. The learner works through chapters and lessons, one lesson at a time in the main pane, and the app always shows what comes next. The tutor sits beside the lesson and helps when asked. It is closed until the learner opens it.
2. Teach, never hand over answers during practice.
3. Show where the learner stands and what comes next, without pressure or failure marks.
4. Every screen must be easy to read at a glance.

## Accessibility & Inclusion

Easy reading is a hard requirement: short text blocks, generous spacing, highly readable fonts, clear hierarchy, low clutter, and no dense walls of text. The learner reads a lot of tutor prose, so prose readability matters as much as code readability.
