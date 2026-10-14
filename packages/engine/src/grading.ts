// Per-concept grading of a finished attempt. Objective signals set the grade; the tutor's
// judgements (diagnosis, explanation, recognition) and the learner's self-rating can only
// lower it. See docs/learning-model.md, "Review phase".

import { Rating } from "ts-fsrs";
import type { Grade } from "ts-fsrs";

import type { Difficulty } from "./content.ts";
import type { HintRow, Recognition } from "./db.ts";

/** Minutes a confident solve should take; beating it (with no hints) can earn Easy. */
const TARGET_MINUTES: Record<Difficulty, number> = {
  easy: 15,
  hard: 40,
  medium: 25,
};

/** The tutor's view of how the learner handled one concept. */
export type Verdict = "ok" | "struggled" | "failed";

export interface AttemptEvidence {
  concepts: string[];
  solved: boolean;
  gaveUp: boolean;
  hints: HintRow[];
  explanationScore: number;
  recognition: Recognition;
  minutes: number;
  difficulty: Difficulty;
  /** Verdicts per concept from the tutor's code review; missing concepts count as "ok". */
  diagnosis: Map<string, Verdict>;
  selfRating?: Grade;
}

export interface ConceptGrade {
  concept: string;
  grade: Grade;
  /** True when the learner handled this concept without real help: used to pass a concept in learning. */
  independent: boolean;
  reasons: string[];
}

/** Highest hint level about this concept. Hints not tied to a concept count for every concept. */
function hintLevel(hints: HintRow[], concept: string): number {
  return Math.max(
    0,
    ...hints
      .filter((h) => h.concept_id === concept || h.concept_id === null)
      .map((h) => h.level)
  );
}

/**
 * When the learner gave up, blame is conjunctive: only the concepts that caused it get Again.
 * The tutor's "failed" verdicts name them; without a diagnosis, the concepts with the
 * strongest hints take the blame, and with no hints at all, every concept does.
 */
function culprits(e: AttemptEvidence): Set<string> {
  const named = e.concepts.filter((c) => e.diagnosis.get(c) === "failed");

  if (named.length) {
    return new Set(named);
  }
  const levels = e.concepts.map((c) => hintLevel(e.hints, c));
  const top = Math.max(...levels);

  return new Set(
    top > 0 ? e.concepts.filter((_, i) => levels[i] === top) : e.concepts
  );
}

const cap = (grade: Grade, limit: Grade): Grade =>
  Math.min(grade, limit) as Grade;

export function gradeAttempt(e: AttemptEvidence): ConceptGrade[] {
  const failed = e.gaveUp || !e.solved;
  const blamed = failed ? culprits(e) : new Set<string>();
  const anyHints = e.hints.length > 0;

  return e.concepts.map((concept) => {
    const reasons: string[] = [];
    const level = hintLevel(e.hints, concept);
    const verdict = e.diagnosis.get(concept) ?? "ok";
    let grade: Grade = Rating.Good;

    if (failed) {
      if (blamed.has(concept)) {
        grade = Rating.Again;
        reasons.push(
          e.gaveUp
            ? "gave up on this part"
            : "tests did not pass because of this part"
        );
      } else {
        grade = Rating.Hard;
        reasons.push("handled this part, but the problem was not finished");
      }
    } else {
      if (level >= 3) {
        grade = Rating.Again;
        reasons.push(`needed a level ${level} hint on it`);
      } else if (level >= 1) {
        grade = Rating.Hard;
        reasons.push(`needed a level ${level} hint on it`);
      }

      if (verdict === "failed") {
        grade = Rating.Again;
        reasons.push("the tutor's review found this part wrong");
      } else if (verdict === "struggled") {
        grade = cap(grade, Rating.Hard);
        reasons.push("the tutor's review found a struggle here");
      }
    }

    if (e.recognition === "wrong") {
      grade = cap(grade, Rating.Hard);
      reasons.push("named the wrong pattern first");
    }

    if (e.explanationScore <= 1) {
      grade = cap(grade, Rating.Hard);
      reasons.push("the explanation was weak");
    }

    if (
      grade === Rating.Good &&
      !anyHints &&
      e.explanationScore >= 3 &&
      e.recognition !== "wrong" &&
      e.recognition !== "partial" &&
      e.minutes <= TARGET_MINUTES[e.difficulty]
    ) {
      grade = Rating.Easy;
      reasons.push("fast, no hints, strong explanation");
    }

    if (e.selfRating && e.selfRating < grade) {
      grade = e.selfRating;
      reasons.push("lowered by your self-rating");
    }

    if (!reasons.length) {
      reasons.push("solved it on your own");
    }

    const independent = !failed && level <= 1 && verdict === "ok";

    return { concept, grade, independent, reasons };
  });
}
