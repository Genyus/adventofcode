import * as fs from "fs";
import * as readline from "readline";

/**
 * Processes an input file. Calls the line handler for each line and the close handler when the file is closed
 * @param {string} inputFile - the input file
 * @param {function} lineHandler - the line handler function
 * @param {function} closeHandler - the close handler function
 * @param {T} context - the context object
 * @returns {void}
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
