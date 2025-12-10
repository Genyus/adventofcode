import * as path from "path";
import { fileURLToPath } from "url";
import { processInputFile } from "../utils/index.js";

interface Context {
  totalJoltage: number;
  requiredBatteries: number;
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const inputFile = path.join(__dirname, "input.txt");
const getBankJoltage = (bank: number[], requiredBatteries: number): number => {
  const maxRemovals = bank.length - requiredBatteries;
  const stack: number[] = [];
  let removed = 0;

  for (const battery of bank) {
    while (
      stack.length > 0 &&
      stack[stack.length - 1]! < battery &&
      removed < maxRemovals
    ) {
      stack.pop();
      removed++;
    }

    stack.push(battery);
  }

  return Number(stack.slice(0, requiredBatteries).join(""));
};
const displayCompletionMessage = (context: Context) => {
  console.log(`Total Joltage: ${context.totalJoltage}`);
};

processInputFile(
  inputFile,
  (line, context) => {
    context.totalJoltage += getBankJoltage(
      line.split("").map(Number),
      context.requiredBatteries,
    );
  },
  (context) => {
    displayCompletionMessage(context);
  },
  { totalJoltage: 0, requiredBatteries: 2 },
);

processInputFile(
  inputFile,
  (line, context) => {
    context.totalJoltage += getBankJoltage(
      line.split("").map(Number),
      context.requiredBatteries,
    );
  },
  (context) => {
    displayCompletionMessage(context);
  },
  { totalJoltage: 0, requiredBatteries: 12 },
);
