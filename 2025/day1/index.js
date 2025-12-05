const fs = require("fs");
const readline = require("readline");
const path = require("path");

const inputFile = path.join(__dirname, "input.txt");
/**
 * Parses a line and returns the direction and the final position
 * @param {number} current - the current position
 * @param {string} line - a string containing the direction (i.e. "L" or "R") and the number of steps (e.g. "L10" or "R5")
 * @returns {Object} { direction: string, finalPosition: number }
 * @example
 * parseLine(50, "L10") // { direction: "L", finalPosition: 40 }
 * parseLine(50, "R5") // { direction: "R", finalPosition: 55 }
 */
const parseLine = (current, line) => {
  const direction = line.substring(0, 1);
  const steps = parseInt(line.substring(1));
  const finalPosition = current + steps * (direction === "L" ? -1 : 1);

  return {
    direction,
    finalPosition,
  };
};
/**
 * Gets the next position after parsing a line
 * @param {number} current - the current position
 * @param {string} line - a string containing the direction (i.e. "L" or "R") and the number of steps (e.g. "L10" or "R5")
 * @returns {number} the next position, normalised to a positive integer between 0 and 99
 * @example
 * getNext(50, "L10") // 40
 * getNext(50, "R5") // 55
 */
const getNext = (current, line) => {
  const { finalPosition } = parseLine(current, line);

  return ((finalPosition % 100) + 100) % 100;
};
/**
 * Updates the password based on the line and the current position
 * @param {Object} context - the context object
 * @param {number} context.current - the current position
 * @param {number} context.password - the password
 * @param {string} line - a string containing the direction (i.e. "L" or "R") and the number of steps (e.g. "L10" or "R5")
 * @returns {void}
 */
const updatePassword = (context, line) => {
  const current = context.current;
  const { direction, finalPosition } = parseLine(current, line);

  if (direction === "L") {
    context.password +=
      Math.floor((current - 1) / 100) - Math.floor((finalPosition - 1) / 100);
  } else {
    context.password += Math.floor(finalPosition / 100);
  }
};
/**
 * Part 1 line handler
 * @param {Object} context - the context object
 * @param {number} context.current - the current position
 * @param {number} context.password - the password
 * @param {string} line - a string containing the direction (i.e. "L" or "R") and the number of steps (e.g. "L10" or "R5")
 * @returns {void}
 */
const part1handler = (context, line) => {
  context.current = getNext(context.current, line);

  if (context.current === 0) {
    context.password++;
  }
};
/**
 * Part 2 line handler
 * @param {Object} context - the context object
 * @param {number} context.current - the current position
 * @param {number} context.password - the password
 * @param {string} line - a string containing the direction (i.e. "L" or "R") and the number of steps (e.g. "L10" or "R5")
 * @returns {void}
 */
const part2handler = (context, line) => {
  updatePassword(context, line);
  context.current = getNext(context.current, line);
};
/**
 * Gets the password from the input file
 * @param {string} inputFile - the input file
 * @param {function} handler - the handler function
 * @returns {void}
 */
const getPassword = (inputFile, handler) => {
  try {
    const fileStream = fs.createReadStream(inputFile);
    const interface = readline.createInterface({
      input: fileStream,
      crlfDelay: Infinity,
    });
    const context = {
      password: 0,
      current: 50,
    };

    interface.on("line", (line) => handler(context, line));
    interface.on("close", () => {
      console.log(`Password: ${context.password}`);
    });
  } catch (err) {
    console.log(`Unable to read ${inputFile}`);
  }
};

getPassword(inputFile, part1handler);
getPassword(inputFile, part2handler);
