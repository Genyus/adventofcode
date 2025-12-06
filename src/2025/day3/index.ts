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
const getBankJoltage = (bank: number[]): number => {
  let maxJolts = 0;
  let currentJolts = 0;
  let left = 0;
  let nextLeft = 0;

  for (let right = 1; right < bank.length; right++) {
    currentJolts = getJolts(bank[left]!, bank[right]!);

    if (bank[right - 1]! > bank[left]!) {
      nextLeft = right - 1;
    }

    if (left !== nextLeft) {
      left = nextLeft;
      currentJolts = getJolts(bank[left]!, bank[right]!);
    }

    maxJolts = Math.max(maxJolts, currentJolts);
  }

  return maxJolts;
};
