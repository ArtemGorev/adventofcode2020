const rawInput: string = await Deno.readTextFile('./input.txt');
const rawRules: string[] = rawInput.split('\n').filter(s => s.length > 0);

type Content = {
  color: string,
  quantity: number
}

type Rule = {
  color: string,
  content: Content[]
}

const removeBags = (s: string): string => s.replaceAll(/bag[s]/g, '');
const removeDots = (s: string): string => s.replaceAll(/[.]/g, '');

function parseContent(s: string): Content[] {
  return s.split(',')
    .map(s => s.trim())
    .filter(s => s !== 'no other')
    .map(s => {
        const match = /(\d+) (\w+ \w+)/gm.exec(s)!;
        return {
          color: match[2],
          quantity: parseInt(match[1])
        };
      }
    );
}

const parseRule = (raw: string): Rule => {
  const parts = removeDots(
    removeBags(raw)
  ).split('contain')
    .map(s => s.trim());


  return ({
    color: parts[0],
    content: parseContent(parts[1])
  });
};

const rules: Rule[] = rawRules.map(raw => parseRule(raw));
console.log(`amount of rules ${rules.length}`);

const getParentBags = (colors: string[]): string[] => {
  const result = [...new Set(
    colors.concat(
      rules
        .filter(
          rule => rule.content.some(
            content => colors.includes(content.color)
          )
        )
        .map(rule => rule.color)
    )
  )];

  return (result.length === colors.length)
    ? result
    : getParentBags(result);
};

const getChildBags = (color: string): number => {
  let contents = rules
    .find(rule => rule.color === color)!
    .content;
  const result = contents
    .map(content => content.quantity + content.quantity * getChildBags(content.color))
    .reduce((acc, val) => acc + val, 0) ;

  return result;
};

// const value1 = getParentBags(['shiny gold']);
// console.log(value1.length);

const value2 = getChildBags('shiny gold');
console.log((value2));
