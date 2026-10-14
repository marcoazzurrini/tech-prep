# Learning model

This document is the specification for how tech-prep decides what the learner does next,
how attempts are graded, and how practice is scheduled over time. It draws on Math
Academy's Fractional Implicit Repetition (FIRe), ALEKS, Khan Academy, knowledge-tracing
research and the interleaving literature. Sources are listed at the end.

## Goals

The interview skill has two parts, and the model trains both:

1. **Recognition.** Given an unlabelled problem, name the pattern that fits.
2. **Flexible execution.** Implement that pattern correctly, including edge cases, and
   explain why it works.

Everything below serves those two goals with as little wasted practice as possible.

## Who decides what: code versus the agent

| Code (the engine)                                  | Agent (the tutor)                                     |
| -------------------------------------------------- | ----------------------------------------------------- |
| Curriculum, prerequisite and encompassing graphs   | Teaching: explanations, examples, exercises           |
| Learner state, FSRS cards, event log               | Diagnosing which concept caused a struggle            |
| Grades derived from objective signals              | Explanation and recognition scores (0-3, rubric)      |
| Credit flow (FIRe), penalties, unlocking           | Deciding whether a stop was "gave up" or "paused"     |
| Choosing the next task (repetition compression)    | Corrective re-teaching after a struggle               |

Rule of thumb: facts and arithmetic live in code; judgement lives in the agent. The
agent's judgements enter the engine through tool parameters, and the engine can only use
them to lower a grade, never to raise it above what the objective signals allow.

## Data model

### Curriculum (JSON in `content/curriculum/`, versioned in git)

- **Topics**: roadmap nodes with topic prerequisites. They order the path and group
  progress for display. They are not scheduled.
- **Concepts**: small skills. Each has prerequisite concepts (a DAG) and a list of
  **encompassings**: `{ id, w }` edges meaning "practising this concept also practises
  `w` of that one". Encompassings are set by hand, only on direct prerequisite edges, and
  default to 0. Prerequisites alone are not used for credit, because they give a lot of
  incorrect credit (Skycak).
- **Problems**: the Blind 75, each with one topic and one or more concepts.

The curriculum is content, so it stays in JSON. Learner state stays in SQLite. They join
on IDs. A startup check validates the curriculum (unknown IDs, cycles, weights outside
0-1, encompassings that are not prerequisites) and reports learner state that refers to
IDs no longer in the curriculum. `content/curriculum/aliases.json` maps renamed IDs so
progress follows a rename.

### Learner state (SQLite)

Per concept:

| Stage      | Meaning                                                                 |
| ---------- | ----------------------------------------------------------------------- |
| locked     | Some prerequisite is not passed yet (derived, not stored)               |
| available  | All prerequisites passed, not taught yet (derived, not stored)          |
| learning   | Taught; not yet solved independently                                    |
| passed     | Solved a problem independently at least once. FSRS starts here.         |
| mastered   | Passed, plus a later independent success on an unlabelled review        |

Plus `fail_count` (learning-phase struggles since the last lesson) and the FSRS card.

Per attempt: problem, phase (learning or review), outcome, hint events (each tagged with
the concept it was about and a level 1-4), explanation score, recognition score, tests
passed, minutes, and the tutor's per-concept diagnosis.

## Phases

### Learning phase (concept is `learning`)

Practice in this phase is instruction, not assessment. It never touches FSRS.

- **Solved independently** (no hint above level 1 on this concept): the concept becomes
  `passed`, its FSRS card is created and given a first Good review, and its dependents
  may unlock.
