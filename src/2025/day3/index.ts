import * as path from "path";
import { fileURLToPath } from "url";
import { processInputFile } from "../utils/io.js";

interface Context {
  totalJoltage: number;
  requiredBatteries: number;
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const inputFile = path.join(__dirname, "input.txt");

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

/**
 * Gets the total joltage for the given array of batteries
 * @param {number[]} arr - the array of batteries
 * @returns {number} the joltage
 */
const getJolts = (arr: number[]): number => {
  return Number(`${arr.join("")}`);
};
/**
 * Updates the active batteries by appending a new battery if it is valid.
 * Preserves the array length by removing the lowest joltage battery
 * @param {number} newBattery - the new battery to append
 * @param {number[]} activeBatteries - the current active batteries
 * @returns {number[]} the updated batteries
 */
const updateActiveBatteries = (
  newBattery: number,
  activeBatteries: number[],
): number[] => {
  const updatedBatteries = [...activeBatteries];
  const index = updatedBatteries.findIndex(
    (battery, index) => battery < updatedBatteries[index + 1]!,
  );

  if (index >= 0) {
    updatedBatteries.splice(index, 1);
    updatedBatteries.push(newBattery);
  } else if (updatedBatteries[updatedBatteries.length - 1]! < newBattery) {
    updatedBatteries.splice(updatedBatteries.length - 1, 1, newBattery);
  }

  return updatedBatteries;
};
/**
 * Gets the total joltage for the active batteries in the given bank
 * @param {number[]} bank - the bank of batteries
 * @param {number} requiredBatteries - the number of required active batteries
 * @returns {number} the total joltage
 */
const getBankJoltage = (bank: number[], requiredBatteries: number): number => {
  let activeBatteries = Array.from(bank.slice(0, requiredBatteries));
  let maxJolts = getJolts(activeBatteries);
  let currentBatteries: number[] = [];
  let currentJolts = 0;

  for (let next = requiredBatteries; next < bank.length; next++) {
    currentBatteries = updateActiveBatteries(bank[next]!, activeBatteries);
    currentJolts = getJolts(currentBatteries);

    if (currentJolts > maxJolts) {
      activeBatteries = currentBatteries;
      maxJolts = currentJolts;
    }
  }

  return maxJolts;
};
const displayCompletionMessage = (context: Context) => {
  console.log(`Total Joltage: ${context.totalJoltage}`);
};
