import * as path from "path";
import { fileURLToPath } from "url";
import { processInputFile } from "../utils/index.js";

interface Context {
  grid: number[];
  width: number;
  height: number;
  rolls: number;
  locations: Set<number>;
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const inputFile = path.join(__dirname, "input.txt");
const MAX_NEIGHBOURING_ROLLS = 4;
const ROLL = 1;
const EMPTY = 0;

const iterateNeighbours = (
  index: number,
  width: number,
  height: number,
  callback: (neighbourIndex: number) => void | boolean,
) => {
  const row = Math.floor(index / width);
  const col = index % width;

  for (let i = -1; i <= 1; i++) {
    for (let j = -1; j <= 1; j++) {
      if (i === 0 && j === 0) continue;

      const neighbouringRow = row + i;
      const neighbouringCol = col + j;

      if (
        neighbouringRow < 0 ||
        neighbouringRow >= height ||
        neighbouringCol < 0 ||
        neighbouringCol >= width
      )
        continue;

      const neighbourIndex = neighbouringRow * width + neighbouringCol;

      if (callback(neighbourIndex) === false) return;
    }
  }
};

const getNeighbouringRolls = (
  index: number,
  grid: number[],
  width: number,
  height: number,
) => {
  let count = 0;

  iterateNeighbours(index, width, height, (neighbourIndex) => {
    if (grid[neighbourIndex] === ROLL) count++;
    if (count === MAX_NEIGHBOURING_ROLLS) return false;
  });

  return count;
};

const isAccessible = (index: number, { grid, width, height }: Context) =>
  grid[index] === ROLL &&
  getNeighbouringRolls(index, grid, width, height) < MAX_NEIGHBOURING_ROLLS;

const calculateRolls = (context: Context) => {
  for (const location of context.locations) {
    if (isAccessible(location, context)) {
      context.rolls++;
    }
  }
  console.log(`Accessible Rolls: ${context.rolls}`);
};

const calculateRemovedRolls = (context: Context) => {
  const stack: number[] = [];
  const { grid, width, height } = context;

  for (const location of context.locations) {
    if (isAccessible(location, context)) {
      stack.push(location);
    }
  }

  while (stack.length > 0) {
    const index = stack.pop()!;

    if (grid[index] !== ROLL) continue;

    context.rolls++;
    grid[index] = EMPTY;
    context.locations.delete(index);

    iterateNeighbours(index, width, height, (neighbourIndex) => {
      if (
        grid[neighbourIndex] === ROLL &&
        isAccessible(neighbourIndex, context)
      ) {
        stack.push(neighbourIndex);
      }
    });
  }

  console.log(`Removed Rolls: ${context.rolls}`);
};

processInputFile(
  inputFile,
  (line, context: Context) => {
    if (context.width === 0) context.width = line.length;

    const chars = line.split("");

    for (let i = 0; i < chars.length; i++) {
      const val = chars[i] === "@" ? ROLL : EMPTY;

      context.grid.push(val);

      if (val === ROLL) {
        context.locations.add(context.grid.length - 1);
      }
    }

    context.height++;
  },
  (context: Context) => {
    const context2: Context = {
      ...context,
      grid: [...context.grid],
      locations: new Set(context.locations),
    };

    calculateRolls(context);
    calculateRemovedRolls(context2);
  },
  {
    grid: [] as number[],
    width: 0,
    height: 0,
    rolls: 0,
    locations: new Set<number>(),
  },
);
