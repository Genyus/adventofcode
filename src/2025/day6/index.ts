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
  let operands: number[][] = Array.from({ length: numRows + 1 }, () => []);
  let operationIndex = 0;
  let operandIndex = 0;
  let total = 0;
  for (let index = 0; index < numCols; index++) {
    let digits = [];

    for (let rowIndex = 0; rowIndex < numRows; rowIndex++) {
      const row = context.matrix[rowIndex]!;

      digits.push(row[numCols - 1 - index]!);
    }

    const operand = digits.join("").trim();
    if (operand !== "") {
      operands[operationIndex]!.push(Number(operand));
      operandIndex++;
    } else {
      operandIndex = 0;
    }

    if (operandIndex === numRows) {
      const operator = operators[operationIndex]!;

      total +=
        operator === "*"
          ? operands[operationIndex]!.reduce((acc, operand) => acc * operand, 1)
          : operands[operationIndex]!.reduce(
              (acc, operand) => acc + operand,
              0,
            );
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
