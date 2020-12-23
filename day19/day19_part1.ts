import { create } from "./nfa.ts";

const test1 = await Deno.readTextFile('./test1.txt');
const test0 = await Deno.readTextFile('./test0.txt');
const input = await Deno.readTextFile('./input.txt');

type Rule = number[] | number[][] | string;
type RuleId = number;
type RuleObject = {
  id: RuleId;
  rule: Rule;
}
type Message = string;


const parseRuleObject = (raw: string): RuleObject => {
  const [id, rule] = raw.split(': ');
  return {
    id: +(id.trim()),
    rule: parseRule(rule)
  };
};
const parseRule = (raw: string): Rule => {
  if (raw.includes('|')) {
    return raw
      .split('|')
      .map(line => line.trim()
        .split(' ')
        .map(line => line.trim())
        .filter(line => line)
        .map(n => +n));
  } else if (raw.includes('"')) {
    return raw.slice(raw.indexOf('"') + 1, raw.lastIndexOf('"'));
  } else {
    return raw.split(' ').map(n => +n);
  }
};

const getStrings = (rawRules: string): string[] =>
  rawRules.split('\n').filter(x => x);

function parse(data: string): [RuleObject[], Message[]] {
  const [rawRules, rawMessages] = data.split('\n\n');
  return [
    getStrings(rawRules).map(raw => parseRuleObject(raw)),
    getStrings(rawMessages).map(raw => raw.trim())
  ];
}

function createDefinition(rules: RuleObject[]) {

}

const accept = (rules: RuleObject[], msg: Message): boolean => {
  var automaton = create(createDefinition(rules));

};

const match = (data: string): number => {
  const [rules, messages] = parse(data);
  return messages.filter(msg => accept(rules, msg)).length;
};

const log = (logged: any) => {
  console.log({ logged });
  return logged;
};


// console.assert(log(match(test1)) === 2);
console.assert(log(match(test0)) === 1);
