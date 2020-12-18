function toBinary(n: number) {
  let binary = '';
  if (n < 0) {
    n = n >>> 0;
  }
  while (Math.ceil(n / 2) > 0) {
    binary = n % 2 + binary;
    n = Math.floor(n / 2);
  }
  return binary;
}

type Mask = { andMask: bigint, orMask: bigint }
type Write = { address: bigint, value: bigint }
type Command = Mask | Write

async function read(path: string) {
  const rawInput: string = await Deno.readTextFile(path);
  const strs: string[] = rawInput.trim().split('\n').map(x => x.trim());
  const commands: Command[] = [];

  strs.forEach(x => {
    if (x.includes('mask = ')) {
      const maskStr = x.replace('mask = ', '');
      const and = maskStr.replaceAll('X', '0');
      const or = maskStr.replaceAll('X', '1');
      const mask: Mask = {
        andMask: BigInt(parseInt(and, 2)),
        orMask: BigInt(parseInt(or, 2))
      };
      commands.push(mask);
    }

    if (x.includes('mem')) {
      const regex = /mem\[(\d*)\] = (\d*)/;
      const matches = x.match(regex);
      commands.push({
        address: BigInt(parseInt(matches![1])),
        value: BigInt(parseInt(matches![2]))
      });
    }
  });

  return commands;
}

function isNumber(x: any): x is number {
  return typeof x === 'number';
}

function isMask(x: any): x is Mask {
  return x.andMask !== undefined && x.orMask !== undefined;
}

function isWrite(x: any): x is Write {
  return x.address !== undefined && x.value !== undefined;
}

const part1 = (commands: Command[]): BigInt => {
  const memory: { [key: string]: BigInt } = {};
  let masks = [0n, 0n];
  for (let i = 0; i < commands.length; i++) {
    const command: Command = commands[i]!;
    if (isMask(command)) {
      masks = [command.andMask, command.orMask];
      continue;
    }

    if (isWrite(command)) {
      memory[command.address.toString()] = (masks[0] | command.value) & masks[1];
    }
  }

  return Object.values(memory)
    .filter(x => x !== 0n)
    .map(BigInt)
    .reduce((acc, val) => acc + val, 0n);
};

console.log(part1(await read('test1.txt')));
console.log(part1(await read('input.txt')));
console.log(part1(await read('inputA.txt')));
