const fs = require('fs');
const input = fs.readFileSync('./input.txt', { encoding: 'utf-8' });
const forms = input.split('\n\n');


function intersection(setA, setB) {
  let _intersection = new Set();
  for (let elem of setB)
    if (setA.has(elem))
      _intersection.add(elem);
  return _intersection;
}

const getIntersection = (forms) => forms.reduce((acc, val) => intersection(acc, val), forms[0]);

const empty = x => x.length !== 0;
const result = forms
  .filter(empty)
  .map(f => getIntersection(f.split('\n')
    .filter(empty)
    .map(x => new Set(x.split('')))
  ))
  .map(x => x.size)
  .reduce((acc, val) => acc + val, 0);
console.log({ result });
