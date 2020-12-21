function parseTokens(input: string) {
  const raw = input
    .replaceAll('(', ' ( ')
    .replaceAll(')', ' ) ')
    .split(' ')
    .map(x => x.trim())
    .filter(x => x);

  return raw.map(x => {
    if (x === '+' || x === '*') {
      return {
        t: 'operation',
        op: x
      };
    } else if (x === '(') {
      return {
        t: 'open_bracket'
      };
    } else if (x === ')') {
      return {
        t: 'close_bracket'
      };
    } else {
      return {
        t: 'operand',
        op: +x
      };
    }
  });
}

const calcOperation = (op: '+' | '*', arg1: number, arg2: number) => {
  if (op === '+') return arg1 + arg2;
  if (op === '*') return arg1 * arg2;
};


type Token = {
  t: 'operand' | 'operation' | 'group' | 'open_bracket' | 'close_bracket'
  op: '+' | '*' | number | any[] | undefined;
}

function group(tokens: any[]): [number, any] {
  const token = {
    t: 'group',
    op: new Array<Token>()
  };

  for (let i = 0; i < tokens.length; i++) {
    let item = tokens[i];
    if (item.t === 'operand'
      || item.t === 'operation')
      token.op.push(item);

    if (item.t === 'open_bracket') {
      const [skip, r] = group(tokens.slice(i + 1));
      token.op.push(r);
      i += skip + 1;
    }

    if (item.t === 'close_bracket') {
      return [i, token];
    }

  }

  return [0, token];
}

function calculateTokens(tokens: any) {
  const stack: any[] = [];

  tokens.forEach((curr: any) => {
    if (curr.t === 'group') {
      let op = calculateTokens(curr.op);
      if (stack.length >= 2) {
        const operation = stack.pop()!;
        const operand = stack.pop()!;

        stack.push({
          t: 'operand',
          op: calcOperation(operation.op, operand.op, op)
        });
      } else {
        stack.push({
          t: 'operand',
          op: op
        });
      }
    }

    if (curr.t === 'operand') {
      if (stack.length >= 2) {
        const operation = stack.pop()!;
        const operand = stack.pop()!;

        stack.push({
          t: 'operand',
          op: calcOperation(operation.op, operand.op, curr.op)
        });
      } else {
        stack.push(curr);
      }
    }

    if (curr.t === 'operation') {
      stack.push(curr);
    }
  });

  const result = stack.pop();
  return result.op;
}

const calc = (input: string): number => {
  const tokens = parseTokens(input);
  const [_, root] = group(tokens);

  return calculateTokens(root.op);
};


console.assert(calc('1 + 2 * 3 + 4 * 5 + 6') === 71);
console.assert(calc('1 + (2 * 3) + (4 * (5 + 6))') === 51);
console.assert(calc('2 * 3 + (4 * 5)') === 26);
console.assert(calc('5 + (8 * 3 + 9 + 3 * 4 * 3)') === 437);
console.assert(calc('5 * 9 * (7 * 3 * 3 + 9 * 3 + (8 + 6 * 4))') === 12240);
console.assert(calc('((2 + 4 * 9) * (6 + 9 * 8 + 6) + 6) + 2 + 4 * 2') === 13632);

const rawFile = await Deno.readTextFile('./inputA.txt');

const sum = rawFile.split('\n').filter(x => x)
  .map(line => calc(line))
  .reduce((acc, val) => acc + val);

console.log({sum});
