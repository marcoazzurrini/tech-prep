export function readCount(text) {
  try {
    const data = JSON.parse(text);

    if (data.count < 0) {
      throw new RangeError("count is negative");
    }

    return data.count;
  } catch (error) {
    if (error instanceof SyntaxError) {
      return null;
    }

    throw error;
  }
}
