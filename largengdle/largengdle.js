const { floor, random, max, min, log10 } = Math;

var chosenNumber = -1n;

var badgesWon = [  ];

var sumPoints = 0;

var toShow = [];

function generateRandom() {
    var toReturn = BigInt(0);
    for(var i = 0; i < 15; i++) {
        toReturn += (10n ** BigInt(i)) * BigInt(floor(random() * 10));
    }
    return toReturn;
}

window.onload = function() {
    $("#bignumber").on("click", function() {
        $("#bignumber").addClass("nohover");
        $("#initialGenerate").animate({ opacity : 0 }, 150, function() {
            var initialWidth = $("#bignumber").width() + 18; // Can't forget padding + border

            $("#initialGenerate").remove();

            chosenNumber = generateRandom();

            var chosenStr = String(chosenNumber);

            for(var i = 0; i < chosenStr.length; i++) {
                $("#bignumber").append(
                    $("<span>").attr("id", `span${i}`).text(chosenStr[i] + ((chosenStr.length - i + 2) % 3 == 0 && chosenStr.length - i != 1 ? "," : "")).addClass("innerSpan")
                );
            }

            var afterWidth = $("#bignumber").width() + 18 + 20; // Give it some more padding

            $("#bignumber").css("width", initialWidth);
            $("#bignumber").animate({
                width : afterWidth,
                padding: 18
            })

            for(var i = 0; i < chosenStr.length; i++) {
                (function(innerI) {
                    setTimeout(function() {
                        $(`#span${innerI}`).animate({
                            opacity: 1
                        }, 150)
                    }, i * 250 + 1500);
                })(i)
            }

            for(var badgeid = 0; badgeid < listOfBadges.length; badgeid++) {
                let badge = listOfBadges[badgeid];
                if(badge.checker(chosenNumber)) {
                    badgesWon.push(badge);
                }
            }
            for(var badgeid = 0; badgeid < listOfCheckFuncs.length; badgeid++) {
                let ret = listOfCheckFuncs[badgeid](chosenNumber);
                if(ret) {
                    badgesWon.push({
                        name : ret[0],
                        desc : ret[1],
                        value : ret[2]
                    });
                }
            }
            
            toShow = [ null ];

            badgesWon.sort((a, b) => {
                return b.value - a.value;
            });
            for(var badgeid = 0; badgeid < badgesWon.length; badgeid++) {
                sumPoints += badgesWon[badgeid].value;
            }
            
            toShow[0] = $("<h2>").text(`${sumPoints.toFixed(min(2, max(0, 3-floor(log10(Number(sumPoints))))))} pts total`);
            $("#badgesWonContainer").append(toShow[0])

            for(var badgeid = 0; badgeid < badgesWon.length; badgeid++) {
                let badge = badgesWon[badgeid];
                let toAdd = $("<div>").addClass("badgeContainer");
                toAdd.append(
                    $("<h3>").text(badge.name)
                );
                toAdd.append(
                    $("<p>").text(badge.desc)
                );
                toAdd.append(
                    $("<p>").append($("<b>").append($("<i>").text(`${ badge.value.toFixed(max(0, 2-floor(log10(Number(badge.value))))) } pts`)))
                );

                $("#badgesWonContainer").append(toAdd);
                $("#badgesWonContainer").append($("<br>"));

                toShow.push(toAdd);

                if(badge.value > 50) confetti({position : {x : toAdd.position().x, y : toAdd.position().y}})
            }

            for(var i = 0; i < toShow.length; i++) {
                //$(toShow[i]).css("opacity", "1");
                $(toShow[i]).css("opacity", "0");
            }

            for(var i = 0; i < toShow.length; i++) {
                (function(innerI) {
                    setTimeout(function() {
                        $(toShow[innerI]).animate({
                            opacity : 1
                        }, 150)
                    }, i * 50 + 2000 + 250 * chosenStr.length);
                    //}, i * 250 + 2000);
                })(i)
            }
        });
    })
}