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

try {
  const fileStream = fs.createReadStream(inputFile);
  const interface = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity,
  });
  let password = 0;
  let current = 50;

  interface.on("line", (line) => {
    current = getNext(current, line);

    if (current === 0) {
      password++;
    }
  });
  interface.on("close", () => {
    console.log(`Password: ${password}`);
  });
} catch (err) {
  console.log(`Unable to read ${inputFile}`);
}
