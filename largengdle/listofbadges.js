var TODO = -1;
const { floor, random, max, min, log10 } = Math;

const rainbowColors = ["rgba(255, 0, 0, 0.4)", "rgba(255, 120, 0, 0.4)", "rgba(255, 255, 0, 0.4)", "rgba(0, 255, 0, 0.4)", "rgba(0, 0, 255, 0.4)", "rgba(120, 0, 255, 0.4)", ]

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
    }
]

function indecesToPos(num, indeces, color=["rgba(0, 0, 255, 0.5)"]) {
    let toReturn = Array(String(num).length).fill(false);
    if(typeof color == "string") color = [color];
    for(var i = 0; i < indeces.length; i++) {
        toReturn[indeces[i]] = color[i % color.length];
    }
    return toReturn;
}

function expArr(fInd, len) {
    let toReturn = Array(len);
    for(var i = 0; i < len; i++) {
        toReturn[i] = fInd + i;
    }
    return toReturn;
}

var listOfCheckFuncs = [
    function(num) {
        let s = String(num);
        if(s.includes("67")) {
            return [["Get out of my head", "Contains 67", 8.23, indecesToPos(num, [s.indexOf("67"), s.indexOf("67")+1])]]
        }
    },
    function(num) {
        if(num % 2n == 0) return [[ "Even", "Divisible by two", 2, indecesToPos(num, [String(num).length-1]) ]];
        else return false;
    },
    function(num) {
        if(String(num).includes("7777777")) return [["Jackpot", "Contains 7777777", TODO, indecesToPos(num, expArr(String(num).indexOf("7777777"), 7), "rgb(255, 150, 150)")]]
        else if(String(num).includes("777777")) return [["Unbelievably Lucky", "Contains 777777", TODO, indecesToPos(num, expArr(String(num).indexOf("777777"), 6), "rgb(255, 150, 150)")]]
        else if(String(num).includes("77777")) return [["Super Lucky", "Contains 77777", TODO, indecesToPos(num, expArr(String(num).indexOf("77777"), 5, indecesToPos(num, expArr(String(num).indexOf("77777"), 5), "rgb(255, 150, 150)")), "gold") ]]
        else if(String(num).includes("7777")) return [["Very Lucky", "Contains 7777", 916.7, indecesToPos(num, expArr(String(num).indexOf("7777"), 4), "rgb(255, 125, 125)") ]]
        else if(String(num).includes("777")) return [["Lucky", "Contains 777", 85.3, indecesToPos(num, expArr(String(num).indexOf("777"), 3), "rgb(255, 150, 150)") ]]
        else return false;
    },
    function(num) {
        if(String(num).includes("666666")) return [["The Devil Himself", "Contains 666666", TODO]]
        else if(String(num).includes("66666")) return [["Deathly Unlucky", "66666", TODO]]
        else if(String(num).includes("6666")) return [["Disturbing Omens", "Contains 6666", 916.7]]
        else if(String(num).includes("666")) return [["Bad Day", "Contains 666", 85.3]]
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
        if(m == s.length) return [["Unanimity", "All digits the same", 10**13, indecesToPos(num, expArr(0, s.length), "gold")]]
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
        if(m == 15) return [["We're so back", `Fifteen digits the same (${mi})`, 9*10**13]]
        else if(m == 14) return [["Oh So Close", `Fourteen digits the same (${mi})`, TODO]]
        else if(m == 13) return [["Unlucky (reprise)", `Thirteen digits the same (${mi})`, TODO]]
        else if(m == 12) return [["Those Three Outliers", `Twelve digits the same (${mi})`, TODO]]
        else if(m == 11) return [["And then there were four...", `Eleven digits the same (${mi})`, TODO]]
        else if(m == 10) return [["Under the Ten-t", `Ten digits the same (${mi})`, TODO]]
        else if(m == 9) return [["Nine-son-God", `Nine digits the same (${mi})`, TODO]]
        else if(m == 8) return [["Octogon", `Eight digits the same (${mi})`, TODO]]
        else if(m == 7) return [["Oh baby a... septuple??", `Seven digits the same (${mi})`, TODO]]
        else if(m == 6) return [["Six? I can barely count that high", `Six digits the same (${mi})`, 53.5]]
        else if(m == 5) return [["Flush Five", `Five digits the same (${mi})`, 10]]
        else if(m == 4) return [["In Four the Money", `Four digits the same (${mi})`, 2.75]]
        else return false;
    },
    function(num) {
        let s = String(num);
        if(s.includes("3141592653")) return [["Mmmm Pi (10)", "Contains 3141592653", TODO]]
        else if(s.includes("314159265")) return [["Mmmm Pi (9)", "Contains 314159265", TODO]]
        else if(s.includes("31415926")) return [["Mmmm Pi (8)", "Contains 31415926", TODO]]
        else if(s.includes("3141592")) return [["Mmmm Pi (7)", "Contains 3141592", TODO]]
        else if(s.includes("314159")) return [["Mmmm Pi (6)", "Contains 314159", TODO]]
        else if(s.includes("31415")) return [["Mmmm Pi (5)", "Contains 31415", TODO]]
        else if(s.includes("3141")) return [["Mmmm Pi (4)", "Contains 3141", 855]]
        else if(s.includes("314")) return [["Mmmm Pi (3)", "Contains 314", 77.2]]
        else return false;
    },
    function(num) {
        let s = String(num);
        if(s.includes("2718281828")) return [["E-aster Bunny (10)", "Contains 2718281828", TODO]]
        else if(s.includes("271828182")) return [["E-aster (9)", "Contains 271828182", TODO]]
        else if(s.includes("27182818")) return [["E-aster (8)", "Contains 27182818", TODO]]
        else if(s.includes("2718281")) return [["E-aster (7)", "Contains 2718281", TODO]]
        else if(s.includes("271828")) return [["E-aster (6)", "Contains 271828", TODO]]
        else if(s.includes("27182")) return [["E-aster (5)", "Contains 27182", TODO]]
        else if(s.includes("2718")) return [["E-aster (4)", "Contains 2718", 855]]
        else if(s.includes("271")) return [["E-aster (3)", "Contains 271", 77.2]]
        else return false;
    },
    function(num) {
        let s = String(num);
        if(s.includes("5772156649")) return [["The Euler-Mascheroni Constant (10)", "Contains 5772156649", TODO, indecesToPos(num, expArr(s.indexOf("5772156649"), 10), "rgb(255, 150, 150)") ]]
        else if(s.includes("577215664")) return [["Euler-Mascheroni (9)", "Contains 577215664", TODO, indecesToPos(num, expArr(s.indexOf("577215664"), 9), "rgb(255, 150, 150)") ]]
        else if(s.includes("57721566")) return [["Euler-Mascheroni (8)", "Contains 57721566", TODO, indecesToPos(num, expArr(s.indexOf("57721566"), 8), "rgb(255, 150, 150)") ]]
        else if(s.includes("5772156")) return [["Euler-Mascheroni (7)", "Contains 5772156", TODO, indecesToPos(num, expArr(s.indexOf("5772156"), 7), "rgb(255, 150, 150)") ]]
        else if(s.includes("577215")) return [["Euler (6)", "Contains 577215", TODO, indecesToPos(num, expArr(s.indexOf("577215"), 6), "rgb(255, 150, 150)") ]]
        else if(s.includes("57721")) return [["Euler (5)", "Contains 57721", TODO, indecesToPos(num, expArr(s.indexOf("57721"), 5), "rgb(255, 150, 150)") ]]
        else if(s.includes("5772")) return [["Euler (4)", "Contains 5772", 855, indecesToPos(num, expArr(s.indexOf("5772"), 4), "rgb(255, 150, 150)") ]]
        else if(s.includes("577")) return [["Euler (3)", "Contains 577", 77.2, indecesToPos(num, expArr(s.indexOf("577"), 3), "rgb(255, 150, 150)") ]]
        else return false;
    },
    function(num) {
        let l = String(num).length;
        return [[`Length ${l}`, `Number is has ${l} digits`, 1.11 * 10**(15-l)]];
    },
    function(num) {
        let s = String(num);
        for(var i = 0; i < 10; i++) {
            if(!s.includes(i)) return false;
        }
        return [["Utilitarian", "All digits used", 22.7]];
    },
    function(num) {
        let sum = 0n;
        let tnum = num;
        while(tnum > 0) {
            sum += tnum % 10n;
            tnum /= 10n;
        }
        if(sum <= 20) return [["Nonexistent Sum", `Sum of the digits is at most 20 (it is ${sum})`, 10000]]
        else if(sum <= 28) return [["Miniscule Sum", `Sum of the digits is at most 28 (it is ${sum})`, 1000]]
        else if(sum <= 34) return [["Small Sum", `Sum of the digits is at most 34 (it is ${sum})`, 100]]
        else if(sum <= 53) return [["Petit Sum", `Sum of the digits is at most 53 (it is ${sum})`, 10]]

        else if(sum >= 115) return [["Overwhelming Sum", `Sum of the digits is at least 115 (it is ${sum})`, 10000]]
        else if(sum >= 107) return [["Huge Sum", `Sum of the digits is at least 107 (it is ${sum})`, 1000]]
        else if(sum >= 100) return [["Big Sum", `Sum of the digits is at least 100 (it is ${sum})`, 100]]
        else if(sum >= 82) return [["Sizable Sum", `Sum of the digits is at least 82 (it is ${sum})`, 10]]
    },
    function(num) {
        let adj = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        let ids = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        let s = String(num);
        let last = "(";
        let currentCount = 0;
        for(var i = 0; i < s.length; i++) {
            if(s[i] == last) {
                currentCount++;
                adj[currentCount]++;
            } else {
                ids[currentCount] = i-currentCount;
                currentCount = 1;
                last = s[i];
            }
        }

        if(adj[8]) return [["Adjacent Octuple", "Eight of the same digit adjacent", TODO, indecesToPos(num, expArr(ids[8], 8)) ]]
        else if(adj[7]) return [["Adjacent Heptuple", "Seven of the same digit adjacent", TODO, indecesToPos(num, expArr(ids[7], 7)) ]]
        else if(adj[6]) return [["Adjacent Hexuple", "Six of the same digit adjacent", TODO, indecesToPos(num, expArr(ids[6], 6)) ]]
        else if(adj[5]) return [["Adjacent Pentuple", "Five of the same digit adjacent", 1017, indecesToPos(num, expArr(ids[5], 5)) ]]
        else if(adj[4]) return [["Adjacent Quadruple", "Four of the same digit adjacent", 92.9, indecesToPos(num, expArr(ids[4], 4)) ]]
    },
    function(num) {
        let adj = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        let ids = [[], [], [], [], [], [], [], [], [], [], [], []];
        let s = String(num);
        let last = "(";
        let currentCount = 0;
        for(var i = 0; i < s.length; i++) {
            if(s[i] == last) {
                currentCount++;
                adj[currentCount]++;
                ids[currentCount].push(i-currentCount+1);
            } else {
                currentCount = 1;
                last = s[i];
            }
        }

        var toReturn = [ ];

        if(adj[3] == 5) toReturn.push(["Five Conglomerated Triplet", "Five sets of three of the same digit, all adjacent", TODO])
        else if(adj[3] == 4) toReturn.push(["Four Conglomerated Triplet", "Four sets of three of the same digit, adjacent", TODO])
        else if(adj[3] == 3) toReturn.push(["Three Conglomerated Triplet", "Three sets of three of the same digit, adjacent", TODO, 
            indecesToPos(num, [ids[3][0], ids[3][0]+1, ids[3][0]+2, ids[3][1], ids[3][1]+1, ids[3][1]+2, ids[3][2], ids[3][2]+1, ids[3][2]+2], ["rgba(0, 0, 255, 0.5)", "rgba(0, 0, 255, 0.5)", "rgba(0, 0, 255, 0.5)", "rgba(255, 0, 0, 0.5)", "rgba(255, 0, 0, 0.5)", "rgba(255, 0, 0, 0.5)", "rgba(255, 120, 0, 0.5)", "rgba(255, 120, 0, 0.5)", "rgba(255, 120, 0, 0.5)"])
        ])
        else if(adj[3] == 2) toReturn.push(["Two Conglomerated Triplet", "Two sets of three of the same digit, adjacent", TODO, 
            indecesToPos(num, [ids[3][0], ids[3][0]+1, ids[3][0]+2, ids[3][1], ids[3][1]+1, ids[3][1]+2], ["rgba(0, 0, 255, 0.5)", "rgba(0, 0, 255, 0.5)", "rgba(255, 0, 0, 0.5)", "rgba(255, 0, 0, 0.5)"])
        ])
        else if(adj[3] == 1) toReturn.push(["Conglomerated Triplet", "Two sets of three of the same digit, adjacent", TODO, 
            indecesToPos(num, [ids[3][0], ids[3][0]+1, ids[3][0]+2], ["rgba(0, 0, 255, 0.5)", "rgba(0, 0, 255, 0.5)", "rgba(0, 0, 255, 0.5)"])
        ])

        return toReturn;
    },
    function(num) {
        let adj = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        let ids = [[], [], [], [], [], [], [], [], [], [], [], []];
        let s = String(num);
        let last = "(";
        let currentCount = 0;
        for(var i = 0; i < s.length; i++) {
            if(s[i] == last) {
                currentCount++;
                adj[currentCount-1]--;
                adj[currentCount]++;
            } else {
                ids[currentCount].push(i-currentCount);
                currentCount = 1;
                last = s[i];
            }
        }

        var toReturn = [ ];

        if(adj[3] >= 3 && adj[2] >= 3) toReturn.push(["Conglomerated Fullest House", "Three full houses, all unique digits which are individually adjacent", 2613439.5])
        else if(adj[3] >= 3 && adj[2] >= 2) toReturn.push(["Conglomerated Full Full House", "Two full houses, all unique digits which are individually adjacent, plus a third adjacent triple", 1250000])
        else if(adj[3] >= 2 && adj[2] >= 2) toReturn.push(["Conglomerated Double Full House", "Two full houses, all unique digits which are individually adjacent", 3061.8])
        else if(adj[3] >= 2 && adj[2] >= 1) toReturn.push(["Conglomerated Half Double Full House", "Two sets of three of the same digit, adjacent, plus a conglomerated pair", 728.4])
        else if(adj[3] >= 1 && adj[2] >= 2) toReturn.push(["Conglomerated Full House Plus", "A set of three of the same digit, adjacent, plus two sets of two, adjacent", 49.1])
        else if(adj[3] >= 1 && adj[2] >= 1) toReturn.push(["Conglomerated Full House", "A triplet a pair, both all together", 24.2])

        if(adj[2] >= 7) toReturn.push(["Seven Conglomerated Pair", "Seven pair, all individually adjacent", TODO])
        else if(adj[2] >= 6) toReturn.push(["Six Conglomerated Pair", "Six pair, all individually adjacent", 31646])
        else if(adj[2] >= 5) toReturn.push(["Five Conglomerated Pair", "Five pair, all adjacent", 1042])
        else if(adj[2] >= 4) toReturn.push(["Four Conglomerated Pair", "Four pair, all individually adjacent", 87.7])
        else if(adj[2] >= 3) toReturn.push(["Three Conglomerated Pair", "Three pair, all individually adjacent", 14])
        else if(adj[2] >= 2) toReturn.push(["Two Conglomerated Pair", "Two pair, both individually adjacent", 4.21, 
            indecesToPos(num, [ids[2][0], ids[2][0]+1, ids[2][1], ids[2][1]+1], ["rgba(0, 0, 255, 0.5)", "rgba(0, 0, 255, 0.5)", "rgba(255, 0, 0, 0.5)", "rgba(255, 0, 0, 0.5)"])
        ])

        return toReturn
    },
    function(num) {
        let nums = [[], [], [], [], [], [], [], [], [], [], [], [], [], [], []];
        let s = String(num);

        nums[(s.match(/0/g) || []).length].push(0);
        nums[(s.match(/1/g) || []).length].push(1);
        nums[(s.match(/2/g) || []).length].push(2);
        nums[(s.match(/3/g) || []).length].push(3);
        nums[(s.match(/4/g) || []).length].push(4);
        nums[(s.match(/5/g) || []).length].push(5);
        nums[(s.match(/6/g) || []).length].push(6);
        nums[(s.match(/7/g) || []).length].push(7);
        nums[(s.match(/8/g) || []).length].push(8);
        nums[(s.match(/9/g) || []).length].push(9);

        if(nums[3].length >= 3 && nums[2].length >= 3) return [["Fullest House", "Three full houses", 348]]
        else if(nums[3].length >= 3 && nums[2].length >= 2) return [["Full Full House", "Two full houses plus a third triple", 20.1]]
        else if(nums[3].length >= 2 && nums[2].length >= 2) return [["Double Full House", "Two unique full houses", 2.49,
            findToColors(num, [[nums[3][0], rainbowColors[0]], [[nums[3][1], rainbowColors[2]]], [nums[2][0], rainbowColors[1]], [nums[2][1], rainbowColors[3]]])
        ]]
        else if(nums[3].length >= 2 && nums[2].length >= 1) return [["Half Double Full House", "One full house, plus another triplet", 6.29,
            findToColors(num, [[nums[3][0], rainbowColors[0]], [[nums[3][1], rainbowColors[2]]], [nums[2][0], rainbowColors[1]]])
        ]]
        else if(nums[3].length >= 1 && nums[2].length >= 2) return [["Full House Plus", "One full house, plus another pair", 3.27, 
            findToColors(num, [[nums[3][0], rainbowColors[0]], [[nums[2][1], rainbowColors[2]]], [nums[2][0], rainbowColors[1]]])
        ]]
        else if(nums[3].length >= 1 && nums[2].length >= 1) return [["Full House", "A bare full house. Very rare!", 441,
            findToColors(num, [[nums[3][0], rainbowColors[0]], [nums[2][0], rainbowColors[1]]])
        ]]
    },
    function(num) {

    }
]

function findToColors(num, arr) {
    let s = String(num);
    let toReturn = Array(s.length).fill(false);
    for(var i = 0; i < arr.length; i++) {
        for(var ii = 0; ii < s.length; ii++) {
            if(s.charAt(ii) == String(arr[i][0])) toReturn[ii] = arr[i][1];
        }
    }
    return toReturn;
}

module.exports = {
    listOfBadges : listOfBadges,
    listOfCheckFuncs : listOfCheckFuncs
}