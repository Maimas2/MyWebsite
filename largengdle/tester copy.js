var ns = require( '@stdlib/stats/array' );
var fs = require('fs');
const generator  = require("./generate");

const { floor, random, max, min } = Math;

// let TODO = -1;
let lizst = [ ];
let TODO = -1;

var o = ns;

for(var i = 0n; i < 1000000n; i++) {
    let d = generator.generateInfo();
    let sumPoints = d.sumPoints;

    lizst.push(sumPoints);

    if(i && i % 100000n == 0) console.error(`${(i / 100000n)} %`)
}

console.error("Sorting...")
lizst.sort();

console.error(`Mean: ${o.mean(lizst)}`)
console.error(`Median: ${o.mediansorted(lizst)}`)
console.error(`Min: ${o.min(lizst)}`)
console.error(`Max: ${o.max(lizst)}`)
console.error(`Range: ${o.range(lizst)}`)
console.error(`Stdev: ${o.stdev(lizst)}`)

// for(var i = 0; i < 10; i++) {
//     console.log(`${i*10}%-ile: ${lizst[(lizst.length/10) * i]}`)
// }
console.log("Points")
console.log(lizst.join("\n"))