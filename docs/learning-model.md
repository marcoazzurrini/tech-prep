# Learning model

This document is the specification for how tech-prep decides what the learner does next, how attempts are graded, and how practice is scheduled over time. It draws on Math Academy's Fractional Implicit Repetition (FIRe), ALEKS, Khan Academy, LearnHarness, knowledge-tracing research and the interleaving literature. Sources are listed at the end.

## Goals

The interview skill has two parts, and the model trains both:

1. **Recognition.** Given an unlabelled problem, name the pattern that fits.
2. **Flexible execution.** Implement that pattern correctly, including edge cases, and explain why it works.

Everything below serves those two goals with as little wasted practice as possible.

## Who decides what: code versus the agent

| Code (the engine) | Agent (the tutor) |
| --- | --- |
| Curriculum, prerequisite and encompassing graphs | Answering questions about a lesson or a problem |
| Learner state, FSRS cards, event log | Hints, one step at a time |
| Pass or fail from objective signals | Explaining the wrong idea behind a miss |
| Choosing the next lesson and the next review | Extra exercises when the learner asks for practice |
| Credit flow (FIRe), penalties, unlocking | Grading open answers, per concept, against a rubric |

The app leads the course through the engine: it opens lessons and reviews and grades what the learner hands in. The tutor helps beside it and never chooses what comes next.

Rule of thumb: facts and arithmetic live in code; judgement lives in the agent. The agent's judgements enter the engine through tool parameters.

## Data model

### Curriculum (JSON in each course folder under `packages/starters/`, versioned in git)

- **Topics**: roadmap nodes with topic prerequisites. They order the path and group progress for display. They are not scheduled.
- **Concepts**: small skills. Each has prerequisite concepts (a DAG) and a list of **encompassings**: `{ id, w }` edges meaning "practising this concept also practises `w` of that one". Encompassings are set by hand, only on direct prerequisite edges, and default to 0. Prerequisites alone are not used for credit, because they give a lot of incorrect credit (Skycak).
- **Problems**: the NeetCode 150, each with one topic and one to three target concepts, plus a few extras for concepts the list has no fitting problem for.
- **Lessons**: one per concept. A lesson has a written text with a worked example, a small **guided problem**, and a **solo problem**: one problem from the list that needs only this concept and concepts taught before it. No two lessons share a solo problem. The problems that no lesson ends on are kept for reviews.
- **Lessons with several tasks**: a course whose tasks are short, such as jq, gives each step a few tasks in place of one. The rules below then read "every guided task" and "every solo task".

A curriculum is built once per subject, from a good source when one exists. It is not made up as the learner goes.

The curriculum is content, so it stays in JSON. Learner state stays in SQLite. They join on IDs. A startup check validates the curriculum (unknown IDs, cycles, weights outside 0-1, encompassings that are not prerequisites) and reports learner state that refers to IDs no longer in the curriculum. `aliases.json` maps renamed IDs so progress follows a rename.

### Learner state (SQLite)

Per concept:

| Stage     | Meaning                                                          |
| --------- | ---------------------------------------------------------------- |
| locked    | Some prerequisite is not passed yet (derived, not stored)        |
| available | All prerequisites passed, not taught yet (derived, not stored)   |
| learning  | Taught; not yet solved independently                             |
| passed    | Solved a problem independently at least once. FSRS starts here.  |
| mastered  | Passed, plus a later independent success on an unlabelled review |

Plus `fail_count` (learning-phase struggles since the last lesson) and the FSRS card.

Per attempt on a course's exercise: why it was opened (a lesson's guided exercise, its solo exercise, or a review), phase (learning or review), outcome, hint events (level 1-4), tests passed.

Per extra exercise from the tutor: its target concepts, how it is checked with the hidden answer, the learner's answer, and the result per concept.

## Exercises

An exercise is something to solve that gets checked. It targets one to three concepts: the ones it cannot be done without. Each exercise says how its answer is checked: by calling the learner's function, by running their command, by comparing a value they typed, and so on. A course calls its exercises "problems" or "tasks".

