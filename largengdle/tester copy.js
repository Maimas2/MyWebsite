var ns = require( '@stdlib/stats/array' );
var fs = require('fs');
const { floor, random, max, min } = Math;

// let TODO = -1;
let lizst = [ ];
let TODO = -1;

var o = ns;

// ----------- BEGIN COPIED SECTION -----------

const listOfBadges = [
    {
        name : "Stay Positive",
        desc : "Contains no 0",
        value : 4.32,
        stringId : "",
        checker : function(num) {
            return !String(num).includes("0")
        }
    },
    {
        name : "Burnt Out",
        desc : "Contains no 1",
        value : 4.32,
        stringId : "",
        checker : function(num) {
            return !String(num).includes("1")
        }
    },
    {
        name : "No Company",
        desc : "Contains no 2",
        value : 4.32,
        stringId : "",
        checker : function(num) {
            return !String(num).includes("2")
        }
    },
    {
        name : "Magicless",
        desc : "Contains no 3",
        value : 4.32,
        stringId : "",
        checker : function(num) {
            return !String(num).includes("3")
        }
    },
    {
        name : "All for One, No Four for All",
        desc : "Contains no 4",
        value : 4.32,
        stringId : "",
        checker : function(num) {
            return !String(num).includes("4")
        }
    },
    {
        name : "Up in Heaven",
        desc : "Contains no 5",
        value : 4.32,
        stringId : "",
        checker : function(num) {
            return !String(num).includes("5")
        }
    },
    {
        name : "Devil-Disliker",
        desc : "Contains no 6",
        value : 4.32,
        stringId : "",
        checker : function(num) {
            return !String(num).includes("6")
        }
    },
    {
        name : "Unlucky",
        desc : "Contains no 7",
        value : 4.32,
        stringId : "",
        checker : function(num) {
            return !String(num).includes("7")
        }
    },
    {
        name : "Hungry",
        desc : "Contains no 8",
        value : 4.32,
        stringId : "",
        checker : function(num) {
            return !String(num).includes("8")
        }
    },
    {
        name : "Yes (DE)",
        desc : "Contains no 9",
        value : 4.32,
        stringId : "",
        checker : function(num) {
            return !String(num).includes("9")
        }
    },
    {
        name : "Get out of my head",
        desc : "Contains 67",
        value : 8.23,
        stringId : "",
        checker : function(num) {
            return String(num).includes("67")
        }
    },
]

