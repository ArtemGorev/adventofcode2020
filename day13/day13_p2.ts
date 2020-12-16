const rawInput: string = await Deno.readTextFile('./inputA.txt');
const commands: string[] = rawInput.trim().split('\n')
  .map(x => x.trim())
  .filter(s => s.length > 0);

console.log({ commands });


type Side = 'E' | 'N' | 'W' | 'S';

type State = {
  x: number,
  y: number,
  dx: number,
  dy: number,
}

const state: State = {
  x: 0,
  y: 0,
  dx: 10,
  dy: 1
};

const print = (state: State) => console.log(`${state.dx}, ${state.dy}`);

const rotateOnce = (state: State): State => {
  const { dx, dy } = state;

  const angle = Math.PI / 2;
  const ddx = Math.round(dx * Math.cos(angle) + dy * Math.sin(angle));
  const ddy = Math.round(-dx * Math.sin(angle) + dy * Math.cos(angle));

  const rotated = {
    ...state,
    dx: ddx,
    dy: ddy
  };
  print(rotated);
  return rotated;
};

const rotate = (state: State, argument: number): State => {
  let value = (argument % 360) / 90;
  if (value < 0)
    value += 4;

  let acc = state;
  for (let i = 0; i < value; i++)
    acc = rotateOnce(acc);

  return acc;
};

const moveTo = (state: State, direction: Side, argument: number): State => {
  const { dx, dy } = state;
  let newX = dx, newY = dy;
  switch (direction) {
    case 'N':
      newY = dy + argument;
      break;
    case 'E':
      newX = dx + argument;
      break;
    case 'S':
      newY = dy - argument;
      break;
    case 'W':
      newX = dx - argument;
      break;
  }

  return {
    ...state,
    dx: newX,
    dy: newY
  };
};

function forward(acc: State, argument: number): State {
  const { x, dx, y, dy } = acc;
  return {
    ...acc,
    x: x + dx * argument,
    y: y + dy * argument
  };
}

const result = commands.reduce((acc: State, val: string) => {
  const command = val[0];
  const argument = parseInt(val.slice(1));

  switch (command) {
    case 'R':
      acc = rotate(acc, argument);
      break;
    case 'L':
      acc = rotate(acc, -1 * argument);
      break;
    case 'F':
      acc = forward(acc, argument);
      break;
    case 'W':
    case 'N':
    case 'E':
    case 'S':
      acc = moveTo(acc, command, argument);
      break;
  }

  return acc;
}, state);

console.log({ result });


console.log(Math.abs(result.x) + Math.abs(result.y));
