import * as path from "path";
import { fileURLToPath } from "url";
import { processInputFile } from "../utils/io.js";

interface Context {
  grid: string[][];
  rolls: number;
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
  context.rolls = context.grid.reduce((acc, row, rowIndex) => {
    return (
      acc +
      row.reduce((acc: number, cell: string, cellIndex: number) => {
        return acc + (isAccessible(rowIndex, cellIndex, context.grid) ? 1 : 0);
      }, 0)
    );
  }, 0);
  console.log(`Accessible Rolls: ${context.rolls}`);
};

processInputFile(
  inputFile,
  (line, context) => {
    context.grid.push(line.split(""));
  },
  (context) => {
    calculateRolls(context);
  },
  { grid: [] as string[][], rolls: 0 },
);
