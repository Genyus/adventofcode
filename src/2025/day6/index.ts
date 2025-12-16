import * as path from "path";
import { fileURLToPath } from "url";
import { processInputFile, timeExecution } from "../utils/index.js";

type Axis = "x" | "y";

interface Context {
  matrix: string[][];
  axis?: Axis;
}

const operators = ["*", "+"];
type Operator = (typeof operators)[number];

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const inputFile = path.join(__dirname, "input.txt");

const buildMatrix = (line: string, context: Context) => {
  const values = line.split("");

  context.matrix.push(values);
};
const isValidOperator = (operator: string): operator is Operator =>
  operators.includes(operator as Operator);
const calculateTotal = (context: Context): number => {
  const axis = context.axis!;
  const operatorRow = context.matrix.splice(context.matrix.length - 1, 1)[0]!;
  const operatorPositions: Array<{ index: number; operator: Operator }> = [];
  const maxColumns = context.matrix[0]!.length;
  const maxRows = context.matrix.length;
  let total = 0;

  for (let i = 0; i < operatorRow.length; i++) {
    if (isValidOperator(operatorRow[i]!)) {
      operatorPositions.push({
        index: i,
        operator: operatorRow[i] as Operator,
      });
    }
  }

  const operations = operatorPositions.map((op, i) => ({
    start: op.index,
    end:
      i < operatorPositions.length - 1
        ? operatorPositions[i + 1]!.index - 1
        : maxColumns - 1,
    operator: op.operator,
  }));

  for (const operation of operations) {
    const { start, end, operator } = operation;
    const outer = axis === "x" ? maxRows : end - start + 1;
    const inner = axis === "x" ? end - start + 1 : maxRows;
    let subtotal = operator === "*" ? 1 : 0;

    for (let i = 0; i < outer; i++) {
      let num = 0;

      for (let j = 0; j < inner; j++) {
        const row = axis === "x" ? i : j;
        const col = axis === "x" ? start + j : start + i;
        const char = context.matrix[row]![col]!;

        if (char !== " ") {
          num = num * 10 + Number(char);
        }
      }

      if (num > 0) {
        subtotal = operator === "*" ? subtotal * num : subtotal + num;
      }
    }

    total += subtotal;
  }

  return total;
};

processInputFile(
  inputFile,
  (line: string, context: Context) => {
    buildMatrix(line, context);
  },
  (context: Context) => {
    const matrix = [...context.matrix];
    const context1: Context = {
      ...context,
      matrix: [...matrix],
      axis: "x",
    };
    const context2: Context = {
      ...context,
      matrix: [...matrix],
      axis: "y",
    };
    const result1 = calculateTotal(context1);
    const result2 = calculateTotal(context2);
    console.log(`Part 1: ${result1}`);
    console.log(`Part 2: ${result2}`);
  },
  {
    matrix: [] as string[][],
  },
);