var listOfCheckFuncs = [
    function(num) {
        if(num % 2n == 0) return ["Even", "Divisible by two", 2];
        else return false;
    },
    function(num) {
        if(String(num).includes("7777777")) return ["Jackpot", "Contains 7777777", TODO]
        else if(String(num).includes("777777")) return ["Unbelievably Lucky", "Contains 777777", TODO]
        else if(String(num).includes("77777")) return ["Super Lucky", "Contains 77777", TODO]
        else if(String(num).includes("7777")) return ["Very Lucky", "Contains 7777", 916.7]
        else if(String(num).includes("777")) return ["Lucky", "Contains 777", 85.3]
        else return false;
    },
    function(num) {
        if(String(num).includes("666666")) return ["The Devil Himself", "Contains 666666", TODO]
        else if(String(num).includes("66666")) return ["Deathly Unlucky", "66666", TODO]
        else if(String(num).includes("6666")) return ["Disturbing Omens", "Contains 6666", 916.7]
        else if(String(num).includes("666")) return ["Bad Day", "Contains 666", 85.3]
        else return false;
    },
    function(num) {
        let s = String(num);
        let m = max(
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
        );
        if(m == s.length) return ["Unanimity", "All digits the same", 10**13]
        else return false;
    },
    function(num) {
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
        if(m == 15) return ["We're so back", `Fifteen digits the same (${mi})`, 9*10**13]
        else if(m == 14) return ["Oh So Close", `Fourteen digits the same (${mi})`, TODO]
        else if(m == 13) return ["Unlucky (reprise)", `Thirteen digits the same (${mi})`, TODO]
        else if(m == 12) return ["Those Three Outliers", `Twelve digits the same (${mi})`, TODO]
        else if(m == 11) return ["And then there were four...", `Eleven digits the same (${mi})`, TODO]
        else if(m == 10) return ["Under the Ten-t", `Ten digits the same (${mi})`, TODO]
        else if(m == 9) return ["Nine-son-God", `Nine digits the same (${mi})`, TODO]
        else if(m == 8) return ["Octogon", `Eight digits the same (${mi})`, TODO]
        else if(m == 7) return ["Oh baby a... septuple??", `Seven digits the same (${mi})`, TODO]
        else if(m == 6) return ["Six? I can barely count that high", `Six digits the same (${mi})`, 53.5]
        else if(m == 5) return ["Flush Five", `Five digits the same (${mi})`, 10]
        else if(m == 4) return ["In Four the Money", `Four digits the same (${mi})`, 2.75]
        else return false;
    },
    function(num) {
        let s = String(num);
        if(s.includes("3141592653")) return ["Mmmm Pi (10)", "Contains 3141592653", TODO]
        else if(s.includes("314159265")) return ["Mmmm Pi (9)", "Contains 314159265", TODO]
        else if(s.includes("31415926")) return ["Mmmm Pi (8)", "Contains 31415926", TODO]
        else if(s.includes("3141592")) return ["Mmmm Pi (7)", "Contains 3141592", TODO]
        else if(s.includes("314159")) return ["Mmmm Pi (6)", "Contains 314159", TODO]
        else if(s.includes("31415")) return ["Mmmm Pi (5)", "Contains 31415", TODO]
        else if(s.includes("3141")) return ["Mmmm Pi (4)", "Contains 3141", 855]
        else if(s.includes("314")) return ["Mmmm Pi (3)", "Contains 314", 77.2]
        else return false;
    },
    function(num) {
        let s = String(num);
        if(s.includes("2718281828")) return ["E-aster Bunny (10)", "Contains 2718281828", TODO]
        else if(s.includes("271828182")) return ["E-aster (9)", "Contains 271828182", TODO]
        else if(s.includes("27182818")) return ["E-aster (8)", "Contains 27182818", TODO]
        else if(s.includes("2718281")) return ["E-aster (7)", "Contains 2718281", TODO]
        else if(s.includes("271828")) return ["E-aster (6)", "Contains 271828", TODO]
        else if(s.includes("27182")) return ["E-aster (5)", "Contains 27182", TODO]
        else if(s.includes("2718")) return ["E-aster (4)", "Contains 2718", 855]
        else if(s.includes("271")) return ["E-aster (3)", "Contains 271", 77.2]
        else return false;
    },
    function(num) {
        let s = String(num);
        if(s.includes("5772156649")) return ["The Euler-Mascheroni Constant (10)", "Contains 5772156649", TODO]
        else if(s.includes("577215664")) return ["Euler-Mascheroni (9)", "Contains 577215664", TODO]
        else if(s.includes("57721566")) return ["Euler-Mascheroni (8)", "Contains 57721566", TODO]
        else if(s.includes("5772156")) return ["Euler-Mascheroni (7)", "Contains 5772156", TODO]
        else if(s.includes("577215")) return ["Euler (6)", "Contains 577215", TODO]
        else if(s.includes("57721")) return ["Euler (5)", "Contains 57721", TODO]
        else if(s.includes("5772")) return ["Euler (4)", "Contains 5772", 855]
        else if(s.includes("577")) return ["Euler (3)", "Contains 577", 77.2]
        else return false;
    },
    function(num) {
        let l = String(num).length;
        return [`Length ${l}`, `Number is has ${l} digits`, 1.11 * 10**(15-l)];
    },
    function(num) {
        let s = String(num);
        for(var i = 0; i < 10; i++) {
            if(!s.includes(i)) return false;
        }
        return ["Utilitarian", "All digits used", 22.7]
    },
    function(num) {
        let sum = 0n;
        let tnum = num;
        while(tnum > 0) {
            sum += tnum % 10n;
            tnum /= 10n;
        }
        if(sum <= 20) return ["Nonexistent Sum", "Sum of the digits is at most 20", 10000]
        else if(sum <= 28) return ["Miniscule Sum", "Sum of the digits is at most 28", 1000]
        else if(sum <= 34) return ["Small Sum", "Sum of the digits is at most 34", 100]
        else if(sum <= 53) return ["Petit Sum", "Sum of the digits is at most 53", 10]

        else if(sum >= 115) return ["Overwhelming Sum", "Sum of the digits is at least 107", 10000]
        else if(sum >= 107) return ["Huge Sum", "Sum of the digits is at least 107", 1000]
        else if(sum >= 100) return ["Big Sum", "Sum of the digits is at least 100", 100]
        else if(sum >= 82) return ["Sizable Sum", "Sum of the digits is at least 82", 10]
    },
    function(num) {
        let adj = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        let s = String(num);
        let last = "(";
        let currentCount = 0;
        for(var i = 0; i < s.length; i++) {
            if(s[i] == last) {
                currentCount++;
                adj[currentCount]++;
            } else {
                currentCount = 1;
                last = s[i];
            }
        }

        if(adj[8]) return ["Adjacent Octuple", "Eight of the same digit adjacent", TODO]
        else if(adj[7]) return ["Adjacent Heptuple", "Seven of the same digit adjacent", TODO]
        else if(adj[6]) return ["Adjacent Hexuple", "Six of the same digit adjacent", TODO]
        else if(adj[5]) return ["Adjacent Pentuple", "Five of the same digit adjacent", 1017]
        else if(adj[4]) return ["Adjacent Quadruple", "Four of the same digit adjacent", 92.9]
        else if(adj[3]) return ["Adjacent Triple", "Three of the same digit adjacent", 8.89]
    },
    function(num) {
        let adj = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        let s = String(num);
        let last = "(";
        let currentCount = 0;
        for(var i = 0; i < s.length; i++) {
            if(s[i] == last) {
                currentCount++;
                adj[currentCount]++;
            } else {
                currentCount = 1;
                last = s[i];
            }
        }

        if(adj[3] == 5) return ["Five Conglomerated Triplet", "Five sets of three of the same digit, all adjacent", TODO]
        else if(adj[3] == 4) return ["Four Conglomerated Triplet", "Four sets of three of the same digit, adjacent", TODO]
        else if(adj[3] == 3) return ["Three Conglomerated Triplet", "Three sets of three of the same digit, adjacent", TODO]
        else if(adj[3] == 2) return ["Two Conglomerated Triplet", "Two sets of three of the same digit, adjacent", TODO]
    },
    function(num) {
        let adj = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        let s = String(num);
        let last = "(";
        let currentCount = 0;
        for(var i = 0; i < s.length; i++) {
            if(s[i] == last) {
                currentCount++;
                adj[currentCount]++;
            } else {
                currentCount = 1;
                last = s[i];
            }
        }

        if(adj[3] == 6) return ["Six Conglomerated Pair", "Six pairs of the same digit, all adjacent", TODO]
        else if(adj[3] == 5) return ["Five Conglomerated Pair", "Five pairs of the same digit, all adjacent", TODO]
        else if(adj[3] == 4) return ["Four Conglomerated Pair", "Four pairs of the same digit, adjacent", TODO]
        else if(adj[3] == 3) return ["Three Conglomerated Pair", "Three pairs of the same digit, adjacent", TODO]
        else if(adj[3] == 2) return ["Two Conglomerated Pair", "Two pairs of the same digit, adjacent", TODO]
    },
    function(num) {
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

        if(adj[3] >= 3 && adj[2] >= 3) return ["Conglomerated Fullest House", "Three full houses, all unique digits which are individually adjacent", TODO]
        else if(adj[3] >= 3 && adj[2] >= 2) return ["Conglomerated Full Full House", "Two full houses, all unique digits which are individually adjacent, plus a third adjacent triple", TODO]
        else if(adj[3] >= 2 && adj[2] >= 2) return ["Conglomerated Double Full House", "Two full houses, all unique digits which are individually adjacent", TODO]
        else if(adj[3] >= 2 && adj[2] >= 1) return ["Conglomerated Half Double Full House", "Two sets of three of the same digit, adjacent, plus a conglomerated pair", TODO]
        else if(adj[3] >= 1 && adj[2] >= 2) return ["Conglomerated Full House Plus", "A set of three of the same digit, adjacent, plus two sets of two, adjacent", TODO]
        else if(adj[3] >= 1 && adj[2] >= 1) return ["Conglomerated Full House", "A triplet a pair, each all together", TODO]
    },
    function(num) {
        let nums = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        let s = String(num);

        nums[(s.match(/0/g) || []).length]++;
        nums[(s.match(/1/g) || []).length]++;
        nums[(s.match(/2/g) || []).length]++;
        nums[(s.match(/3/g) || []).length]++;
        nums[(s.match(/4/g) || []).length]++;
        nums[(s.match(/5/g) || []).length]++;
        nums[(s.match(/6/g) || []).length]++;
        nums[(s.match(/7/g) || []).length]++;
        nums[(s.match(/8/g) || []).length]++;
        nums[(s.match(/9/g) || []).length]++;

        for(var i = 13; i >= 3; i--) {
            nums[i] += nums[i+1];
        }

        if(nums[3] >= 3 && nums[2] >= 3) return ["Fullest House", "Three full houses", 348]
        else if(nums[3] >= 3 && nums[2] >= 2) return ["Full Full House", "Two full houses plus a third triple", 20.1]
        else if(nums[3] >= 2 && nums[2] >= 2) return ["Double Full House", "Two unique full houses", 2.49]
        else if(nums[3] >= 2 && nums[2] >= 1) return ["Half Double Full House", "One full house, plus another triplet", 6.29]
        else if(nums[3] >= 1 && nums[2] >= 2) return ["Full House Plus", "One full house, plus another pair", 3.27] // test
        else if(nums[3] >= 1 && nums[2] >= 1) return ["Full House", "A bare full house. Very rare!", 441]
    }
]