Where an exercise sits decides what its result means:

- **A solo or review exercise**, from the course. Solving one from its starting text, without help, is the strongest evidence, so only this passes a concept. The learner may try until it is right.
- **A guided exercise**, also from the course. It is solved with the lesson beside it, so it is teaching, not evidence. Solving a lesson's guided exercises marks the concept as taught.
- **An extra exercise**, written by the tutor when the learner asks for more practice: an example to read, predict the output, arrange the lines, or an open answer in the learner's own words. The engine builds it before the learner sees it, so the key cannot be wrong. The learner answers once: the first answer is the evidence.

## Grading

Each concept gets pass or fail. There are no middle grades.

- **A pass** needs a right answer with no hint beyond a guiding question (level 1). A stronger hint names the concept or the approach, which is the thing being tested.
- **All targets share the result.** Passing tests or a matched output cannot say which concept broke. So a failed exercise fails every target. This is why an exercise has at most three targets: with more, one weak concept would keep failing concepts the learner knows.
- **An open answer is the exception.** The tutor reads it and gives each concept its own pass or fail.
- **Opening the lesson** while solving its solo problem counts as a hint that names the concept, because the lesson shows the approach.
- The learner is not asked how sure they are. Confidence never changed a grade or a review date, and the extra step cost more than the signal was worth.
- A session that stopped for outside reasons is recorded as `paused`: no grade, and the attempt can be resumed or discarded.

## Phases

### Learning phase (concept is not passed yet)

A lesson has two steps, with support that fades from one to the next.

- **Step 1, with the lesson.** The learner reads the lesson and solves its guided problem with the lesson beside it. A worked example first, then a problem with support, is the order that works for new material. Solving the guided problem moves the concept to `learning`. It never touches FSRS. With several guided tasks, the concept moves when all of them are solved.
- **Step 2, alone.** The lesson closes and the learner solves the concept's solo problem. Recalling the idea without the text is what makes it last, and it shows honestly whether the lesson worked. With several solo tasks, the concept is learned when every one is solved alone; an unaided solve before the last one is recorded with no verdict.
- **Solved without help**: the concept becomes `passed`, its FSRS card is created and given a first Good review, and its dependents may unlock.
- **Solved with help** or **gave up**: the concept stays `learning`, `fail_count` goes up, and the solo problem waits a day. The lesson stays readable meanwhile.
- **Never stuck**: while a solo problem waits, the course moves on to the next open lesson (ALEKS-style switching to another frontier concept).

A lesson opens when every prerequisite of its concept is passed.

### Review phase (concept is `passed` or `mastered`)

Here a struggle is evidence of forgetting, so it is recorded. A pass is an FSRS Good review and a fail is Again.

- A concept is reviewed at most once a day. After a failed review the tutor teaches and retries with a new exercise, but that retry is practice only. Repeating an item on the same day adds little to long-term memory.
- A concept becomes `mastered` on a later unaided pass in a review. A review names nothing, so solving it without a hint means the learner chose the approach. A fail drops it back to `passed`.

## Fractional implicit repetition

After an explicit review of concept `c` with a passing grade, credit flows **down** the encompassing graph:

