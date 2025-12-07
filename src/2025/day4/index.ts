import * as path from "path";
import { fileURLToPath } from "url";
import { processInputFile } from "../utils/io.js";

interface Location {
  row: number;
  cell: number;
}
interface Context {
  grid: string[][];
  rolls: number;
  locations: Set<Location>;
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const inputFile = path.join(__dirname, "input.txt");
const getNeighbouringRolls = (
  rowIndex: number,
  cellIndex: number,
  grid: string[][],
) => {
  let count = 0;

  for (let i = -1; i <= 1; i++) {
    for (let j = -1; j <= 1; j++) {
      if (i === 0 && j === 0) continue;

      const neighbouringRowIndex = rowIndex + i;
      const neighbouringCellIndex = cellIndex + j;

      if (
        neighbouringRowIndex < 0 ||
        neighbouringRowIndex >= grid.length ||
        neighbouringCellIndex < 0 ||
        neighbouringCellIndex >= grid[neighbouringRowIndex]!.length
      )
        continue;

      if (grid[neighbouringRowIndex]![neighbouringCellIndex]! === "@") count++;
    }
  }

  return count;
};
const isAccessible = (rowIndex: number, cellIndex: number, grid: string[][]) =>
  grid[rowIndex]![cellIndex]! === "@" &&
  getNeighbouringRolls(rowIndex, cellIndex, grid) < 4;
const calculateRolls = (context: Context) => {
  for (const location of context.locations) {
    if (isAccessible(location.row, location.cell, context.grid)) {
      context.rolls++;
    }
  }
  console.log(`Accessible Rolls: ${context.rolls}`);
};
const calculateRemovedRolls = (context: Context) => {
  let removedRolls: number;

  do {
    removedRolls = 0;

    for (const location of context.locations) {
      if (isAccessible(location.row, location.cell, context.grid)) {
        removedRolls++;
        context.grid[location.row]![location.cell]! = ".";
        context.locations.delete(location);
      }
    }

    context.rolls += removedRolls;
  } while (removedRolls > 0);

  console.log(`Removed Rolls: ${context.rolls}`);
};

processInputFile(
  inputFile,
  (line, context) => {
    const row = line.split("");

    context.grid.push(row);
    row.forEach((cell, cellIndex) => {
      if (cell === "@") {
        context.locations.add({
          row: context.grid.length - 1,
          cell: cellIndex,
        });
      }
    });
  },
  (context) => {
    const context2 = { ...context };

    calculateRolls(context);
    calculateRemovedRolls(context2);
  },
  { grid: [] as string[][], rolls: 0, locations: new Set<Location>() },
);
