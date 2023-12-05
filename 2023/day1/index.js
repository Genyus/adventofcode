const fs = require("fs");
const readline = require("readline");
const path = require("path");

let iterations = 0;
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
const keys = Array.from(tokens.keys());
const lengths = Array.from(new Set(keys.map((str) => str.length)));
const maxLength = keys.reduce((previous, current) => {
  return current.length > previous ? current.length : previous;
}, 0);
const getLineNumbers = (line) => {
  const numbers = [];
  let i = 0;

  while (i < line.length) {
    for (let len of lengths.filter((length) => length <= line.length - i)) {
      let segment = line.substring(i, i + len);

      iterations++;

      if (tokens.has(segment)) {
        numbers.push(tokens.get(segment));
        i += Math.max(len - 2, 0);

        break;
      }
    }
    i++;
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
    console.log(`Total: ${total}. Iterations: ${iterations}`);
  });
} catch (err) {
  console.log(`Unable to read ${inputFile}`);
}