- **Solved with help** or **gave up**: the concept stays `learning`, `fail_count` goes up,
  and the problem cannot be served again for at least one day. The next item for this
  concept is a sibling problem when one exists (Bloom's parallel assessment); otherwise
  the same problem returns after the delay.
- **Remediation**: when `fail_count` reaches 2, the next action for that concept is
  `reteach`. The agent re-teaches from a different angle (a different worked example aimed
  at the diagnosed misconception, never "louder and slower") and checks the prerequisites.
  Completing the new lesson resets `fail_count`.
- **Never stuck**: while a problem waits for its retry delay, the planner serves other
  available work (ALEKS-style switching to another frontier concept).

Concepts that no problem uses directly (for example `dynamic-arrays`, `recursion`) become
`passed` when their lesson exercise is completed.

### Review phase (concept is `passed` or `mastered`)

Here a struggle is evidence of forgetting, so it is recorded.

Per concept, the grade comes from objective signals first:

| Evidence on this concept                                  | Grade |
| --------------------------------------------------------- | ----- |
| Gave up, or a level 3-4 hint on it                         | Again |
| A level 1-2 hint on it, or the tutor diagnosed a struggle  | Hard  |
| Solved, no hints on it                                     | Good  |
| As Good, fast, no hints at all, explanation 3, recognised  | Easy  |

- Wrong recognition (the learner named the wrong pattern before coding) caps the grade
  at Hard for the concepts they missed.
- An explanation score of 0-1 caps the grade at Hard.
- The learner's self-rating can only lower a grade.
- A session that stopped for outside reasons is recorded as `paused`: no grade, and the
  attempt can be resumed or discarded.

**Credit assignment is conjunctive.** On a failed attempt, the concept the tutor
diagnosed as the cause gets the full penalty. The other tagged concepts get Hard at most
if the learner handled them, never Again by association. Penalising every tagged skill
causes "problem-selection thrashing" (Koedinger et al. 2011).

## Fractional implicit repetition

After an explicit review of concept `c` with a passing grade, credit flows **down** the
encompassing graph:

- The credit reaching concept `d` is the maximum, over paths from `c` to `d`, of the
  product of the edge weights. Propagation stops below 0.15.
- A concept that was reviewed explicitly in the same attempt gets no implicit credit.
- Implicit credit `x` updates `d`'s FSRS card as a partial Good review: the new stability
  is `S · (S_good / S)^x`, where `S_good` is the stability a full Good review would give.
  FSRS already gives smaller gains when recall is still high, which discounts early
  repetitions as FIRe requires.
- Credit at or above 0.9 counts as a full Good review.
- **Weak concepts get no implicit credit.** A concept with two or more lapses, or whose
  last explicit grade was Again, must be reviewed explicitly (Math Academy's "speed < 1"
  rule).

After a failed review (Again) of concept `c`, a penalty flows **up**: every passed
concept that encompasses `c`, with path weight `x`, has its due date brought forward to
`now + (due - now) · (1 - x)`. Its stability is unchanged.

Every review is logged with `implicit_credit` (null for explicit reviews) and the source
concept, so implicit events can be excluded if FSRS parameters are ever optimised.

## Choosing the next task

The planner runs in order:

1. **Resume** an open attempt.
2. **Reteach** a concept whose `fail_count` reached 2.
3. **Repetition compression.** If any passed concept is due, score every candidate
   problem (authored, all concepts at least `learning`, not attempted in the last day):
   `score = Σ over due concepts d of min(1, credit(problem → d)) · (1 + overdue_days / interval_days)`.
   A problem's credit to `d` is 1 if it is tagged with `d`, otherwise the best implicit
   credit from its tags. Unseen problems get a bonus; the next roadmap problem is also a
   candidate, so new material that covers due reviews is preferred. The best-scoring
   problem is served as a review.
4. **Pacing.** After three reviews in a row, new material is served if any is available,
   even with reviews still due.
5. **New material.** The first problem on the roadmap that is not solved independently,
   whose retry delay has passed, and whose concepts are all at least `available`. If it
   needs untaught concepts, the action is `learn` with those concepts, prerequisites first.
6. **Done for now.**

FSRS runs with `enable_short_term: false`, so no concept is scheduled again on the same
day. Repeating an item several times in one day adds little to long-term memory.

## Interleaving and recognition

- **Learning phase:** blocked practice with labels. Lessons and the first problems for a
  concept are explicitly about that concept.
- **Review phase:** unlabelled. The tutor never says which topic or concept a review is
  from. Repetition compression already mixes topics.
- **Recognition step:** before coding a review, the learner names the approach. The tutor
  scores it (correct, partial, wrong) and passes it to `finish_attempt`. This makes
  recognition a tracked skill, separate from execution.
- Learners tend to feel interleaved practice is less productive than blocked practice,
  even when it works better (Kornell & Bjork 2008). Self-reported confidence does not
  reduce interleaving.

## Out of scope for now

- Mixing confusable concepts on purpose (for example sliding window versus two pointers).
- Problem variants to fight memorisation of the 75 problems.
- Learned models (BKT, PFA) once there is enough data.
- A diagnostic placement test.

## Sources

- Skycak, *Individualized Spaced Repetition in Hierarchical Knowledge Structures*:
  https://justinmath.com/individualized-spaced-repetition-in-hierarchical-knowledge-structures/
- Skycak, *The Math Academy Way* (working draft): https://www.justinmath.com/files/the-math-academy-way.pdf
- Math Academy, *How our AI works*: https://www.mathacademy.com/how-our-ai-works
- ALEKS, learned versus mastered topics:
  https://www.mheducation.com/support/aleks-support-center/knowledge/aleks-what-is-the-difference-between-mastered-and-learned-topics.html
- Khan Academy mastery levels: https://support.khanacademy.org/hc/en-us/articles/5548760867853
- Koedinger et al. 2011, conjunctive knowledge tracing: https://digitalcommons.memphis.edu/facpubs/7461
- Guskey, *Lessons of Mastery Learning*: https://www.ascd.org/el/articles/lessons-of-mastery-learning
- Rohrer et al., interleaved mathematics practice: https://ies.ed.gov/use-work/awards/interleaved-mathematics-practice
- Brunmair & Richter 2019, interleaving meta-analysis:
  https://www.psychologie.uni-wuerzburg.de/fileadmin/06020400/2019/Brunmair_Richter_in_press__2019_META-ANALYSIS_OF_INTERLEAVED_LEARNING.pdf
- Anki deck options (relearning steps): https://docs.ankiweb.net/deck-options.html
- FSRS algorithm: https://github.com/open-spaced-repetition/awesome-fsrs/wiki/The-Algorithm
- Prior art: mnemo (Blind 75 with FIRe, no licence, ideas only): https://github.com/hectorrbv/mnemo;
  Trane reward propagator (AGPL, ideas only):
  https://github.com/trane-project/trane/blob/HEAD/src/scheduler/reward_propagator.rs
