const input =
  "61-71,12004923-12218173,907895-1086340,61083-74975,7676687127-7676868552,3328-4003,48-59,3826934-3859467,178-235,75491066-75643554,92-115,1487-1860,483139-586979,553489051-553589200,645895-722188,47720238-47818286,152157-192571,9797877401-9798014942,9326-11828,879837-904029,4347588-4499393,17-30,1-16,109218-145341,45794-60133,491-643,2155-2882,7576546102-7576769724,4104-5014,34-46,67594702-67751934,8541532888-8541668837,72-87,346340-480731,3358258808-3358456067,78265-98021,7969-9161,19293-27371,5143721-5316417,5641-7190,28793-36935,3232255123-3232366239,706-847,204915-242531,851-1135,790317-858666";
// const input =
//   "11-22,95-115,998-1012,1188511880-1188511890,222220-222224,1698522-1698528,446443-446449,38593856-38593862,565653-565659,824824821-824824827,2121212118-2121212124";
const ranges = input
  .split(",")
  .map((range) => range.split("-").map(Number))
  .filter(
    (range): range is [number, number] =>
      typeof range[0] === "number" && typeof range[1] === "number",
  );
const getFactors = (value: number): number[] => {
  const factors: number[] = [];

  for (let i = 1; i <= Math.sqrt(value); i++) {
    if (value % i === 0) {
      factors.push(i);

      if (i !== Math.sqrt(value) && i !== 1) {
        factors.push(value / i);
      }
    }
  }

  return factors.sort((a, b) => b - a);
};
const getFullValue = (token: number, iterations: number): number =>
  parseInt(String(token).repeat(iterations));
const getInvalidSumForRange1 = (start: number, end: number): number => {
  const startString = start.toString();
  const endString = end.toString();
  let firstHalf;
  let sum = 0;

  if (startString.length % 2 === 0) {
    const secondHalf = parseInt(startString.substring(startString.length / 2));

    firstHalf = parseInt(startString.substring(0, startString.length / 2));

    if (secondHalf > firstHalf) {
      firstHalf++;
    }
  } else {
    if (startString.length === endString.length) {
      return 0;
    }

    firstHalf = Math.pow(10, Math.floor(startString.length / 2));
  }

  for (let half = firstHalf; ; half++) {
    const fullValue = getFullValue(half, 2);

    if (fullValue > end) {
      break;
    }

    sum += fullValue;
  }

  return sum;
};
const getSumForFixedLength = (
  length: number,
  min: number,
  max: number,
): number => {
  const factors = getFactors(length);
  const invalidValues: Set<number> = new Set();

  if (factors.length === 0) {
    return 0;
  }

  for (const factor of factors) {
    const repetitions = length / factor;
    const minStr = min.toString();
    let startToken = parseInt(minStr.substring(0, factor));

    if (getFullValue(startToken, repetitions) < min) {
      startToken++;
    }

    for (let token = startToken; ; token++) {
      const fullValue = getFullValue(token, repetitions);

      if (fullValue > max) {
        break;
      }

      if (invalidValues.has(fullValue)) {
        continue;
      }

      invalidValues.add(fullValue);
    }
  }

  return Array.from(invalidValues).reduce((acc, value) => acc + value, 0);
};
const getInvalidSumForRange2 = (start: number, end: number): number => {
  const startLen = start.toString().length;
  const endLen = end.toString().length;
  let totalSum = 0;

  for (let len = Math.max(startLen, 2); len <= endLen; len++) {
    const min = len === startLen ? start : Math.pow(10, len - 1);
    const max = len === endLen ? end : Math.pow(10, len) - 1;

    totalSum += getSumForFixedLength(len, min, max);
  }

  return totalSum;
};
const total1 = ranges.reduce(
  (acc, [start, end]) => acc + getInvalidSumForRange1(start, end),
  0,
);
const total2 = ranges.reduce(
  (acc, [start, end]) => acc + getInvalidSumForRange2(start, end),
  0,
);
console.log(total1);
console.log(total2);
