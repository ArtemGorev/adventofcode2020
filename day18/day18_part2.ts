type Token = {
  t: 'operand' | 'operation' | 'group' | 'open_bracket' | 'close_bracket'
  op?: '+' | '*' | number | any[];
}

type ASTNode = {
  type: 'operand' | 'operation';
  value: number | '+' | '*';

  left?: ASTNode;
  right?: ASTNode;
}

const parseTokens = (input: string): Token[] => {
  const raw = input
    .replaceAll('(', ' ( ')
    .replaceAll(')', ' ) ')
    .split(' ')
    .map(x => x.trim())
    .filter(x => x);

  return raw.map(x => {
    switch (x) {
      case '+':
      case '*':
        return { t: 'operation', op: x };
      case '(':
        return { t: 'open_bracket' };
      case ')':
        return { t: 'close_bracket' };
      default:
        return { t: 'operand', op: +x };
    }
  });
};
const log = (number: number) => {
  console.log({ number });
  return number;
};

const createOperandNode = (value: number): ASTNode => ({ type: 'operand', value });
const createOperationNode = (value: '+' | '*', left: ASTNode, right: ASTNode): ASTNode =>
  ({ type: 'operation', value, left, right });

function term(tokens: IterableIterator<Token>): ASTNode {
  const token = tokens.next().value;
  if (token.t === 'operand') {
    return createOperandNode(token.op);
  } else if (token.t === 'open_bracket') {
    return expression(tokens);
  }

  throw new Error('wrong token was occurred');
}

function expression(tokens: IterableIterator<Token>): ASTNode {
  let first = term(tokens);
  let token = tokens.next().value;
  let root;
  let prevOp = '+';

  while (token) {
    if (token.t === 'operation') {
      const second = term(tokens);
      first = root = createOperationNode(token.op, first, second);

      if (token.t)
        prevOp = token.value as string;
    }

    token = tokens.next().value;
  }

  return first;
}


const last = <A>(array: A[]) =>
  array.length <= 0 ? undefined : array[array.length - 1];

const getPrecedence = (token: Token): number => {
  if (token.op === '+') return 2;
  if (token.op === '*') return 1;

  return 0;
};

const createAST = (tokens: Token[]): ASTNode => {
  const ops = new Array<Token>();
  const nodes = new Array<ASTNode>();

  tokens.forEach(token => {

    if (token.t === 'operand') {
      addOperandNode(nodes, token);
    }

    if (token.t === 'open_bracket') {
      ops.push(token);
    }

    if (token.t === 'close_bracket') {
      while (last(ops) && last(ops)!.t !== 'open_bracket')
        addOperatorNode(nodes, ops.pop()!);

      ops.pop();
    }

    // pull operators based on precedence & associativity
    if (token.t === 'operation') {
      while (
        last(ops) && (getPrecedence(last(ops)!) > getPrecedence(token))) {
        addOperatorNode(nodes, ops.pop()!);
      }

      ops.push(token);
    }
  });

  // if there are still operators in the stack
  while (ops.length > 0) {
    addOperatorNode(nodes, ops.pop()!);
  }

  return nodes.pop()!;
};

const addOperandNode = (nodes: ASTNode[], token: Token) => {
  const node = createOperandNode(token.op as number);

  nodes.push(node);
};

const addOperatorNode = (nodes: ASTNode[], token: Token) => {
  const node = createOperationNode(token.op as '+' | '*', nodes.pop()!, nodes.pop()!);
  nodes.push(node);
};


const traverse = (ast: ASTNode, callback: (node: ASTNode) => (void)) => {
  if (ast.left) traverse(ast.left, callback);
  if (ast.right) traverse(ast.right, callback);
  if (ast) callback(ast);
};

const run = (array: ASTNode[]): number => {
  const stack = new Array<number>();
  for (const node of array) {
    if (node.type === 'operand') {
      stack.push(node.value as number);
    } else if (node.type === 'operation') {
      const first = stack.pop()!;
      const second = stack.pop()!;

      switch (node.value) {
        case '+':
          stack.push(first + second);
          break;
        case '*':
          stack.push(first * second);
          break;
      }
    }
  }

  return stack.pop()!;
};

const evalAST = (ast: ASTNode): number => {
  const array: ASTNode[] = [];
  traverse(ast, (node) => array.push(node));
  return run(array);
};

const calc2 = (input: string): number => log(evalAST(createAST(parseTokens(input))));

console.assert(calc2('1 + 2') === 3);
console.assert(calc2('1 + 2 + 3') === 6);
console.assert(calc2('1 + 2 * 3') === 9);
console.assert(calc2('1 + (2 * 3) + (4 * (5 + 6))') === 51);
console.assert(calc2('2 * 3 + (4 * 5)') === 46);
console.assert(calc2('5 + (8 * 3 + 9 + 3 * 4 * 3)') === 1445);
console.assert(calc2('5 * 9 * (7 * 3 * 3 + 9 * 3 + (8 + 6 * 4))') === 669060);
console.assert(calc2('((2 + 4 * 9) * (6 + 9 * 8 + 6) + 6) + 2 + 4 * 2') === 23340);


const rawFile = await Deno.readTextFile('./input.txt');

const sum = rawFile
  .split('\n')
  .filter(x => x)
  .map(line => calc2(line))
  .reduce((acc, val) => acc + val);

console.log({sum});

