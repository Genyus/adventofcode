import * as path from "path";
import { fileURLToPath } from "url";
import { processInputFile } from "../utils/index.js";

interface Context {
  ranges: Range[];
  ingredients: number[];
}

type Range = [min: number, max: number];

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const inputFile = path.join(__dirname, "input.txt");
let processingRanges = true;
/**
 * Sorts the range and ingredient arrays
 * @param context - the context object
 */
const sortArrays = (context: Context) => {
  context.ranges.sort((a, b) => a[0] - b[0]);
  context.ingredients.sort((a, b) => a - b);
};
/**
 * Merges overlapping ranges
 * @param context - the context object
 */
const mergeRanges = (context: Context) => {
  for (
    let currentIndex = 0, nextIndex = 1;
    currentIndex < context.ranges.length - 1;
    currentIndex++, nextIndex++
  ) {
    const currentRange = context.ranges[currentIndex]!;
    const nextRange = context.ranges[nextIndex]!;

    if (nextRange[0] <= currentRange[1] + 1) {
      context.ranges[currentIndex]! = [
        currentRange[0],
        Math.max(currentRange[1], nextRange[1]),
      ];
      context.ranges.splice(nextIndex, 1);
      currentIndex--;
      nextIndex--;
    }
  }
};
const countFreshIngredients = (context: Context) => {
  let rangeIndex = 0;
  let count = 0;

  for (let i = 0; i < context.ingredients.length; i++) {
    const ingredient = context.ingredients[i]!;

    while (
      rangeIndex < context.ranges.length &&
      context.ranges[rangeIndex]![1] < ingredient
    ) {
      rangeIndex++;
    }

    if (
      rangeIndex < context.ranges.length &&
      context.ranges[rangeIndex]![0] <= ingredient
    ) {
      count++;
    }
  }

  return count;
};
const countAllFreshIngredientIds = (context: Context) => {
  return context.ranges.reduce(
    (acc, range) => acc + (range[1] - range[0] + 1),
    0,
  );
};
/**
 * Parses a range string into a tuple, e.g. "10-20" => [10, 20]
 * @param rangeStr - a string representing a range
 * @returns a tuple holding the minimum and maximum values of the range
 */
const parseRange = (rangeStr: string): Range =>
  rangeStr.split("-").map((x) => Number(x)) as Range;

processInputFile(
  inputFile,
  (line, context: Context) => {
    if (line.trim() === "") processingRanges = false;
    else if (processingRanges) {
      context.ranges.push(parseRange(line));
    } else {
      context.ingredients.push(Number(line));
    }
  },
  (context: Context) => {
    sortArrays(context);
    mergeRanges(context);

    const result1 = countFreshIngredients(context);
    const result2 = countAllFreshIngredientIds(context);

    console.log(`Result 1: ${result1}`);
    console.log(`Result 2: ${result2}`);
  },
  {
    ranges: [],
    ingredients: [],
  },
);
