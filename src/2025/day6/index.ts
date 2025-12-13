import * as path from "path";
import { fileURLToPath } from "url";
import { processInputFile, timeExecution } from "../utils/index.js";

interface Context {
  operations: Operation[];
  matrix: string[][];
}

const operators = ["*", "+"];
type Operator = (typeof operators)[number];
type Operation = Partial<Record<Operator, number[]>>;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const inputFile = path.join(__dirname, "input.txt");
const operands: number[][] = [];
let initialised = false;
const buildOperations = (line: string, context: Context) => {
  const values = line.trim().split(/\s+/);
  let operandIndex = 0;

  for (const [index, value] of values.entries()) {
    if (!initialised) {
      operands.push([Number(value)]);
    } else if (isValidOperator(value)) {
      context.operations.push({
        [value as Operator]: operands[operandIndex++]!,
      });
    } else {
      operands[index]!.push(Number(value));
    }
  }

  if (!initialised) {
    initialised = true;
  }
};
const buildMatrix = (line: string, context: Context) => {
  const values = line.split("");

  context.matrix.push(values);
};
const isValidOperator = (operator: string): operator is Operator =>
  operators.includes(operator as Operator);
const buildOperations2 = (context: Context) => {
  const operators = context.matrix
    .splice(context.matrix.length - 1, 1)[0]!
    .filter((value) => value !== " ")
    .reverse();
  const numCols = context.matrix[0]!.length;
  const numRows = context.matrix.length;
  let operationIndex = 0;
  let operandIndex = 0;
  let operationAccumulator = 0;
  let operator: Operator | null = null;
  let total = 0;

  for (let index = 0; index < numCols; index++) {
    let operand = 0;

    for (let rowIndex = 0; rowIndex < numRows; rowIndex++) {
      const char = context.matrix[rowIndex]![numCols - 1 - index]!;

      if (char !== " ") {
        operand = operand * 10 + Number(char);
      }
    }

    if (operand > 0) {
      if (operandIndex === 0) {
        operator = operators[operationIndex]!;
        operationAccumulator = operand;
      } else {
        if (operator === "*") {
          operationAccumulator *= operand;
        } else {
          operationAccumulator += operand;
        }
      }

      operandIndex++;
    } else {
      operandIndex = 0;
    }

    if (operandIndex === 0 || index === numCols - 1) {
      total += operationAccumulator;
      operationAccumulator = 0;
      operator = null;
      operationIndex++;
    }
  }

  console.log(`Result 2: ${total}`);
};
const applyOperations = (context: Context) => {
  const result = context.operations.reduce((acc, operation) => {
    const key: Operator = Object.keys(operation)[0]! as Operator;

    return (
      acc +
      (key === "*"
        ? operation[key]!.reduce((acc, operand) => acc * operand, 1)
        : operation[key]!.reduce((acc, operand) => acc + operand, 0))
    );
  }, 0);

  console.log(`Result: ${result}`);
};

processInputFile(
  inputFile,
  (line: string, context: Context) => {
    buildOperations(line, context);
    buildMatrix(line, context);
  },
  (context: Context) => {
    const context2: Context = {
      operations: [],
      matrix: [...context.matrix],
    };
    applyOperations(context);
    buildOperations2(context2);
  },
  {
    operations: [] as Operation[],
    matrix: [] as string[][],
  },
);
