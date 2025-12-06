import * as path from "path";
import { fileURLToPath } from "url";
import { processInputFile } from "../utils/io.js";

interface Context {
  maxJoltage: number;
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const inputFile = path.join(__dirname, "input.txt");
const context: Context = { maxJoltage: 0 };

processInputFile(
  inputFile,
  (line, context) => {
    context.maxJoltage += getBankJoltage(line.split("").map(Number));
  },
  (context) => {
    console.log(`Max Joltage: ${context.maxJoltage}`);
  },
  context,
);
const getJolts = (left: number, right: number): number => {
  return Number(`${left}${right}`);
};
const getBankJoltage = (arr: number[]): number => {
  let maxJolts = 0;
  let windowJolts = 0;
  let left = 0;

  for (let right = 1; right < arr.length; right++) {
    windowJolts = getJolts(arr[left]!, arr[right]!);

    for (let i = left + 1; i < right; i++) {
      const currentJolts = getJolts(arr[i]!, arr[right]!);

      if (currentJolts > windowJolts) {
        windowJolts = currentJolts;
        left = i;
      }
    }

    maxJolts = Math.max(maxJolts, windowJolts);
  }

  return maxJolts;
};
