# [Day 1](https://adventofcode.com/2023/day/1)

## Part 1

The newly-improved calibration document consists of lines of text; each line originally contained a specific calibration value that the Elves now need to recover. On each line, the calibration value can be found by combining the first digit and the last digit (in that order) to form a single two-digit number.

For example:

```
1abc2
pqr3stu8vwx
a1b2c3d4e5f
treb7uchet
```

In this example, the calibration values of these four lines are `12`, `38`, `15`, and `77`. Adding these together produces `142`.

Consider your entire calibration document. What is the sum of all of the calibration values?

## Part Two

Your calculation isn't quite right. It looks like some of the digits are actually spelled out with letters: `one`, `two`, `three`, `four`, `five`, `six`, `seven`, `eight`, and `nine` also count as valid "digits".

Equipped with this new information, you now need to find the real first and last digit on each line. For example:

```
two1nine
eightwothree
abcone2threexyz
xtwone3four
4nineeightseven2
zoneight234
7pqrstsixteen
```

In this example, the calibration values are `29`, `83`, `13`, `24`, `42`, `14`, and `76`. Adding these together produces `281`.

What is the sum of all of the calibration values?

## Prerequisites

[Node.js](https://nodejs.org/en) (or any other JS runtime environment)

## Setup

1. Fork this repository
2. Clone your fork locally
3. Copy input.txt.dist to input.txt
4. (Optional) If you're following the AoC exercises, replace the contents of input.txt with your personal input from https://adventofcode.com/2023/day/1/input
5. Open a terminal and navigate to the local repo directory
6. Execute `node 2023/day1/index.js`