// -----------  END COPIED SECION  -----------

function generateRandom() {
    var toReturn = BigInt(0);
    for(var i = 0; i < 15; i++) {
        toReturn += (10n ** BigInt(i)) * BigInt(floor(random() * 10));
    }
    return toReturn;
}

for(var i = 0n; i < 1000000n; i++) {
    let chosenNumber = generateRandom();

    var chosenStr = String(chosenNumber);

    let sumPoints = 0;

    for(var badgeid = 0; badgeid < listOfBadges.length; badgeid++) {
        let badge = listOfBadges[badgeid];
        if(badge.checker(chosenNumber)) {
            sumPoints += badge.value;
        }
    }
    for(var badgeid = 0; badgeid < listOfCheckFuncs.length; badgeid++) {
        let ret = listOfCheckFuncs[badgeid](chosenNumber);
        if(ret) {
            sumPoints += ret[2];
        }
    }

    lizst.push(sumPoints);

    if(i && i % 100000n == 0) console.log(`${(i / 100000n)} %`)
}

console.log("Sorting...")
lizst.sort();

console.log(`Mean: ${o.mean(lizst)}`)
console.log(`Median: ${o.mediansorted(lizst)}`)
console.log(`Min: ${o.min(lizst)}`)
console.log(`Max: ${o.max(lizst)}`)
console.log(`Range: ${o.range(lizst)}`)
console.log(`Stdev: ${o.stdev(lizst)}`)

console.log();

for(var i = 0; i < 10; i++) {
    console.log(`${i*10}%-ile: ${lizst[(lizst.length/10) * i]}`)
}