var listOfBadges = require("./listofbadges.js").listOfBadges;
const { floor, random, max, min } = Math;
var os = require("os");

let TODO = -1;

function test(num) {
    let s = String(num);
    let a = [
        (s.match(/0/g) || []).length,
        (s.match(/1/g) || []).length,
        (s.match(/2/g) || []).length,
        (s.match(/3/g) || []).length,
        (s.match(/4/g) || []).length,
        (s.match(/5/g) || []).length,
        (s.match(/6/g) || []).length,
        (s.match(/7/g) || []).length,
        (s.match(/8/g) || []).length,
        (s.match(/9/g) || []).length,
    ]
    let m = max.apply(Math, a);
    let mi = a.findIndex((el) => el == m);
    if(m == 15) return [["We're so back", `Fifteen digits the same (${mi})`, 9*10**13]]
    else if(m == 14) return [["Oh So Close", `Fourteen digits the same (${mi})`, TODO]]
    else if(m == 13) return [["Unlucky (reprise)", `Thirteen digits the same (${mi})`, TODO]]
    else if(m == 12) return [["Those Three Outliers", `Twelve digits the same (${mi})`, TODO]]
    else if(m == 11) return [["And then there were four...", `Eleven digits the same (${mi})`, 10000000]]
    else if(m == 10) return [["Under the Ten-t", `Ten digits the same (${mi})`, 666666.7]]
    else if(m == 9) return [["Nine-son-God", `Nine digits the same (${mi})`, 36900.3]]
    else if(m == 8) return [["Octogon", `Eight digits the same (${mi})`, 3430]]
    else if(m == 7) return [["Oh baby a... septuple??", `Seven digits the same (${mi})`, 379.7]]
    else if(m == 6) return [["Six? I can barely count that high", `Six digits the same (${mi})`, 53.5]]
    else if(m == 5) return [["Flush Five", `Five digits the same (${mi})`, 10]]
    else if(m == 4) return [["In Four the Money", `Four digits the same (${mi})`, 2.75]]
    else return false;
}

function generateRandom() {
    var toReturn = BigInt(0);
    for(var i = 0; i < 15; i++) {
        toReturn += (10n ** BigInt(i)) * BigInt(floor(random() * 10));
    }
    return toReturn;
}

var found = {  };
var total = 0n;

for(var i = 0n; i < 10000000n; i++) {
    let trr = null;
    if(trr = test(generateRandom())) {
        let tr = trr[0];
        if(tr) found[tr[0]] = found[tr[0]]+1 || 1;
    }
    total++;
    //if(i % 100000n == 0n) console.log(`${i * 100n / 10000000n} %, currently ${found} of ${String(total)}, prop. ${Number(found*10n**10n / total)/10**10}`);
    if(i % 100000n == 0n) console.log(`${i * 100n / 10000000n} %, currently ${JSON.stringify(found)}`);

    if(i == 10000000n-1n && found < 100n) {
        //console.log(`Restarting due to low turnout, currently ${Number(found*10n**10n / total)/10**10}`);
        console.log(`Restarting due to low turnout`);
        i = 0n;
    }
}

//console.log(`Found ${found} out of ${String(total)}, a proportion of ${Number(found*10n**10n / total)}/10**10`)
console.log(JSON.stringify(found));