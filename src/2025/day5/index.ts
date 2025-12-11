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
const isInRange = (range: Range, value: number): boolean => {
  return value >= range[0] && value <= range[1];
};
const binarySearch = (ranges: Range[], value: number): number => {
  let left = 0;
  let right = ranges.length - 1;

  while (left <= right) {
    const mid = Math.floor((left + right) / 2);

    if (isInRange(ranges[mid]!, value)) return mid;

    if (ranges[mid]![0] < value) left = mid + 1;
    else right = mid - 1;
  }

  return -1;
};
const sortArrays = (context: Context) => {
  context.ranges.sort((a, b) => a[0] - b[0]);
  context.ingredients.sort((a, b) => a - b);
};
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
const getFreshIngredients = (context: Context) => {
  let rangeIndex = 0;

  return context.ingredients.reduce((acc, ingredient) => {
    while (
      rangeIndex < context.ranges.length &&
      context.ranges[rangeIndex]![1] < ingredient
    ) {
      rangeIndex++;
    }

    return (
      acc +
      (rangeIndex < context.ranges.length &&
      context.ranges[rangeIndex]![0] <= ingredient
        ? 1
        : 0)
    );
  }, 0);
};
const getAllFreshIngredients = (context: Context) => {
  return context.ranges.reduce(
    (acc, range) => acc + (range[1] - range[0] + 1),
    0,
  );
};
const getRange = (range: string): Range =>
  range.split("-").map((x) => Number(x)) as Range;

processInputFile(
  inputFile,
  (line, context: Context) => {
    if (line.trim() === "") processingRanges = false;
    else if (processingRanges) {
      context.ranges.push(getRange(line));
    } else {
      context.ingredients.push(Number(line));
    }
  },
  (context: Context) => {
    sortArrays(context);
    mergeRanges(context);

    const result1 = getFreshIngredients(context);
    const result2 = getAllFreshIngredients(context);

    console.log(`Result 1: ${result1}`);
    console.log(`Result 2: ${result2}`);
  },
  {
    ranges: [],
    ingredients: [],
  },
);
