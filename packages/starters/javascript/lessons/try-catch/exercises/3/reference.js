function averageRating(ratings) {
  if (ratings.length === 0) {
    throw new Error("no ratings");
  }

  let sum = 0;

  for (const rating of ratings) {
    sum += rating.stars;
  }

  return sum / ratings.length;
}

export function ratingLabel(ratings) {
  try {
    return averageRating(ratings).toFixed(1);
  } catch (error) {
    if (error.message === "no ratings") {
      return "not rated";
    }

    throw error;
  }
}
