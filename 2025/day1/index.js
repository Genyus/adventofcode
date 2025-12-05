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
  const steps = totalSteps % 100;

  if (direction === "L") {
    const next = context.current - steps;
    const finalPosition = context.current - totalSteps;
    const toAdd =
      finalPosition <= 0
        ? Math.floor(Math.abs(finalPosition) / 100) +
          (context.current > 0 ? 1 : 0)
        : 0;

    context.password += toAdd;

    return next < 0 ? 100 - Math.abs(next) : next;
  } else {
    const next = context.current + steps;
    const finalPosition = context.current + totalSteps;
    const toAdd = Math.floor(finalPosition / 100);

    context.password += toAdd;

    return next > 99 ? next - 100 : next;
  }
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

// getPassword(inputFile, part1handler);
getPassword(inputFile, part2handler);
