const fs = require('fs');
const input = fs.readFileSync('./input.txt', 'utf-8');
const passes = input.split('\n').filter(a => a.length !== 0);

const toBit = (val) => val === 'B' || val === 'R' ? 1 : 0;
const toProperty = (acc, val) => (acc << 1) + toBit(val);
const result = passes.map(bp => bp.split('').reduce(toProperty, 0));
const max = Math.max(...result);
const min = Math.min(...result);
console.log(max, min);

const isOurBoardPass = (result, i) => !(result.includes(i));
for (let i = min; i < max; i++)
  if (isOurBoardPass(result, i))
    console.log(i);
