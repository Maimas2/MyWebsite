var listOfBadges = require("./listofbadges.js").listOfBadges;
const { floor, random, max, min } = Math;
var os = require("os");

let TODO = -1;

function test(num) {
        let adj = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        let s = String(num);
        let last = "(";
        let currentCount = 0;
        for(var i = 0; i < s.length; i++) {
            if(s[i] == last) {
                currentCount++;
                adj[currentCount-1]--;
                adj[currentCount]++;
            } else {
                currentCount = 1;
                last = s[i];
            }
        }

        if(adj[2] >= 7) return ["Seven Conglomerated Pair", "Seven pair, all individually adjacent", TODO]
        else if(adj[2] >= 6) return ["Six Conglomerated Pair", "Six pair, all individually adjacent", 31646]
        else if(adj[2] >= 5) return ["Five Conglomerated Pair", "Five pair, all adjacent", 1042]
        else if(adj[2] >= 4) return ["Four Conglomerated Pair", "Four pair, all individually adjacent", 87.7]
        else if(adj[2] >= 3) return ["Three Conglomerated Pair", "Three pair, all individually adjacent", 14]
        else if(adj[2] >= 2) return ["Two Conglomerated Pair", "Two pair, all individually adjacent", 4.21]
    }

function generateRandom() {
    var toReturn = BigInt(0);
    for(var i = 0; i < 15; i++) {
        toReturn += (10n ** BigInt(i)) * BigInt(floor(random() * 10));
    }
    return toReturn;
}

var found = { "Seven Conglomerated Pair": 0, "Six Conglomerated Pair": 0, "Five Conglomerated Pair": 0, "Four Conglomerated Pair": 0, "Three Conglomerated Pair": 0, "Two Conglomerated Pair": 0 };
var total = 0n;

for(var i = 0n; i < 10000000n; i++) {
    let tr = null;
    if(tr = test(generateRandom())) {
        found[tr[0]]++;
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