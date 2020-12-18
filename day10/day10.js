const fs = require('fs');
const input = fs.readFileSync('./input.txt', { encoding: 'utf-8' });

const adapters = input
  .split('\n')
  .filter(a => a)
  .map(a => parseInt(a));
adapters.sort((a, b) => a - b);

console.log({ adapters });

const findAllSupported = (adapters, currentAdapter) =>
  adapters
    .filter(adapter => adapter > currentAdapter && adapter - currentAdapter <= 3);

const findJoltageDifferences = (adapters, diff) => {
  let i = 0;
  adapters.forEach((val, index) => {
    if (index === 0) return;
    if (val - adapters[index - 1] === diff) i++;
  });
  return i;
};


const max = Math.max(...adapters) + 3;
const min = 0;
let fullRange = [min, ...adapters, max];
const diff1 = findJoltageDifferences(fullRange, 1);
const diff3 = findJoltageDifferences(fullRange, 3);
console.log({ diff1, diff3 });
console.log(diff1 * diff3);

const supportedAdapters = {};
fullRange.forEach(val => {
  supportedAdapters[val] = findAllSupported(adapters, val);
});

const borders = fullRange.filter((value, index, array) => {
  if (index < 1) return true;
  const element = array[index - 1];
  return value - element === 3;
});

console.log({ borders });

const traverse = (adapters, current, state) => {

  const supported = findAllSupported(adapters, current);
  if (supported.length === 0) {
    state.counter += 1;
  } else
    supported.map(s => traverse(adapters, s, state));
};

let leftBorder = min;
const results = borders.map(rightBorder => {
  const list = fullRange.filter(element => element >= leftBorder && element <= rightBorder);
  const state = { counter: 0 };
  traverse(list, leftBorder, state);
  const result = state.counter;
  console.log(`${leftBorder} - ${rightBorder}: ${list} -> ${result}`);
  state.counter = 0;
  leftBorder = rightBorder;
  return result;
}).reduce((acc, val) => acc * val, 1);


console.log({ results });
