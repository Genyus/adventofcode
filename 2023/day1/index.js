const fs = require("fs");
const readline = require("readline");
const path = require("path");

const inputFile = path.join(__dirname, "input.txt");

try {
  const fileStream = fs.createReadStream(inputFile);
  const interface = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity,
  });
  let total = 0;

  interface.on("line", (line) => {
    const numbers = line
      .split("")
      .filter((char) => !isNaN(char))
      .map((char) => Number(char));

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
