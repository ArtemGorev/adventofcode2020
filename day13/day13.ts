async function read(path: string) {
  const rawInput: string = await Deno.readTextFile(path);
  const lines: string[] = rawInput.trim().split('\n').map(x => x.trim()).filter(s => s.length > 0);

  const timestamp = parseInt(lines[0]);
  const buses = lines[1].split(',')
    .filter(x => x !== 'x')
    .map(x => parseInt(x));
  return { lines, timestamp, buses };
}

const { lines, timestamp, buses } = await read('./test1.txt');

const part1 = () => {
  let i = timestamp + 1;
  while (true) {
    const results = buses.filter(x => i % x === 0);
    if (results.length > 0) {
      console.log({ results, diff: i - timestamp, value: results[0] * (i - timestamp) });
      break;
    } else {
      i++;
    }
  }
};
part1();


type Bus = { offset: number; id: number };
const checkTimestamp = (timestamp: number, buses: Bus[]) => {
  return buses.map(bus => (timestamp + bus.offset) % bus.id === 0)
    .reduce((acc, val) => acc && val, true);
};

const modularMultiplicativeInverse = (a: bigint, modulus: bigint) => {
  const b = BigInt(a % modulus);

  for (let hipothesis = 1n; hipothesis <= modulus; hipothesis++) {
    if ((b * hipothesis) % modulus == 1n) return hipothesis;
  }

  return 1n;
};

const solveCRT = (remainders: bigint[], modules: bigint[]) => {
  const prod: bigint = modules.reduce((acc: bigint, val) => acc * val, 1n);

  return modules.reduce((sum, mod, index) => {
    const p = prod / mod;
    return sum + (remainders[index] * modularMultiplicativeInverse(p, mod) * p);
  }, 0n) % prod;
};


async function part2(path: string) {
  const { lines } = await read(path);

  const buses = lines[1]
    .split(',')
    .map((id, offset) => ({ id, offset }))
    .filter(x => x.id !== 'x')
    .map(elem => ({ id: parseInt(elem.id), offset: elem.offset }));

  const remainders = buses.map(bus => (bus.id - bus.offset) % bus.id).map(BigInt);
  const modules = buses.map(bus => bus.id).map(BigInt);

  return solveCRT(remainders, modules);
}

console.assert(await part2('./test1.txt') === 1202161486n);
console.assert((await part2('./test2.txt')) === 3417n);
console.log((await part2('./input.txt')));
console.log((await part2('./inputA.txt')));
console.log('OK');