- The credit reaching concept `d` is the maximum, over paths from `c` to `d`, of the product of the edge weights. Propagation stops below 0.15.
- A concept that was reviewed explicitly in the same attempt gets no implicit credit.
- Implicit credit `x` updates `d`'s FSRS card as a partial Good review: the new stability is `S · (S_good / S)^x`, where `S_good` is the stability a full Good review would give. FSRS already gives smaller gains when recall is still high, which discounts early repetitions as FIRe requires.
- Credit at or above 0.9 counts as a full Good review.
- Without implicit credit, a concept the learner has just used inside a harder exercise would still come up for its own review. With many concepts these wasted reviews pile up.
- **Weak concepts get no implicit credit.** A concept with two or more lapses, or whose last explicit grade was Again, must be reviewed explicitly (Math Academy's "speed < 1" rule).

After a failed review (Again) of concept `c`, a penalty flows **up**: every passed concept that encompasses `c`, with path weight `x`, has its due date brought forward to `now + (due - now) · (1 - x)`. Its stability is unchanged.

Every review is logged with `implicit_credit` (null for explicit reviews) and the source concept, so implicit events can be excluded if FSRS parameters are ever optimised.

## Choosing the next task

Lessons and reviews are chosen apart. The learner picks which to do; the app shows how many reviews are due.

**The next lesson** is the first concept, in course order, that is not passed, whose prerequisites are all passed, and whose solo problem is not waiting after a struggle.

**The next review** uses repetition compression. Score every candidate problem (all its concepts passed, not attempted in the last day): `score = Σ over due concepts d of min(1, credit(problem → d)) · (1 + overdue_days / interval_days)`. A problem's credit to `d` is 1 if it is tagged with `d`, otherwise the best implicit credit from its tags. Problems the learner has not tried get a bonus, so a review is usually a new problem: the learner must recall the concept, not one answer. The best-scoring problem is served. A review always starts from the empty stub.

FSRS runs with `enable_short_term: false`, so no concept is scheduled again on the same day. Repeating an item several times in one day adds little to long-term memory.

## Interleaving and recognition

- **Learning phase:** blocked practice with labels. A lesson and its two problems are explicitly about one concept.
- **Review phase:** unlabelled. The review screen shows no lesson, no chapter and no lessons column, and the tutor never says which concept a review is from. Repetition compression already mixes topics.
- **Recognition** is trained by the reviews themselves: the learner sees a problem with nothing that names its pattern and must choose the approach. A hint that names it turns the review into a fail.
- Learners tend to feel interleaved practice is less productive than blocked practice, even when it works better (Kornell & Bjork 2008).

## Out of scope for now

- Mixing confusable concepts on purpose (for example sliding window versus two pointers).
- Problem variants to fight memorisation of the problems.
- A short review that asks only for the approach, with no code.
- Learned models (BKT, PFA) once there is enough data.
- A placement test across the whole curriculum.

## Sources

- Skycak, _Individualized Spaced Repetition in Hierarchical Knowledge Structures_: https://justinmath.com/individualized-spaced-repetition-in-hierarchical-knowledge-structures/
- Skycak, _The Math Academy Way_ (working draft): https://www.justinmath.com/files/the-math-academy-way.pdf
- Math Academy, _How our AI works_: https://www.mathacademy.com/how-our-ai-works
- ALEKS, learned versus mastered topics: https://www.mheducation.com/support/aleks-support-center/knowledge/aleks-what-is-the-difference-between-mastered-and-learned-topics.html
- Khan Academy mastery levels: https://support.khanacademy.org/hc/en-us/articles/5548760867853
- Koedinger et al. 2011, conjunctive knowledge tracing: https://digitalcommons.memphis.edu/facpubs/7461
- Guskey, _Lessons of Mastery Learning_: https://www.ascd.org/el/articles/lessons-of-mastery-learning
- Rohrer et al., interleaved mathematics practice: https://ies.ed.gov/use-work/awards/interleaved-mathematics-practice
- Brunmair & Richter 2019, interleaving meta-analysis: https://www.psychologie.uni-wuerzburg.de/fileadmin/06020400/2019/Brunmair_Richter_in_press__2019_META-ANALYSIS_OF_INTERLEAVED_LEARNING.pdf
- Anki deck options (relearning steps): https://docs.ankiweb.net/deck-options.html
- FSRS algorithm: https://github.com/open-spaced-repetition/awesome-fsrs/wiki/The-Algorithm
- LearnHarness, for probing before teaching, confidence with each answer, the hint ladder and committing the answer before posing a question (AGPL, ideas only): https://github.com/amosblomqvist/learnharness
- Prior art: mnemo (Blind 75 with FIRe, no licence, ideas only): https://github.com/hectorrbv/mnemo; Trane reward propagator (AGPL, ideas only): https://github.com/trane-project/trane/blob/HEAD/src/scheduler/reward_propagator.rs
