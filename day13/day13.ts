const rawInput: string = await Deno.readTextFile('./input.txt');
const lines: string[] = rawInput.trim().split('\n').map(x => x.trim()).filter(s => s.length > 0);

const timestamp = parseInt(lines[0]);
const buses = lines[1].split(',')
  .filter(x => x !== 'x')
  .map(x => parseInt(x));
console.log({ timestamp, buses });


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

// part1();


const checkTimestamp = (timestamp: number, buses: { offset: number; id: number }[]) => {
  return buses.map(bus => (timestamp + bus.offset) % bus.id === 0)
    .reduce((acc, val) => acc && val, true);
};

const gcd: (a: number, b: number) => number =
  (a: number, b: number) => !b ? a : gcd(b, a % b);

const lcm = (a: number, b: number) => (a / gcd(a, b) * b);


function part2() {
  const buses = lines[1]
    .split(',')
    .map((id, offset) => ({ id, offset }))
    .filter(x => x.id !== 'x')
    .map(elem => ({ id: parseInt(elem.id), offset: elem.offset }));

  // console.log(buses);


  // const numbers = [...new Set(buses.map(x => x.id += x.offset))];
  // console.log(numbers);

  // const number = buses.map(x => x.id).reduce((acc, val) => lcm(acc, val));
  // console.log({ number });
  // const check = checkTimestamp(number, buses);
  // console.log({ check });

  const di = Math.max(...buses.map(i => i.id));
  const doffset = buses.find(x => x.id === di)!.offset;

  console.log({ di, doffset });
  let i = 0;
  while (true) {
    const results = checkTimestamp(i - doffset, buses);
    if (results) {
      console.log({ value: i - doffset });
      break;
    } else {
      i += di;
    }
  }
}


part2();
