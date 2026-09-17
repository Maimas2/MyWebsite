var listFile = require("./listofbadges");
const { floor, random, max, min, log10 } = Math;

let TODO = -1;

function generateRandom() {
    var toReturn = BigInt(0);
    for(var i = 0; i < 15; i++) {
        toReturn += (10n ** BigInt(i)) * BigInt(floor(random() * 10));
    }
    return toReturn;
}

function generateInfo(num = null) {
    var chosenNumber = num || generateRandom();
    var chosenStr    = String(chosenNumber);
    var sumPoints    = 0;

    var badgesWon = [  ];

    for(var badgeid = 0; badgeid < listFile.listOfBadges.length; badgeid++) {
        let badge = listFile.listOfBadges[badgeid];
        if(badge.checker(chosenNumber)) {
            badgesWon.push(badge);
        }
    }
    for(var badgeid = 0; badgeid < listFile.listOfCheckFuncs.length; badgeid++) {
        let ret = listFile.listOfCheckFuncs[badgeid](chosenNumber);
        if(ret) {
            let ta = [ ];
            for(var ai = 0; ai < ret.length; ai++) {
                let a = ret[ai];
                ta.push({
                    name : a[0],
                    desc : a[1],
                    value : a[2],
                    highlight : a[3] || null
                });
            }
            badgesWon = badgesWon.concat(ta);
        }
    }

    badgesWon.sort((a, b) => {
        return b.value - a.value;
    });
    for(var badgeid = 0; badgeid < badgesWon.length; badgeid++) {
        sumPoints += badgesWon[badgeid].value || 0;
    }

    // console.log(JSON.stringify({
    //     num : String(chosenNumber),
    //     sumPoints : sumPoints,
    //     badgesWon : badgesWon
    // }));

    return {
        num : String(chosenNumber),
        sumPoints : sumPoints,
        badgesWon : badgesWon
    };
}

console.log(generateInfo())

module.exports = {
    generateInfo : generateInfo
}