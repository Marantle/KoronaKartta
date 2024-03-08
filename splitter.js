const fs = require('fs');

// read file from ./data/hsData.json
const hsData = JSON.parse(fs.readFileSync('./data/hsData.json', 'utf8')).hsData;

console.log({length: hsData.confirmed.length});
console.log({length: hsData.deaths.length});
console.log({length: hsData.recovered.length});
console.log(Object.keys(hsData))

const halfOfConfirmed = hsData.confirmed.slice(0, 500000);
const restOfConfirmed = hsData.confirmed.slice(500000);
console.log({length1: halfOfConfirmed.length, length2: restOfConfirmed.length, totalLength: halfOfConfirmed.length + restOfConfirmed.length});

const firstHsData = {hsData: { confirmed: halfOfConfirmed, deaths: hsData.deaths, recovered: hsData.recovered }};
const extraHsData = {hsData: { confirmed: restOfConfirmed, deaths: [], recovered: [] }};

fs.writeFileSync('./data/firstHsData.json', JSON.stringify(firstHsData), 'utf8');
fs.writeFileSync('./data/secondHsData.json', JSON.stringify(extraHsData), 'utf8');