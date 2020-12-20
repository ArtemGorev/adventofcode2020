const eq = (a: any, b: any) => JSON.stringify(a) === JSON.stringify(b);

function addToIndex(indexes: Map<number, number[]>, value: number, index: number) {
  if (indexes.has(value)) {
    indexes.set(value, [indexes.get(value)!.pop()!, index]);
  } else {
    indexes.set(value, [index]);
  }
}

function getItem(indexes: Map<number, number[]>, value: number) {
  const index = indexes.get(value);
  if (index && index.length > 1) {
    const [preLast, last] = index;
    return last - preLast;
  }
  return 0;
}

const part1 = (start: number[], len: number): number => {
  const buffer = [...start];
  const indexes = new Map<number, number[]>();

  buffer.forEach((value, index) =>
    addToIndex(indexes, value, index));

  let preValue = buffer.pop()!;

  for (let turn = start.length; turn < len; turn++) {
    const item = getItem(indexes, preValue);
    addToIndex(indexes, item, turn);
    preValue = item;
  }

  return preValue;
};

console.assert(eq(part1([0, 3, 6], 10), 0));
console.assert(part1([1, 3, 2], 2020) === 1);
console.assert(part1([2, 1, 3], 2020) === 10);
console.assert(part1([1, 2, 3], 2020) === 27);
console.assert(part1([2, 3, 1], 2020) === 78);
console.assert(part1([3, 2, 1], 2020) === 438);
console.assert(part1([3, 1, 2], 2020) === 1836);

console.time('p2');

console.assert(part1([0, 3, 6], 30000000) === 175594);
console.assert(part1([1, 3, 2], 30000000) === 2578);
console.assert(part1([2, 1, 3], 30000000) === 3544142);
console.assert(part1([1, 2, 3], 30000000) === 261214);
console.assert(part1([2, 3, 1], 30000000) === 6895259);
console.assert(part1([3, 2, 1], 30000000) === 18);
console.assert(part1([3, 1, 2], 30000000) === 362);


console.log(part1([8,13,1,0,18,9], 30000000));

console.timeEnd('p2');
