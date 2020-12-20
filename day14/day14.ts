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

type Mask = { andMask: bigint, orMask: bigint, rawMask: string }
type Write = { address: bigint, value: bigint }
type Command = Mask | Write

async function read(path: string) {
  const rawInput: string = await Deno.readTextFile(path);
  const strs: string[] = rawInput.trim().split('\n').map(x => x.trim());
  const commands: Command[] = [];

  strs.forEach(command => {
    if (command.includes('mask = ')) {
      const rawMask = command.replace('mask = ', '');
      const and = rawMask.replaceAll('X', '0');
      const or = rawMask.replaceAll('X', '1');
      const mask: Mask = {
        andMask: BigInt(parseInt(and, 2)),
        orMask: BigInt(parseInt(or, 2)),
        rawMask: rawMask
      };
      commands.push(mask);
    }

    if (command.includes('mem')) {
      const regex = /mem\[(\d*)\] = (\d*)/;
      const matches = command.match(regex);
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

function evalSum(memory: { [p: string]: BigInt }) {
  return Object.values(memory)
    .filter(x => x !== 0n)
    .map(BigInt)
    .reduce((acc, val) => acc + val, 0n);
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

  return evalSum(memory);
};

console.log(part1(await read('test1.txt')));
console.log(part1(await read('input.txt')));
console.log(part1(await read('inputA.txt')));

const matchBit = (valueBit: string, maskBit: string): string => {
  switch (valueBit + maskBit) {
    case '00':
      return '0';
    case '01':
      return '1';
    case '11':
      return '1';
    case '10':
      return '1';
    case '0X':
      return 'X';
    case '1X':
      return 'X';
  }
  return 'Y';
};

function produceAddresses(mask: string, address: bigint): string[] {
  const addressString = address.toString(2).padStart(36, '0');
  const maskedAddressBuffer = new Array<string>(36);
  for (let i = 0; i < 36; i++)
    maskedAddressBuffer[i] = matchBit(addressString[i], mask[i]);

  const maskedAddress = maskedAddressBuffer.join('');
  console.log({ maskedAddress });
  const xBitCount = maskedAddress.split('').filter(x => x === 'X').length;
  console.log({ xBitCount });


  const result: string[] = [];
  for (let i = 0; i < 2 ** xBitCount; i++) {
    const value = i.toString(2).padStart(xBitCount, '0');
    let finalAddress = maskedAddress;
    for (let j = 0; j < xBitCount; j++) {
      finalAddress = finalAddress.replace('X', value[j]);
    }

    console.log({ value, finalAddress });
    result.push(finalAddress);
  }

  return result;
}

const part2 = (commands: Command[]): BigInt => {
  const memory: { [key: string]: BigInt } = {};
  let mask = '111111111111111111111111111111111111';
  for (let i = 0; i < commands.length; i++) {
    const command: Command = commands[i]!;

    if (isMask(command)) {
      mask = command.rawMask;
      continue;
    }

    if (isWrite(command)) {
      produceAddresses(mask, command.address).forEach(address => {
        memory[address] = command.value;
      });
    }
  }

  return evalSum(memory);
};


// console.log(part2(await read('test2.txt')));
console.log(part2(await read('input.txt')));
