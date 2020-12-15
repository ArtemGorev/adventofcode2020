const rawInput: string = await Deno.readTextFile('./inputA.txt');
const commands: string[] = rawInput.trim().split('\n').map(x => x.trim()).filter(s => s.length > 0);

console.log({ commands });


const sides: Side[] = ['N', 'E', 'S', 'W'];
type Side = 'E' | 'N' | 'W' | 'S';

type State = {
  direction: Side,
  x: number,
  y: number
}

const state: State = {
  direction: 'E',
  x: 0,
  y: 0
};

const rotate = (state: State, argument: number): State => {
  const value = (argument % 360) / 90;
  const number = sides.indexOf(state.direction);

  let number1 = number + value;
  if (number1 < 0) number1 = 4 + number1;
  return {
    ...state,
    direction: sides[number1 % 4]
  };
};
const moveTo = (state: State, direction: Side, argument: number): State => {
  const { x, y } = state;
  let newX = x, newY = y;
  switch (direction) {
    case 'N':
      newY = y + argument;
      break;
    case 'E':
      newX = x + argument;
      break;
    case 'S':
      newY = y - argument;
      break;
    case 'W':
      newX = x - argument;
      break;
  }

  return {
    ...state,
    x: newX,
    y: newY
  };
};

const result = commands.reduce((acc: State, val: string) => {
  const command = val[0];
  const argument = parseInt(val.slice(1));
  console.log({ command, argument });

  switch (command) {
    case 'R':
      acc = rotate(acc, argument);
      break;
    case 'L':
      acc = rotate(acc, -1 * argument);
      break;
    case 'F':
      acc = moveTo(acc, acc.direction, argument);
      break;
    case 'W':
    case 'N':
    case 'E':
    case 'S':
      acc = moveTo(acc, command, argument);
      break;
  }

  console.log({ acc });

  return acc;
}, state);

console.log({ result });


console.log(Math.abs(result.x) + Math.abs(result.y));
