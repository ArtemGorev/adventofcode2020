const test1 = await Deno.readTextFile('./test1.txt');
const test2 = await Deno.readTextFile('./test2.txt');
const input = await Deno.readTextFile('./input.txt');

const eq = (a: any, b: any) => JSON.stringify(a) === JSON.stringify(b);


type Rule = {
  name: string;
  periods: number[][]
}

const parseRule = (file: string): Rule[] =>
  file.split('your ticket:')[0]
    .split('\n')
    .filter(x => x)
    .map(line => {
      const elements = line.split(': ');
      return {
        name: elements[0],
        periods: elements[1].split(' or ')
          .map(x => x.split('-')
            .map(x => parseInt(x)))
      };
    });

const parseTicket = (file: string) =>
  file
    .split('your ticket:')[1]
    .split('nearby tickets:')[0]
    .replaceAll('\n', '')
    .split(',')
    .map(x => parseInt(x));

const parseTickets = (file: string) =>
  file
    .split('nearby tickets:')[1]
    .split('\n')
    .filter(x => x)
    .map(line =>
      line.split(',')
        .map(x => parseInt(x)));

const inRange = (periods: number[][], value: number): boolean =>
  periods
    .map((period) => period[0] <= value && value <= period[1])
    .find(x => x === true) !== undefined;

const isOk = (rules: Rule[], value: number): boolean =>
  rules
    .map(rule => inRange(rule.periods, value))
    .find(x => x === true) !== undefined;

const part1 = (file: string): number => {
  const rules = parseRule(file);
  const myTicker = parseTicket(file);
  const nearbyTickets = parseTickets(file);


  const errors = new Array<number>();
  nearbyTickets.forEach(ticket =>
    ticket.forEach(value => {
      if (!isOk(rules, value)) errors.push(value);
    })
  );


  return errors.reduce((acc, val) => acc + val);
};


console.assert(part1(test1) === 71);
console.log(part1(input));


function recognize(matches: { columns: number[]; rule: string }[]) {
  const result = new Array<any>();
  let temp = matches;

  for (let i = 0; i < 20; i++) {
    const found = temp.filter(match => match.columns.length === 1);
    found.forEach(x => {
      let foundColumn = x.columns.pop();
      result.push({ rule: x.rule, column: foundColumn });
      temp = temp
        .filter(match => match.columns.length !== 1)
        .map(match => {
          return {
            ...match,
            columns: match.columns.filter(column => column !== foundColumn)
          };
        });
    });
  }

  return result.sort((a, b) => a.column - b.column);
}


const part2 = (file: string): number => {
  const rules = parseRule(file);
  const myTicket = parseTicket(file);
  const nearbyTickets = parseTickets(file);

  const errors = new Array<number>();
  nearbyTickets.forEach(ticket =>
    ticket.forEach(value => {
      if (!isOk(rules, value)) errors.push(value);
    })
  );

  let errorTickets = nearbyTickets.filter(ticket => ticket.find(value => errors.includes(value)) !== undefined);
  let normalTickets = nearbyTickets.filter(ticket => ticket.find(value => errors.includes(value)) === undefined);

  const realTickets = [
    ...normalTickets,
    myTicket
  ];
  const COLUMNS = myTicket.length;
  console.log({ COLUMNS });
  const matches = rules.map(rule => {
    const columns = [];
    for (let column = 0; column < COLUMNS; column++) {
      const isMatched = realTickets
        .map(ticket => ticket[column])
        .map(value => inRange(rule.periods, value))
        .reduce((acc, val) => acc && val);

      if (isMatched)
        columns.push(column);
    }

    return {
      rule: rule.name,
      columns
    };
  });

  console.log(matches.map(
    x => `${x.rule} -> ${x.columns.join(',')}`
  ));

  const headers = recognize(matches);
  console.log({ headers });

  return headers
    .filter(h => h.rule.startsWith('departure'))
    .map(h => h.column)
    .map(c => myTicket[c])
    .reduce((acc, val) => acc * val, 1);
};

// console.log(part2(test2));
console.log(part2(input));
