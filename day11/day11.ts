const rawInput: string = await Deno.readTextFile('./input.txt');
const rawLines: string[] = rawInput.trim().split('\n').map(x => x.trim()).filter(s => s.length > 0);

const width = rawLines[0].length;
const height = rawLines.length;

console.log({ width, height });

const fulfillFromFile = (rawLines: string[]) =>
  rawLines.map(line => line.split('')).reduce(
    (acc, val) => acc.concat(...val), []
  );

const matrix = fulfillFromFile(rawLines);
const println = (matrix: string[]) => {
  console.log('************ matrix ************');
  for (let y = 0; y < height; y++)
    console.log(matrix.slice(width * y, width * (y + 1)).join(''));
};

const getSymbol = (m: string[], x: number, y: number) => {
  if (x < 0 || y < 0 || x >= width || y >= height) return '.';
  return m[y * width + x];
};

const adjucentSeats = () => {
  const result = [];
  for (let i = -1; i <= 1; i++)
    for (let j = -1; j <= 1; j++)
      if (!(i === 0 && j === 0))
        result.push([i, j]);
  return result;
};


const getAdjacent = (matrix: string[], i: number, j: number) =>
  adjucentSeats().map(([x, y]) => getSymbol(matrix, i + x, j + y));

function isOutside(x: number, y: number) {
  return (x < 0 || y < 0 || x >= width || y >= height);
}

function findNearest(matrix: string[], x: number, y: number, dx: number, dy: number) {
  let pointX = x + dx;
  let pointY = y + dy;
  while (!isOutside(pointX, pointY)) {
    const symbol = getSymbol(matrix, pointX, pointY);
    if (symbol == 'L') return 'L';
    if (symbol == '#') return '#';
    pointX = pointX + dx;
    pointY = pointY + dy;
  }
  return '.';
}

const getAdjacentRanged = (matrix: string[], x: number, y: number) =>
  adjucentSeats().map(([dx, dy]) => findNearest(matrix, x, y, dx, dy));

const checkEmpty = (matrix: string[], x: number, y: number) =>
  getAdjacentRanged(matrix, x, y).filter(elem => elem === '#').length === 0 ? '#' : 'L';

const checkAvailable = (matrix: string[], i: number, j: number) =>
  getAdjacentRanged(matrix, i, j).filter(x => x === '#').length >= 5 ? 'L' : '#';

const evalState = (matrix: string[], i: number, j: number): string => {
  const symbol = getSymbol(matrix, i, j);

  if (symbol === '.') return '.';
  if (symbol === '#') return checkAvailable(matrix, i, j);
  if (symbol === 'L') return checkEmpty(matrix, i, j);
  return '.';
};

let nextRound = (matrix: string[]) => {
  const round = [];
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      round.push(evalState(matrix, x, y));
    }
  }
  return round;
};

let current = matrix;
let next;

const isEqual = (current: string[], next: string[]) => current.join('') === next.join('');

while (true) {
  next = nextRound(current);
  println(next);
  if (isEqual(current, next)) {
    println(next);
    console.log(next.filter(x => x === '#').length);
    break;
  }
  current = next;
}
