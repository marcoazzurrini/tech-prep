const MAX_SCORE = 100;

const bands = [
  [90, "A"],
  [75, "B"],
  [50, "C"],
  [0, "F"],
];

function grade(score) {
  if (score < 0 || score > MAX_SCORE) {
    return "invalid";
  }

  return bands.find(([from]) => score >= from)[1];
}

export { MAX_SCORE, grade };
