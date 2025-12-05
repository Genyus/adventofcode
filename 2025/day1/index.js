const fs = require("fs");
const readline = require("readline");
const path = require("path");

const inputFile = path.join(__dirname, "input.txt");
// rotation is a string containing the direction (i.e. "L" or "R") and the number of steps (e.g. "L10" or "R5")
const getNext = (current, rotation) => {
  const direction = rotation.substring(0, 1);
  const steps = parseInt(rotation.substring(1)) % 100;

  if (direction === "L") {
    const next = current - steps;

    return next < 0 ? 100 - Math.abs(next) : next;
  } else {
    const next = current + steps;

    return next > 99 ? next - 100 : next;
  }
};
const getNext2 = (context, rotation) => {
  const direction = rotation.substring(0, 1);
  const totalSteps = parseInt(rotation.substring(1));
  const finalPosition =
    context.current + totalSteps * (direction === "L" ? -1 : 1);
  let toAdd = 0;

  if (direction === "L") {
    // handle edge case where the current position is 0
    toAdd =
      Math.floor((context.current - 1) / 100) -
      Math.floor((finalPosition - 1) / 100);
  } else {
    toAdd = Math.floor(finalPosition / 100);
  }

  context.password += toAdd;

  // normalise the final position to be between 0 and 99
  return ((finalPosition % 100) + 100) % 100;
};
const part1handler = (line, context) => {
  context.current = getNext(context.current, line);

  if (context.current === 0) {
    context.password++;
  }
};
const part2handler = (line, context) => {
  context.current = getNext2(context, line);
};
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

    interface.on("line", (line) => handler(line, context));
    interface.on("close", () => {
      console.log(`Password: ${context.password}`);
    });
  } catch (err) {
    console.log(`Unable to read ${inputFile}`);
  }
};

getPassword(inputFile, part1handler);
getPassword(inputFile, part2handler);
