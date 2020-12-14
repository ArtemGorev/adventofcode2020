const fs = require('fs');
const input = fs.readFileSync('./inputAlexander.txt', { encoding: 'utf-8' });

const adapters = input
  .split('\n')
  .filter(a => a)
  .map(a => parseInt(a));
adapters.sort((a, b) => a - b);

console.log({ adapters });

const findAllSupported = (adapters, currentAdapter) =>
  adapters
    .filter(adapter => adapter > currentAdapter && adapter - currentAdapter <= 3);

const result = findAllSupported(adapters, adapters[9]);
// console.log({ result });

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
const diff1 = findJoltageDifferences([min, ...adapters, max], 1);
const diff3 = findJoltageDifferences([min, ...adapters, max], 3);
// console.log({ diff1, diff3 });
// console.log(diff1 * diff3);

const getPaths = (adapters, elem) => {
  return {
    elem,
    child: findAllSupported(adapters, elem)
      .map(elem => getPaths(adapters, elem))
  };
};

console.log("getPaths");
const paths = getPaths([min, ...adapters, max], min);
console.log("traverse");
const traverse = (root, path, result) => {
  path.push(root.elem);

  if (root.child.length === 0)
    result += 1;
  else
    root.child.map(c => traverse(c, path, result));

  path.pop();
  return result;
};


let data = traverse(paths, [], 0);
