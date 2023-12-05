const fs = require("fs");
const readline = require("readline");
const path = require("path");

const tokens = new Map([
  ["0", 0],
  ["1", 1],
  ["2", 2],
  ["3", 3],
  ["4", 4],
  ["5", 5],
  ["6", 6],
  ["7", 7],
  ["8", 8],
  ["9", 9],
  ["zero", 0],
  ["one", 1],
  ["two", 2],
  ["three", 3],
  ["four", 4],
  ["five", 5],
  ["six", 6],
  ["seven", 7],
  ["eight", 8],
  ["nine", 9],
]);
const getLineNumbers = (line) => {
  const numbers = [];

  for (let i = 0; i < line.length; i++) {
    for (let substring of tokens.keys()) {
      if (line.startsWith(substring, i)) {
        numbers.push(tokens.get(substring));
      }
    }
  }

  return numbers;
};
const inputFile = path.join(__dirname, "input.txt");

try {
  const fileStream = fs.createReadStream(inputFile);
  const interface = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity,
  });
  let total = 0;

  interface.on("line", (line) => {
    const numbers = getLineNumbers(line);

    if (numbers.length > 0) {
      total += numbers[0] * 10 + numbers[numbers.length - 1];
    }
  });
  interface.on("close", () => {
    console.log(`Total: ${total}`);
  });
} catch (err) {
  console.log(`Unable to read ${inputFile}`);
}
