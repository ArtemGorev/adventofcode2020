const fs = require('fs');
const input = fs.readFileSync('./input.txt', { encoding: 'utf-8' });
const passportsRaw = input.split('\n\n');
console.log(passportsRaw.length);
const necessaryFields = ['byr', 'iyr', 'eyr', 'hgt', 'hcl', 'ecl', 'pid'];
let eyeColors = ['amb', 'blu', 'brn', 'gry', 'grn', 'hzl', 'oth'];

const isInteger = (value) => Number.isInteger(parseInt(value));
const isMin = (value, min) => parseInt(value) >= min;
const isMax = (value, max) => parseInt(value) <= max;

const inRange = (value, min, max) => isInteger(value) && isMin(value, min) && isMax(value, max);
const isHeight = (value) => {
  if (value.endsWith('in')) return inRange(value.replace('/in$/', ''), 59, 76);
  if (value.endsWith('cm')) return inRange(value.replace('/cm$/', ''), 150, 193);
  return false;
};

const isHairColor = (value) => /^#[0-9a-f]{6}$/.test(value);
const isEyeColor = (value) => eyeColors.includes(value);
const isPassport = (value) => /^[0-9]{9}$/.test(value);


function isValid(key, value) {
  if(value === undefined) return false;

  switch (key) {
    case 'byr':
      return inRange(value, 1920, 2002);
    case 'iyr':
      return inRange(value, 2010, 2020);
    case 'eyr':
      return inRange(value, 2020, 2030);
    case 'hgt':
      return isHeight(value);
    case 'hcl':
      return isHairColor(value);
    case 'ecl':
      return isEyeColor(value);
    case 'pid':
      return isPassport(value);
    case 'cid':
      return true;
    default:
      console.log(`${key}:${value}`);
      return false;
  }
}

const extractFields = p => p.split(/\n|\s/)
  .map(f => f
    .split(':'))
  .reduce((acc, [key, value]) => Object.assign(acc, { [key]: value }), {});

const isValidPassport = p => !(necessaryFields.map(f => isValid(f, p[f])).includes(false));

const passports = passportsRaw.map(extractFields);
const step1 = passports.filter(isValidPassport);

console.log(step1.length);
