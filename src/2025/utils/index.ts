import * as fs from "fs";
import * as readline from "readline";

/**
 * Processes an input file. Calls the line handler for each line and the close handler when the file is closed
 * @param {string} inputFile - the input file
 * @param {function} lineHandler - the line handler function
 * @param {function} closeHandler - the close handler function
 * @param {T} context - the context object
 * @returns {void}
 * @example
 * processInputFile("input.txt", (line, context) => {
 *   context.count++;
 *   console.log(line);
 * }, (context) => {
 *   console.log(`Processed ${context.count} lines`);
 * }, { count: 0 });
 */
export const processInputFile = <T>(
  inputFile: string,
  lineHandler: (line: string, context: T) => void,
  closeHandler: (context: T) => void,
  context: T,
): void => {
  try {
    const fileStream = fs.createReadStream(inputFile);
    const rl = readline.createInterface({
      input: fileStream,
      crlfDelay: Infinity,
    });

    rl.on("line", (line: string) => lineHandler(line, context));
    rl.on("close", () => {
      closeHandler(context);
    });
  } catch (err) {
    console.log(`Unable to read ${inputFile}`);
  }
};

/**
 * Times the execution of a callback
 * @param callback - the callback function to execute
 * @param context - the context object to pass to the callback function
 * @param iterations - the number of iterations to run (default: 100)
 * @param label - the label to use for the execution (optional)
 * @returns {void}
 */
/**
 * @example
 * const context = { count: 0 };
 * timeExecution(() => {
 *   testFunction(context);
 * }, context, 100, "testFunction");
 */
export const timeExecution = <T>(
  callback: (context: T) => void,
  context: T,
  iterations: number = 100,
  label: string = "",
): void => {
  const startHr = process.hrtime();

  for (let i = 0; i < iterations; i++) {
    callback(context);
  }

  const endHr = process.hrtime(startHr);
  const elapsedMs = endHr[0] * 1000 + endHr[1] / 1000000;

  console.log(
    `Executed ${iterations} iterations${
      label ? ` of ${label}` : ""
    }. Total time: ${elapsedMs.toFixed(4)} ms. Average per iteration: ${(
      elapsedMs / iterations
    ).toFixed(4)} ms.`,
  );
};
